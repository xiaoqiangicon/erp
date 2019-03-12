<template>
  <div class="s-mask" v-show="visible">
    <div class="s-container">
      <div class="cell">
        <div class="cell-title">处理反馈</div>
        <div class="cell-body">
          <div class="fb-container">
            <img
              class="fb-img"
              src="https://pic.zizaihome.com/692097f6-db6d-11e8-9f9a-00163e0c001e.png"
              alt=""
            />
            <div class="fb-text1">点击或将图片拖拽到这里上传</div>
            <div class="fb-text2">支持格式：.jpg .png .gif</div>
          </div>
        </div>
      </div>

      <div class="cell">
        <div class="cell-title">物流单号</div>
        <div class="cell-body">
          <div class="logistics-container">
            <div class="select"></div>
            <div class="input"></div>
          </div>
        </div>
      </div>

      <div class="cell">
        <div class="cell-title">处理备注</div>
        <div class="cell-body"></div>
      </div>

      <div class="cell">
        <div class="cell-title">附言信息</div>
        <div class="cell-body"></div>
      </div>

      <div class="cell">
        <div class="cell-title">订单详情</div>
        <div class="cell-body"></div>
      </div>

      <div class="foot">
        <div class="s-btn">设为已完成</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notification } from 'element-ui';
import seeFetch from 'see-fetch';

export default {
  name: 'Detail',
  props: {},
  data() {
    return {
      logisticsList: [
        { label: '圆通快递', value: 1 },
        { label: '申通快递', value: 2 },
      ],
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },

  methods: {
    getLogisticsList() {},
  },
};
</script>

<style lang="less" scoped>
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
  bottom: 0;
  background-color: #fff;
  color: #333;
}

.cell-title {
  height: 50px;
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
.cell-body {
  padding: 14px 30px;
}

.foot {
  margin-top: 30px;
  text-align: center;
}

.fb-container {
  width: 411px;
  height: 155px;
  margin: 0 auto;
  border: 2px dashed #7bafef;
  border-radius: 54px;
  cursor: pointer;
  text-align: center;
  .fb-img {
    display: block;
    width: 59px;
    height: 47px;
    margin: 23px auto 20px;
  }
  .fb-text1 {
    font-size: 18px;
  }
  .fb-text2 {
    font-size: 16px;
    color: #9b9b9b;
  }
}

.logistics-container {
  height: 45px;
  line-height: 45px;
  border: 1px solid #969696;
  .select {
  }
  .input {
  }
}

.s-btn {
  display: inline-block;
  width: 234px;
  height: 48px;
  line-height: 48px;
  border-radius: 24px;
  background-color: #71ba31;
  text-align: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
</style>
