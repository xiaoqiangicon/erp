import { Message, MessageBox, Notification } from 'element-ui';
import { reportError } from '@senntyou/web-monitor-sdk';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import request from '../../utils/request';
import regionData from '../../../../pro-com/src/regions/three-levels.json';
import { fakeBatchList } from './utils';
import { formatDate } from '../../utils/date';

export default {
  name: 'App',
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      const date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
  },
  data() {
    return {
      // 初始化加载
      initRequesting: true,
      activeTab: 'new',
      // 收件人姓名
      receiverName: '',
      // 收件人电话
      receiverPhone: '',
      // 收件人省
      receiverProvince: null,
      // 收件人市
      receiverCity: null,
      // 收件人区
      receiverDistrict: null,
      // 收件人地址
      receiverAddress: '',
      // 物品名称
      goodsName: '',
      // 物品数量
      goodsQuantity: 1,
      // 备注
      remark: '',
      // 佛事订单集合
      foshiOrderIds: [''],

      provinceList: regionData,
      cityList: [],
      districtList: [],

      provinceListForUpdate: regionData,
      cityListForUpdate: [],
      districtListForUpdate: [],

      // 是否正在保存添加
      savingAdd: false,
      // 是否正在批量添加
      savingBatch: false,
      // 是否正在保存修改
      savingUpdate: false,
      // 显示修改的drawer
      showUpdateDrawer: false,
      // 当前更新的Id(用于更新已有的数据)
      updateRecordId: 0,
      // 当前更新的索引(用于更新批量添加的数据)
      updateRecordIndex: -1,
      // 当前更新记录
      // 收件人姓名
      updateRecordReceiverName: '',
      // 收件人电话
      updateRecordReceiverPhone: '',
      // 收件人省
      updateRecordReceiverProvince: null,
      // 收件人市
      updateRecordReceiverCity: null,
      // 收件人区
      updateRecordReceiverDistrict: null,
      // 收件人地址
      updateRecordReceiverAddress: '',
      // 物品名称
      updateRecordGoodsName: '',
      // 物品数量
      updateRecordGoodsQuantity: 1,
      // 备注
      updateRecordRemark: '',
      // 佛事订单集合
      updateRecordFoshiOrderIds: [''],

      // 是否在批量添加模式
      inBatchMode: false,
      // 批量列表
      // batchList: [],
      batchList: fakeBatchList,
      // 批量添加时修改条目
      batchEditItem: {},

      // 待打印列表查询参数
      pendingListQuery: {
        print_status: 1,
        page_num: 1,
        page_size: 10,
        search_type: 2,
        search_key: '',
        start_create_time: null,
        end_create_time: null,
        sort_field: 'create_time',
        sort_type: null,
      },
      pendingList: null,
      pendingTotal: null,
      pendingListLoading: false,
      // 不加筛选条件的所有
      pendingAllTotal: null,
      pendingCreateTimes: ['', ''],
      pendingSelectedIds: [],

      // 已打印列表查询参数
      printedListQuery: {
        print_status: 2,
        page_num: 1,
        page_size: 10,
        search_type: 5,
        search_key: '',
        start_create_time: null,
        end_create_time: null,
        start_print_time: null,
        end_print_time: null,
        sort_field: 'print_time',
        sort_type: null,
      },
      printedList: null,
      printedTotal: null,
      printedListLoading: false,
      printedCreateTimes: ['', ''],
      printedPrintTimes: ['', ''],
      printedSelectedIds: [],

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
  created() {
    this.requestExpressInfo();
  },
  mounted() {
    const { uploadExcel } = this.$refs;

    const rowKeys = [
      'receiverName',
      'receiverPhone',
      'receiverAddress',
      'goodsName',
      'goodsQuantity',
      'remark',
      'foshiOrderIds',
    ];
    uploadExcel.addEventListener(
      'change',
      e => {
        const file = e.target.files[0];
        file.arrayBuffer().then(data => {
          const workbook = XLSX.read(data);
          const result = [];
          workbook.SheetNames.forEach(sheetName => {
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              raw: false,
              header: rowKeys,
            });
            if (json && json.length > 1) {
              // 第一行是title，去掉第一行
              json.shift();
              result.push(...json);
            }
          });

          if (!result.length) {
            this.$alert('您上传文件中的没有数据，请检查后再重新尝试');
            return;
          }

          this.batchList = result;
          this.inBatchMode = true;
        });
      },
      false
    );
  },
  beforeDestroy() {
    if (this.refreshPrintDevicesInterval)
      clearInterval(this.refreshPrintDevicesInterval);
  },
  watch: {
    expressPrintingDialogVisible(value) {
      // 关闭这个弹框，立即刷新列表
      if (!value) {
        this.getPrintedList();
        this.getPendingList();
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
    init() {
      this.getPendingList();
      this.getPrintedList();
    },
    onChangeTab() {
      // console.log(this.activeTab);
    },
    onChangeProvince() {
      this.cityList = [];
      this.ditrictList = [];
      this.receiverCity = null;
      this.receiverDistrict = null;

      const provinceItem = regionData.find(
        i => i.name === this.receiverProvince
      );
      this.cityList = provinceItem ? provinceItem.children : [];
    },
    onChangeCity() {
      this.ditrictList = [];
      this.receiverDistrict = null;

      const cityItem = this.cityList.find(i => i.name === this.receiverCity);
      this.districtList = cityItem ? cityItem.children : [];
    },
    setRegion(province, city, district) {
      this.receiverProvince = province;
      this.onChangeProvince();
      this.receiverCity = city;
      this.onChangeCity();
      this.receiverDistrict = district;
    },
    onChangeProvinceForUpdate() {
      this.cityListForUpdate = [];
      this.ditrictListForUpdate = [];
      this.updateRecordReceiverCity = null;
      this.updateRecordReceiverDistrict = null;

      const provinceItem = regionData.find(
        i => i.name === this.updateRecordReceiverProvince
      );
      this.cityListForUpdate = provinceItem ? provinceItem.children : [];
    },
    onChangeCityForUpdate() {
      this.ditrictListForUpdate = [];
      this.updateRecordReceiverDistrict = null;

      const cityItem = this.cityListForUpdate.find(
        i => i.name === this.updateRecordReceiverCity
      );
      this.districtListForUpdate = cityItem ? cityItem.children : [];
    },
    setRegionForUpdate(province, city, district) {
      this.updateRecordReceiverProvince = province;
      this.onChangeProvinceForUpdate();
      this.updateRecordReceiverCity = city;
      this.onChangeCityForUpdate();
      this.updateRecordReceiverDistrict = district;
    },
    resetAdd() {
      this.receiverName = '';
      this.receiverPhone = '';
      // // 收件人省
      // this.receiverProvince = null;
      // // 收件人市
      // this.receiverCity = null;
      // // 收件人区
      // this.receiverDistrict = null;
      this.setRegion(null, null, null);
      // 收件人地址
      this.receiverAddress = '';
      // 物品名称
      this.goodsName = '';
      // 物品数量
      this.goodsQuantity = 1;
      // 备注
      this.remark = '';
      // 佛事订单集合
      this.foshiOrderIds = [''];
    },
    onSaveAdd() {
      if (this.savingAdd) return;

      let error;
      if (!this.receiverName) error = '收件人姓名不能为空';
      else if (!this.receiverPhone) error = '收件人电话号码不能为空';
      else if (!this.receiverProvince) error = '请选择收件人省份';
      else if (!this.receiverCity) error = '请选择收件人城市';
      else if (
        !this.receiverDistrict &&
        this.districtList &&
        this.districtList.length
      )
        error = '请选择收件人区域';
      else if (!this.receiverAddress) error = '收件人详细地址不能为空';
      else if (!this.goodsName) error = '物品名称不能为空';

      if (error) {
        this.$alert(error);
        return;
      }

      const data = new URLSearchParams();
      data.append('receiver_name', this.receiverName);
      data.append('receiver_phone', this.receiverPhone);
      data.append('receiver_province', this.receiverProvince);
      data.append('receiver_city', this.receiverCity);
      data.append('receiver_district', this.receiverDistrict || '');
      data.append('receiver_address', this.receiverAddress);
      data.append('goods_name', this.goodsName);
      data.append('goods_quantity', this.goodsQuantity);
      data.append('remark', this.remark);
      data.append(
        'foshi_order_ids',
        this.foshiOrderIds.filter(i => !!i).join(',')
      );

      this.savingAdd = true;
      request({
        url: '/express/addPrintManual',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.$alert(res.msg);
            return;
          }

          Message.success('添加成功');

          // 刷新待打印数据
          this.handlePendingSearchList();
          this.resetAdd();
        })
        .finally(() => {
          this.savingAdd = false;
        });
    },
    downloadExcel() {
      window.open(
        'https://pic.zizaihome.com/manual/%E8%87%AA%E5%9C%A8%E5%AE%B6%E5%BF%AB%E9%80%92%E9%9D%A2%E5%8D%95%E6%89%93%E5%8D%B0%E6%A8%A1%E6%9D%BF.xlsx'
      );
    },
    backToUploadBatch() {
      this.inBatchMode = false;
    },
    handleDeleteBatch(index, row) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.batchList.splice(index, 1);
      });
    },
    handleUpdateBatch(index, row) {
      this.updateRecordIndex = index;
      this.showUpdateDrawer = true;

      this.updateRecordReceiverName = row.receiverName;
      this.updateRecordReceiverPhone = row.receiverPhone;
      this.updateRecordReceiverProvince = row.receiverProvince || null;
      this.updateRecordReceiverCity = row.receiverCity || null;
      this.updateRecordReceiverDistrict = row.receiverDistrict || null;
      this.updateRecordReceiverAddress = row.receiverAddress;
      this.updateRecordGoodsName = row.goodsName;
      this.updateRecordGoodsQuantity = row.goodsQuantity;
      this.updateRecordRemark = row.remark;
      if (row.foshiOrderIds) {
        this.updateRecordFoshiOrderIds = row.foshiOrderIds.split(/[,;，；]/g);
      } else {
        this.updateRecordFoshiOrderIds = [''];
      }
      this.setRegionForUpdate(
        this.updateRecordReceiverProvince,
        this.updateRecordReceiverCity,
        this.updateRecordReceiverDistrict
      );
    },
    onSaveBatch() {
      this.$confirm('确定要全部加入待打印?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.doSaveBatch();
      });
    },
    doSaveBatch() {
      if (this.savingBatch) return;

      for (let i = 0, il = this.batchList.length; i < il; i += 1) {
        const item = this.batchList[i];
        const seq = i + 1;
        const errorPrefix = `第${seq}个条目的`;

        if (!item.receiverProvince) item.receiverProvince = '';
        if (!item.receiverCity) item.receiverCity = '';
        if (!item.receiverDistrict) item.receiverDistrict = '';
        if (!item.remark) item.remark = '';
        if (!item.foshiOrderIds) item.foshiOrderIds = '';

        let error;
        if (!item.receiverName) error = '收件人姓名不能为空';
        else if (!item.receiverPhone) error = '收件人电话号码不能为空';
        else if (!item.receiverAddress) error = '收件人详细地址不能为空';
        else if (!item.goodsName) error = '物品名称不能为空';
        else if (!item.goodsQuantity) error = '物品数量不能为空';

        if (error) {
          this.$alert(errorPrefix + error);
          return;
        }
      }

      const finalList = this.batchList.map(item => ({
        receiver_name: item.receiverName,
        receiver_phone: item.receiverPhone,
        receiver_province: item.receiverProvince,
        receiver_city: item.receiverCity,
        receiver_district: item.receiverDistrict,
        receiver_address: item.receiverAddress,
        goods_name: item.goodsName,
        goods_quantity: parseInt(item.goodsQuantity, 10) || 1,
        remark: item.remark,
        foshi_order_ids: item.foshiOrderIds,
      }));
      const data = new URLSearchParams();
      data.append('content', JSON.stringify(finalList));

      this.savingBatch = true;
      request({
        url: '/express/addPrintManualBatch',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.$alert(res.msg);
            return;
          }

          Message.success('批量添加全部成功');
          this.backToUploadBatch();
          this.batchList = [];

          // 刷新待打印数据
          this.handlePendingSearchList();
        })
        .finally(() => {
          this.savingBatch = false;
        });
    },
    onUpdate() {
      if (this.savingUpdate) return;

      let error;
      if (!this.updateRecordReceiverName) error = '收件人姓名不能为空';
      else if (!this.updateRecordReceiverPhone)
        error = '收件人电话号码不能为空';
      else if (
        !this.updateRecordReceiverCity &&
        this.cityListForUpdate &&
        this.cityListForUpdate.length
      )
        error = '请选择收件人城市';
      else if (
        !this.updateRecordReceiverDistrict &&
        this.districtListForUpdate &&
        this.districtListForUpdate.length
      )
        error = '请选择收件人区域';
      else if (!this.updateRecordReceiverAddress)
        error = '收件人详细地址不能为空';
      else if (!this.updateRecordGoodsName) error = '物品名称不能为空';

      if (error) {
        this.$alert(error);
        return;
      }

      // 批量添加编辑模式
      if (this.inBatchMode) {
        const item = this.batchList[this.updateRecordIndex];
        item.receiverName = this.updateRecordReceiverName;
        item.receiverPhone = this.updateRecordReceiverPhone;
        item.receiverProvince = this.updateRecordReceiverProvince || '';
        item.receiverCity = this.updateRecordReceiverCity || '';
        item.receiverDistrict = this.updateRecordReceiverDistrict || '';
        item.receiverAddress = this.updateRecordReceiverAddress;
        item.goodsName = this.updateRecordGoodsName;
        item.goodsQuantity = this.updateRecordGoodsQuantity;
        item.remark = this.updateRecordRemark;
        item.foshiOrderIds = this.updateRecordFoshiOrderIds
          .filter(i => !!i)
          .join(',');

        this.showUpdateDrawer = false;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
        return;
      }

      const data = new URLSearchParams();
      data.append('id', this.updateRecordId);
      data.append('receiver_name', this.updateRecordReceiverName);
      data.append('receiver_phone', this.updateRecordReceiverPhone);
      data.append('receiver_province', this.updateRecordReceiverProvince);
      data.append('receiver_city', this.updateRecordReceiverCity);
      data.append('receiver_district', this.updateRecordReceiverDistrict || '');
      data.append('receiver_address', this.updateRecordReceiverAddress);
      data.append('goods_name', this.updateRecordGoodsName);
      data.append('goods_quantity', this.updateRecordGoodsQuantity);
      data.append('remark', this.updateRecordRemark);
      data.append(
        'foshi_order_ids',
        this.updateRecordFoshiOrderIds.filter(i => !!i).join(',')
      );

      this.savingUpdate = true;
      request({
        url: '/express/updatePrintManual',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.$alert(res.msg);
            return;
          }

          Message.success('更新成功');
          this.showUpdateDrawer = false;
          this.handlePendingSearchList();

          // 刷新待打印数据
          this.handlePendingSearchList();
        })
        .finally(() => {
          this.savingUpdate = false;
        });
    },

    handlePendingSearchList() {
      this.pendingListQuery.page_num = 1;
      this.getPendingList();
    },
    handlePendingSizeChange(val) {
      this.pendingListQuery.page_num = 1;
      this.pendingListQuery.page_size = val;
      this.getPendingList();
    },
    handlePendingCurrentChange(val) {
      this.pendingListQuery.page_num = val;
      this.getPendingList();
    },
    getPendingList() {
      this.pendingListLoading = true;

      const query = { ...this.pendingListQuery };

      if (this.pendingCreateTimes && this.pendingCreateTimes[0]) {
        query.start_create_time = this.pendingCreateTimes[0] + ' 00:00:01';
        query.end_create_time = this.pendingCreateTimes[1] + ' 23:59:59';
      }
      request({
        url: '/express/getPrintManualList',
        method: 'get',
        params: query,
      }).then(response => {
        this.pendingListLoading = false;
        this.pendingList = response.data.list || [];
        this.pendingTotal = response.data.total || 0;
        this.pendingAllTotal = response.data.all_total || 0;
      });
    },
    handlePendingUpdate(index, row) {
      this.updateRecordId = row.id;
      this.showUpdateDrawer = true;

      this.updateRecordReceiverName = row.receiver_name;
      this.updateRecordReceiverPhone = row.receiver_phone;
      this.updateRecordReceiverProvince = row.receiver_province || null;
      this.updateRecordReceiverCity = row.receiver_city || null;
      this.updateRecordReceiverDistrict = row.receiver_district || null;
      this.updateRecordReceiverAddress = row.receiver_address;
      this.updateRecordGoodsName = row.goods_name;
      this.updateRecordGoodsQuantity = row.goods_quantity;
      this.updateRecordRemark = row.remark;
      if (row.foshi_order_ids) {
        this.updateRecordFoshiOrderIds = row.foshi_order_ids.split(/[,;，；]/g);
      } else {
        this.updateRecordFoshiOrderIds = [''];
      }
      this.setRegionForUpdate(
        this.updateRecordReceiverProvince,
        this.updateRecordReceiverCity,
        this.updateRecordReceiverDistrict
      );
    },
    handlePendingDelete(index, row) {
      this.$confirm('是否要删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = new URLSearchParams();
        data.append('id', row.id);

        request({
          url: '/express/delPrintManual',
          method: 'post',
          data,
        }).then(response => {
          if (response.result < 0) {
            this.$alert(response.msg);
            return;
          }

          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getPendingList();
        });
      });
    },
    handlePendingSortChange({ prop, order }) {
      let sortValue = '';
      if (order === 'ascending') sortValue = 'asc';
      else if (order === 'descending') sortValue = 'desc';

      this.pendingListQuery.sort_field = prop;
      this.pendingListQuery.sort_type = sortValue;
      this.handlePendingSearchList();
    },
    handlePendingSelectionChange(selectedData) {
      this.pendingSelectedIds = selectedData.map(i => i.id);
    },

    handlePrintedSearchList() {
      this.printedListQuery.page_num = 1;
      this.getPrintedList();
    },
    handlePrintedSizeChange(val) {
      this.printedListQuery.page_num = 1;
      this.printedListQuery.page_size = val;
      this.getPrintedList();
    },
    handlePrintedCurrentChange(val) {
      this.printedListQuery.page_num = val;
      this.getPrintedList();
    },
    getPrintedList() {
      this.printedListLoading = true;

      const query = { ...this.printedListQuery };

      if (this.printedCreateTimes && this.printedCreateTimes[0]) {
        query.start_create_time = this.printedCreateTimes[0] + ' 00:00:01';
        query.end_create_time = this.printedCreateTimes[1] + ' 23:59:59';
      }
      if (this.printedPrintTimes && this.printedPrintTimes[0]) {
        query.start_print_time = this.printedPrintTimes[0] + ' 00:00:01';
        query.end_print_time = this.printedPrintTimes[1] + ' 23:59:59';
      }
      request({
        url: '/express/getPrintManualList',
        method: 'get',
        params: query,
      }).then(response => {
        this.printedListLoading = false;
        this.printedList = response.data.list || [];
        this.printedTotal = response.data.total || 0;
      });
    },
    handlePrintedSortChange({ prop, order }) {
      let sortValue = '';
      if (order === 'ascending') sortValue = 'asc';
      else if (order === 'descending') sortValue = 'desc';

      this.printedListQuery.sort_field = prop;
      this.printedListQuery.sort_type = sortValue;
      this.handlePrintedSearchList();
    },
    handlePrintedSelectionChange(selectedData) {
      this.printedSelectedIds = selectedData.map(i => i.id);
    },
    handlePrintAgain(index, row) {
      this.expressPrintOrdersAgain = 1;
      this.expressPrintAgainOrderIds = [row.id];
      this.expressPrintAgainTotalCount = this.expressPrintAgainOrderIds.length;
      this.expressPrintAgainFinishCount = 0;
      this.expressPrintAgainLatestFailMsg = '';
      this.expressPrintingAgainDialogVisible = true;
      this.expressPrintAgainNext();
    },

    // 获取快递设置
    requestExpressInfo() {
      this.initRequesting = true;
      request('/express/getPrintSetting')
        .then(res => {
          this.expressSetting = res.data || {};
          const printEnabled =
            this.expressSetting.partner_id && this.expressSetting.enable_print;

          if (!printEnabled) {
            this.$alert('请配置面单打印设置并启用后，再访问此页面', {
              confirmButtonText: '去配置',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
            }).then(() => {
              window.location.href = '/express/setting';
            });
            return;
          }
          // 每隔10秒重新刷新数据
          this.refreshPrintDevicesInterval = setInterval(
            this.requestExpressPrintDevicesWithTask,
            10 * 1000
          );
          this.requestExpressPrintDevicesWithTask();

          this.init();
        })
        .finally(() => {
          this.initRequesting = false;
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
      const { pendingSelectedIds } = this;

      if (!pendingSelectedIds.length) {
        Notification({
          title: '提示',
          message: '请至少选中一个项目',
          type: 'warning',
        });
        return;
      }

      this.expressPrintOrdersAgain = 0;
      this.expressDeviceSelectDialogVisible = true;
    },
    onClickExpressPrintAgain() {
      const { printedSelectedIds } = this;

      if (!printedSelectedIds.length) {
        Notification({
          title: '提示',
          message: '请至少选中一个项目',
          type: 'warning',
        });
        return;
      }

      this.expressPrintOrdersAgain = 1;
      this.expressPrintAgainOrderIds = JSON.parse(
        JSON.stringify(this.printedSelectedIds)
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
      data.append('manual_ids', this.pendingSelectedIds.join(','));

      this.expressPrintAddingOrders = true;
      request({
        url: '/express/printManual',
        method: 'post',
        data,
      })
        .then(res => {
          if (res.result < 0) {
            this.expressDeviceSelectErrorMsg = res.msg;
            return;
          }

          Message.success('添加到快递单打印成功');

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
      data.append('manual_id', orderId);

      request({
        url: '/express/printAgainManual',
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

    // 复制到系统
    copyToSys(index, row) {
      const preEl = this.$refs[`printedCopy${row.id}`];
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }

      const range = window.document.createRange();
      range.selectNode(preEl);
      selection.addRange(range);

      window.document.execCommand('copy');

      this.$message('复制成功');
    },
  },
};
