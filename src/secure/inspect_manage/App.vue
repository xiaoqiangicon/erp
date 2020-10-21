<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="add" @click="add">创建巡查点</div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="巡查点名称名称" :align="'center'" />
        <el-table-column prop="addDate" label="添加时间" :align="'center'" />
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <div>
              <span class="btn allow" @click="edit(scope.row)">编辑</span>
              <span class="btn reject" @click="del(scope.row)">删除</span>
              <span class="btn allow" @click="showSignCode(scope.row)"
                >巡查二维码</span
              >
              <span class="btn reject" @click="toSign(scope.row)"
                >巡查记录</span
              >
            </div>
          </template>
        </el-table-column>
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
    <Detail :detail="detail" />
    <div class="mask" v-if="showInvite">
      <div class="mask-content">
        <div class="invite-header">
          <p class="invite-title">巡查签到</p>
          <span class="invite-close" @click="closeInvite">×</span>
        </div>
        <div class="invite-body">
          <p class="invite-body-title">巡查签到二维码</p>
          <p class="invite-body-tips">
            人员可通过微信扫描二维码打开巡查签到。
          </p>
          <div class="qrcode">
            <img :src="code" alt="" />
          </div>
          <div class="download" @click="download">下载二维码</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import Detail from './Detail';
import { MessageBox } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      tableList: [],
      detail: {},
      currentPage: 1,
      total: 0,
      pageSize: 25,
      showInvite: !1,
      code: '',
    };
  },
  components: {
    Detail,
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      seeAjax(
        'getAreaList',
        { pageNo: this.currentPage, pageSize: this.pageSize },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
          }
        }
      );
    },
    add() {
      this.detail = {};
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    edit(row) {
      this.detail = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    del(row) {
      MessageBox.confirm(`确定删除${row.name}寺务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        seeAjax('del', { id: row.id, status: -1 }, res => {
          if (res.success) {
            window.location.reload();
          }
        });
      });
    },
    showSignCode(row) {
      this.showInvite = !0;
      this.code = row.code;
    },
    toSign(row) {
      window.location.href = `/zzhadmin/placeInspectRecord?id=${row.id}`;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchList();
    },
    closeInvite() {
      this.showInvite = !1;
    },
    download() {},
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
}
.header {
  height: 60px;
  padding: 0 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.add {
  width: 120px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: #409eff;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 3000;
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background-color: #fff;
  border-radius: 8px;
}
.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.invite-close {
  font-size: 22px;
  cursor: pointer;
}
.invite-body-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
}
.invite-body-tips {
  color: #999;
  text-align: center;
}
.qrcode {
  width: 162px;
  height: 162px;
  margin: 20px auto;
  img,
  canvas {
    width: 100%;
    height: 100%;
  }
}
.download {
  width: 120px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  color: #2ecc40;
  border-radius: 15px;
  border: 1px solid rgba(46, 204, 64, 0.4);
  text-align: center;
  cursor: pointer;
}
</style>
