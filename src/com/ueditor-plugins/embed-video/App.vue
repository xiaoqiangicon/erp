<template>
  <el-dialog title="上传视频" :visible.sync="visible" width="800px">
    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="本地上传" name="local">
          <div
            class="cover-add"
            ref="uploadVideo"
            v-show="!uploadingVideo && !url"
          >
            <img
              class="cover-add"
              src="http://imgs.zizaihome.com/build/2ed86af0ce03dd222864747496bcc75a.png"
            />
          </div>
          <!-- 视频正在上传 -->
          <div
            v-show="uploadingVideo"
            v-loading="uploadingVideo"
            class="fb-cell"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <div
              @click="onClickVideoUploadDelete"
              class="video-uploading-delete"
            ></div>
          </div>
          <div class="cover-item" v-show="url && !uploadingVideo">
            <img
              class="wd-100-pc hg-100-pc"
              :src="url + '?vframe/jpg/offset/1/w/85/h/85'"
            />
            <span class="cover-mask"></span>
            <i class="el-icon-circle-close cover-del" @click="delCover"></i>
          </div>
          <p style="margin-top: 20px;">支持视频格式MP4/MOV等，不超过50MB。</p>
          <el-button
            type="primary"
            class="clean right-1 insert"
            @click="insertLocalVideo"
            >确定插入</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="外部引用" name="iframe">
          <textarea
            class="form-control left-1 code"
            rows="6"
            placeholder="请复制视频播放页中带有类似 <iframe ......></iframe> 标记的分享代码，粘贴到此输入框中"
            v-model="code"
          ></textarea>
          <el-button type="primary" class="clean right-1 insert" @click="insert"
            >确定插入</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script src="./App.js"></script>

<style lang="less" src="./App.less" scoped></style>
