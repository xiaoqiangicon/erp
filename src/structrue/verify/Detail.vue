<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div class="s-container">
        <div class="body">
          <div class="cell">
            <div class="cell-title">{{ isModify ? '编辑资料' : '详情' }}</div>
            <div class="cell-body">
              <div class="row mg-b-20">
                <p class="row-title">姓名</p>
                <p class="row-value">{{ detail.name }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">性别</p>
                <p class="row-value">{{ detail.sexStr }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">角色</p>
                <p class="row-value">{{ detail.typeStr }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">手机号码</p>
                <p class="row-value">{{ detail.mobile }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">备注</p>
                <p class="row-value">{{ detail.memo }}</p>
              </div>
              <div class="row">
                <p class="row-title">面部照片</p>
                <img class="avatar" :src="detail.headImg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <div class="foot-btn">
            <div class="save-btn" @click="verify">确认通过</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';

export default {
  name: 'Detail',
  props: ['detail'],
  data() {
    return {
      isModify: !1,
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },
  methods: {
    verify() {
      seeAjax('verifyManager', { id: this.detail.id, status: 0 }, res => {
        if (res.success) {
          window.location.reload();
        }
      });
    },
    onClickMask() {
      this.$store.commit({ type: 'updateDetailVisible', state: false });
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
  transform: translateX(10px);
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
.s-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 460px;
  height: 100%;
  padding-bottom: 80px;
  bottom: 0;
  background-color: #fff;
  color: #333;
  .body {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 80px;
    width: 100%;
    overflow-y: auto;
    .cell-title {
      height: 50px;
      margin-bottom: 10px;
      line-height: 50px;
      font-size: 18px;
      position: relative;
      padding-left: 34px;
      font-weight: bold;
      border-bottom: 1px solid #d8d8d8;
      &:before {
        position: absolute;
        top: 11px;
        left: 18px;
        content: '';
        width: 6px;
        height: 28px;
        background-color: #71ba31;
      }
    }
    .cell-title-tip {
      font-size: 16px;
      color: #71ba31;
      float: right;
      margin-right: 20px;
      font-weight: normal;
    }
    .cell-body {
      padding: 14px 20px;
    }
  }
  .foot {
    position: absolute;
    width: 100%;
    height: 82px;
    bottom: 0;
    right: 0;
    background-color: #fff;
    padding: 16px 0;
    border-top: 2px solid #d8d8d8;
    text-align: center;
    z-index: 999;
    .foot-btn {
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
    }
    .edit-btn {
      width: 180px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      background-color: #71ba31;
      text-align: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    .del-btn {
      width: 160px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      background-color: rgba(255, 153, 51, 0.11);
      text-align: center;
      color: rgba(255, 153, 0, 1);
      border: 1px solid rgba(255, 153, 0, 1);
      font-size: 18px;
      cursor: pointer;
    }
    .save-btn {
      width: 233px;
      height: 48px;
      margin: 0 auto;
      line-height: 48px;
      border-radius: 24px;
      background-color: #71ba31;
      text-align: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
.row {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.row-title {
  flex-shrink: 0;
  width: 70px;
  margin-right: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: right;
}
.input-text {
  width: 217px;
  height: 40px;
  padding: 0 15px;
  background-color: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
}
.row-value {
  font-size: 16px;
  font-weight: bold;
}
.avatar {
  width: 100px;
}
</style>
