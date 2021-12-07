import { Message, MessageBox } from 'element-ui';
import request from '../../utils/request';
import { checkItemValid } from './utils';

const defaultListQuery = {
  page_num: 1,
  page_size: 10,
};

const defaultItem = {
  device_name: null,
  device_num: null,
};

export default {
  name: 'App',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      item: Object.assign({}, defaultItem),
      isUpdate: false,

      addError: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearchList() {
      this.listQuery.page_num = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.page_num = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page_num = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isUpdate = false;
      this.item = Object.assign({}, defaultItem);
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isUpdate = true;
      this.item = Object.assign({}, row);
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = new URLSearchParams();
        data.append('id', row.id);

        request({
          url: '/express/delPrintDevice',
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
          this.getList();
        });
      });
    },
    handleDialogConfirm() {
      const checkResult = checkItemValid(this.item);

      if (typeof checkResult === 'string') {
        this.addError = checkResult;
        return;
      }

      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = new URLSearchParams();

        Object.keys(defaultItem).forEach(key => {
          data.append(key, checkResult[key]);
        });

        if (this.isUpdate) {
          data.append('id', checkResult.id);
          request({
            url: '/express/updatePrintDevice',
            method: 'post',
            data,
          }).then(response => {
            if (response.result < 0) {
              this.addError = response.msg;
              return;
            }

            this.$message({
              message: '更新成功！',
              type: 'success',
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          request({
            url: '/express/addPrintDevice',
            method: 'post',
            data,
          }).then(response => {
            if (response.result < 0) {
              this.addError = response.msg;
              return;
            }

            this.$message({
              message: '添加成功！',
              type: 'success',
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      request({
        url: '/express/getPrintDeviceList',
        method: 'get',
        params: this.listQuery,
      }).then(response => {
        this.listLoading = false;
        this.list = response.data.list || [];
        this.total = response.data.total || 0;
        this.getStatuses();
      });
    },
    getStatuses() {
      this.list.forEach((item, index) => {
        request({
          url: '/express/getPrintDeviceStatus',
          method: 'get',
          params: { id: item.id },
        }).then(response => {
          this.list[index].statusOnline = response.result >= 0;
          this.list[index].statusMessage = response.msg;
          this.list[index].statusLoaded = true;

          // 更新数据
          // this.$forceUpdate();
          this.list = JSON.parse(JSON.stringify(this.list));
        });
      });
    },
  },
};
