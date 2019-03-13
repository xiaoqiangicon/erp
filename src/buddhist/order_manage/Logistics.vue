<template>
  <el-dialog
    title="批量发货"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="cell">
      <p class="mg-b-10">1. 导出已选择的订单号码</p>
      <el-button tyee="default" size="mini">导出excel</el-button>
    </div>

    <div class="cell">
      <p class="mg-b-10">2. 在电脑中编辑发货文件中的：物流公司、物流单号</p>
    </div>

    <div class="cell">
      <p class="mg-b-10">
        3. 上传已编辑的发货文件，自在家系统中对应的订单则会发货
      </p>
      <el-button type="default" size="mini">上传发货文件</el-button>
    </div>

    <div class="foot">
      <el-button type="default" size="mini">取消</el-button>
      <el-button type="success" size="mini">确认发货</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Logistics',
  data: () => {
    return {};
  },
  computed: {
    visible() {
      return this.$store.state.logisticsDialogVisible;
    },
  },
  methods: {
    handleClose() {
      this.$store.commit({
        type: 'updateLogisticsDialogVisible',
        state: false,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cell {
  margin-bottom: 20px;
}
.foot {
  text-align: center;
}
</style>
