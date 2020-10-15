<template>
  <div class="contain">
    <div class="header">
      <div class="title">人员审核</div>
      <div class="status-box">
        <div
          class="status status-1"
          @click="changeTab(1)"
          :class="{ 'status-active': status === 1 }"
        >
          待审核
        </div>
        <div
          class="status status-2"
          @click="changeTab(2)"
          :class="{ 'status-active': status === 2 }"
        >
          拒绝
        </div>
      </div>
    </div>
    <div class="body">
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="申请人姓名" :align="'center'" />
        <el-table-column prop="sexStr" label="性别" :align="'center'" />
        <el-table-column prop="mobile" label="手机号码" :align="'center'" />
        <el-table-column prop="typeStr" label="申请角色" :align="'center'" />
        <el-table-column label="面部" :align="'center'">
          <template slot-scope="scope">
            <div>
              <img class="avatar" :src="scope.row.headImg" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="申请时间" :align="'center'" />
        <el-table-column prop="memo" label="申请备注" :align="'center'" />
        <el-table-column
          prop="refuceReason"
          label="拒绝原因"
          :align="'center'"
          v-if="status === 2"
        />
        <el-table-column label="操作" :align="'center'" v-if="status === 1">
          <template slot-scope="scope">
            <div>
              <span class="btn allow" @click="allow(scope.row)">通过</span>
              <span class="btn reject" @click="reject(scope.row)">拒绝</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Detail :detail="detail" />
    <div class="mask" v-if="showReject">
      <div class="mask-content">
        <div class="reject-header">
          <p class="reject-title">拒绝理由</p>
          <span class="reject-close" @click="showReject = !1">×</span>
        </div>
        <div class="reject-body">
          <p class="reject-tips">你确定要拒绝{{ detail.name }}的申请吗？</p>
          <el-input
            :resize="'none'"
            width="80%"
            :rows="5"
            type="textarea"
            v-model="reason"
          ></el-input>
        </div>
        <div class="reject-btn" @click="confirmReject">确认拒绝</div>
      </div>
    </div>
  </div>
</template>

<script>
import Detail from './Detail';
import seeAjax from 'see-ajax';
import { MessageBox } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      status: 1,
      tableList: [],
      detail: {},
      reason: '',
      showReject: !1,
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
      seeAjax('userDetailList', { status: this.status }, detailRes => {
        this.tableList = detailRes.data;
      });
    },
    changeTab(status) {
      this.status = status;
      this.fetchList();
    },
    allow(row) {
      this.detail = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    reject(row) {
      this.detail = row;
      this.showReject = !0;
    },
    confirmReject() {
      if (!this.reason) {
        MessageBox.alert(`请填写拒绝原因？`);
        return;
      }
      seeAjax(
        'verifyManager',
        { id: this.detail.id, status: 2, content: this.reason },
        res => {
          if (res.success) {
            window.location.reload();
          }
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  padding: 20px 0;
  font-size: 20px;
  font-weight: bold;
}
.status-box {
  display: flex;
}
.status {
  width: 100px;
  height: 40px;
  margin-bottom: 2px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  background-color: #fff;
}
.status-active {
  background-color: #2ecc40;
  color: #fff;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 330px;
  background-color: #fff;
  border-radius: 8px;
}
.reject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.reject-close {
  font-size: 22px;
  cursor: pointer;
}
.reject-body-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
}
.reject-tips {
  margin: 20px 0 20px;
  text-align: center;
  color: #333;
  font-size: 16px;
}
.el-textarea {
  margin: 0 auto;
  textarea {
    display: block;
    margin: 0 auto;
  }
}
.reject-btn {
  width: 100px;
  height: 36px;
  margin: 30px auto 0;
  background-color: #2ecc40;
  border-radius: 6px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  cursor: pointer;
}
</style>
