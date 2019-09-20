<template>
  <main>
    <div class="head">
      <div class="s-tabs">
        <div
          class="s-tab-panel"
          :class="{ active: type === 1 }"
          @click="onClickType(1)"
        >
          未生效
        </div>
        <div
          class="s-tab-panel"
          :class="{ active: type === 2 }"
          @click="onClickType(2)"
        >
          生效中
        </div>
        <div
          class="s-tab-panel"
          :class="{ active: type === 3 }"
          @click="onClickType(3)"
        >
          过期
        </div>
      </div>
      <div class="search-row">
        <el-input v-model="searchContent" style="width: 200px;" size="medium" />
        <el-button type="primary" @click="search">
          搜索
        </el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :data="list"
      >
        <el-table-column label="分配编号" prop="id" />
        <el-table-column width="120" label="人数" prop="total" />
        <el-table-column v-if="type == 3" label="过期" prop="invalidTotal" />
        <el-table-column label="截至时间">
          <template slot-scope="scope">
            <div v-if="type == 1">
              <div v-if="scope.row.endTime">
                {{ scope.row.endTime }}
              </div>
              <div v-else class="not-set" @click="onClickSetTime(scope.row)">
                <span>未设置</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-if="type == 2">
              <div class="" @click="onClickSetTime(scope.row)">
                <span>{{ scope.row.endTime }}</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-if="type == 3">
              <div class="">
                <span>{{ scope.row.expireTime }}</span>
                <span class="expire-sign">过期</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="保险单号" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="type === 1">
              <div v-if="scope.row.insuranceNumber | insuranceId">
                {{ insuranceId ? insuranceId : scope.row.insuranceNumber }}
              </div>
              <div
                v-else
                class="not-set"
                @click="onClickSetInsuranceId(scope.row)"
              >
                <span>未设置</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div
              v-else-if="type === 2"
              @click="onClickSetInsuranceId(scope.row)"
            >
              <div>
                {{ scope.row.insuranceNumber }}
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-else-if="type === 3">
              <div>
                {{ scope.row.insuranceNumber }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="生成时间"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="type == 1">
              <el-button type="primary" @click="onClickSetValid(scope.row)">
                设为生效
              </el-button>
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickManage(scope.row)"
                >管理人员</a
              >
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickDelete(scope.row)"
                >删除</a
              >
            </div>
            <div v-if="type == 2">
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickManage(scope.row)"
                >查看人员</a
              >
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickWithdraw(scope.row)"
                >撤回</a
              >
            </div>
            <div v-if="type == 3">
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickManage(scope.row)"
                >管理人员</a
              >
              <a
                class="s-a"
                href="javascript:void(0);"
                @click="onClickNotice(scope.row)"
                >通知续保</a
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mg-t-10" style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="currentSize"
        background=""
        layout="sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <SetValid :set-valid-id="setValidId" />
    <Delete :delete-id="deleteId" />
    <Withdraw :withdraw-id="withdrawId" />
    <SetEndTime
      :end-time.sync="endTime"
      :set-end-time-id="setEndTimeId"
      :end-time-group-id="endTimeGroupId"
    />
    <SetInsuranceId :insurance-id.sync="insuranceId" />
    <Notice :notice-id="noticeId" />
  </main>
</template>

<script>
import seeAjax from 'see-ajax';
import * as env from '../../util/env';

import SetValid from './components/SetValid';
import Delete from './components/Delete';
import Withdraw from './components/Withdraw';
import SetEndTime from './components/SetEndTime';
import SetInsuranceId from './components/SetInsuranceId';
import Notice from './components/Notice';

export default {
  name: 'App',
  components: {},
  components: {
    SetValid,
    Delete,
    Withdraw,
    SetEndTime,
    SetInsuranceId,
    Notice,
  },
  data() {
    return {
      nameId: '', // 搜索请求参数
      distributeId: '', // 分配编号
      list: [], // 列表信息
      type: 1, // 生效状态
      searchContent: '', // 搜索内容
      endTime: '', // 需要修改的截至时间
      setEndTimeId: '', // 设置截至时间得表单号
      endTimeGroupId: '', // 设置截至时间的分组ID
      setValidId: '', // 需要生效得表单号
      noticeId: '', // 需要通知续保得表单号
      deleteId: '', // 需要删除得保单号
      withdrawId: '', // 需要撤回得表单号
      insuranceId: '', // 需要修改的保险单号
      currentPage: 1, // 当前页数
      currentSize: 25, // 一页的数据量
      totalCount: 0, // 总数量
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
  },
  created() {
    this.requestList();
  },
  methods: {
    // 获取未过期列表
    requestList() {
      const { type, searchContent, currentPage, currentSize } = this;
      seeAjax(
        'getList',
        {
          status: type,
          content: searchContent,
          pageNum: currentPage - 1,
          pageSize: currentSize,
        },
        res => {
          if (!res.success) return;

          this.totalCount = res.data.count;
          this.list = res.data.list;
        }
      );
    },
    // 获取过期列表
    requestExpireList() {
      const { searchContent, currentPage, currentSize } = this;
      seeAjax(
        'expireList',
        {
          content: searchContent,
          pageNum: currentPage - 1,
          pageSize: currentSize,
        },
        res => {
          if (!res.success) return;

          this.totalCount = res.data.count;
          this.list = res.data.list;
        }
      );
    },
    // 选项卡切换
    onClickType(type) {
      if (this.type === type) return;

      this.searchContent = '';
      this.type = type;
      if (this.type === 1) {
        this.onChangeFilter();
      }
      if (this.type === 2) {
        this.onChangeFilter();
      }
      if (this.type === 3) {
        this.onChangeFilter();
      }
    },
    onChangeFilter() {
      this.currentPage = 1;
      if (this.type <= 2) {
        this.requestList();
      } else {
        this.requestExpireList();
      }
    },
    // 搜索
    search() {
      this.onChangeFilter();
    },
    // 设置截至时间
    onClickSetTime(data) {
      this.endTime = data.end_time;
      this.setEndTimeId = data.insuranceNumber;
      this.endTimeGroupId = data.id;
      this.$store.commit({ type: 'updateSetEndTimeVisible', state: true });
    },
    // 设置保单号
    onClickSetInsuranceId(data) {
      this.insuranceId = data.id;
      this.$store.commit({ type: 'updateSetInsranceIdVisible', state: true });
    },
    // 设为生效
    onClickSetValid(row) {
      this.setValidId = row.id;
      this.$store.commit({ type: 'updateSetValidVisible', state: true });
    },
    // 管理人员
    onClickManage(row) {
      const url = `${env.wxProtocol}://${
        env.wxSubDomain
      }.zizaihome.com/zzhadmin/insurancePersonalHtml?groupId=${row.id}${
        env.wxParamSuffix ? `&${env.wxParamSuffix}` : ''
      }`;
      // window.location.href = url;
    },
    // 删除
    onClickDelete(row) {
      this.deleteId = row.id;
      this.$store.commit({ type: 'updateSetDeleteVisible', state: true });
    },
    // 撤回
    onClickWithdraw(row) {
      this.withdrawId = row.id;
      this.$store.commit({ type: 'updateSetWithdrawVisible', state: true });
    },
    onClickNotice(row) {
      this.noticeId = row.id;
      this.$store.commit({ type: 'updateNoticeVisible', state: true });
    },
    // 改变每页数据量
    handleSizeChange(size) {
      this.currentSize = size;
      this.onChangeFilter();
    },
    // 改变页数
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
  padding-top: 30px;
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
.search-row {
  display: flex;
  align-items: center;
  margin: 20px 0 20px 20px;
  button {
    margin-left: 20px;
  }
}

.not-set {
  color: #409eff;
  cursor: pointer;
}

.s-a {
  line-height: 40px;
  margin-right: 20px;
  color: #409eff;
  text-decoration: none;
}
</style>
