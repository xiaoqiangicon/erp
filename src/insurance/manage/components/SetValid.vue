<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card distribute">
        <div slot="header" class="clearfix">
          <span>设为生效</span>
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
            <p class="info">
              1. 下载当前保单表格并设置；
            </p>
            <el-button type="primary" class="download">
              下载
            </el-button>
            <p class="info">
              2. 填写已下载表格中的：承保标示和承保方案；
            </p>
            <p class="info">
              3. 上传填写好的表格，保存后会批量同步信息到系统中。
            </p>
            <el-button type="primary" class="upload">
              上传表格
            </el-button>
          </div>
          <div class="operate">
            <el-button type="primary" class="cancel" @click="onClickMask">
              取消
            </el-button>
            <el-button type="primary" class="set-valid">
              设为生效
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Detail',
  components: {},
  data() {
    return {};
  },
  computed: {
    visible() {
      return this.$store.state.setValidDialogVisible;
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateSetValidVisible', state: false });
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

.operate {
  margin-top: 10px;
  text-align: center;
}
</style>
