<template>
  <section id="reset-password-from">
    <el-form
      :model="resetFrom"
      :rules="resetFromRules"
      status-icon
      ref="resetFrom"
      label-width="100px"
      class="demo-resetFrom"
    >
      <el-form-item label="账号号码" prop="mobile">
        <el-input
          v-model.number="resetFrom.mobile"
          :disabled="isHasDefaultMobile"
        ></el-input>
      </el-form-item>
      <el-form-item label="短信验证码" prop="code">
        <el-input v-model="resetFrom.code">
          <el-button
            slot="append"
            :disabled="isDisabledGetCode"
            @click="sendMessageCode"
          >
            {{ isDisabledGetCode ? ` ${currTimeCount} s ` : '发送验证码' }}
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pwd">
        <el-input
          type="password"
          v-model="resetFrom.pwd"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPwd">
        <el-input
          type="password"
          v-model="resetFrom.checkPwd"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit-btn" @click="submitForm" round
          >确认修改</el-button
        >
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import seeAjax from 'see-ajax';
import CountDown from '../../../../pro-com/src/count-down';
export default {
  props: {
    defaultMobile: String,
    isHasDefaultMobile: Boolean,
  },
  data() {
    const checkPwdValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetFrom.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isDisabledGetCode: false,
      currTimeCount: 60,
      resetFrom: {
        mobile: '',
        code: '',
        pwd: '',
        checkPwd: '',
      },
      resetFromRules: {
        mobile: [
          {
            required: true,
            pattern: /^1[34578]\d{9}$/,
            message: '请正确输入手机号码',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            pattern: /^\d{4,6}$/,
            message: '请正确输入短信验证码',
            trigger: 'blur',
          },
        ],
        pwd: [
          {
            required: true,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message: '请输入密码，至少包含大写字母、小写字母、数字且不少于8位',
            trigger: 'blur',
          },
        ],
        checkPwd: [
          {
            required: true,
            validator: checkPwdValidator,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.resetFrom.mobile = this.defaultMobile;
  },
  methods: {
    // 发送短信验证码
    sendMessageCode() {
      const that = this;
      if (!that.resetFromRules.mobile[0].pattern.test(that.resetFrom.mobile)) {
        that.$message({
          message: '请正确输入手机号码',
          type: 'warning',
        });
        return false;
      }
      that.isDisabledGetCode = true;
      new CountDown({
        initCount: 60,
        onChange(count) {
          that.currTimeCount = count;
        },
        onComplete() {
          that.isDisabledGetCode = false;
          that.currTimeCount = 60;
        },
      });
      seeAjax(
        'sendMessageCode',
        {
          mobile: that.resetFrom.mobile,
        },
        res => {
          that.$message({
            message: res.msg || '',
            type: res.result == 0 ? 'success' : 'error',
          });
        }
      );
    },
    // 提交重设密码表单
    submitForm() {
      const that = this;
      that.$refs.resetFrom.validate(valid => {
        if (!valid) {
          that.$message({
            message: '请正确填写相关信息',
            type: 'error',
          });
        } else {
          seeAjax(
            'resetPassword',
            {
              mobile: that.resetFrom.mobile,
              code: that.resetFrom.code,
              pwd: that.resetFrom.pwd,
            },
            res => {
              if (res.result == 0) {
                let d = new Date();
                that.$emit('resetSuccess', {
                  templeName: res.data.templeName,
                  mobile: that.resetFrom.mobile,
                  creatDate: `${d.getFullYear()}年${d.getMonth() +
                    1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`,
                });
              }
              that.$message({
                message: res.msg || '',
                type: res.result == 0 ? 'success' : 'error',
              });
            }
          );
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#reset-password-from {
  .submit-btn {
    width: 50%;
    margin-left: 110px;
  }
}
</style>
