<template>
  <div class="container">
    <el-card>
      <p class="title">基础信息</p>
      <div class="line"></div>
      <div class="row">
        <span class="row-left">名称：</span>
        <el-input placeholder="请输入优惠券名称" v-model="name"></el-input>
      </div>
      <div class="row">
        <span class="row-left">介绍：</span>
        <el-input placeholder="请输入优惠券介绍" v-model="title"></el-input>
      </div>
      <div class="row">
        <span class="row-left">价格：</span>
        <el-input placeholder="请输入优惠价格" v-model="price"></el-input>
      </div>
      <div class="row">
        <span class="row-left">有效期：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="row">
        <span class="row-left">说明文本：</span>
        <el-input type="textarea" v-model="memo"></el-input>
      </div>
      <p class="title">优惠规则</p>
      <div class="line"></div>
      <div class="row">
        <span class="row-left">指定佛事项目：</span>
        <el-select v-model="commodityId">
          <el-option :value="0">1</el-option>
        </el-select>
      </div>
      <div class="row">
        <span class="row-left">优惠券库存</span>
        <el-input v-model="stock"></el-input>
      </div>
      <el-button type="primary" @click="save">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import './ajax';
import seeAjax from 'see-ajax';

export default {
  name: 'APP',
  data() {
    return {
      name: '',
      title: '',
      type: 1,
      price: '',
      date: '',
      memo: '',
      stock: '',
      commodityId: '',
    };
  },
  methods: {
    save() {
      let { name, title, type, price, stock, memo, commodityId } = this;
      seeAjax('save', { name, title, price, stock, memo, commodityId }, res => {
        if (res.errorCode === 0) {
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.row-left {
  flex-shrink: 0;
  width: 120px;
}
</style>
