<template>
  <div class="contain">
    <div>
      <div class="header">
        <p>
          可开总额<span class="price">{{ price }}</span
          >元
        </p>
        <p class="header-tips">
          可开票金额根据系统计算自动生成，如有问题请联系客服。
        </p>
      </div>
      <hr />
      <div class="content">
        <label>
          <span>抬头类型：</span>
          <p>企业</p>
        </label>
        <label>
          <span>发票类型：</span>
          <p>增值税普通发票（电子）</p>
        </label>
        <label>
          <span>发票抬头（必填）：</span>
          <input v-model="invoiceCompany" class="input-form" type="text" />
        </label>
        <label>
          <span>纳税识别号（必填）：</span>
          <input v-model="ratepayingNo" class="input-form" type="text" />
        </label>
        <label>
          <span>基本开户银行：</span>
          <input v-model="bankName" class="input-form" type="text" />
        </label>
        <label>
          <span>基本开户账号：</span>
          <input v-model="bankNo" class="input-form" type="number" />
        </label>
        <label>
          <span>注册场所地址：</span>
          <textarea v-model="registerAddress" class="input-form"></textarea>
        </label>
        <label>
          <span>注册固定电话：</span>
          <input v-model="registerMobile" class="input-form" type="text" />
        </label>
      </div>
      <hr />
      <div class="comment">
        <label>
          <span>备注：</span>
          <textarea
            v-model="note"
            placeholder="如有其他问题与要求，请备注"
          ></textarea>
        </label>
        <div class="tips">
          为保障你的利益，请务必检查抬头与纳税识别号等信息无误后再提交。
        </div>
      </div>
      <div class="apply-btn" @click="apply">确认申请</div>
    </div>
    <div class="mask" v-if="showMask">
      <div class="mask-content">
        <img
          class="mask-icon"
          src="https://pic.zizaihome.com/1d168242-c583-11ea-bf45-00163e060b31.png"
          alt=""
        />
        <p class="mask-info">提交成功</p>
        <p class="mask-tips">自在家工作人员将在 7 个工作日内为您处理</p>
        <div class="mask-btn" @click="back">我知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
import { urlParams } from '../../../../pro-com/src/utils';
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';

export default {
  name: 'APP',
  data() {
    return {
      price: 0,
      bankName: '',
      bankNo: '',
      invoiceCompany: '',
      registerAddress: '',
      registerMobile: '',
      ratepayingNo: '',
      note: '',
      showMask: !1,
    };
  },
  created() {
    let params = JSON.parse(window.localStorage.getItem('params')) || {};
    console.log(params);
    this.bankName = params.bankName || '';
    this.bankNo = params.bankNo || '';
    this.invoiceCompany = params.invoiceCompany || '';
    this.registerAddress = params.registerAddress || '';
    this.registerMobile = params.registerMobile || '';
    this.ratepayingNo = params.ratepayingNo || '';
    this.note = params.note || '';
    this.price = parseFloat(urlParams.price, 10);
  },
  methods: {
    apply() {
      if (!this.invoiceCompany) {
        Notification({
          title: '提示',
          message: '请填写发票抬头',
        });
        return;
      }
      if (!this.ratepayingNo) {
        Notification({
          title: '提示',
          message: '请填写纳税识别号',
        });
        return;
      }
      let params = {
        bankName: this.bankName,
        bankNo: this.bankNo,
        invoiceCompany: this.invoiceCompany,
        registerAddress: this.registerAddress,
        registerMobile: this.registerMobile,
        ratepayingNo: this.ratepayingNo,
        note: this.note,
      };
      window.localStorage.setItem('params', JSON.stringify(params));
      seeAjax('apply', params, res => {
        if (res.success) {
          this.showMask = !0;
        }
      });
    },
    back() {
      this.showMask = !1;
      window.location.replace('/zzhadmin/receiptIndex');
    },
  },
};
</script>

<style lang="less" scoped>
label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  span {
    max-width: 180px;
  }
  input {
    flex: auto;
  }
  textarea {
    flex: auto;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
textarea {
  padding-left: 10px;
  padding-top: 9px;
  padding-bottom: 10px;
  resize: none;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  color: #999;
  font-weight: normal;
}
input {
  height: 40px;
  padding-left: 10px;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  color: #999;
  font-weight: normal;
}
hr {
  border-top: 1px solid #979797;
}

.contain {
  position: relative;
  padding-right: 20px;
  padding-top: 20px;
  padding-left: 20px;
  p {
    margin: 0;
  }
}
.header {
  padding: 20px 0 20px 10px;
  border-radius: 5px;
  background-color: #fff;
  font-size: 16px;
  font-weight: bold;
}
.price {
  margin-left: 12px;
}
.header-tips {
  padding-left: 74px;
  color: #999999;
  font-size: 14px;
  font-weight: normal;
}

.content,
.comment {
  width: 610px;
  // margin: 0 auto;
}

.tips {
  padding: 0 130px 0 42px;
  border-radius: 4px;
  background-color: rgba(74, 144, 226, 0.1);
  background-image: url('https://pic.zizaihome.com/f199e2a4-c4eb-11ea-9479-00163e060b31.png');
  background-repeat: no-repeat;
  background-size: 23px 23px;
  background-position: 10px center;
  line-height: 40px;
  color: #4a90e2;
  border: 1px solid #4a90e2;
}
.apply-btn {
  width: 116px;
  height: 36px;
  margin: 40px 0 0 260px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  line-height: 36px;
  color: #fff;
  background-color: #71ba31;
}

.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 432px;
  height: 298px;
  background-image: url('https://pic.zizaihome.com/03450302-c583-11ea-b21c-00163e060b31.png');
  background-size: 100%;
}
.mask-icon {
  position: absolute;
  top: 34px;
  left: 190px;
  width: 52px;
  height: 52px;
}
.mask-info {
  padding-top: 96px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
}
.mask-tips {
  padding-top: 10px;
  font-size: 16px;
  color: #979797;
  font-weight: 400;
  text-align: center;
}
.mask-btn {
  position: absolute;
  bottom: 28px;
  left: 50%;
  margin-left: -55px;
  width: 110px;
  height: 36px;
  background-color: #71ba31;
  border-radius: 8px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  cursor: pointer;
}
</style>
