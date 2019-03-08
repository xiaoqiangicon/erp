<template>
  <main>
    <div class="head">
      <el-row class="mg-b-10" style="line-height: 40px;">
        <el-col :span="10">
          <label for="">佛事项目：</label>
          <el-select size="medium">
            <el-option>
              全部
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <label for="">佛事选择项：</label>
          <el-select size="medium">
            <el-option>
              全部
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
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
          >
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <label for="">手机号：</label>
          <el-input style="width: 150px;" size="medium"></el-input>
        </el-col>

        <el-col :span="6">
          <el-button size="medium">查询</el-button>
          <el-button size="medium">重置</el-button>
          <el-button size="medium">导出</el-button>
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
          @click="onClickType(2)"
          v-bind:class="{ active: type === 2 }"
        >
          已发货
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
          @click="onClickType(4)"
          v-bind:class="{ active: type === 4 }"
        >
          全部订单
        </div>
      </div>

      <div class="mg-b-10">
        <span class="mg-r-10 mg-l-30" style="color:#989898;"
          >已选择<span class="mg-l-10 mg-r-10">0</span>项</span
        >
        <el-button type="default" size="mini">设为已处理</el-button>
        <el-button type="default" class="pull-right mg-r-20" size="mini"
          >小票打印</el-button
        >
      </div>

      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="佛事">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="联系人" width="200">
        </el-table-column>
        <el-table-column
          prop="address"
          label="数量"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="支付"
          width="150"
          sortable
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="下单时间"
          width="200"
          sortable
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="打印状态"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="100"
          show-overflow-tooltip
        >
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
  </main>
</template>

<script>
import seeFetch from 'see-fetch';

export default {
  name: 'App',
  data() {
    return {
      loading: false,
      unHandleNum: 10,
      // 列表请求参数
      hasFb: false,
      notPrint: false,
      startDate: '',
      endDate: '',
      tel: '',
      type: 1,
      orderByPayType: 1,
      orderByTimeType: 1,
      // 分页
      currentSize: 25,
      currentPage: 0,
      totalCount: 0,
      // 数据
      list: [],
      selected: [],

      detail: {},
    };
  },
  created() {
    this.requestBuddhistList();
    this.requestList();
  },
  methods: {
    requestBuddhistList() {
      seeFetch('getBuddhistList', {}, res => {
        console.log(res, 1123);
        debugger;
      });
    },
    requestList() {
      this.loading = true;

      this.loading = false;
    },

    onClickType(type) {
      this.type = type;
      this.currentPage = 0;
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

.badge {
  background-color: #d9534f;
}
</style>
