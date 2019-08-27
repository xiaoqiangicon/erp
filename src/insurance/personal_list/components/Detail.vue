<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <div
        v-loading="handleLoading"
        class="s-container"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <div class="body">
          <div class="cell">
            <div class="cell-title">
              保单信息
            </div>
            <div class="cell-body">
              <div class="ps-row">
                <div class="ps-title">
                  分配编号：
                </div>
                <div class="ps-content">
                  20190827
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  保单单号：
                </div>
                <div class="ps-content">
                  20190827
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  生效时间：
                </div>
                <div class="ps-content">
                  20190827
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  承保标示：
                </div>
                <div class="ps-content">
                  123456
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  承保方案：
                </div>
                <div class="ps-content">
                  123
                </div>
              </div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">
              备注
            </div>
            <div class="cell-body">
              <p class="remarks">
                附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我
              </p>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">
              基本资料
            </div>
            <div class="cell-body">
              <div class="ps-row">
                <div class="ps-title">
                  姓名：
                </div>
                <div class="ps-content">
                  李玉刚
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  法号：
                </div>
                <div class="ps-content">
                  玉刚
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  身份证号码：
                </div>
                <div class="ps-content">
                  362227199412091204
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  性别：
                </div>
                <div class="ps-content">
                  男
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  身高：
                </div>
                <div class="ps-content">
                  123
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  体重：
                </div>
                <div class="ps-content">
                  123
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  联系电话：
                </div>
                <div class="ps-content">
                  0755213123124
                </div>
              </div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">
              寺院资料
            </div>
            <div class="cell-body">
              <div class="ps-row">
                <div class="ps-title">
                  常驻寺院：
                </div>
                <div class="ps-content">
                  本焕学院
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  寺院所在：
                </div>
                <div class="ps-content">
                  广东省深圳市南山区
                </div>
              </div>
              <div class="ps-row">
                <div class="ps-title">
                  详细地址：
                </div>
                <div class="ps-content">
                  学院路78号C栋708
                </div>
              </div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">
              身份证明
            </div>
            <div class="cell-body img-cell-body">
              <div class="img-cell">
                <img
                  v-gallery
                  class="img-gallery"
                  src="https://pic.zizaihome.com/826f865e-d99d-11e7-8d6d-00163e0c1e1c.png"
                  alt=""
                />
                <p class="">
                  身份证证件
                </p>
              </div>
              <div class="img-cell">
                <img
                  v-gallery
                  class="img-gallery"
                  src="https://pic.zizaihome.com/826f865e-d99d-11e7-8d6d-00163e0c1e1c.png"
                  alt=""
                />
                <p class="">
                  法师证明照片
                </p>
              </div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">
              病史
            </div>
            <div class="cell-body">
              <p class="disease">
                附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Detail',
  components: {},
  data() {
    return {
      handleLoading: false, // 订单处理接口等待位
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateDetailVisible', state: false });
    },
  },
};
</script>

<style lang="less">
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
    bottom: 20px;
    width: 100%;
    overflow-y: scroll;
    .cell-title {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      position: relative;
      padding-left: 34px;
      font-weight: bold;
      border-bottom: 1px solid #d8d8d8;
      &::before {
        position: absolute;
        top: 11px;
        left: 18px;
        content: '';
        width: 6px;
        height: 28px;
        background-color: #71ba31;
      }
    }

    .ps-row {
      /* display: flex; */

      /* flex-direction: row; */
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
      margin-top: 10px;
      padding-left: 16px;
    }
    .ps-title {
      /* flex: 1; */
      display: inline-block;
    }
    .ps-content {
      /* flex: 3; */
      display: inline-block;
    }

    .img-cell-body {
      display: flex;
    }
    .img-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      padding-left: 16px;
    }
    .img-gallery {
      max-width: 200px;
      margin-bottom: 10px;
    }

    .disease {
      margin-top: 10px;
      padding: 0 16px;
      font-size: 18px;
    }
  }
}
</style>
