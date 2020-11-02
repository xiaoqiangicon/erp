<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="search-time">
          <span>筛选日期</span>
          <el-date-picker
            v-model="date"
            @change="onChangeDatePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="search-class">
          <span v-if="!1">报备人</span>
          <el-select
            v-model="userId"
            class="select-box"
            @change="refresh"
            placeholder="请选择报备人"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-class">
          <span v-if="!1">巡查地点</span>
          <el-select
            v-model="areaId"
            class="select-box"
            @change="refresh"
            placeholder="请选择报备地点"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="addDate" label="巡查时间" :align="'center'" />
        <el-table-column prop="areaName" label="巡查地点" :align="'center'" />
        <el-table-column prop="managerName" label="报备人" :align="'center'" />
        <el-table-column prop="checkMemo" label="报备说明" :align="'center'" />
      </el-table>
      <el-pagination
        background
        class="pagination"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { urlParams } from '../../../../pro-com/src/utils';
import formatTime from '../../util/format_time';
import { Notification } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      tableList: [],
      userList: [],
      areaList: [],
      userId: '',
      areaId: '',
      date: ['', ''],
      formatDate: ['', ''],
      currentPage: 1,
      pageSize: 25,
      total: 0,
      loading: !0,
    };
  },
  created() {
    this.areaId = parseInt(urlParams.id, 10) || '';
    this.fetchList();
    this.fetchUserList();
    this.fetchAreaList();
  },
  methods: {
    fetchList() {
      this.loading = !0;
      seeAjax(
        'areaRecordList',
        {
          startDate: this.formatDate[0],
          endDate: this.formatDate[1],
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          managerId: this.userId,
          areaId: this.areaId,
        },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
            this.total = res.data.total;
          } else {
            Notification({
              title: '提示',
              message: res.message,
              type: 'error',
            });
          }
          this.loading = !1;
        }
      );
    },
    fetchUserList() {
      seeAjax('getUserList', {}, res => {
        if (res.success) {
          this.userList = res.data;
        }
      });
    },
    fetchAreaList() {
      seeAjax('getAreaList', { pageNo: 1, pageSize: 1000 }, res => {
        if (res.success) {
          this.areaList = res.data.list;
          this.areaId = parseInt(urlParams.id, 10) || '';
        }
      });
    },
    onChangeDatePicker() {
      const { date } = this;
      this.formatDate = date.map(item => formatTime(`${item}`));
      this.refresh();
    },
    refresh() {
      this.currentPage = 1;
      this.fetchList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchList();
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
}
.header {
  display: flex;
  margin: 20px 0 30px 20px;
}
.search-class {
  font-size: 16px;
  margin-right: 30px;
  span {
    margin-right: 10px;
  }
}
.search-time {
  font-size: 16px;
  margin-right: 20px;
  span {
    margin-right: 10px;
  }
}
.avatar {
  width: 100px;
  height: 150px;
  border-radius: 8px;
}
</style>
