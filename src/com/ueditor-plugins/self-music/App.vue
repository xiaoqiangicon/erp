<template>
  <div class="container">
    <div class="row">
      <div class="row-name">标题：</div>
      <el-input
        v-model="title"
        placeholder="请输入标题"
        size="small"
      ></el-input>
    </div>
    <div class="row">
      <div class="row-name">描述：</div>
      <el-input
        v-model="desc"
        placeholder="请输入描述"
        size="small"
        type="textarea"
        rows="3"
      ></el-input>
    </div>
    <div class="row">
      <div class="row-name">封面：</div>
      <Upload :images="covers" :multiple="false" />
    </div>
    <div class="row">
      <div class="row-name">音频：</div>
      <div
        class="ps-relative mg-r-20"
        ref="uploadFile"
        v-show="!audioUploading"
      >
        <el-button size="small">{{
          audio ? '更新音频' : '上传音频'
        }}</el-button>
      </div>
      <el-button size="small" class="mg-r-20" v-show="audioUploading"
        >正在上传 {{ audioUploadProgress }}%</el-button
      >
      <el-input v-model="audio" size="small" readonly></el-input>
    </div>
    <div class="ok" @click="ok">确定</div>
  </div>
</template>

<script src="./App.js"></script>

<style lang="less" src="./App.less" scoped></style>
