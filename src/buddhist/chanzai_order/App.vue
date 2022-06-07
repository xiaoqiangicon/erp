<template>
  <main>
    <div class="head">
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="11">
          <label for="">佛事项目：</label>
          <el-select
            style="width: 350px;"
            clearable
            @change="onChangeBuddhistId"
            size="medium"
            v-model="buddhistId"
            filterable
            :loading="loadingBuddhistList"
            placeholder="请选择或填写关键词搜索"
          >
            <el-option
              v-for="item in buddhistList"
              :key="item.buddhistId"
              :label="item.buddhistName"
              :value="item.buddhistId"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="11">
          <label for="">下单时间：</label>
          <el-date-picker
            @change="onChangeDatePicker"
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            unlink-panels
          ></el-date-picker>
        </el-col>
        <el-col :span="7">
          <label for="">手机号：</label>
          <el-input
            style="width: 150px;"
            size="medium"
            v-model="tel"
            @keyup.enter.native="onClickSearch"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="medium" @click="onClickSearch">查询</el-button>
          <el-button size="medium" @click="onClickReset">重置</el-button>
          <el-button size="medium" @click="onClickExport">导出</el-button>
        </el-col>
      </el-row>
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="11">
          <label for="">物流单号：</label>
          <el-input
            style="width: 350px;"
            size="medium"
            v-model="logisticsOrder"
            @keyup.enter.native="onClickSearch"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <label for="">单号查询：</label>
          <el-input
            style="width: 350px;"
            size="medium"
            v-model="orderNo"
            @keyup.enter.native="onClickSearch"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="s-tabs">
        <div
          class="s-tab-panel"
          @click="onClickType(1)"
          v-bind:class="{ active: type === 1 }"
        >
          未处理
          <span class="badge mg-l-20">{{ unHandleNum }}</span>
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(3)"
          v-bind:class="{ active: type === 3 }"
        >
          已发货
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(4)"
          v-bind:class="{ active: type === 4 }"
        >
          已收货
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(2)"
          v-bind:class="{ active: type === 2 }"
        >
          已处理
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(6)"
          v-bind:class="{ active: type === 6 }"
        >
          多次处理订单
        </div>
      </div>
      <div class="mg-b-10" style="height: 40px; line-height: 40px;">
        <span class="mg-r-10 mg-l-30" style="color:#989898;">
          已选择
          <span
            class="mg-l-10 mg-r-10 text-center"
            style="width: 20px;display: inline-block;"
            >{{ selected.length }}</span
          >项
        </span>
        <el-button
          type="success"
          size="medium"
          v-show="type === 1 || type === 2 || type === 6"
          @click="onClickHandleOrderGroup"
        >
          <span v-if="type === 2">批量修改反馈</span>
          <span v-else>批量处理</span>
        </el-button>
        <el-button
          v-show="type === 1 && buddhistId"
          type="default"
          size="medium"
          @click="onClickLogistics"
        >
          批量发货
        </el-button>
        <el-button
          v-show="expressSetting.enable_print && (type === 1 || type === 2)"
          type="default"
          class="fl-right"
          size="medium"
          @click="onClickExpressPrint"
        >
          快递单打印
        </el-button>
        <el-button
          v-show="expressSetting.enable_print && type === 3"
          type="default"
          size="medium"
          @click="onClickExpressPrintAgain"
        >
          原单重打印
        </el-button>
        <el-button
          type="default"
          class="pull-right mg-r-20"
          size="medium"
          @click="onClickPrint"
          >立即打印</el-button
        >
        <el-button
          type="default"
          class="pull-right mg-r-20"
          size="medium"
          @click="onClickSetPrinter"
          >打印设置</el-button
        >
      </div>

      <div class="print-task-sec" v-if="expressPrintDevicesWithTask.length">
        <div
          class="print-task-row"
          v-for="(item, index) in expressPrintDevicesWithTask"
          :key="index"
        >
          {{ item.device_name }} 正在打印第
          <span class="green f-wg-bold">{{
            item.finish_count < item.total_count
              ? item.finish_count + 1
              : item.finish_count
          }}</span>
          单， 共 {{ item.total_count }} 单
          <div class="mg-t-10" v-if="item.latest_fail_msg">
            <el-alert type="warning" :closable="false" show-icon>
              {{ item.latest_fail_msg }}
            </el-alert>
          </div>
          <span
            class="print-task-row-detail"
            @click="seeExpressPrintTaskDetail(index)"
            >查看详情</span
          >
        </div>
      </div>

      <el-table
        highlight-current-row
        v-loading="loadingList"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="佛事">
          <template slot-scope="scope">
            <img class="td-cover" v-bind:src="scope.row.productImg" />
            <p class="mg-b-0" style="font-size: 16px;">
              {{ scope.row.buddhistName }}
            </p>
            <p class="mg-b-0">{{ scope.row.subdivideName }}</p>
          </template>
        </el-table-column>
        <el-table-column width="200" label="联系人">
          <template slot-scope="scope">
            <p>{{ scope.row.user.name }}</p>
            <p>{{ scope.row.user.mobile }}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="buyNum"
          label="数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="用户留言">
          <template slot-scope="scope">
            <div v-if="scope.row.userComment">{{ scope.row.userComment }}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="price"
          label="支付"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          width="180"
          prop="orderTime"
          label="下单时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="150" label="打印状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="!scope.row.express_print_status">未打印</div>
            <div v-else-if="scope.row.express_print_status === 1">
              <el-button type="primary" size="small" round plain
                >正在打印</el-button
              >
            </div>
            <div v-else-if="scope.row.express_print_status === 2">
              <el-button type="success" size="small" round plain
                >打印完成</el-button
              >
            </div>
            <div v-else-if="scope.row.express_print_status === 3">
              <el-button type="warning" size="small" round plain
                >打印失败</el-button
              >
              <div
                class="mg-t-10"
                style="color: #E6A23C"
                v-if="scope.row.express_print_message"
              >
                {{ scope.row.express_print_message }}
              </div>
            </div>
            <div v-else-if="scope.row.express_print_status === 9">
              <el-button type="warning" size="small" round plain
                >添加打印失败</el-button
              >
              <div
                class="mg-t-10"
                style="color: #E6A23C"
                v-if="scope.row.express_print_message"
              >
                {{ scope.row.express_print_message }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDetail(scope.row)"
              >详情</a
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="mg-t-10" style="text-align: center;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[25, 50, 75, 100]"
          :page-size="currentSize"
          background=""
          layout="sizes, prev, pager, next"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <Printer />
    <Detail
      :isGroup="isGroup"
      :type="type"
      :detail="detail"
      @refresh="requestList"
    />
    <Logistics :buddhistId="buddhistId" :date="date" @refresh="requestList" />

    <el-dialog
      title="快递面单打印"
      :visible.sync="expressDeviceSelectDialogVisible"
      width="500px"
    >
      <el-alert
        type="success"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectedOnline === true"
      >
        选中的云打印机在线，可正常使用。
      </el-alert>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectedOnline === false"
      >
        {{ expressDeviceSelectedName || '' }}已离线，请检查本地网络是否正常。
      </el-alert>
      <el-form label-width="100px" size="small" class="mg-t-20">
        <el-form-item label="物流公司：" v-if="expressPrintMultiPartner">
          <el-radio v-model="expressPrintPartnerType" label="yt">圆通</el-radio>
          <el-radio v-model="expressPrintPartnerType" label="sf">顺丰</el-radio>
        </el-form-item>
        <el-form-item label="云打印机：">
          <el-select
            v-model="expressDeviceSelectedId"
            placeholder="请选择云打印机"
            style="width: 250px;"
            @change="onChangeExpressPrintDevice"
          >
            <el-option
              v-for="item in expressPrintDevices"
              :key="item.id"
              :label="item.device_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceSelectErrorMsg"
      >
        {{ expressDeviceSelectErrorMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="expressDeviceSelectDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-loading="expressPrintAddingOrders"
          @click="handleExpressDeviceSelectDialogConfirm"
          :disabled="
            !expressDeviceSelectedId || expressDeviceSelectedOnline !== true
          "
          >下一步</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单打印"
      :visible.sync="expressPrintingDialogVisible"
      width="500px"
    >
      <el-alert type="info" :closable="false" show-icon>
        请稍等，待全部快递单打印完成后再关闭此窗口，否则可能会出现漏单等情况。
      </el-alert>
      <div class="mg-t-40 mg-b-40 t-a-center">
        正在打印第
        <span class="green f-wg-bold">{{
          expressDeviceCurrentFinishCount < expressDeviceCurrentTotalCount
            ? expressDeviceCurrentFinishCount + 1
            : expressDeviceCurrentFinishCount
        }}</span>
        单，共 {{ expressDeviceCurrentTotalCount }} 单
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressDeviceCurrentLatestFailMsg"
      >
        {{ expressDeviceCurrentLatestFailMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="expressPrintingDialogVisible = false"
          >关闭</el-button
        >
        <el-button
          type="warning"
          size="small"
          @click="handleExpressPrintCancelDialogConfirm"
          >取消打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleExpressPrintCancelDialogRestore"
          v-if="expressDeviceCurrentLatestFailMsg"
          >重新开始打印</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单打印"
      :visible.sync="expressPrintedDialogVisible"
      width="500px"
    >
      <div class="mg-t-40 mg-b-40 t-a-center f-s-16">
        <img
          src="https://pic.zizaihome.com/f6c88722-4071-4c94-b005-e5aa61ff8c93.svg"
          width="50"
          class="mg-r-20"
        />
        已打印完成，共
        <span class="green f-wg-bold">{{
          expressPrintOrdersAgain
            ? expressPrintAgainTotalCount
            : expressDeviceCurrentTotalCount
        }}</span>
        单
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="expressPrintedDialogVisible = false"
          >知道了</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="快递面单复打"
      :visible.sync="expressPrintingAgainDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-alert type="info" :closable="false" show-icon>
        请勿关闭此窗口或刷新页面，不然复打任务将取消
      </el-alert>
      <div class="mg-t-40 mg-b-40 t-a-center">
        正在打印第
        <span class="green f-wg-bold">{{
          expressPrintAgainFinishCount < expressPrintAgainTotalCount
            ? expressPrintAgainFinishCount + 1
            : expressPrintAgainFinishCount
        }}</span>
        单，共 {{ expressPrintAgainTotalCount }} 单
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        v-if="expressPrintAgainLatestFailMsg"
      >
        {{ expressPrintAgainLatestFailMsg }}
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          size="small"
          @click="handleExpressPrintAgainCancelDialogConfirm"
          >取消打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleExpressPrintAgainCancelDialogRestore"
          v-if="expressPrintAgainLatestFailMsg"
          >重新开始打印</el-button
        >
      </span>
    </el-dialog>
  </main>
</template>

<script src="./App.js"></script>

<style lang="less" scoped src="./App.less"></style>
