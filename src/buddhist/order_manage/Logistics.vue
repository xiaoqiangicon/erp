<template>
  <el-dialog
    title="批量发货"
    :visible.sync="visible"
    width="35%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="cell">
      <p class="mg-b-10">1. 导出已选择的订单号码</p>
      <div class="btn mg-l-20" @click="onClickExport">导出excel</div>
    </div>

    <div class="cell">
      <p class="mg-b-10">2. 在电脑中编辑发货文件中的：物流公司、物流单号</p>
    </div>

    <div class="cell">
      <p class="mg-b-10">
        3. 上传已编辑的发货文件，自在家系统中对应的订单则会发货
      </p>
      <div class="btn mg-l-20" @click="onClickUpload" ref="uploadRef">
        上传发货文件
      </div>
    </div>
  </el-dialog>
</template>

<script>
import upload from '@zzh/upload';
import { Notification } from 'element-ui';

export default {
  name: 'Logistics',
  props: ['date', 'buddhistId', 'subId'],
  data() {
    return {
      hasInitUpload: false,
    };
  },
  computed: {
    visible() {
      return this.$store.state.logisticsDialogVisible;
    },
  },
  updated() {
    // element-ui 的 visible 会导致 一些节点初始化时并不加载 因此使用 mounted 是不行的
    this.$nextTick(() => {
      if (this.hasInitUpload) return;

      // 自定义上传接口
      window.zzhUploadUrl = '/zzhadmin/logisticsOrderUploadExcel/';

      upload(
        this.$refs.uploadRef,
        (url, e, data) => {
          if (data.result.result >= 0) {
            Notification({
              title: '提示',
              message: '上传成功！',
              type: 'success',
            });
            this.$store.commit({
              type: 'updateLogisticsDialogVisible',
              state: false,
            });
            this.$emit('refresh');
          } else {
            Notification({
              title: '提示',
              duration: 6000,
              message: data.result.msg,
              type: 'error',
            });
          }
        },
        {
          type: 'file',
          componentOption: {
            dataType: 'json',
            paramName: 'myfile',
            fail: () => {
              Notification({
                title: '提示',
                duration: 6000,
                message:
                  '文件格式或内容填写有误,请核对并修改信息后，再重新提交。',
                type: 'error',
              });
            },
          },
        }
      );
      this.hasInitUpload = true;
    });
  },
  methods: {
    handleClose() {
      this.$store.commit({
        type: 'updateLogisticsDialogVisible',
        state: false,
      });
    },

    onClickExport() {
      const { buddhistId, subId, date } = this;
      window.open(
        `/zzhadmin/logisticsOrderDownloadExcel/?beginDate=${date[0]}` +
          `&endDate=${date[1]}&commodityId=${buddhistId}&subdirideId=${subId}`
      );
    },
    onClickUpload() {},
  },
};
</script>

<style lang="less" scoped>
p {
  font-size: 20px;
  color: #333;
}
.btn {
  width: 117px;
  height: 35px;
  border: 1px solid #333;
  text-align: center;
  cursor: pointer;
  color: #333;
  position: relative;
}
.cell {
  margin-bottom: 20px;
}
</style>
