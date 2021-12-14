import { Notification, MessageBox, Message } from 'element-ui';
import seeAjax from 'see-ajax';
import Detail from './Detail';
import Printer from './Printer';
import Logistics from './Logistics';
import formatTime from '../../util/format_time';
import request from '../../utils/request';

export default {
  name: 'App',
  components: {
    Printer,
    Detail,
    Logistics,
  },
  data() {
    return {
      loadingBuddhistList: true,
      loadingList: true,
      unHandleNum: null,
      // 列表请求参数
      buddhistId: '',
      date: ['', ''],
      formatDate: ['', ''],
      tel: '',
      logisticsOrder: '',
      orderNo: '',
      type: 1, // 1 未处理 2 已处理  3 已发货 4 已收货 6 多次处理
      // 分页
      currentSize: 25,
      currentPage: 1,
      totalCount: 0,
      // 数据
      buddhistList: [],
      list: [],
      isGroup: false, // 是否是批量处理
      detail: {}, // 当前选中项的detail

      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },

      // 快递设置
      expressSetting: {},
      // 快递打印设备有任务的
      expressPrintDevicesWithTask: [],
      // 快递打印设备
      expressPrintDevices: [],
      // 刷新定时器
      refreshPrintDevicesInterval: null,
      // 选择快递机器
      expressDeviceSelectDialogVisible: false,
      // 是否在线
      expressDeviceSelectedOnline: null,
      // 离线原因
      expressDeviceSelectErrorMsg: null,
      // 已选择的设备Id
      expressDeviceSelectedId: null,
      // 已选择的设备名称
      expressDeviceSelectedName: null,
      // 当前选中的机器项目
      expressDeviceCurrentItem: {},
      // 下面的数据有可能会被清掉
      expressDeviceCurrentTotalCount: 0,
      expressDeviceCurrentFinishCount: 0,
      expressDeviceCurrentLatestFailMsg: null,
      // 快递正在打印
      expressPrintingDialogVisible: false,
      // 快递打印完毕
      expressPrintedDialogVisible: false,
      // 是否正在添加打印订单
      expressPrintAddingOrders: false,
      // 是否是复打
      expressPrintOrdersAgain: 0,
      // 接口返回无打印任务，可能是取消造成的，而不是打印完了
      expressPrintFinishByCancel: false,
      // 复打的数据
      expressPrintAgainTotalCount: 0,
      expressPrintAgainFinishCount: 0,
      expressPrintAgainLatestFailMsg: null,
      expressPrintAgainOrderIds: [],
      // 快递复打对话框
      expressPrintingAgainDialogVisible: false,
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
  },
  created() {
    this.requestBuddhistList();
    this.requestList();

    this.requestBuddhistList();
    this.requestList();
    this.requestExpressInfo();
  },
  beforeDestroy() {
    if (this.refreshPrintDevicesInterval)
      clearInterval(this.refreshPrintDevicesInterval);
  },
  watch: {
    expressPrintingDialogVisible(value) {
      // 关闭这个弹框，立即刷新列表
      if (!value) {
        this.requestList();
      }
    },
    expressDeviceSelectDialogVisible(value) {
      // 如果在选择对话框中，只有一台设备，有没有选过，默认选中第一个
      if (
        value &&
        !this.expressDeviceSelectedId &&
        this.expressPrintDevices.length === 1
      ) {
        this.expressDeviceSelectedId = this.expressPrintDevices[0].id;
        this.onChangeExpressPrintDevice();
      }
    },
  },
  methods: {
    // 获取快递设置
    requestExpressInfo() {
      request('/express/getPrintSetting').then(res => {
        this.expressSetting = res.data || {};

        // 启用了快递打印设置
        if (
          this.expressSetting.partner_id &&
          this.expressSetting.enable_print
        ) {
          // 每隔10秒重新刷新数据
          this.refreshPrintDevicesInterval = setInterval(
            this.requestExpressPrintDevicesWithTask,
            10 * 1000
          );
          this.requestExpressPrintDevicesWithTask();
        }
      });
    },
    requestExpressPrintDevicesWithTask() {
      // 获取设备正在打印的列表
      return request('/express/getAllPrintDevicesWithTask').then(res => {
        this.expressPrintDevices = res.data || [];

        this.expressPrintDevicesWithTask = this.expressPrintDevices.filter(
          i => !!i.total_count
        );
        if (this.expressDeviceSelectedId) {
          // 更新已选择的设备
          this.expressDeviceCurrentItem = this.expressPrintDevices.find(
            i => i.id === this.expressDeviceSelectedId
          );
          this.expressDeviceSelectedName = this.expressDeviceCurrentItem.device_name;

          // 有值才更新
          if (this.expressDeviceCurrentItem.total_count) {
            this.expressDeviceCurrentTotalCount =
              this.expressDeviceCurrentItem.total_count || 0;
            this.expressDeviceCurrentFinishCount =
              this.expressDeviceCurrentItem.finish_count || 0;
            this.expressDeviceCurrentLatestFailMsg =
              this.expressDeviceCurrentItem.latest_fail_msg || '';
          }
          // 如果没有值，但上一次有值，说明是任务打印完了，或者取消打印
          else if (this.expressDeviceCurrentTotalCount) {
            // 取消打印
            if (this.expressPrintFinishByCancel) {
              this.expressPrintingDialogVisible = false;
              this.expressPrintFinishByCancel = false;
            }
            // 打印完成
            // 没有值，就是已打印完，正在打印中，接口返回的数据显示打印完毕
            else if (this.expressPrintingDialogVisible) {
              this.expressPrintingDialogVisible = false;
              this.expressPrintedDialogVisible = true;
            }
          }
        }
      });
    },
    onClickExpressPrint() {
      const { selected } = this;

      if (!selected.length) {
        Notification({
          title: '提示',
          message: '请先选中订单',
          type: 'warning',
        });
        return;
      }

      this.expressPrintOrdersAgain = 0;
      this.expressDeviceSelectDialogVisible = true;
    },
    onClickExpressPrintAgain() {
      const { selected } = this;

      if (!selected.length) {
        Notification({
          title: '提示',
          message: '请先选中订单',
          type: 'warning',
        });
        return;
      }

      this.expressPrintOrdersAgain = 1;
      this.expressPrintAgainOrderIds = JSON.parse(
        JSON.stringify(this.selected)
      );
      this.expressPrintAgainTotalCount = this.expressPrintAgainOrderIds.length;
      this.expressPrintAgainFinishCount = 0;
      this.expressPrintAgainLatestFailMsg = '';
      this.expressPrintingAgainDialogVisible = true;
      this.expressPrintAgainNext();
    },
    onChangeExpressPrintDevice() {
      // 是否在线
      this.expressDeviceSelectedOnline = null;
      // 离线原因
      this.expressDeviceSelectErrorMsg = null;
      // 已选择的设备名称
      this.expressDeviceCurrentItem = this.expressPrintDevices.find(
        i => i.id === this.expressDeviceSelectedId
      );
      this.expressDeviceSelectedName = this.expressDeviceCurrentItem.device_name;
      this.expressDeviceCurrentTotalCount =
        this.expressDeviceCurrentItem.total_count || 0;
      this.expressDeviceCurrentFinishCount =
        this.expressDeviceCurrentItem.finish_count || 0;
      this.expressDeviceCurrentLatestFailMsg =
        this.expressDeviceCurrentItem.latest_fail_msg || '';

      request({
        url: '/express/getPrintDeviceStatus',
        method: 'get',
        params: {
          id: this.expressDeviceSelectedId,
        },
      }).then(res => {
        this.expressDeviceSelectedOnline = res.result >= 0;
        if (!this.expressDeviceSelectedOnline)
          this.expressDeviceSelectErrorMsg = res.msg;
      });
    },
    handleExpressDeviceSelectDialogConfirm() {
      if (this.expressPrintAddingOrders) return;

      if (
        !this.expressDeviceSelectedId ||
        this.expressDeviceSelectedOnline !== true
      )
        return;

      const data = new URLSearchParams();
      data.append('device_id', this.expressDeviceSelectedId);
      data.append('order_ids', this.selected.join(','));

      this.expressPrintAddingOrders = true;
      request({
        url: '/express/printFoshiOrders',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.expressDeviceSelectErrorMsg = res.msg;
            return;
          }

          Message.success('添加订单的快递单打印成功');

          this.requestExpressPrintDevicesWithTask().then(res2 => {
            this.expressDeviceSelectDialogVisible = false;
            this.expressPrintingDialogVisible = true;
          });
        })
        .finally(() => {
          this.expressPrintAddingOrders = false;
        });
    },
    handleExpressPrintCancelDialogConfirm() {
      this.$confirm('确定要取消打印?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = new URLSearchParams();
        data.append('device_id', this.expressDeviceSelectedId);

        request({
          url: '/express/cancelPrintTask',
          method: 'post',
          data,
        }).then(response => {
          if (response.result < 0) {
            this.$alert(response.msg);
            return;
          }

          this.$message({
            type: 'success',
            message: '取消打印成功!',
          });

          this.expressPrintFinishByCancel = true;
          this.requestExpressPrintDevicesWithTask().then(res2 => {
            this.expressPrintingDialogVisible = false;
          });
        });
      });
    },
    seeExpressPrintTaskDetail(index) {
      const item = this.expressPrintDevicesWithTask[index];
      this.expressDeviceSelectedId = item.id;
      this.onChangeExpressPrintDevice();
      this.expressPrintingDialogVisible = true;
    },
    handleExpressPrintCancelDialogRestore() {
      this.$confirm('确定您已经处理好错误，要重新开始打印?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = new URLSearchParams();
        data.append('device_id', this.expressDeviceSelectedId);

        request({
          url: '/express/restoreSuspendedPrintTask',
          method: 'post',
          data,
        }).then(response => {
          if (response.result < 0) {
            this.$alert(response.msg);
            return;
          }

          this.$message({
            type: 'success',
            message: '重新开始打印成功!',
          });

          // 清除消息，并刷新数据
          this.expressDeviceCurrentLatestFailMsg = null;
          this.requestExpressPrintDevicesWithTask();
        });
      });
    },
    handleExpressPrintAgainCancelDialogConfirm() {
      this.$confirm('确定要取消复打?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.expressPrintAgainOrderIds = [];
        this.expressPrintAgainTotalCount = 0;
        this.expressPrintAgainFinishCount = 0;
        this.expressPrintAgainLatestFailMsg = '';
        this.expressPrintingAgainDialogVisible = false;

        this.$message({
          type: 'success',
          message: '取消打印成功!',
        });
      });
    },
    handleExpressPrintAgainCancelDialogRestore() {
      this.$confirm('确定您已经处理好错误，要重新开始复打?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '重新开始复打成功!',
        });

        // 清除消息，并重新开始打印
        this.expressDeviceCurrentLatestFailMsg = null;
        this.expressPrintAgainNext();
      });
    },
    expressPrintAgainNext() {
      const orderId = this.expressPrintAgainOrderIds.shift();

      // 全部打印完毕
      if (!orderId) {
        this.expressPrintingAgainDialogVisible = false;
        this.expressPrintedDialogVisible = true;
        return;
      }

      const data = new URLSearchParams();
      data.append('order_id', orderId);

      request({
        url: '/express/printAgainFoshiOrder',
        method: 'post',
        data,
      }).then(response => {
        if (response.result < 0) {
          this.expressPrintAgainLatestFailMsg = response.msg;
          return;
        }

        this.expressPrintAgainFinishCount += 1;
        this.expressPrintAgainNext();
      });
    },

    requestBuddhistList() {
      seeAjax('getBuddhistList', {}, res => {
        if (res.success) {
          this.buddhistList = [
            //            { buddhistId: '', buddhistName: '全部' },
            ...res.data,
          ];
          this.loadingBuddhistList = false;

          this.$store.state.buddhistList = this.buddhistList;
        } else {
          Notification({
            title: '提示',
            message: res.message,
            type: 'error',
          });
        }
      });
    },
    requestList() {
      this.loadingList = true;

      const {
        currentPage: page,
        currentSize: pageSize,
        type,
        buddhistId,
        formatDate,
        tel,
        logisticsOrder,
        orderNo,
      } = this;

      seeAjax(
        'getList',
        {
          page,
          pageSize,
          type,
          buddhistId,
          beginDate: formatDate[0],
          endDate: formatDate[1],
          tel,
          logisticsOrder,
          orderNo,
        },
        res => {
          if (res.success) {
            this.totalCount = res.totalCount;
            this.list = res.data;

            if (type === 1) {
              this.unHandleNum = res.totalCount;
              // 导航栏的total显示
              window.localStorage.setItem(
                'chanzai_orderNumber',
                res.totalCount
              );
              document.querySelector('[data-chanzai-order-count]').innerHTML =
                res.totalCount;
            }

            this.loadingList = false;
          } else {
            Notification({
              title: '提示',
              message: res.message,
              type: 'error',
            });
          }
        }
      );
    },
    onChangeBuddhistId() {
      this.onChangeFilter();
    },
    onClickLogistics() {
      console.log(1234123);
      this.$store.commit({ type: 'updateLogisticsDialogVisible', state: true });
    },
    onChangeDatePicker() {
      const { date } = this;
      this.formatDate = date.map(item => formatTime(`${item}`));
      this.onChangeFilter();
    },
    onChangeFilter() {
      this.currentPage = 1;
      this.requestList();
    },
    onClickSearch() {
      this.requestList();
    },
    onClickReset() {
      this.buddhistId = '';
      this.tel = '';
      this.logisticsOrder = '';
      this.date = ['', ''];
      this.formatDate = ['', ''];
      this.requestList();
    },
    onClickExport() {
      const { type, buddhistId, formatDate, tel } = this;
      const excelUrl =
        `/zzhadmin/getConversionOrderExcel/?type=${type}` +
        `&startTime=${formatDate[0]}&endTime=${formatDate[1]}` +
        `&mobile=${tel}&commodityId=${buddhistId ? buddhistId : 0}`;
      window.open(excelUrl);
    },
    onClickType(type) {
      if (this.type === type) return;

      this.type = type;
      this.currentPage = 1;
      this.requestList();
    },
    onClickHandleOrderGroup() {
      const { selected, type } = this;

      if (selected.length) {
        // 处理订单弹窗
        this.isGroup = true;
        this.detail = {};
        this.$store.commit({
          type: 'updateDetailVisible',
          state: true,
        });
        return;
      }

      MessageBox.confirm(
        `请至少选中一个订单，或选择『条件筛选批量${
          type === 2 ? '修改' : '处理'
        }』`,
        {
          cancelButtonText: '我知道了',
          confirmButtonText: `条件筛选批量${type === 2 ? '修改' : '处理'}`,
        }
      ).then(() => {
        this.isGroup = true;
        this.detail = {};
        this.$store.commit({
          type: 'updateDetailVisible',
          state: true,
        });
      });
    },
    onClickSetPrinter() {
      this.$store.commit('updatePrinterDialog', {
        visible: true,
        type: 'set',
      });
    },
    onClickPrint() {
      const { selected, type } = this;

      if (!selected.length) {
        Notification({
          title: '提示',
          message: '请先选中订单',
          type: 'warning',
        });
        return;
      } else {
        // 打印小票弹窗
        this.$store.commit('updatePrinterDialog', {
          visible: true,
          type: 'print',
        });
      }
    },
    handleSelectionChange(selectedData) {
      let selected = [];
      selectedData.forEach(item => {
        selected.push(item.id);
      });

      this.$store.commit({
        type: 'updateSelected',
        state: selected,
      });
    },
    handleSizeChange(size) {
      this.currentSize = size;
      this.currentPage = 1;
      this.requestList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.requestList();
    },
    onClickDetail(rowData) {
      console.log(rowData);
      this.$store.commit({ type: 'updateDetailVisible', state: true });
      this.isGroup = false;
      this.detail = { ...rowData };
    },
  },
};
