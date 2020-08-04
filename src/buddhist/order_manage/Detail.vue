<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div
        class="s-container"
        v-loading="handleLoading"
        element-loading-text="订单处理中"
        element-loading-background="rgba(0, 0, 0, 0.5)"
      >
        <div class="body">
          <div class="cell" v-show="isGroup && !selected.length">
            <div class="cell-title">筛选条件</div>
            <div class="cell-body">
              <div>
                <label class="wd-100">佛事项目：</label>
                <el-select
                  style="width: 300px;"
                  clearable
                  size="medium"
                  v-model="buddhistId"
                  filterable
                  placeholder="请选择或填写关键词搜索"
                >
                  <el-option
                    v-for="item in buddhistList"
                    :key="item.buddhistId"
                    :label="item.buddhistName"
                    :value="item.buddhistId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="mg-t-10" v-show="subList.length !== 0">
                <label class="wd-100">佛事选择项：</label>
                <el-select
                  style="width: 300px;"
                  size="medium"
                  v-model="subId"
                  filterable
                  placeholder="请选择或填写关键词搜索"
                >
                  <el-option
                    v-for="item in subList"
                    :key="item.subId"
                    :label="item.subName"
                    :value="item.subId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="mg-t-10">
                <label class="wd-100">下单时间：</label>
                <el-date-picker
                  style="width: 300px;"
                  v-model="date"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  unlink-panels
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">处理反馈</div>
            <div class="cell-body">
              <div class="mg-b-5">
                <!-- 反馈图片 -->
                <div
                  v-for="item in images"
                  :key="item"
                  class="fb-cell img-cell"
                >
                  <img v-gallery :src="item" alt="" />
                  <div @click="onClickImgDelete(item)" class="img-delete"></div>
                </div>
                <!-- 反馈视频 -->
                <div
                  v-for="item in videos"
                  :key="item"
                  class="fb-cell video-cell"
                >
                  <video :src="item"></video>
                  <div class="video-play" @click="onClickPlayVideo(item)"></div>
                  <div
                    @click="onClickVideoDelete(item)"
                    class="video-delete"
                  ></div>
                </div>
                <!-- 视频正在上传 -->
                <div
                  v-show="curUploadVideo.uploading"
                  v-loading="curUploadVideo.uploading"
                  class="fb-cell"
                  :element-loading-text="curUploadVideo.progress + '%'"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                  <div
                    @click="onClickVideoUploadDelete"
                    class="video-uploading-delete"
                  ></div>
                </div>
              </div>
              <div class="upload-container">
                <!-- 图片上传
                <div
                  class="upload-img-container"
                  draggable=""
                  @dragover.prevent
                  @drop.prevent="onDrop"
                  @click="onClickChooseImage"
                >-->
                <div class="upload-img-container" @click="onClickChooseImage">
                  <img
                    class="upload-icon"
                    src="https://pic.zizaihome.com/7181a6a2-81c5-11e9-bda2-00163e0c001e.png"
                  />
                  <div class="upload-text">
                    <!-- 图片拖到此处或点击上传 -->点击上传图片
                  </div>
                </div>
                <!-- 视频上传 -->
                <el-upload
                  ref="uploadVideo"
                  :show-file-list="false"
                  :action="uploadUrl"
                  class="upload-video-container"
                  drag
                  :before-upload="beforeUploadVideo"
                  :on-success="handleUploadVideoSuccess"
                  :on-progress="handleUploadVideoProgress"
                  :on-error="handleUploadVideoError"
                >
                  <img
                    class="upload-icon"
                    src="https://pic.zizaihome.com/6b9b5dd2-81c5-11e9-8458-00163e0c001e.png"
                  />
                  <div class="upload-text">视频拖到此处或点击上传</div>
                </el-upload>
              </div>
              <div class="tip">
                图片格式支持JPG、PNG、GIF等，视频格式支持MP4、WMV、MOV等，文件大小不超过80M
              </div>
            </div>
          </div>
          <div v-show="!isGroup" class="cell">
            <div class="cell-title">物流单号</div>
            <div class="cell-body">
              <el-input
                placeholder="请输入内容"
                v-model="logisticsOrder"
                class="logistics-container"
              >
                <el-select
                  filterable
                  v-model="courierCompanyCode"
                  slot="prepend"
                  placeholder="请选择"
                  class="logistics-select"
                >
                  <el-option
                    v-for="item in courierCompanyList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">处理备注</div>
            <div class="cell-body">
              <div class="remark" id="remark-editor"></div>
            </div>
          </div>
          <div class="cell">
            <div class="cell-title">下次处理时间</div>
            <div class="cell-body">
              <el-date-picker
                v-model="nextFeedBackTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <div class="mg-t-10">
                需要多次处理的订单，请在这里选择下次需要处理的日期；如果已处理完，请把这里的时间清除
              </div>
            </div>
          </div>
          <div v-show="!isGroup" class="cell">
            <div class="cell-title">附言信息</div>
            <div class="cell-body">
              <template v-if="ps.length">
                <div v-for="item in ps" :key="item.inputId" class="ps-row">
                  <div class="ps-title">{{ item.name }}：</div>
                  <div class="ps-content">
                    <!--图片-->
                    <template v-if="item.type === 14 && item.value">
                      <img
                        v-for="img in item.value.split(',')"
                        :key="img"
                        class="ps-image"
                        :src="img"
                        alt=""
                      />
                    </template>
                    <!--非图片-->
                    <template v-else>
                      <div class="ps-content">{{ item.value }}</div>
                    </template>
                  </div>
                </div>
              </template>
              <template v-else
                >暂无附言信息</template
              >
            </div>
          </div>
          <div v-show="!isGroup" class="cell">
            <div class="cell-title">功德主信息</div>
            <div class="cell-body">
              <div class="ps-row">
                <div class="ps-title">购买人：</div>
                <div class="ps-content">{{ user && user.name }}</div>
              </div>
              <div class="ps-row">
                <div class="ps-title">联系电话：</div>
                <div class="ps-content">{{ user && user.tel }}</div>
              </div>
            </div>
          </div>
          <div v-show="!isGroup" class="cell">
            <div class="cell-title">
              订单详情
              <span class="cell-title-tip"
                >下单数量：{{ buyNum }}&nbsp;&nbsp;支付金额：{{ price }}</span
              >
            </div>
            <div class="cell-body">
              <div class="detail-row">
                <div class="detail-title">佛事名称：</div>
                <div class="detail-content">{{ buddhistName }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-title">选择项：</div>
                <div class="detail-content">{{ subName }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-title">下单时间：</div>
                <div class="detail-content">{{ orderTime }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-title">订单号：</div>
                <div class="detail-content">{{ orderNumber }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-title">外部订单号：</div>
                <div class="detail-content">{{ outerOrderNumber }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-title">支付流水号：</div>
                <div class="detail-content">{{ runningNumber }}</div>
              </div>
              <div ref="qrcode" class="qrcode"></div>
            </div>
          </div>
        </div>
        <div
          v-show="
            type === 1 || type === 4 || type === 3 || type === 5 || type === 6
          "
          class="foot"
        >
          <div @click="onClickHandle" v-if="logisticsOrder" class="s-btn">
            设为已发货
          </div>
          <div @click="onClickHandle" v-else class="s-btn">
            <span v-if="isGroup && type === 3">确定替换反馈内容</span>
            <span v-else-if="!isGroup && type === 3">保存</span>
            <span v-else>设为已处理</span>
          </div>
        </div>
      </div>
      <VideoPlayer :src="videoPlayerSrc" />
    </div>
  </transition>
</template>

<script>
import VideoPlayer from './VideoPlayer';

import { Notification } from 'element-ui';
import _ from 'underscore';
import seeAjax from 'see-ajax';
import QRCode from '../../../../pro-com/src/libs-es5/qrcode';
import ChooseImage from '../../com-deprecated/choose-image';
import { setHtmlNoScroll, recoverHtmlScroll } from './util';

let qrCodeImg;
let remarkEditor;

export default {
  name: 'Detail',
  components: {
    VideoPlayer,
  },
  props: ['isGroup', 'detail', 'type'],
  data() {
    return {
      uploadUrl: `${window.location.origin}/zzhadmin/uploadPic/`, // 上传地址 返回 {msg, result:0, url}

      curUploadVideo: {
        uploading: !1,
        progress: 0,
      },

      mounted: false, // 组件是否建立
      courierCompanyList: [],

      handleLoading: false, // 订单处理接口等待位

      // detail中的静态字段
      id: 0,
      user: { name: '', tel: '' }, // 功德主
      buyNum: '', // 下单数量
      price: '', // 支付金额
      buddhistName: '', // 佛事名
      subName: '', // 选择项名称
      qrcode: '', // 二维码
      orderTime: '', // 下单时间
      orderNumber: '', // 订单号
      outerOrderNumber: '', // 外部订单号
      runningNumber: '', // 支付流水号
      ps: [], // 附言 {inputId name type value}

      // detail中的动态字段
      images: [], // 反馈图片
      videos: [], // 反馈视频
      remark: '', // 备注
      courierCompanyCode: 'SF', // 快递公司编号
      logisticsOrder: '', // 物流编号

      videoPlayerSrc:
        'https://pic.zizaihome.com/b7c155f70d6a2d0a49cabcb6b790ce6b.mp4',

      // 下次处理时间
      nextFeedBackTime: '',

      // 过滤参数
      buddhistId: '',
      subId: -1,
      date: ['', ''],
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
    visible() {
      return this.$store.state.detailDialogVisible;
    },
    buddhistList() {
      return this.$store.state.buddhistList;
    },
    subList() {
      // 为了兼容 360 兼容模式 不能使用 find
      const curBuddhist = _.find(
        this.buddhistList,
        item => item.buddhistId === this.buddhistId
      );

      //      const curBuddhist = this.buddhistList.find(
      //        item => item.buddhistId === this.buddhistId
      //      );

      if (curBuddhist) {
        const subList = curBuddhist.subList;
        return subList && subList.length
          ? [{ subName: '全部', subId: -1 }, ...subList]
          : [];
      } else {
        return [];
      }
    },
  },
  created() {
    // 初始化图片上传
    this.chooseImage = new ChooseImage({
      multiUpload: true,
      multiSelect: true,
      showManage: true,
      onSubmit: items => {
        let images = [...this.images];

        items.map(({ src }) => {
          images.push(src);
        });

        this.images = images;
      },
    });
    // 获取数据
    this.getCourierCompanyList();
  },
  mounted() {
    // mounted 执行时 dom 并没有渲染完成
    this.$nextTick(() => {
      // 初始化 ueditor
      remarkEditor = window.UE.getEditor('remark-editor');
      remarkEditor.ready(() => {
        remarkEditor.setContent(this.remark);
      });

      this.mounted = true;
    });
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        // 阻止 html 滚动
        setHtmlNoScroll();
        // 每次显示时 要 重置数据
        if (this.mounted) {
          this.init();
        }
      } else {
        // 恢复 html 滚动
        recoverHtmlScroll();
      }
    },
  },
  methods: {
    init() {
      console.log('init');

      const { isGroup } = this;

      let images = [];
      let videos = [];
      let remark = '';
      let courierCompanyCode = '';
      let logisticsOrder = '';

      if (!isGroup) {
        const {
          id,
          user,
          buyNum,
          price,
          buddhistName,
          subName,
          qrcode,
          orderTime,
          orderNumber,
          outerOrderNumber,
          runningNumber,
          ps,
          nextFeedBackTime,
        } = this.detail;

        ({
          images,
          videos,
          remark,
          courierCompanyCode,
          logisticsOrder,
        } = this.detail);

        this.id = id;
        this.user = user; // 此属性后台出现了 无返回字段的情况
        this.buyNum = buyNum;
        this.price = price;
        this.buddhistName = buddhistName;
        this.subName = subName;
        this.qrcode = qrcode;
        this.orderTime = orderTime;
        this.orderNumber = orderNumber;
        this.outerOrderNumber = outerOrderNumber;
        this.runningNumber = runningNumber;
        this.ps = ps;
        this.nextFeedBackTime = nextFeedBackTime;

        // 初始化qrcode
        this.$refs.qrcode.innerHTML = '';
        qrCodeImg = new QRCode(this.$refs.qrcode, qrcode);
      }

      this.images = images;
      this.videos = videos;
      this.remark = remark;
      this.courierCompanyCode = courierCompanyCode || '';
      this.logisticsOrder = logisticsOrder || '';

      // 渲染 ueditor 数据
      if (remarkEditor) {
        remarkEditor.setContent(this.remark);
      }
    },
    onClickMask() {
      this.$store.commit({ type: 'updateDetailVisible', state: false });
    },
    getCourierCompanyList() {
      seeAjax('getCourierCompanyList', {}, res => {
        if (res.success) {
          this.courierCompanyList = res.data;
        } else {
          Notification({
            title: '提示',
            message: `${res.message}`,
            type: 'error',
          });
        }
      });
    },
    onClickImgDelete(img) {
      let images = [...this.images];
      images.splice(images.indexOf(img), 1);
      this.images = images;
    },
    onClickVideoDelete(video) {
      let videos = [...this.videos];
      videos.splice(videos.indexOf(video), 1);
      this.videos = videos;
    },
    onClickPlayVideo(video) {
      this.videoPlayerSrc = video;
      this.$store.commit({ type: 'updateVideoPlayerVisible', state: true });
    },
    onClickVideoUploadDelete() {
      this.$refs.uploadVideo.abort();
      this.curUploadVideo = {
        uploading: !1,
        progress: 0,
      };
      console.log('取消上传');
    },
    beforeUploadVideo(file) {
      const MAX_SIZE = 50;
      const ACCEPT_FILE_TYPES = /^video\/(avi|mp4|wmv|mov|ogg|flv|rmvb)$/i;

      if (this.curUploadVideo.uploading) {
        Notification({
          type: 'info',
          title: '提示',
          message: '暂不支持多选上传哦，请耐心等待',
        });
        return false;
      }
      console.log('beforeUploadVideo');
      console.log(file);

      const isLarge = file.size / 1024 / 1024 > MAX_SIZE;

      if (!ACCEPT_FILE_TYPES.test(file.type)) {
        Notification({
          type: 'warning',
          title: '提示',
          message: '请上传正确的视频格式',
        });
        return false;
      }

      if (isLarge) {
        Notification({
          type: 'warning',
          title: '提示',
          message: `上传视频大小不能超过${MAX_SIZE}MB哦!`,
        });
        return false;
      }

      this.curUploadVideo = {
        uploading: !0,
        progress: 0,
      };
    },
    handleUploadVideoSuccess(res) {
      console.log('handleUploadVideoSuccess');
      this.videos.push(res.url);
      this.curUploadVideo = {
        uploading: !1,
        progress: 0,
      };
    },
    handleUploadVideoProgress(e) {
      console.log('handleUploadVideoProgress');
      this.curUploadVideo.progress = e.percent.toFixed(0);
    },
    handleUploadVideoError(err, file, fileList) {
      console.log('handleUploadVideoError');
      Notification({
        type: 'error',
        title: '提示',
        message: '未知错误，请刷新页面重试',
      });
      this.curUploadVideo = {
        uploading: !1,
        progress: 0,
      };
    },
    onDrop(e) {
      console.log('drop');
      console.log(e);
      const url = '/zzhadmin/uploadPic/';
      const dt = e.dataTransfer;
      const { files /* type */ } = dt; // 判断类型 type 'image/jpeg'
      const formData = new FormData();
      formData.append('file', files[0]);
      // 上传数据
      $.ajax({
        url,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: res => {
          if (res.result >= 0) {
            const { url: img } = res;
            let { images } = this;
            images.push(img + '?imageMogr/auto-orient');
            this.images = [...images];
          } else {
            Notification({
              title: '提示',
              message: `${res.message}`,
              type: 'error',
            });
          }
        },
      });
    },
    onClickChooseImage() {
      this.chooseImage.show();
    },
    onClickHandle() {
      const {
        isGroup,
        images,
        videos,
        logisticsOrder,
        nextFeedBackTime,
      } = this;
      let { courierCompanyCode } = this;
      const remark = remarkEditor.getContent();
      let orderIds;

      if (!logisticsOrder) {
        // 设为已处理
        courierCompanyCode = '';
      }

      if (logisticsOrder && !courierCompanyCode) {
        Notification({
          title: '提示',
          message: '请选择快递公司',
          type: 'error',
        });
        return;
      }

      if (isGroup) {
        // 从selected中取orderIds
        orderIds = JSON.stringify(this.selected);
      } else {
        // 从detail 中 取 orderId
        orderIds = `[${this.id}]`;
      }

      const params = {
        orderIds,
        pics: images,
        videos,
        courierCompanyCode,
        logisticsOrder,
        remark,
        nextFeedBackTime,
      };

      if (isGroup && !this.selected.length) {
        if (!this.buddhistId) {
          Notification({
            title: '提示',
            message: '请选择一个佛事项目',
            type: 'error',
          });
          return;
        }

        params.commodityId = this.buddhistId;
        params.subdivideId = this.subId;
        params.startTime = this.date[0];
        params.endTime = this.date[1];
      }

      this.handleLoading = true;

      seeAjax(
        'handleOrder',
        params,
        res => {
          if (res.success) {
            this.handleLoading = false;

            Notification({
              title: '提示',
              message: '处理成功',
              type: 'success',
            });

            this.$emit('refresh');
            this.$store.commit({ type: 'updateDetailVisible', state: false });
          } else {
            Notification({
              title: '提示',
              message: `${res.message}`,
              type: 'error',
            });

            this.handleLoading = false;
          }
        },
        () => {
          Notification({
            title: '提示',
            message: res.message,
            type: 'error',
          });

          this.handleLoading = false;
        }
      );
    },
  },
};
</script>

<style lang="less">
// 此页面 需要修改 qrcode ueditor 的 样式 不能使用 scoped

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
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
  padding-bottom: 80px;
  bottom: 0;
  background-color: #fff;
  color: #333;

  .body {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 80px;
    width: 100%;
    overflow-y: scroll;
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
    .cell-title-tip {
      font-size: 16px;
      color: #71ba31;
      float: right;
      margin-right: 20px;
      font-weight: normal;
    }
    .cell-body {
      padding: 14px 20px;
    }
  }
  .foot {
    position: absolute;
    width: 100%;
    height: 82px;
    bottom: 0;
    right: 0;
    background-color: #fff;
    padding: 16px 0;
    border-top: 2px solid #d8d8d8;
    text-align: center;
    z-index: 999;
    .s-btn {
      display: inline-block;
      width: 233px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      background-color: #71ba31;
      text-align: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
  }
}

.fb-cell {
  font-size: 0;
  width: 120px;
  height: 120px;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  position: relative;
  vertical-align: middle;
  &:nth-child(3n) {
    margin-right: 0;
  }
}

.img-cell {
  img {
    width: 100%;
    height: 100%;
  }
}
.video-cell {
  video {
    width: 100%;
    height: 100%;
    background-color: #edeef5;
  }
}
.img-delete,
.video-delete,
.video-uploading-delete {
  background: url('https://pic.zizaihome.com/4c8b28d8-455b-11e9-9667-00163e0c001e.png')
    no-repeat;
  background-size: 24px 24px;
  position: absolute;
  width: 24px;
  height: 24px;
  top: -10px;
  right: -10px;
  cursor: pointer;
  z-index: 99999;
}
.upload-container {
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  .upload-img-container {
    flex: 1 1 auto;
    cursor: pointer;
    border-radius: 10px;
    padding: 10px;
    margin-right: 10px;
    background-color: #7bafef;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .upload-video-container {
    flex: 1 1 auto;
    border: 2px dashed #7bafef;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    color: #333;
  }
  .upload-icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .upload-text {
    flex: 0 0 100px;
  }
}
.tip {
  font-size: 16px;
  color: #999;
  margin-top: 20px;
}

.logistics-container {
  /*width: 130px;*/
  border: 1px solid #969696;
}
.logistics-container input {
  border: none;
  border-left: 1px solid #969696;
}
.logistics-select {
  background-color: #fff;
  width: 130px;
}

.video-play {
  background: url('https://pic.zizaihome.com/7788d7f2-8007-11e8-b517-00163e0c001e.png')
    no-repeat;
  background-size: 30px 30px;
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.ps-row {
  /*display: flex;*/
  /*flex-direction: row;*/
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}
.ps-title {
  display: inline-block;
  /*flex: 1;*/
}
.ps-content {
  display: inline-block;
  /*flex: 3;*/
}
.ps-image {
  width: 80px;
  height: 80px;
  margin: 0 10px 10px 0;
}

.detail-row {
  display: flex;
  flex-direction: row;
  font-size: 18px;
}
.detail-title {
  flex: 2;
}
.detail-content {
  flex: 5;
}
.qrcode {
  width: 162px;
  height: 162px;
  margin: 30px auto;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
/*el-upload样式修改*/
.el-upload {
  width: 100%;
  height: 100%;
  .el-upload-dragger {
    flex: 1 1 auto;
    border: 2px dashed #7bafef;
    border-radius: 10px;
    display: flex;
    align-items: center;
    color: #333;
    width: 100%;
    height: 100%;
    border: none;
  }
  .el-upload__input {
    display: none;
  }
}

/*ueditor样式修改*/
.remark .edui-default .edui-editor-toolbarbox {
  display: none !important;
}
.edui-editor-iframeholder.edui-default {
  height: 100px !important;
}
/*默认z-index为1005,设为已处理的modal为1050*/
.edui-default {
  z-index: 1051;
}
</style>
