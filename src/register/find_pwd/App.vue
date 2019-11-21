<template>
  <div>
    <header class="top-header">
      <div class="t-left">
        <img
          src="https://pic.zizaihome.com/a0af77ef-004a-462e-9551-41b6699af9ce.png"
          alt="自在家"
        />
      </div>
      <div class="t-right">
        <el-button @click="jumpLoginUrl">登录</el-button>
      </div>
    </header>

    <main class="main-box">
      <el-card class="info-card">
        <el-alert
          v-if="isHasDefaultMobile"
          title="账户密码安全更新"
          type="success"
          :closable="false"
          description="自在家系统已更新为金融级安全性，需要重新设置账户密码。"
        />
        <el-alert
          v-else
          title="通过手机验证更改密码"
          type="success"
          :closable="false"
        />
      </el-card>

      <el-card class="container-card">
        <resetPasswordFrom
          v-if="!isResetSuccess"
          :defaultMobile="defaultMobile"
          :isHasDefaultMobile="isHasDefaultMobile"
          @resetSuccess="resetSuccess"
        />
        <resetPasswordSuccess :accountInfo="accountInfo" v-else />
      </el-card>
    </main>
  </div>
</template>

<script>
import resetPasswordFrom from './components/reset_password_from.vue';
import resetPasswordSuccess from './components/reset_password_success.vue';
export default {
  data() {
    return {
      isHasDefaultMobile: false,
      isResetSuccess: false,
      defaultMobile: '',
      accountInfo: {},
    };
  },
  components: { resetPasswordFrom, resetPasswordSuccess },
  created() {
    // 初始化默认账号手机号码
    if (window.renderData.mobile) {
      this.isHasDefaultMobile = true;
      this.defaultMobile = String(window.renderData.mobile);
    }
  },
  methods: {
    resetSuccess(accountInfo) {
      this.isResetSuccess = true;
      this.accountInfo = accountInfo;
    },
    jumpLoginUrl() {
      window.location.replace('/accounts/login/');
    },
  },
};
</script>

<style lang="less">
body {
  background-color: #f4f7f7 !important;
}

.top-header {
  padding: 33px 30px 0;
  height: 100px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .t-left {
    float: left;
  }
  .t-right {
    float: right;
  }
}

.main-box {
  width: 1000px;
  margin: 50px auto;
  .info-card {
    margin-bottom: 20px;
  }
  .container-card {
    padding: 100px 140px 80px 100px;
  }
}
</style>
