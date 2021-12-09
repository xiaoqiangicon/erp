<template>
  <div class="root pd-20">
    <el-card>
      <div class="t-a-right">
        <el-button
          type="primary"
          class="pd-l-40 pd-r-40 mg-r-20"
          round
          @click="handleAdd"
          >绑定设备</el-button
        >
      </div>

      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" style="width: 100%;">
          <el-table-column label="设备类型">
            <template slot-scope="scope"
              >快递单云打印机</template
            >
          </el-table-column>
          <el-table-column
            label="设备名称"
            prop="device_name"
          ></el-table-column>
          <el-table-column label="设备编号" prop="device_num"></el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDateTime }}<br />
            </template>
          </el-table-column>
          <el-table-column label="设备状态">
            <template slot-scope="scope">
              <div class="status-sec">
                <div
                  v-if="!scope.row.statusLoaded"
                  v-loading="true"
                  style="height: 30px;"
                ></div>
                <div v-else style="min-height: 30px;">
                  <el-button
                    type="success"
                    size="small"
                    round
                    plain
                    v-if="scope.row.statusOnline"
                    >在线</el-button
                  >
                  <el-button type="warning" size="small" round plain v-else
                    >离线</el-button
                  >
                  <div
                    class="mg-t-10"
                    style="color: #E6A23C"
                    v-if="!scope.row.statusOnline"
                  >
                    {{ scope.row.statusMessage }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              -
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      :title="isUpdate ? '更新绑定设备' : '绑定设备'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-alert type="success" :closable="false"
        >绑定时请确保“快递云打印机”正常开机状态，且通过网线或WIFI已正常的连接网络；若需购买“打印机硬件”请联系自在家管家。</el-alert
      >
      <el-form :model="item" label-width="100px" size="small" class="mg-t-20">
        <el-form-item label="设备名称：">
          <el-input
            v-model="item.device_name"
            style="width: 100%"
            placeholder="如：XX寺快递单打印机01"
            @focus="addError = null"
          />
        </el-form-item>
        <el-form-item label="设备码：">
          <el-input
            v-model="item.device_num"
            style="width: 100%"
            placeholder="云打印机背后的设备码，如：KX100L202012324"
            @focus="addError = null"
          />
        </el-form-item>
      </el-form>
      <el-alert type="warning" :closable="false" show-icon v-if="addError">{{
        addError
      }}</el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm"
          >确认绑定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script src="./App.js"></script>

<style src="./App.less" lang="less" scoped></style>

<style scoped>
.status-sec >>> .el-loading-spinner {
  width: auto;
}
.status-sec >>> .el-loading-spinner .circular {
  width: 22px;
  height: 22px;
  margin-bottom: -16px;
}
</style>
