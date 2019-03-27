<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div class="s-container">
        <div class="cell">
          <div class="cell-title">处理反馈</div>
          <div class="cell-body">
            <div class="fb-images-container mg-b-5">
              <div v-for="item in images" class="img-cell">
                <img :src="item" alt="" />
                <img
                  @click="onClickImgDelete(item)"
                  src="https://pic.zizaihome.com/4c8b28d8-455b-11e9-9667-00163e0c001e.png"
                  class="img-delete"
                  alt=""
                />
              </div>
            </div>
            <div
              class="fb-upload-container"
              draggable
              @dragover.prevent
              @drop.prevent="onDrop"
              @click="onClickChooseImage"
            >
              <img
                class="fb-img"
                src="https://pic.zizaihome.com/692097f6-db6d-11e8-9f9a-00163e0c001e.png"
                alt=""
              />
              <div class="fb-text1">点击或将图片拖拽到这里上传</div>
              <div class="fb-text2">支持格式：.jpg .png .gif</div>
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
                >
                </el-option>
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

        <div v-show="!isGroup" class="cell">
          <div class="cell-title">反馈视频</div>
          <div class="cell-body">
            <template v-if="videos.length">
              <div v-for="item in videos" class="video-cell">
                <video :src="item"></video>
                <img
                  class="video-play"
                  @click="onClickPlayVideo(item)"
                  src="https://pic.zizaihome.com/7788d7f2-8007-11e8-b517-00163e0c001e.png"
                />
              </div>
            </template>
            <template v-else
              >暂无反馈视频</template
            >
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
              <div class="ps-content">{{ user.name }}</div>
            </div>
            <div class="ps-row">
              <div class="ps-title">联系电话：</div>
              <div class="ps-content">{{ user.tel }}</div>
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

        <div
          v-show="type === 1 || type === 4 || type === 3 || type === 5"
          class="foot"
        >
          <div @click="onClickHandle" v-if="logisticsOrder" class="s-btn">
            设为已发货
          </div>
          <div @click="onClickHandle" v-else class="s-btn">设为已处理</div>
        </div>
      </div>
      <VideoPlayer :src="videoPlayerSrc" />
    </div>
  </transition>
</template>

<script>
import VideoPlayer from './VideoPlayer';

import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import QRCode from '@zzh/qrcode';
import ChooseImage from '@zzh/choose-image';
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
      mounted: false, // 组件是否建立
      courierCompanyList: [],

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
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
    visible() {
      return this.$store.state.detailDialogVisible;
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
        } = this.detail;

        ({
          images,
          videos,
          remark,
          courierCompanyCode,
          logisticsOrder,
        } = this.detail);

        this.id = id;
        this.user = user;
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
            message: '接口出错',
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
    onClickPlayVideo(video) {
      this.videoPlayerSrc = video;
      this.$store.commit({ type: 'updateVideoPlayerVisible', state: true });
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
            images.push(img);
            this.images = [...images];
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
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
      const { isGroup, images, logisticsOrder } = this;
      let { courierCompanyCode } = this;
      const remark = remarkEditor.getContent();
      let orderIds;

      if (!logisticsOrder) {
        // 设为已处理
        courierCompanyCode = '';
      }

      if (isGroup) {
        // 从selected中取orderIds
        orderIds = JSON.stringify(this.selected);
      } else {
        // 从detail 中 取 orderId
        orderIds = `[${this.id}]`;
      }

      seeAjax(
        'handleOrder',
        {
          orderIds,
          pics: images,
          courierCompanyCode,
          logisticsOrder,
          remark,
        },
        res => {
          if (res.success) {
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
              message: '接口出错',
              type: 'error',
            });
          }
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
  overflow-y: scroll;
}

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
.foot {
  position: fixed;
  bottom: 30px;
  right: 105px;
  padding-top: 10px;
  border-top: 2px solid gray;
  text-align: center;
  z-index: 999;
}
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

.img-cell {
  font-size: 0;
  width: 120px;
  height: 120px;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  position: relative;
  .img-delete {
    position: absolute;
    width: 24px;
    height: 24px;
    top: -10px;
    right: -10px;
    cursor: pointer;
  }
  &:nth-child(3n) {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.fb-upload-container {
  width: 411px;
  height: 155px;
  margin: 0 auto;
  border: 2px dashed #7bafef;
  border-radius: 54px;
  cursor: pointer;
  text-align: center;
  .fb-img {
    display: block;
    width: 59px;
    height: 47px;
    margin: 23px auto 20px;
  }
  .fb-text1 {
    font-size: 18px;
  }
  .fb-text2 {
    font-size: 16px;
    color: #9b9b9b;
  }
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

.video-cell {
  position: relative;
  display: inline-block;
  width: 90px;
  height: 90px;
  margin: 5px;
  video {
    width: 100%;
    height: 100%;
    background-color: #edeef5;
  }
}
.video-play {
  position: absolute;
  width: 30px;
  height: 30px;
  left: 35px;
  top: 35px;
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
/*ueditor样式修改*/
.remark .edui-default .edui-editor-toolbarbox {
  display: none !important;
}
/*默认z-index为1005,设为已处理的modal为1050*/
.edui-default {
  z-index: 1051;
}
</style>
