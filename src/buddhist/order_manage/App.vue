<template>
  <main>
    <div class="head">
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="10">
          <label for="">佛事项目：</label>
          <el-select size="medium" v-model="buddhistId" filterable>
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
          <el-select size="medium" v-model="subId" filterable>
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
          <el-checkbox label="无反馈图片" v-model="hasFb"></el-checkbox>
          <el-checkbox label="未打印图片" v-model="notPrint"></el-checkbox>
        </el-col>
      </el-row>

      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="12">
          <label for="">下单时间：</label>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
          >
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <label for="">手机号：</label>
          <el-input
            style="width: 150px;"
            size="medium"
            v-model="tel"
          ></el-input>
        </el-col>

        <el-col :span="6">
          <el-button size="medium" @click="onClickSearch">查询</el-button>
          <el-button size="medium" @click="onClickReset">重置</el-button>
          <el-button size="medium" @click="onClickExport">导出</el-button>
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
          @click="onClickType(3)"
          v-bind:class="{ active: type === 3 }"
        >
          已完成
        </div>
        <div
          class="s-tab-panel"
          @click="onClickType(2)"
          v-bind:class="{ active: type === 2 }"
        >
          全部订单
        </div>
      </div>

      <div class="mg-b-10" style="height: 28px; line-height: 28px;">
        <span class="mg-r-10 mg-l-30" style="color:#989898;"
          >已选择<span
            class="mg-l-10 mg-r-10 text-center"
            style="width: 20px;display: inline-block;"
            >{{ selected.length }}</span
          >项</span
        >
        <el-button
          type="success"
          size="mini"
          v-show="type === 1 || type === 3"
          @click="onClickHandleOrderGroup"
        >
          <span v-if="type === 1">设为已完成</span>
          <span v-else-if="type === 3">设为未处理</span>
        </el-button>
        <el-button type="default" size="mini" @click="onClickLogistics">
          批量发货
        </el-button>
        <el-button
          type="default"
          class="pull-right mg-r-20"
          size="mini"
          @click="onClickPrintGroup"
          >小票打印</el-button
        >
      </div>

      <el-table
        highlight-current-row
        v-loading="loading"
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
            <p class="mg-b-0">{{ scope.row.productName }}</p>
            <p class="mg-b-0">{{ scope.row.productSize }}</p>
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
    <Detail :detail="detail" :type="type" />
    <Logistics />
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeFetch from 'see-fetch';
import Detail from './Detail';
import Printer from './Printer';
import Logistics from './Logistics.vue';

export default {
  name: 'App',
  components: {
    Printer,
    Detail,
    Logistics,
  },
  data() {
    return {
      loading: false,
      unHandleNum: null,
      // 列表请求参数
      buddhistId: 0,
      subId: 0,
      hasFb: false,
      notPrint: false,
      date: ['', ''],
      tel: '',
      type: 1, // 未处理 1 已处理 3  已发货 4 全部订单 2
      orderByPriceType: 0,
      orderByTimeType: 0,
      // 分页
      currentSize: 25,
      currentPage: 0,
      totalCount: 0,
      // 数据
      buddhistList: [],
      list: [],
      detail: {},
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },

    subList: function() {
      const curBuddhist = this.buddhistList.find(
        item => item.buddhistId === this.buddhistId
      );
      if (curBuddhist) {
        const subList = curBuddhist.subList;
        return subList.length
          ? [{ subName: '全部', subId: 0 }, ...subList]
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
      seeFetch('getBuddhistList', {}).then(res => {
        this.buddhistList = [
          { buddhistId: 0, buddhistName: '全部', subList: [] },
          ...res.data,
        ];
      });
    },
    requestList() {
      this.loading = true;

      const {
        currentPage: page,
        currentSize: pageSize,
        type,
        buddhistId,
        subId,
        hasFb,
        notPrint,
        date,
        tel,
        orderByPriceType,
        orderByTimeType,
      } = this;

      seeFetch('getList', {
        page,
        pageSize,
        type,
        buddhistId,
        subId,
        hasFb: Number(hasFb),
        notPrint: Number(notPrint),
        beginDate: date[0],
        endDate: date[1],
        tel,
        orderByPriceType,
        orderByTimeType,
      }).then(res => {
        this.totalCount = res.totalCount;
        this.list = res.data;

        if (type === 1) {
          this.unHandleNum = res.totalCount;
          // 导航栏的total显示
          window.localStorage.setItem('orderNumber', res.totalCount);
          document.querySelector('[data-buddhist-order-count]').innerHTML =
            res.totalCount;
        }

        this.loading = false;
      });
    },
    onClickSearch() {
      this.requestList();
    },
    onClickReset() {
      this.buddhistId = 0;
      this.subId = 0;
      this.tel = '';
      this.hasFb = false;
      this.notPrint = false;
      this.date = ['', ''];
      this.tel = '';
      this.requestList();
    },
    onClickExport() {
      const {
        currentPage: page,
        currentSize: pageSize,
        type,
        buddhistId,
        subId,
        hasFb,
        notPrint,
        date,
        tel,
      } = this;

      // templeId 暂时不传了 看看后台能否从 cookies 中获取
      window.open(`/zzhadmin/bcDownloadExcel/?beginDate=${date[0]}&endDate=${
        date[1]
      }
      &tel=${tel}&buddishService=${buddhistId}&type=${type}&subdirideId=${subId}
      &isSearchNoPic=${hasFb}&searchNotPrint=${notPrint}`);
    },
    onClickType(type) {
      this.type = type;
      this.currentPage = 0;
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
      const selected = selectedData.map(item => ({ id: item.id }));
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
      this.currentPage = 0;
      this.requestList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.requestList();
    },
    onClickDetail(rowData) {
      console.log(rowData);
      this.$store.commit({ type: 'updateDetailVisible', state: true });
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
  padding: 0 5%;
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
