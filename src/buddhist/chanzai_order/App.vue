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
        <el-col :span="10">
          <label for="">物流单号：</label>
          <el-input
            style="width: 350px;"
            size="medium"
            v-model="logisticsOrder"
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
          v-show="type === 1 || type === 2"
          @click="onClickHandleOrderGroup"
        >
          <span v-if="type === 2">批量修改反馈</span>
          <span v-else>批量处理</span>
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
            <p class="mg-b-0">{{ scope.row.subName }}</p>
          </template>
        </el-table-column>
        <el-table-column width="200" label="联系人">
          <template slot-scope="scope">
            <p>{{ scope.row.customerName }}</p>
            <p>{{ scope.row.customerTel }}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="buyNum"
          label="数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="备注" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.userComment">{{ userComment }}</div>
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
        <el-table-column width="100" label="打印状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.isPrint">已打印</div>
            <div v-else>未打印</div>
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
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import Detail from './Detail';
import Printer from './Printer';
import formatTime from '../../util/format_time';

export default {
  name: 'App',
  components: {
    Printer,
    Detail,
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
      type: 1, // 1 未处理 2 已处理  3 已发货 4 已收货
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
  },
  methods: {
    requestBuddhistList() {
      seeAjax('getBuddhistList', {}, res => {
        if (res.success) {
          this.buddhistList = [
            //            { buddhistId: '', buddhistName: '全部' },
            ...res.data,
          ];
          this.loadingBuddhistList = false;
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

      if (!selected.length) {
        Notification({
          title: '提示',
          message: '请先选中订单',
          type: 'warning',
        });
        return;
      } else {
        // 处理订单弹窗
        this.isGroup = true;
        this.detail = {};
        this.$store.commit({
          type: 'updateDetailVisible',
          state: true,
        });
      }
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
</script>

<style lang="less" scoped>
main {
  padding: 15px;
}
.head {
  margin: 20px 0 50px;
  padding: 0 3%;
}

.s-tabs {
  height: 42px;
  line-height: 40px;
  border-bottom: 2px solid #6fba2c;
  margin-bottom: 10px;
  box-sizing: content-box;
  .s-tab-panel {
    width: 200px;
    text-align: center;
    float: left;
    background-color: #fff;
    margin-right: 20px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    &.active {
      color: #fff;
      background-color: #6fba2c;
      border: 1px solid #6fba2c;
    }
  }
}

.s-a {
  color: #2ecc40;
}

.badge {
  background-color: #d9534f;
}

.td-cover {
  float: left;
  width: 45px;
  height: 45px;
  display: inline-block;
  margin-right: 10px;
}
</style>
