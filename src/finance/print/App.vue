<template>
  <div class="contain">
    <div class="list">
      <div class="item" v-for="(item, key) in list" :key="key">
        <div class="item-header">{{ templeName }} 固定资产标识卡</div>
        <div class="item-content">
          <div class="qrcode" ref="qrcode"></div>
          <div class="item-content-right">
            <p class="sncode">资产编号：{{ item.sn }}</p>
            <p class="item-content-info">
              资产入库、查看详细信息与资产盘点请使用微信扫描左侧二维码查看。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import QRCode from '../../../../pro-com/src/libs-es5/qrcode';
import { urlParams } from '../../../../pro-com/src/utils';

let qrCodeImg;

export default {
  name: 'APP',
  data() {
    return {
      templeName: '',
      list: [],
      qrcode: '', // 二维码
    };
  },
  created() {
    this.templeName = decodeURI(urlParams.templeName);
    this.fetchList();
  },
  methods: {
    fetchList() {
      seeAjax('getCodeList', {}, res => {
        if (res.success) {
          this.list = res.data;
          // 初始化qrcode
          this.$nextTick(() => {
            let aQrcode = this.$refs.qrcode;
            for (let i = 0; i < aQrcode.length; i++) {
              aQrcode[i].innerHTML = '';
              // qrCodeImg = new QRCode(aQrcode[i], res.data[i].inventoryCode,);
              new QRCode(aQrcode[i], {
                text: res.data[i].inventoryCode,
                width: 100,
                height: 100,
              });
              console.log(qrCodeImg);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.item {
  width: 330px;
  margin-bottom: 20px;
  border: 1px solid black;
  border-radius: 6px;
}
.item-header {
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #eee;
}
.item-content {
  display: flex;
  padding: 20px 10px;
}
.qrcode {
  margin-right: 20px;
  flex-shrink: 0;
  img {
    width: 100% !important;
    height: 100% !important;
  }
}
img {
  width: 100% !important;
  height: 100% !important;
}
</style>
