<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card distribute">
        <div slot="header" class="clearfix">
          <span>打回</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="text item">
          <div class="info">
            <p class="name">
              姓名：李玉刚
            </p>
            <p class="nickName">
              法号：玉刚
            </p>
            <p class="temple_name">
              所在寺院：佛山本焕寺
            </p>
          </div>
          <div class="reason">
            <el-input
              v-model="textarea"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入内容"
            />
          </div>
          <el-button type="primary" class="confirm" @click="confirmRepulse">
            确认
          </el-button>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';

export default {
  name: 'Repulse',
  components: {},
  data() {
    return {
      textarea: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.repulseDialogVisible;
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateRepulseVisible', state: false });
    },
    confirmRepulse() {},
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
  width: 480px;
}

.distribute {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.confirm {
  margin-top: 20px;
}
</style>
