<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="search-class">
          <span>签到寺务</span>
          <el-select v-model="signId" class="select-box" @change="refresh">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-time">
          <span>筛选日期</span>
          <el-date-picker
            v-model="date"
            type="date"
            @change="refresh"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="姓名" :align="'center'">
          <template slot-scope="scope">
            <div>
              <img class="avatar" :src="scope.row.pic" alt="" />
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeStr" label="角色" :align="'center'" />
        <el-table-column prop="mobile" label="手机号码" :align="'center'" />
        <el-table-column prop="signStr" label="签到方式" :align="'center'" />
        <el-table-column prop="addTime" label="签到时间" :align="'center'" />
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

let firstSign = !0;

export default {
  name: 'APP',
  data() {
    return {
      tableList: [],
      activityList: [],
      signId: '',
      date: '',
      total: 0,
      currentPage: 1,
      pageSize: 25,
    };
  },
  created() {
    this.signId = parseInt(urlParams.id, 10) || '';
    this.fetchActivity();
  },
  computed: {
    time() {
      return (
        new Date(this.date).getFullYear() +
        '-' +
        (new Date(this.date).getMonth() + 1) +
        '-' +
        new Date(this.date).getDate()
      );
    },
  },
  methods: {
    fetchList() {
      seeAjax(
        'getList',
        {
          time: this.date ? this.time : '',
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          signId: this.signId,
        },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
            this.total = res.data.total;
          }
        }
      );
    },
    fetchActivity() {
      seeAjax('getActivityList', { pageNum: 1, pageSize: 1000 }, res => {
        if (res.success) {
          this.activityList = res.data.list;
          if (firstSign && !this.signId) {
            this.signId = res.data.list.length ? res.data.list[0].id : '';
            firstSign = !1;
          }
          this.fetchList();
        }
      });
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
  span {
    margin-right: 10px;
  }
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
