<template>
  <div class="root pd-20" v-loading="initRequesting">
    <div class="f-s-18 mg-b-10">面单打印</div>
    <el-card class="ps-relative">
      <el-alert style="width: 60%;" :closable="false" type="success">
        由自在家提供的免费物流面单打印工具。<br />
        你可使用本功能在多家快递公司获取电子面单号等信息，再通过自在家接入的云打印机完成电子面单打印，即可将快件交给快递公司上门揽收。
      </el-alert>
      <div class="enable-switch">
        <el-switch
          v-loading="switchingEnabled"
          v-model="enabled"
          :active-value="1"
          :inactive-value="0"
          active-text="开启"
          inactive-text="不开启"
          :validate-event="false"
          active-color="#13ce66"
          size="medium"
          @change="onChangeEnabled"
        >
        </el-switch>
      </div>
    </el-card>
    <el-card class="mg-t-20" style="padding: 20px 40px;">
      <div class="f-s-16">物流公司</div>
      <div class="gray">当前自在家仅支持圆通快递的电子面单打印</div>
      <div class="mg-t-20 clearfix">
        <div class="select-company">
          <el-radio checked>
            <span class="select-company-content">
              <img
                src="https://pic.zizaihome.com/1f079e06-c5be-43e2-95c8-21486b2f47ec.png"
                height="50"
              />
            </span>
          </el-radio>
        </div>
      </div>
      <div class="f-s-16 mg-t-60">网点签约</div>
      <div class="gray">
        若已在线下快递网点签约了月结账户，请填写快递网点签约时分配给你的月结账号（客户号）和密码提交绑定；若未与快递网点签约，请联系快递网点开通月结账户。
      </div>
      <el-alert class="mg-t-10" type="info" :closable="false" show-icon
        >添加客户编码前，请联系自在家服务人员，激活您的客户编码</el-alert
      >
      <div class="input-section" v-if="showEditPartner">
        <div>客户编码</div>
        <el-input
          v-model="partnerId"
          placeholder="请填写客户编码（K+8位数字）"
          maxlength="100"
          @focus="savePartnerError = null"
          class="mg-t-10"
          style="width: 300px"
        ></el-input>
        <div class="mg-t-10">客户密钥</div>
        <el-input
          v-model="partnerKey"
          placeholder="请填写客户密钥"
          maxlength="100"
          @focus="savePartnerError = null"
          class="mg-t-10"
          style="width: 300px"
        ></el-input>
        <el-alert
          class="mg-t-20"
          type="warning"
          show-icon
          v-if="savePartnerError"
          >{{ savePartnerError }}</el-alert
        >
        <div class="mg-t-40">
          <el-button
            type="success"
            class="pd-l-40 pd-r-40"
            @click="onSavePartner"
            v-loading="savingPartner"
            round
            >{{ initData.partner_id ? '更新' : '绑定' }}</el-button
          >
        </div>
      </div>
      <div class="input-section" v-else>
        <div>
          客户编码<span class="dp-inline-block wd-60"></span>{{ partnerId }}
        </div>
        <div class="mg-t-10">
          剩余单量<span class="dp-inline-block wd-60"></span>
          <span
            style="display: inline-block; min-width: 50px"
            v-loading="balanceRequesting"
          >
            <span class="blue" style="font-size: 24px">{{
              partnerBalance
            }}</span>
            <span class="dp-inline-block wd-10"></span>
            <span class="f-s-13 gray">{{ balanceQueryTime }}</span>
          </span>
        </div>
        <div class="mg-t-40">
          <el-button
            type="success"
            class="pd-l-40 pd-r-40"
            @click="showEditPartner = true"
            round
            >修改</el-button
          >
          <el-button
            type="warning"
            class="pd-l-40 pd-r-40"
            @click="removePartner"
            round
            >删除</el-button
          >
        </div>
      </div>
      <div class="f-s-16 mg-t-60">发货信息</div>
      <div class="input-section">
        <div>姓名</div>
        <el-input
          v-model="senderName"
          placeholder="发件人的真实姓名/单位名称"
          maxlength="100"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 300px"
        ></el-input>
        <div class="mg-t-10">电话号码</div>
        <el-input
          v-model="senderPhone"
          placeholder="发件人手机号码/单位座机号码"
          maxlength="100"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 300px"
        ></el-input>
        <div class="mg-t-10">所在地区</div>
        <el-select
          v-model="senderProvince"
          placeholder="请选择省份"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 250px;"
          @change="onChangeProvince"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="senderCity"
          placeholder="请选择城市"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 250px;"
          @change="onChangeCity"
        >
          <el-option
            v-for="item in cityList"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="senderDistrict"
          placeholder="请选择区域"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 250px;"
        >
          <el-option
            v-for="item in districtList"
            :key="item.code"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <div class="mg-t-10">详细地址</div>
        <el-input
          v-model="senderAddress"
          placeholder="请填写街道门牌、楼层房间号等信息"
          maxlength="100"
          @focus="saveSenderError = null"
          class="mg-t-10"
          style="width: 300px"
        ></el-input>
        <el-alert
          class="mg-t-20"
          type="warning"
          show-icon
          v-if="saveSenderError"
          >{{ saveSenderError }}</el-alert
        >
        <div class="mg-t-40">
          <el-button
            type="success"
            class="pd-l-40 pd-r-40"
            @click="onSaveSender"
            v-loading="savingSender"
            round
            >保存</el-button
          >
        </div>
      </div>
      <div class="f-s-16 mg-t-20">面单设置</div>
      <div class="gray">
        系统默认选择“物流标准”面单。若佛事订单需要发货前确认发货人信息、拍照给用户邮寄物品等特殊情况请选择“显示订单处理二维码”面单。
        <span class="f-wg-bold red"
          >注意：订单设为已处理状态“48小时”后二维码会失效。</span
        >
      </div>
      <div class="mg-t-20 clearfix">
        <div class="select-company">
          <el-radio
            v-model="template_type"
            @change="onChangeTemplateType"
            :label="1"
          >
            <span class="select-company-content">物流标准的面单</span>
          </el-radio>
        </div>
        <div class="select-company special-1">
          <el-radio
            v-model="template_type"
            @change="onChangeTemplateType"
            :label="2"
          >
            <span class="select-company-content" style="line-height: 25px"
              >显示订单处理<br />二维码的面单</span
            >
          </el-radio>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script src="./App.js"></script>

<style src="./App.less" lang="less" scoped></style>
<style scoped>
.special-1 >>> .el-radio__input {
  position: relative;
  top: -12px;
}
</style>
