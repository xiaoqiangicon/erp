<template>
  <div class="content-container" id="content-container">
    <div class="content">
      <header class="recommend-box">
        <div class="r-left">
          <div class="r-item">
            <div
              class="r-item-con"
              :style="{ cursor: recommendAd.p1.link ? 'pointer' : 'auto' }"
            >
              <img
                :src="recommendAd.p1.picUrl"
                :alt="recommendAd.p1.name"
                @click="jumpPage(recommendAd.p1)"
              />
            </div>
          </div>
        </div>
        <div class="r-right">
          <div class="r-item">
            <div
              class="r-item-con"
              :style="{ cursor: recommendAd.p2.link ? 'pointer' : 'auto' }"
            >
              <img
                :src="recommendAd.p2.picUrl"
                :alt="recommendAd.p2.name"
                @click="jumpPage(recommendAd.p2)"
              />
            </div>
          </div>
          <div class="r-item">
            <div
              class="r-item-con"
              :style="{ cursor: recommendAd.p3.link ? 'pointer' : 'auto' }"
            >
              <img
                :src="recommendAd.p3.picUrl"
                :alt="recommendAd.p3.name"
                @click="jumpPage(recommendAd.p3)"
              />
            </div>
          </div>
        </div>
      </header>

      <footer class="footer-box">
        <div class="introduce">
          <span class="i-bule">自在家</span>
          <span>国内首家服务于寺院的正规互联网</span>
        </div>
        <div class="department">
          <div class="d-item">
            <div class="d-title">合作伙伴：</div>
            <div class="d-img partners">
              <img
                src="https://pic.zizaihome.com/9dc72d8b-bc58-44fd-ad90-6307ae508267.png"
                alt="合作伙伴"
              />
            </div>
          </div>
          <div class="split-line"></div>
          <div class="d-item">
            <div class="d-title">授权服务单位：</div>
            <div class="d-img authorize">
              <img
                src="https://pic.zizaihome.com/8e17a039-ee63-4359-854c-a35b7adc4022.png"
                alt="授权服务单位"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>

    <el-dialog :visible.sync="adImgDialog.visible" class="ad-img-dialog">
      <a :href="adImgDialog.link">
        <img :src="adImgDialog.imgsrc" :alt="adImgDialog.name" />
      </a>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      templeInfo: {
        id: '',
        name: '',
      },
      adImgDialog: {
        visible: false,
        name: '',
        link: '',
        imgsrc: '',
      },
      recommendAd: {
        p1: {
          picUrl:
            'https://pic.zizaihome.com/38c2c6ab-12b1-4f3e-9a16-9e77cc186e15.png',
          name: '推荐位01',
          link: '',
          id: -1,
        },
        p2: {
          picUrl:
            'https://pic.zizaihome.com/d0d9a7d4-1ea7-49b0-8e03-092ba4a5e59a.png',
          name: '推荐位02',
          link: '',
          id: -1,
        },
        p3: {
          picUrl:
            'https://pic.zizaihome.com/d4ddb709-5113-469c-bc50-052994731a21.png',
          name: '推荐位03',
          link: '',
          id: -1,
        },
      },
    };
  },
  created() {
    if (window.localStorage.templeId)
      this.templeInfo.id = window.localStorage.templeId;
    if (window.localStorage.templeName)
      this.templeInfo.name = window.localStorage.templeName;
    this.getAdInfo();
  },
  methods: {
    // 获取广告数据
    getAdInfo() {
      this.$api.getAdInfo().then(res => {
        if (res.result === 0) {
          if (res.announcement && res.announcement.picUrl) {
            this.adImgDialog.name = res.announcement.name;
            this.adImgDialog.link = res.announcement.link || '';
            this.adImgDialog.imgsrc = res.announcement.picUrl;
            this.adImgDialog.visible = true;
          }
          if (res.erpAdDataList && res.erpAdDataList.length) {
            res.erpAdDataList.forEach(e => {
              this.recommendAd['p' + e.position].id = e.id;
              this.recommendAd['p' + e.position].name = e.name;
              this.recommendAd['p' + e.position].link = e.link;
              this.recommendAd['p' + e.position].picUrl = e.picUrl;
            });
          }
        } else {
          console.log(res);
        }
      });
    },
    // 跳转页面
    jumpPage(item) {
      if (item.id === -1) return;
      this.$api
        .getAdInfo({
          adId: item.id,
        })
        .then(res => {
          window.location.href = item.link;
        })
        .catch(err => {
          window.location.href = item.link;
        });
    },
  },
};
</script>

<style lang="less">
.content-container {
  padding: 15px;
  .content {
    position: relative;
    min-height: calc(100vh - 126px);
    padding-bottom: 112px;
    background-color: #ffffff;
    .recommend-box {
      display: flex;
      padding: 20px 0;
      .r-left {
        margin-left: 1.875%;
        width: 64.375%;
        .r-item {
          padding-top: 29.787%;
        }
      }
      .r-right {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        width: 30.625%;
        margin-left: 1.25%;
        margin-right: 1.875%;
        .r-item {
          padding-top: 29.795%;
        }
      }
      .r-item {
        position: relative;
        .r-item-con {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
        }
      }
    }

    .footer-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 10px 16px;
      .introduce {
        padding: 20px 0;
        text-align: center;
        border-top: 1px solid #e5e5e5;
        font-size: 13px;
        font-weight: 600;
        line-height: 13px;
        letter-spacing: 2px;
        color: #666666;
        .i-bule {
          color: #0486fe;
        }
      }
      .department {
        display: flex;
        justify-content: center;
        align-items: center;
        .d-item {
          display: flex;
          align-items: center;
          .d-title {
            color: #333333;
            font-size: 13px;
            margin-right: 10px;
          }
          .partners img {
            width: 341px;
          }
          .authorize img {
            width: 105px;
          }
        }
        .split-line {
          width: 1px;
          background-color: #e5e5e5;
          height: 28px;
          margin: 0 42px;
        }
      }
    }
  }
  .ad-img-dialog {
    /deep/ .el-dialog {
      width: 500px;
      height: 600px;
      border-radius: 14px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0);
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        padding: 0;
        a {
          display: block;
          width: 500px;
          height: 600px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
@media (min-width: 1290px) {
  .content {
  }
}
@media (min-width: 1400px) {
  .content {
  }
}
@media (min-width: 1620px) {
  .background-image {
  }
}
</style>
