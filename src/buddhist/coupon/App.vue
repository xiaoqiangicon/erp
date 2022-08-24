<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="header-left">
          <span>状态：</span>
          <el-select v-model="status" @change="getList">
            <el-option :value="0" label="有效"></el-option>
            <el-option :value="1" label="过期"></el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="edit">新建福券</el-button>
      </div>
      <el-table v-loading="loading" :data="list">
        <el-table-column prop="name" label="福券名称" :align="'center'" />
        <el-table-column label="福券面额" :align="'center'">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.type === 1
                  ? `减${scope.row.price / 100}元`
                  : scope.row.type === 2
                  ? `满${scope.row.logic.full / 100}减${scope.row.logic.reduce /
                      100}`
                  : scope.row.type === 3
                  ? `买${scope.row.logic.buy}赠${scope.row.logic.give}`
                  : ''
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" :align="'center'">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }}</div>
            <div>-</div>
            <div>{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="库存" :align="'center'">
          <template slot-scope="scope">
            <span class="green">{{
              scope.row.stock >= 0 ? scope.row.stock : '无限制'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <span class="btn edit" @click="edit(scope.row)">编辑</span>
            <span class="btn red" @click="del(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        :current-page="pageNum"
        background
        layout="prev, pager, next"
        style="margin-top: 40px"
        :page-size="pageSize"
        @current-change="pageChange"
      />
    </el-card>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { Notification } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      status: 0,
      loading: true,
      list: [],
      currentPage: 1,
      pageSize: 25,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      let { pageSize, currentPage, status } = this;
      seeAjax('list', { pageSize, pageNum: currentPage - 1, status }, res => {
        this.loading = false;
        if (res.result === 0) {
          this.list = res.data;
          this.total = res.total;
        } else {
          this.showMsg(res.msg, 'error');
        }
      });
    },
    del(row) {
      this.$confirm('删除后将无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        seeAjax('del', { id: row.id }, res => {
          if (res.result === 0) {
            this.showMsg('删除成功');
            this.getList();
          } else {
            this.showMsg(res.msg, 'error');
          }
        });
      });
    },
    edit(row) {
      if (row && row.id) {
        window.localStorage.setItem('couponItem', JSON.stringify(row));
      } else {
        window.localStorage.setItem('couponItem', '');
      }
      window.location.href = '/zzhadmin/ceremony_discount_coupon_edit/';
    },
    pageChange(page) {
      this.currentPage = page;
      this.getList();
    },
    showMsg(msg, type) {
      Notification({
        title: '提示',
        type: type || 'success',
        message: msg,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 30px;
}

.red {
  color: #f56c6c;
}
.btn {
  margin-left: 10px;
  cursor: pointer;
}
.edit {
  color: #409eff;
}
</style>
