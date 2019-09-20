<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card distribute">
        <div slot="header" class="clearfix">
          <span>续保设置</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="text item">
          <div class="">
            <p>若通过线下的方式联系后：</p>
          </div>
          <div class="">
            <el-radio v-model="radio" label="1">
              同意续保
            </el-radio>
            <el-radio v-model="radio" label="0">
              不同意
            </el-radio>
            <div v-if="radio == 0" class="reason">
              <span>原因</span>
              <el-input
                v-model="reason"
                class="input-content"
                placeholder="请输入内容（非必填）"
              />
            </div>
          </div>
          <div>
            <el-button type="primary" class="confirm" @click="onClickMask">
              取消
            </el-button>
            <el-button type="primary" class="confirm" @click="confirmRenew">
              确认
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';
import { Message } from 'element-ui';

export default {
  name: 'Renew',
  props: {
    renewId: { required: true },
  },
  data() {
    return {
      radio: '1',
      reason: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.setRenewDialogVisible;
    },
  },
  watch: {
    radio() {
      if (this.radio == '1') {
        this.disabled = true;
        this.nameId = `2019-09-12`;
      } else {
        this.disabled = false;
        this.nameId = '';
      }
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateSetRenewVisible', state: false });
    },
    confirmRenew() {
      seeAjax(
        'insuranceEditUserInfo',
        { id: this.renewId, isCarryOn: this.radio, content: this.reason },
        res => {
          if (!res.success) return;

          this.$store.commit({ type: 'updateSetRenewVisible', state: false });
          this.reason = '';
          this.radio = '1';
          Message({
            message: '操作成功',
            type: 'success',
          });
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
/* 可以设置不同的进入和离开动画 */

/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}
.s-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}
.clearfix::after {
  clear: both;
}

.box-card {
  width: 340px;
}

.distribute {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.el-select {
  margin-top: 20px;
}
.reason {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .input-content {
    width: 80%;
    margin-left: 10px;
  }
}
.confirm {
  margin-top: 20px;
}
</style>
