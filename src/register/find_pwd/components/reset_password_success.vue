<template>
  <section id="reset-password-from">
    <div class="icon-con">
      <div><i class="el-icon-success"></i></div>
      <h2>修改成功</h2>
    </div>
    <div class="account-con">
      <div class="a-item">
        <span class="a-label"
          >名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</span
        >{{ accountInfo.templeName || '' }}
      </div>
      <div class="a-item">
        <span class="a-label">账户号码：</span>{{ accountInfo.mobile || '' }}
      </div>
      <div class="a-item">
        <span class="a-label">修改时间：</span
        >{{ accountInfo.creatDate || '2019年10月20日 20:12' }}
      </div>
    </div>
    <div class="login-btn-con">
      <el-button type="primary" class="login-btn" @click="jumpLoginUrl" round
        >重新登录</el-button
      >
    </div>
  </section>
</template>

<script>
export default {
  props: {
    accountInfo: {
      type: Object,
      default: {},
    },
  },
  methods: {
    jumpLoginUrl() {
      window.location.replace('/accounts/login/');
    },
  },
};
</script>

<style lang="less" scoped>
#reset-password-from {
  .icon-con {
    width: 100px;
    margin: 0 auto;
    text-align: center;
    i.el-icon-success {
      font-size: 80px;
      color: #52c41a;
    }
    h2 {
      margin: 10px 0 50px;
      font-weight: bold;
      font-size: 22px;
    }
  }
  .account-con {
    font-size: 16px;
    line-height: 2;
    width: 300px;
    margin: 0 auto 40px;
  }
  .login-btn-con {
    width: 300px;
    margin: 0 auto;
    .login-btn {
      width: 300px;
    }
  }
}
</style>
