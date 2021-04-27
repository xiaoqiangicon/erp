<template>
  <div class="root">
    <div class="nav">
      <i class="nav-icon-home"></i>
      <span>微佛事</span>
      <i class="el-icon-arrow-right nav-icon-arrow"></i>
      <a href="/zzhadmin/managerCeremonyIndex/" class="nav-text-2">佛事管理</a>
      <i class="el-icon-arrow-right nav-icon-arrow nav-icon-arrow-2"></i>
      <span class="nav-text-3">{{ navTitleText }}</span>
    </div>
    <el-form :model="form" label-width="150px" size="medium" class="forms">
      <el-form-item label="标题：" required>
        <template slot="label"
          >标&nbsp;&nbsp;&nbsp;&nbsp;题：
        </template>
        <el-input
          v-model="form.title"
          placeholder="请输入不超过30个文字"
          maxlength="30"
          style="width: 500px"
        ></el-input>
        <span class="mg-l-20">分享标题参与人次：</span>
        <el-switch
          v-model="form.allow_showVistNum"
          active-text="开"
          inactive-text="关"
          :active-value="1"
          :inactive-value="0"
          :validate-event="false"
          active-color="#13ce66"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="分类：" required>
        <template slot="label"
          >分&nbsp;&nbsp;&nbsp;&nbsp;类：
        </template>
        <el-select
          v-model="form.ceremonyTypeId"
          placeholder="请选择"
          style="width: 250px;"
        >
          <el-option
            v-for="item in ceremonyTypes"
            :key="item.ceremonyTypeId"
            :label="item.name"
            :value="item.ceremonyTypeId"
          >
          </el-option>
        </el-select>
        <span class="edit-type" @click="toTypesDialog">编辑</span>
      </el-form-item>
      <el-form-item label="封面图：" required>
        <draggable class="dp-inline-block" :list="form.pics">
          <div
            class="cover-item"
            v-for="(pic, index) in form.pics"
            :key="index"
          >
            <img class="wd-100-pc hg-100-pc" :src="pic" />
            <span class="cover-mask"></span>
            <i
              class="el-icon-circle-close cover-del"
              @click="delCover(index)"
            ></i>
          </div>
        </draggable>
        <img
          class="cover-add"
          src="https://pic.zizaihome.com/build/2ed86af0ce03dd222864747496bcc75a.png"
          @click="addCover"
          v-show="form.pics.length < 5"
        />
        <p>添加图片（最少 1 张最多 5 张，请保持所有图片的宽高比例一致）</p>
      </el-form-item>
      <el-form-item label="封面视频：">
        <div class="cover-item" v-for="(src, index) in form.video" :key="index">
          <img class="wd-100-pc hg-100-pc" :src="src + videoCoverSuffix" />
          <span class="cover-mask"></span>
          <i
            class="el-icon-circle-close cover-del"
            @click="delVideo(index)"
          ></i>
        </div>
        <div class="cover-add" v-if="uploadingVideo">
          <img
            class="cover-add"
            src="https://pic.zizaihome.com/build/2ed86af0ce03dd222864747496bcc75a.png"
            style="opacity: .2"
          />
          <img class="cover-loading" src="../../../images/loading.gif" />
        </div>
        <div
          class="cover-add"
          ref="uploadVideo"
          v-show="!uploadingVideo && form.video.length < 1"
        >
          <img
            class="cover-add"
            src="https://pic.zizaihome.com/build/2ed86af0ce03dd222864747496bcc75a.png"
          />
        </div>
        <p>支持视频格式MP4/MOV等，不超过50MB，仅支持上传1个封面视频</p>
      </el-form-item>
      <el-form-item label="简介：">
        <template slot="label"
          >简&nbsp;&nbsp;&nbsp;&nbsp;介：
        </template>
        <el-input
          type="textarea"
          placeholder="简介可自定义佛事分享时的描述（选填）"
          v-model="form.custom_introduce"
          maxlength="60"
          show-word-limit
          rows="3"
          style="max-width: 600px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="详情：" required>
        <template slot="label"
          >详&nbsp;&nbsp;&nbsp;&nbsp;情：
        </template>
        <div id="detail-editor" class="editor-container"></div>
      </el-form-item>
      <el-form-item label="选择项：">
        <template slot="label"
          >选择项
          <el-tooltip
            effect="dark"
            content="可添加信众参与的选项"
            placement="top-start"
          >
            <i class="el-icon-question"></i
          ></el-tooltip>
          ：
        </template>
        <GuiGe :subdivideStr="form.subdivideStr" />
      </el-form-item>
      <el-form-item label="支付：" v-if="!guiGeListLength">
        <template slot="label"
          >支&nbsp;&nbsp;&nbsp;&nbsp;付：
        </template>
        <el-radio v-model="form._needPay" :label="1">需支付</el-radio>
        <el-radio v-model="form._needPay" :label="0">无需支付</el-radio>
        <div class="mg-t-20" v-if="form._needPay">
          <el-input
            v-model="form.price"
            placeholder="多个随喜金额逗号分隔"
            style="width: 300px"
          ></el-input>
          <el-button
            type="success"
            size="medium"
            @click="fillRandomPrices"
            v-if="form.price.indexOf(',') === -1"
          >
            自动生成随喜金额
          </el-button>
          <span v-else>
            自动处理订单
            <el-switch
              v-model="form.isAutoFinish"
              :active-value="1"
              :inactive-value="0"
              :validate-event="false"
              active-color="#13ce66"
            >
            </el-switch>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="库存：" v-if="!guiGeListLength">
        <template slot="label"
          >库&nbsp;&nbsp;&nbsp;&nbsp;存：
        </template>
        <el-input
          v-model="form.stock"
          placeholder="为空不限库存"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item label="附言：">
        <template slot="label"
          >附&nbsp;&nbsp;&nbsp;&nbsp;言：
        </template>
        <FuYan :postScript="form.postScript" />
      </el-form-item>
      <el-form-item label="按钮文字：">
        <el-input
          v-model="form.opName"
          maxlength="20"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item label="参与者列表：">
        <el-radio v-model="form.showClient" :label="1">显示</el-radio>
        <el-radio v-model="form.showClient" :label="0">不显示</el-radio>
      </el-form-item>
      <el-form-item label="统计区域：">
        <el-radio v-model="form._showStat" :label="1">显示</el-radio>
        <el-radio v-model="form._showStat" :label="0">不显示</el-radio>
        <div class="mg-t-20 stat-area" v-if="form._showStat">
          <div
            class="col-sm-5 s-panel s-panel-1"
            :class="{ active: form._statStyle === 1 }"
            @click="form._statStyle = 1"
          >
            <div class="s-panel-icon">普通样式</div>
            <div class="s-panel-list">
              <div class="s-panel-item">
                <div class="mgb20">发起时间</div>
                <div>
                  <span class="s-panel-special-text">3</span
                  ><span class="mgl5">天</span>
                </div>
              </div>
              <div class="s-panel-item">
                <div class="mgb20">募集总额</div>
                <div>
                  <span class="s-panel-special-text">2000</span
                  ><span class="mgl5">元</span>
                </div>
              </div>
              <div class="s-panel-item">
                <div class="mgb20">参与人次</div>
                <div class="s-panel-special-text">21098</div>
              </div>
            </div>
            <img
              src="https://pic.zizaihome.com/fe0ea670-a1eb-11e8-9f56-00163e0c001e.png"
              class="s-panel-select-img"
            />
          </div>
          <div class="col-sm-5 mgl20">
            <div
              class="s-panel s-panel-2"
              :class="{ active: form._statStyle === 2 }"
              @click="form._statStyle = 2"
            >
              <div class="s-panel-icon">众筹样式</div>
              <div class="s-panel-list">
                <div class="s-panel-item">
                  <div class="mgb20">目标金额</div>
                  <div>
                    <span class="s-panel-special-text">22300</span
                    ><span class="mgl5">元</span>
                  </div>
                </div>
                <div class="s-panel-item">
                  <div class="mgb20">募集总额</div>
                  <div>
                    <span class="s-panel-special-text">2000</span
                    ><span class="mgl5">元</span>
                  </div>
                </div>
                <div class="s-panel-item">
                  <div class="mgb20">参与人次</div>
                  <div class="s-panel-special-text">21098</div>
                </div>
              </div>
              <div class="s-panel-title mgb10">进度</div>
              <div class="s-panel-bar-container">
                <div class="s-panel-bar"></div>
                <div class="s-panel-bar-icon">30%</div>
              </div>
              <img
                src="https://pic.zizaihome.com/fe0ea670-a1eb-11e8-9f56-00163e0c001e.png"
                class="s-panel-select-img"
              />
            </div>
            <div
              class="mg-t-20 s-panel s-panel-3"
              v-show="form._statStyle === 2"
            >
              <span>目标金额</span>
              <el-input
                v-model="form.targetAmount"
                class="mg-l-20 mg-r-20"
                style="width: 150px"
              ></el-input>
              <span>元</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="为空默认今天开始"
          style="width: 250px;"
        />
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 250px;"
        />
      </el-form-item>
      <el-form-item label="剩余时间：">
        <el-radio v-model="form.showEndTime" :label="1">显示</el-radio>
        <el-radio v-model="form.showEndTime" :label="0">不显示</el-radio>
      </el-form-item>
      <el-form-item label="选择功德证书：">
        <el-radio v-model="form._showFeedback" :label="1">显示</el-radio>
        <el-radio v-model="form._showFeedback" :label="0">不显示</el-radio>
        <div class="mg-t-20" v-if="form._showFeedback">
          <div class="feedback-type-list">
            <div class="title">样式列表</div>
            <div
              class="item"
              v-for="item in feedbackPrizes"
              :key="item.value"
              :class="{ active: form.feedbackType === item.value }"
              @click="form.feedbackType = item.value"
            >
              {{ item.name }}
            </div>
          </div>
          <img
            class="feedback-img"
            :src="feedbackPrizes[form.feedbackType - 1].cover"
          />
        </div>
      </el-form-item>
      <el-form-item label="反馈信息：">
        <el-radio v-model="form.pay_succ_details_flag" :label="1"
          >开启</el-radio
        >
        <el-radio v-model="form.pay_succ_details_flag" :label="0"
          >关闭</el-radio
        >
        <div class="mg-t-20" v-show="form.pay_succ_details_flag">
          <div id="pay-success-editor" class="editor-container"></div>
        </div>
      </el-form-item>
    </el-form>
    <div class="mg-t-40 mg-b-40 t-a-center">
      <el-button type="success" size="medium" @click="submit">{{
        submitText
      }}</el-button>
      <el-button type="success" size="medium" plain @click="cancel"
        >取消</el-button
      >
      <el-button
        type="success"
        size="medium"
        plain
        v-if="showSaveAsTemplate"
        @click="saveAsTemplate"
        >存为模板</el-button
      >
      <el-button
        type="success"
        size="medium"
        plain
        v-if="showSaveAsDraft"
        @click="saveAsDraft"
        >存为草稿</el-button
      >
    </div>

    <!-- 分类管理 -->
    <Types />
  </div>
</template>

<script src="./App.js"></script>

<style src="./App.less" lang="less" scoped></style>
