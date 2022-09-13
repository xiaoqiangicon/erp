<template>
  <div class="contain">
    <el-card>
      <div class="content">
        <p class="title">基础信息</p>
        <div class="line"></div>
        <div class="row">
          <span class="row-left">名称：</span>
          <el-input placeholder="请输入优惠券名称" v-model="name"></el-input>
        </div>
        <div class="row">
          <span class="row-left">介绍：</span>
          <el-input
            placeholder="请输入优惠券介绍（最多50个字）"
            v-model="title"
          ></el-input>
        </div>
        <div class="row">
          <el-select
            v-model="type"
            style="width: 102px;margin-right: 18px;flex-shrink: 0;"
          >
            <el-option :value="1" label="减免："></el-option>
            <el-option :value="2" label="满减："></el-option>
            <el-option :value="3" label="买赠："></el-option>
          </el-select>
          <el-input
            v-if="type === 1"
            placeholder="请输入优惠价格(单位元)"
            v-model="price"
            type="number"
          ></el-input>
          <div class="coupon-gift" v-if="type === 2">
            <span>满</span>
            <el-input type="number" v-model="full"></el-input>
            <span>减</span>
            <el-input type="number" v-model="reduce"></el-input>
          </div>
          <div class="coupon-gift" v-if="type === 3">
            <span>买</span>
            <el-input type="number" v-model="buy"></el-input>
            <span>赠</span>
            <el-input type="number" v-model="give"></el-input>
          </div>
        </div>
        <div class="row">
          <span class="row-left">有效期：</span>
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="row">
          <span class="row-left">说明文本：</span>
          <el-input
            type="textarea"
            :rows="3"
            resize="none"
            v-model="memo"
          ></el-input>
        </div>
        <p class="title">优惠规则</p>
        <div class="line"></div>
        <div class="row">
          <span class="row-left">指定佛事项目：</span>
          <el-select v-model="commodityId" filterable>
            <el-option
              :value="item.commodityId"
              v-for="item in commodityList"
              :key="item.commodityId"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="row">
          <span class="row-left">优惠券库存：</span>
          <el-input
            placeholder="请输入优惠券库存"
            v-model="stock"
            type="number"
          ></el-input>
        </div>
        <el-button class="save" type="primary" @click="save" v-loading="loading"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import './ajax';
import seeAjax from 'see-ajax';
import { Notification } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      id: 0,
      name: '',
      title: '',
      type: 1,
      price: '',
      date: '',
      memo: '',
      stock: '',
      commodityList: [],
      commodityId: '',
      full: '',
      reduce: '',
      buy: '',
      give: '',
      loading: false,
    };
  },
  created() {
    let coupon = window.localStorage.getItem('couponItem');
    coupon = coupon ? JSON.parse(coupon) : '';
    console.info(coupon, 'coupon');
    if (coupon) {
      this.name = coupon.name || '';
      this.title = coupon.title || '';
      this.type = parseInt(coupon.type, 10) || 1;
      this.memo = coupon.memo;
      this.stock = parseInt(coupon.stock);
      // this.commodityId = coupon.commodityId ? parseInt(coupon.commodityId, 10) : '';
      this.id = parseInt(coupon.id, 10);
      this.date = [coupon.startTime || '', coupon.endTime || ''];

      if (this.type === 1) {
        this.price = parseFloat(coupon.price, 10) / 100;
      } else if (this.type === 2) {
        this.full = parseInt(coupon.logic.full, 10) / 100;
        this.reduce = parseInt(coupon.logic.reduce, 10) / 100;
      } else if (this.type === 3) {
        this.buy = parseInt(coupon.logic.buy, 10);
        this.give = parseInt(coupon.logic.give, 10);
      }
    }

    seeAjax('getBuddhistList', {}, res => {
      if (res.result === 1) {
        this.commodityList = res.data;
        this.commodityId =
          coupon && coupon.commodityId ? parseInt(coupon.commodityId, 10) : '';
      }
    });
  },
  methods: {
    save() {
      let {
        id,
        name,
        title,
        type,
        price,
        stock,
        memo,
        commodityId,
        full,
        reduce,
        buy,
        give,
        date,
      } = this;

      if (!name || !title || !stock || !memo || !date[0] || !date[1]) {
        Notification({
          type: 'warning',
          title: '提示',
          message: '请填写必要的信息',
        });
        return;
      }
      let formatDate = date.map(item => this.formate(`${item}`));
      let params = {};
      params.id = id;
      params.name = name;
      params.title = title;
      params.type = type;
      params.stock = parseInt(stock, 10);
      params.memo = memo;
      params.commodityId = commodityId;
      params.startTime = formatDate[0];
      params.endTime = formatDate[1];
      if (type === 1) {
        if (price <= 0) {
          Notification({
            type: 'warning',
            title: '提示',
            message: '金额必须大于0',
          });
          return;
        }
        params.price = parseFloat(price, 10) * 100;
      } else if (type === 2) {
        if (full <= 0 || reduce <= 0) {
          Notification({
            type: 'warning',
            title: '提示',
            message: '金额必须大于0',
          });
          return;
        }
        params.logic = JSON.stringify({
          full: full * 100,
          reduce: reduce * 100,
        });
      } else if (type === 3) {
        if (buy <= 0 || give <= 0) {
          Notification({
            type: 'warning',
            title: '提示',
            message: '买赠数量必须大于0',
          });
          return;
        }
        params.logic = JSON.stringify({ buy, give });
      }

      if (this.loading) return;
      this.loading = true;
      seeAjax('save', params, res => {
        if (res.result === 0) {
          window.location.replace('/zzhadmin/ceremony_discount_coupon/');
        } else {
          Notification({
            type: 'warning',
            title: '提示',
            message: res.msg,
          });
          return;
        }
        this.loading = false;
      });
    },
    formate(timeStr) {
      const date = new Date(timeStr);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const h = date.getHours();
      const min = date.getMinutes();

      return `${y}-${m >= 10 ? m : `0${m}`}-${d >= 10 ? d : `0${d}`} ${
        h >= 10 ? h : `0${h}`
      }:${min >= 10 ? min : `0${min}`}`;
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  width: 80%;
  padding: 20px;
}
.content {
  padding: 0 40px;
}
.title {
  padding-bottom: 10px;
  margin: 20px 0;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  font-weight: bold;
}
.row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 20px;
}
.row-left {
  flex-shrink: 0;
  width: 120px;
}

.coupon-gift {
  display: flex;
  align-items: center;
  span {
    margin: 0 10px;
  }
}

.save {
  display: block;
  margin: 0 auto;
}
</style>
