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
        <el-input style="width: 150px;" size="medium" />
        <el-button type="primary">
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
        <el-table-column width="60" label="人数" prop="num" />
        <el-table-column v-if="type == 3" label="过期" prop="id" />
        <el-table-column width="140" label="截至时间">
          <template slot-scope="scope">
            <div v-if="type == 1">
              <div v-if="scope.row.end_time">
                {{ scope.row.end_time }}
              </div>
              <div v-else class="not-set" @click="onClickSetTime">
                <span>未设置</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-if="type == 2">
              <div class="" @click="onClickSetTime">
                <span>{{ scope.row.end_time }}</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-if="type == 3">
              <div class="" @click="onClickSetTime">
                <span>{{ scope.row.end_time }}</span>
                <span class="expire-sign">过期</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="保险单号" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="type == 1">
              <div v-if="scope.row.insurance_id">
                {{ scope.row.insurance_id }}
              </div>
              <div v-else class="not-set" @click="onClickSetInsuranceId">
                <span>未设置</span>
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
            <div v-else>
              <div>
                {{ scope.row.insurance_id }}
                <i class="el-icon-edit-outline" style="color: #409eff" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="add_time"
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
                @click="onClickDelete(scope.row)"
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
                @click="onClickDelete(scope.row)"
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
      />
    </div>
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';

export default {
  name: 'App',
  components: {},
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
    onClickType(type) {
      if (this.type === type) return;

      this.type = type;
    },
    onClickSetTime() {},
    onClickSetInsuranceId() {},
    onClickSetValid() {},
    onClickManage() {},
    onClickDelete() {},
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
