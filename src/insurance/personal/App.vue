<template>
  <main>
    <div class="head">
      <div class="search-row">
        <el-select
          v-model="nameId"
          style="width: 100px;"
          clearable
          size="medium"
          filterable
          placeholder="姓名"
        />
        <el-input
          v-model="input"
          class="input-content"
          placeholder="请输入内容"
        />
        <el-button type="primary">
          搜索
        </el-button>
      </div>
      <div class="distribute-row">
        <label for="">分配编号：</label>
        <el-select
          v-model="distributeId"
          style="width: 180px;"
          clearable
          size="medium"
          filterable
          placeholder="全部"
        />
      </div>
    </div>
    <div class="content">
      <div class="info-bar">
        <el-button class="distribution" type="primary" @click="exportForm">
          导出表格
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :data="list"
      >
        <el-table-column width="160" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.valid_type == 1" class="status">
              <span class="invalid">未生效</span>
            </div>
            <div v-else-if="scope.row.valid_type == 2" class="status">
              <span class="valid">生效中</span>
            </div>
            <div v-else-if="scope.row.valid_type == 3" class="status">
              <span class="expired">已过期</span>
            </div>
            <div
              v-else-if="scope.row.valid_type == 4"
              class="status expire-item"
            >
              <el-tooltip
                effect="dark"
                content="失效是指未通过审核或不续保的用户"
                placement="top"
              >
                <i class="el-icon-info" style="font-size: 18px" />
              </el-tooltip>
              <span class="expire">失效用户</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.customerName }}</div>
            <div>UID：{{ scope.row.uId }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="法号" show-overflow-tooltip />
        <el-table-column prop="temple" label="所在寺院" show-overflow-tooltip />
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
              v-if="scope.row.valid_type == 1"
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDelete(scope.row)"
              >删除</a
            >
            <a
              v-if="scope.row.valid_type == 3"
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDelete(scope.row)"
              >续保</a
            >
            <a
              v-if="(scope.row.valid_type == 2) | (scope.row.valid_type == 4)"
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDelete(scope.row)"
              >撤回</a
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
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import Detail from './components/Detail';

export default {
  name: 'App',
  components: {
    Detail,
  },
  data() {
    return {
      nameId: '', // 搜索请求参数
      distributeId: '', // 分配编号
      list: [],
      type: 1,
      input: '',
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
      const { currentPage: page, currentSize: pageSize } = this;

      seeAjax(
        'getList',
        {
          page,
          pageSize,
        },
        res => {
          if (res.success) {
            this.totalCount = res.totalCount;
            this.list = res.data;
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
            });
          }
        }
      );
    },
    exportForm() {},
    onClickDetail() {
      this.$store.commit({ type: 'updateDetailVisible', state: true });
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
  padding-left: 16px;
}
.search-row {
  display: flex;
  align-items: center;
}
.input-content {
  width: 180px;
  margin: 0 20px;
}
.distribute-row {
  margin: 20px 0 0 0;
}

.status span {
  display: inline-block;
  padding: 2px 4px;
  line-height: 16px;
  border-radius: 4px;
}
.invalid {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}
.valid {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}
.expire-item {
  display: flex;
  align-items: center;
}
.expired {
  background: #fff2e8;
  color: #fa541c;
  border: 1px solid #ffbb96;
}
.expire {
  background: #ebebea;
  color: #4b4b4b;
  border: 1px solid #b0b0b0;
  margin-left: 4px;
}

.info-bar {
  float: right;
  height: 60px;
  padding-right: 60px;
  line-height: 60px;
  background: #f0f2f5;
}

.s-a {
  margin-right: 20px;
}
</style>
