<template>
  <main>
    <div class="head">
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="10">
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
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" v-show="subList.length !== 0">
          <label for="">佛事选择项：</label>
          <el-select
            @change="onChangeFilter"
            size="medium"
            v-model="subId"
            filterable
            placeholder="请选择或填写关键词搜索"
          >
            <el-option
              v-for="item in subList"
              :key="item.subId"
              :label="item.subName"
              :value="item.subId"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-checkbox
            @change="onChangeFilter"
            label="无反馈图片"
            v-model="hasFb"
          ></el-checkbox>
          <el-checkbox
            @change="onChangeFilter"
            label="未打印小票"
            v-model="notPrint"
          ></el-checkbox>
        </el-col>
      </el-row>

      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="10">
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
          >
          </el-date-picker>
        </el-col>
        <el-col :span="8">
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
          未处理 <span class="badge mg-l-20">{{ unHandleNum }}</span>
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(4)"
          v-bind:class="{ active: type === 4 }"
        >
          已发货
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(5)"
          v-bind:class="{ active: type === 5 }"
        >
          已收货
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(3)"
          v-bind:class="{ active: type === 3 }"
        >
          已处理
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(2)"
          v-bind:class="{ active: type === 2 }"
        >
          全部订单
        </div>
      </div>

      <div class="mg-b-10" style="height: 40px; line-height: 40px;">
        <span class="mg-r-10 mg-l-30" style="color:#989898;"
          >已选择<span
            class="mg-l-10 mg-r-10 text-center"
            style="width: 20px;display: inline-block;"
            >{{ selected.length }}</span
          >项</span
        >
        <el-button
          type="success"
          size="medium"
          v-show="type === 1 || type === 3"
          @click="onClickHandleOrderGroup"
        >
          <span v-if="type === 3">批量修改反馈</span>
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
          type="default"
          size="medium"
          class="pull-right mg-r-20"
          @click="onClickPrintGroup"
          >小票打印</el-button
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
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection"> </el-table-column>
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
          sortable="custom"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="180"
          prop="orderTime"
          label="下单时间"
          sortable="custom"
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
          background
          layout="sizes, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>

    <Printer />
    <Detail
      :isGroup="isGroup"
      :type="type"
      :detail="detail"
      @refresh="requestList"
    />
    <Logistics
      :buddhistId="buddhistId"
      :subId="subId"
      :date="date"
      @refresh="requestList"
    />
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import Detail from './Detail';
import Printer from './Printer';
import Logistics from './Logistics';
import formatTime from '../../util/format_time';
import underscore from 'underscore';

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
      subId: -1,
      hasFb: false,
      notPrint: false,
      date: ['', ''],
      formatDate: ['', ''],
      tel: '',
      logisticsOrder: '',
      type: 1, // 1 未处理 3 已处理 4 已发货 2 全部订单 5 已发货
      orderByPriceType: 0,
      orderByTimeType: 0,
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

    subList: function() {
      // 为了兼容 360 兼容模式 不能使用 find
      const curBuddhist = underscore.find(this.buddhistList, item => {
        return item.buddhistId === this.buddhistId;
      });

      //      const curBuddhist = this.buddhistList.find(
      //        item => item.buddhistId === this.buddhistId
      //      );

      if (curBuddhist) {
        const subList = curBuddhist.subList;
        return subList.length
          ? [{ subName: '全部', subId: -1 }, ...subList]
          : [];
      } else {
        return [];
      }
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
            //            { buddhistId: '', buddhistName: '全部', subList: [] },
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
        subId,
        hasFb,
        notPrint,
        formatDate,
        tel,
        logisticsOrder,
        orderByPriceType,
        orderByTimeType,
      } = this;

      seeAjax(
        'getList',
        {
          page,
          pageSize,
          type,
          buddhistId,
          subId,
          hasFb: Number(hasFb),
          notPrint: Number(notPrint),
          beginDate: formatDate[0],
          endDate: formatDate[1],
          tel,
          logisticsOrder,
          orderByPriceType,
          orderByTimeType,
        },
        res => {
          if (res.success) {
            this.totalCount = res.totalCount;
            this.list = res.data;

            if (type === 1) {
              this.unHandleNum = res.totalCount;
              // 导航栏的total显示
              window.localStorage.setItem('orderNumber', res.totalCount);
              document.querySelector('[data-buddhist-order-count]').innerHTML =
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
      this.subId = -1;
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
      this.subId = -1;
      this.tel = '';
      this.logisticsOrder = '';
      this.hasFb = false;
      this.notPrint = false;
      this.date = ['', ''];
      this.formatDate = ['', ''];
      this.requestList();
    },
    onClickExport() {
      const { type, buddhistId, hasFb, notPrint, formatDate, tel } = this;
      const excelUrl =
        `/zzhadmin/bcDownloadExcel/?type=${type}` +
        `&beginDate=${formatDate[0]}&endDate=${formatDate[1]}` +
        `&buddishService=${buddhistId}&tel=${tel}` +
        `&isSearchNoPic=${Number(hasFb)}&searchNotPrint=${Number(notPrint)}`;
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
    onClickLogistics() {
      this.$store.commit({ type: 'updateLogisticsDialogVisible', state: true });
    },
    onClickPrintGroup() {
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
        this.$store.commit({
          type: 'updatePrinterVisible',
          state: true,
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
    handleSortChange({ prop, order }) {
      let orderKey;
      let orderType; // 0 不排序 1

      // 重置
      this.orderByPriceType = 0;
      this.orderByTimeType = 0;

      if (prop === 'orderTime') {
        orderKey = 'orderByTimeType';
      } else if (prop === 'price') {
        orderKey = 'orderByPriceType';
      }

      if (order === 'ascending') {
        // 1 降 2 升 0 无效
        orderType = 2;
      } else if (order === 'descending') {
        orderType = 1;
      }

      if (orderKey) {
        this[orderKey] = orderType;
      }

      this.requestList();
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
