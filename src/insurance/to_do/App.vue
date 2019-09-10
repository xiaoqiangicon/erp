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
          placeholder="姓名"
        />
        <el-input class="name-input" size="medium" />
        <el-button class="search-btn" type="primary" round>
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
          <el-tooltip
            effect="dark"
            content="失效是指未通过审核或不续保的用户，这类用户将记录在“待办事项 - 不通过”的列表中。"
            placement="top"
          >
            <i class="el-icon-info" style="font-size: 18px" />
          </el-tooltip>
          失效用户
        </div>
      </div>
      <div class="info-bar">
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
        <el-table-column type="selection" labei="全选" />
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.customerName }}</div>
            <div>UID：{{ scope.row.uId }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          prop="nickName"
          label="法号"
          show-overflow-tooltip
        />
        <el-table-column prop="temple" label="所在寺院" />
        <el-table-column
          width="140"
          prop="customerTel"
          label="联系电话"
          show-overflow-tooltip
        />
        <el-table-column
          width="180"
          prop="idCard"
          label="身份证号"
          show-overflow-tooltip
        />
        <el-table-column width="60" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.isMale">
              男
            </div>
            <div v-else>
              女
            </div>
          </template>
        </el-table-column>
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
          prop="reason"
          label="不通过原因"
          show-overflow-tooltip
        />
        <el-table-column
          v-else
          prop="orderTime"
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
      />
    </div>
    <Detail />
    <Destribute />
    <Repulse />
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
      type: 1, // 1 待分配 2 已分配 3 不通过
      list: [],
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
    this.requestList();
  },
  methods: {
    requestList() {
      const { currentPage: page, currentSize: pageSize, type } = this;

      seeAjax(
        'getList',
        {
          page,
          pageSize,
          type,
        },
        res => {
          if (res.success) {
            this.totalCount = res.totalCount;
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
    onClickType(type) {
      if (this.type === type) return;

      this.type = type;
    },
    setBatch() {
      console.log(111);
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
    onClickDetail() {
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    onClickDistribute() {},
    onClickRepulse() {
      this.$store.commit({ type: 'updateRepulseVisible', state: true });
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
