<template>
  <main>
    <div class="header">
      <div class="select-item">
        <div class="buddhist-name">
          <span>活动名称</span>
          <el-select
            style="width: 350px;"
            clearable
            @change="onChangeBuddhistId"
            size="medium"
            v-model="buddhistId"
            filterable
            placeholder="请选择或填写关键词搜索"
          >
            <el-option
              v-for="item in buddhistList"
              :key="item.commodityId"
              :label="item.name"
              :value="item.commodityId"
            ></el-option>
          </el-select>
        </div>
        <div class="buddhist-time">
          <span for="">评价时间</span>
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
        </div>
      </div>
      <div class="sort-item">
        <div class="sort-comment-item">
          <p class="sort-item-title">
            <span>很赞</span>
            <span>{{ evaluation.praiseNum }}</span>
          </p>
          <p class="sort-item-info">
            <span>{{ prasiseNumPer }}</span>
            <span>%的人感觉很赞</span>
          </p>
        </div>
        <div class="sort-comment-item">
          <p class="sort-item-title">
            <span>满意</span>
            <span>{{ evaluation.satisfactionNum }}</span>
          </p>
          <p class="sort-item-info">
            <span>{{ satisfactionNumPer }}</span>
            <span>%的人表示满意</span>
          </p>
        </div>
        <div class="sort-comment-item">
          <p class="sort-item-title">
            <span>体验不佳</span>
            <span>{{ evaluation.badReview }}</span>
          </p>
          <p class="sort-item-info">
            <span>{{ badReviewPer }}</span>
            <span>%的人体验不佳</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="tabs">
        <div
          class="tab-panel"
          @click="onClickType(0)"
          v-bind:class="{ active: type === 0 }"
        >
          全部
        </div>
        <div
          class="tab-panel"
          @click="onClickType(3)"
          v-bind:class="{ active: type === 3 }"
        >
          体验不佳
        </div>
        <div
          class="tab-panel"
          @click="onClickType(2)"
          v-bind:class="{ active: type === 2 }"
        >
          满意
        </div>
        <div
          class="tab-panel"
          @click="onClickType(1)"
          v-bind:class="{ active: type === 1 }"
        >
          很赞
        </div>
      </div>
      <el-table
        highlight-current-row
        v-loading="loadingList"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          label="评价内容"
          prop="labelRecordList"
          :align="'center'"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.labelRecordList.length">
              <div
                class="comment-content"
                v-for="(value, key) in scope.row.labelRecordList"
                :key="key"
              >
                {{ value }}
              </div>
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文字评价" :align="'center'">
          <template slot-scope="scope">
            <div class="text-comment">
              {{ scope.row.content ? scope.row.content : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="回复内容" :align="'center'">
          <template slot-scope="scope">
            <p>{{ scope.row.reply }}</p>
            <div
              class="modify reply"
              v-if="scope.row.reply"
              @click="onClickReply(scope.row)"
            >
              修改
            </div>
            <div class="reply" v-else @click="onClickReply(scope.row)">
              回复
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价类型" prop="evaluation" :align="'center'" />
        <el-table-column
          label="参与项目"
          prop="commodityName"
          :align="'center'"
        >
        </el-table-column>
        <el-table-column label="评价用户" prop="nickName" :align="'center'" />
        <el-table-column label="评价时间" prop="addTime" :align="'center'" />
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <div class="detail" @click="toDetail(scope.row)">
              订单详情
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <Reply :replyContent="replyContent" :replyId="replyId" />
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';

import formatTime from '../../util/format_time';

import Reply from './Reply';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      loadingBuddhistList: true,
      loadingList: true,

      // 列表请求参数
      buddhistId: '',
      date: ['', ''],
      formatDate: ['', ''],
      type: 0,
      currentPage: 1,
      currentSize: 25,
      totalCount: 128,

      // 数据
      buddhistList: [],
      list: [],
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
      replyContent: '',
      replyId: 0,
      evaluation: {},
    };
  },
  components: {
    Reply,
  },
  created() {
    this.requestEvaluation();
    this.requestList();
    this.requestBuddhist();
  },
  computed: {
    badReviewPer() {
      return (
        parseInt(
          (this.evaluation.badReview /
            (this.evaluation.badReview +
              this.evaluation.satisfactionNum +
              this.evaluation.praiseNum)) *
            100,
          10
        ) | 0
      );
    },
    prasiseNumPer() {
      return (
        parseInt(
          (this.evaluation.praiseNum /
            (this.evaluation.badReview +
              this.evaluation.satisfactionNum +
              this.evaluation.praiseNum)) *
            100,
          10
        ) | 0
      );
    },
    satisfactionNumPer() {
      return (
        parseInt(
          (this.evaluation.satisfactionNum /
            (this.evaluation.badReview +
              this.evaluation.satisfactionNum +
              this.evaluation.praiseNum)) *
            100,
          10
        ) | 0
      );
    },
  },
  methods: {
    requestEvaluation() {
      seeAjax('getEvaluationNum', { commodityId: this.buddhistId | 0 }, res => {
        if (!res.success) return;

        this.evaluation = res.data;
      });
    },
    requestList() {
      let { buddhistId, formatDate, currentPage, currentSize, type } = this;

      seeAjax(
        'getList',
        {
          commodityId: parseInt(buddhistId, 10) | 0,
          startTime: formatDate[0],
          endTime: formatDate[1],
          pageNum: currentPage - 1,
          pageSize: currentSize,
          evaluation: parseInt(type),
        },
        res => {
          if (!res.success) return;

          let commodityList = [];
          res.data.forEach(item => {
            let single = {};
            single.commodityId = item.id;
            single.name = item.subdivideName;
            commodityList.push(single);
          });
          // this.buddhistList = commodityList;
          this.list = res.data;
          this.loadingList = false;
          this.totalCount = res.total;
        }
      );
    },
    requestBuddhist() {
      seeAjax('getBuddhistList', {}, res => {
        this.buddhistList = res.data;
      });
    },
    onChangeBuddhistId() {
      // this.requestEvaluation();
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
    onClickType(type) {
      if (this.type === type) return;

      this.type = type;
      this.currentPage = 1;
      this.requestList();
    },
    onClickReply(row) {
      this.replyContent = row.reply;
      this.replyId = row.id;
      this.$store.commit({ type: 'updateReplyVisible', state: true });
    },
    toDetail(row) {
      console.log(row);
      const orderId = row.orderId;
      const url = `/zzhadmin/ceremony_index?orderId=${orderId}`;
      window.open(url);
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
  },
};
</script>

<style lang="less" scoped>
main {
  padding: 15px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 50px;
  padding: 0 3%;
}
.buddhist-time {
  margin-top: 20px;
}
.sort-item {
  display: flex;
}
.sort-comment-item {
  width: 134px;
  margin-left: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;

  p {
    margin: 0;
  }
}
.sort-item-title {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 14px;
  border-bottom: 1px solid #cccccc;
  font-size: 18px;
  font-weight: bold;
}
.sort-item-info {
  padding-left: 25px;
  font-size: 12px;
  line-height: 26px;
  color: #b1b1b1;
}

.tabs {
  height: 42px;
  line-height: 40px;
  border-bottom: 2px solid #6fba2c;
  margin-bottom: 10px;
  box-sizing: content-box;
  .tab-panel {
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

.text-comment {
  // background-color: rgba(123, 175, 239, 0.5);
  border-radius: 4px;
  color: #333333;
  font-size: 12px;
  line-height: 18px;
}
.reply {
  width: 48px;
  height: 24px;
  margin: 0 auto;
  line-height: 24px;
  text-align: center;
  border: 1px solid #4a90e2;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  background-color: #386ad1;
  color: white;
}
.modify {
  color: #1890ff;
  background-color: #d2e9ff;
}
.detail {
  color: #1890ff;
  cursor: pointer;
}
</style>
