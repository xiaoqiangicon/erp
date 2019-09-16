<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card delete">
        <div slot="header" class="clearfix">
          <span>删除</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="text item">
          <p class="info">
            删除后当前分配表的人员需重新进行分配
          </p>
          <div class="operate">
            <el-button type="primary" class="cancel" @click="onClickMask">
              取消
            </el-button>
            <el-button type="primary" class="confirm" @click="confirmDelete">
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

export default {
  name: 'Delete',
  components: {},
  props: {
    deleteId: { required: true },
  },
  data() {
    return {};
  },
  computed: {
    visible() {
      return this.$store.state.setDeleteDialogVisible;
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateSetDeleteVisible', state: false });
    },
    confirmDelete() {
      seeAjax(
        'insuranceEditUserInfo',
        { id: this.deleteId, status: -1 },
        res => {
          if (res.success) {
            this.$store.commit({
              type: 'updateSetDeleteVisible',
              state: false,
            });
          }
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

.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}
.clearfix::after {
  clear: both;
}

.box-card {
  width: 380px;
}

.delete {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.info {
  height: 100px;
  padding-top: 24px;
  text-align: center;
}

.operate {
  margin-top: 10px;
  text-align: center;
}
</style>
