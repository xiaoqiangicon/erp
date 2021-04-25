<template>
  <div class="root">
    <div class="nav">
      <i class="nav-icon-home"></i>
      <span>微佛事</span>
      <i class="el-icon-arrow-right nav-icon-arrow"></i>
      <a href="/zzhadmin/managerCeremonyIndex/" class="nav-text-2">佛事管理</a>
      <i class="el-icon-arrow-right nav-icon-arrow nav-icon-arrow-2"></i>
      <span class="nav-text-3">编辑佛事</span>
    </div>
    <el-form
      :model="form"
      :rules="rules"
      label-width="150px"
      size="medium"
      class="forms"
    >
      <el-form-item label="标题：" prop="title" required>
        <template slot="label"
          >标&nbsp;&nbsp;&nbsp;&nbsp;题：
        </template>
        <el-input
          v-model="form.title"
          placeholder="请输入不超过30个文字"
          maxlength="30"
          style="max-width: 600px"
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
      <el-form-item label="分类：" prop="ceremonyTypeId" required>
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
        <draggable class="dp-inline-block" v-model="form.pics">
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
        <div ref="detailEditor" class="editor-container"></div>
      </el-form-item>
      <el-form-item label="选择项：">
        <template slot="label"
          >选择项<el-tooltip
            effect="dark"
            content="可添加信众参与的选项"
            placement="top-start"
          >
            <i class="el-icon-question"></i> </el-tooltip
          >：
        </template>
        <GuiGe :subdivideStr="form.subdivideStr" />
      </el-form-item>
      <el-form-item label="附言：">
        <template slot="label"
          >附&nbsp;&nbsp;&nbsp;&nbsp;言：
        </template>
        <FuYan :postScript="form.postScript" />
      </el-form-item>
    </el-form>

    <!-- 分类管理 -->
    <Types />
  </div>
</template>

<script src="./App.js"></script>

<style src="./App.less" lang="less" scoped></style>
