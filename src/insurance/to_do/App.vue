<template>
  <main>
    <div class="head">
      <div class="head-search">
        <el-select
          v-model="nameId"
          class="name-select"
          clearable
          size="medium"
          filterable
          placeholder="请选择搜索项"
        >
          <el-option
            v-for="item in selectItem"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input v-model="searchInput" class="name-input" size="medium" />
        <el-button
          class="search-btn"
          type="primary"
          round
          @click="onclickSearch"
        >
          搜索
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="s-tabs">
        <div
          class="s-tab-panel"
          :class="{ active: type === 1 }"
          @click="onClickType(1)"
        >
          待分配
        </div>
        <div
          v-show="false"
          class="s-tab-panel"
          :class="{ active: type === 2 }"
          @click="onClickType(2)"
        >
          已分配
        </div>
        <div
          class="s-tab-panel"
          :class="{ active: type === 3 }"
          @click="onClickType(3)"
        >
          失效用户
          <el-tooltip
            effect="dark"
            content="失效是指未通过审核或不续保的用户，这类用户将记录在“待办事项 - 不通过”的列表中。"
            placement="top"
          >
            <i class="el-icon-info" style="font-size: 18px" />
          </el-tooltip>
        </div>
      </div>
      <div v-show="type === 1" class="info-bar">
        <span>已选择{{ selected.length }}人</span>
        <el-button class="distribution" type="primary" @click="distribution">
          分配表单
        </el-button>
        <el-button type="warning" @click="setBatch">
          批量不通过
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="type === 1" type="selection" labei="全选" />
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.realName }}</div>
            <div>UID：{{ scope.row.userId }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          prop="name"
          label="法号"
          show-overflow-tooltip
        />
        <el-table-column prop="templeName" label="所在寺院" />
        <el-table-column
          width="140"
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
        />
        <el-table-column
          width="180"
          prop="idCard"
          label="身份证号"
          show-overflow-tooltip
        />
        <el-table-column
          width="60"
          prop="sex"
          label="性别"
          show-overflow-tooltip
        />>
        <el-table-column
          width="60"
          prop="age"
          label="年龄"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="height"
          label="身高(厘米)"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="type == 3"
          width="200"
          prop="reason"
          label="不通过原因"
        />
        <el-table-column
          v-else
          prop="addTime"
          label="申请时间"
          show-overflow-tooltip
        />
        <el-table-column width="180" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDetail(scope.row)"
              >详情</a
            >
            <a
              v-if="type == 1"
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDistribute(scope.row)"
              >分配</a
            >
            <a
              v-if="type == 1"
              class="s-a repulse"
              href="javascript:void(0);"
              @click="onClickRepulse(scope.row)"
              >打回</a
            >
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
    <Detail :detail-row="detailRow" />
    <Destribute />
    <Repulse
      :is-repulse="isRepulse"
      :distribute-row="distributeRow"
      :repulse-row="repulseRow"
    />
    <Batch />
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import Detail from './components/Detail';
import Destribute from './components/Destribute';
import Repulse from './components/Repulse';
import Batch from './components/Batch';

export default {
  name: 'App',
  components: {
    Detail,
    Destribute,
    Repulse,
    Batch,
  },
  data() {
    return {
      nameId: '', // 搜索请求参数
      selectItem: ['姓名', 'UID', '电话', '批次号码'],
      searchInput: '',
      nameInput: '',
      numberAccountInput: '', //
      phoneInput: '', // 手机号搜索
      groupIdInput: '', // 批次搜索
      type: 1, // 1 待分配 2 已分配 3 不通过
      list: [], // 人员列表
      isRepulse: 0,
      detailRow: {
        idCardImgFront: '',
        proveImg: '',
      }, // 详情的信息,
      distributeRow: '', // 分配的信息
      repulseRow: '', // 打回的信息
      currentPage: 1,
      currentSize: 25,
      totalCount: 0,
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
  },
  created() {
    this.requestList({});
    seeAjax('getInsuranceList', { status: 1 }, res => {
      const insuranceIdItem = res.data.list;

      this.$store.commit({
        type: 'updateInsuranceIdItem',
        state: insuranceIdItem,
      });
    });
  },
  methods: {
    requestList({
      status = 1,
      name = '',
      numberAccount = '',
      phone = '',
      groupId = '',
      pageNum = 0,
      pageSize = 25,
    }) {
      let type = status;
      if (status === 2) type = 0; // 生效中
      if (status === 3) type = 2; // 失效

      seeAjax(
        'getList',
        {
          status: type,
          name,
          numberAccount,
          phone,
          groupId: parseInt(groupId, 10) | 0,
          pageNum,
          pageSize,
        },
        res => {
          if (res.success) {
            this.totalCount = res.total;
            this.list = res.data;
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
              type: 'error',
            });
          }
        }
      );
    },
    onclickSearch() {
      if (this.nameId === this.selectItem[0]) {
        this.nameInput = this.searchInput;
        this.numberAccountInput = '';
        this.phoneInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectItem[1]) {
        this.numberAccountInput = this.searchInput;
        this.nameInput = '';
        this.phoneInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectItem[2]) {
        this.phoneInput = this.searchInput;
        this.nameInput = '';
        this.numberAccountInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectItem[3]) {
        this.groupIdInput = this.searchInput;
        this.nameInput = '';
        this.numberAccountInput = '';
        this.phoneInput = '';
      }
      this.requestList({
        name: this.nameInput,
        numberAccount: this.numberAccountInput,
        phone: this.phoneInput,
        groupId: this.groupIdInput,
      });
    },
    onClickType(type) {
      if (this.type === type) return;

      this.type = type;
      this.requestList({ status: type });
    },
    setBatch() {
      this.$store.commit({ type: 'updateBatchVisible', state: true });
    },
    distribution() {
      this.$store.commit({ type: 'updateDistributeVisible', state: true });
    },
    handleSelectionChange(selectedData) {
      const selected = [];
      selectedData.forEach(item => {
        selected.push(item.id);
      });

      this.$store.commit({
        type: 'updateSelected',
        state: selected,
      });
    },
    onClickDetail(row) {
      this.detailRow = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    onClickDistribute(row) {
      this.isRepulse = 2;
      this.distributeRow = row;
      this.$store.commit({ type: 'updateRepulseVisible', state: true });
    },
    onClickRepulse(row) {
      this.isRepulse = 1;
      this.repulseRow = row;
      this.$store.commit({ type: 'updateRepulseVisible', state: true });
    },
    handleSizeChange(size) {
      this.currentSize = size;
      this.currentPage = 1;
      this.requestList({ pageSize: size });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.requestList({ pageNum: page - 1 });
    },
  },
};
</script>

<style lang="less" scoped>
main {
  padding: 15px;
}

.head-search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 40px 60px 20px 0;
}
.name-select {
  width: 100px;
}
.name-input {
  width: 180px;
  margin: 0 30px;
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

.info-bar {
  height: 60px;
  padding-left: 30px;
  line-height: 60px;
  background: #f0f2f5;
  .distribution {
    margin: 0 30px 0 20px;
  }
}

.s-a {
  margin-right: 20px;
}
.repulse {
  color: #eb7e9c;
}
</style>
