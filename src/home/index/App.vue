<template>
  <div class="content-container" id="content-container">
    <div class="content">
      <div class="greeting">
        <div class="text-1 text-1-1">欢迎您</div>
        <div class="text-1 text-1-2">{{ templeInfo.name }}的管理者</div>
      </div>
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
    };
  },
  created() {
    if (window.localStorage.id) this.templeInfo.name = window.localStorage.id;
    if (window.localStorage.templeName)
      this.templeInfo.name = window.localStorage.templeName;
    this.getAdInfo();
  },
  methods: {
    // 获取广告数据
    getAdInfo() {
      this.$api.getAdInfo().then(res => {
        if (res.result === 0 && res.data.picUrl) {
          this.adImgDialog.name = res.data.name;
          this.adImgDialog.link = res.data.link || '';
          this.adImgDialog.imgsrc = res.data.picUrl;
          this.adImgDialog.visible = true;
        } else {
          console.log(res);
        }
      });
    },
  },
};
</script>

<style lang="less">
.content-container {
  .content {
    padding: 60px 60px;
    overflow: hidden;
    background-size: 100% 100%;
    background-image: url(https://pic.zizaihome.com/a45cad7c-8006-11e8-b517-00163e0c001e.jpg);
    .greeting {
      float: left;
      color: #fff;
      font-size: 32px;
      font-family: '楷体';
      padding: 30px 20px;
      background-color: rgba(0, 0, 0, 0.2);
      .text-1 {
        float: left;
        padding: 30px 10px;
      }
      .text-1-1 {
        width: 64px;
      }
      .text-1-2 {
        width: 32px;
        font-size: 16px;
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
    background-image: url(https://pic.zizaihome.com/b42568a2-8006-11e8-b517-00163e0c001e.png);
    padding: 60px 60px;
  }
}
@media (min-width: 1400px) {
  .content {
    background-image: url(https://pic.zizaihome.com/b42568a2-8006-11e8-b517-00163e0c001e.png);
    padding: 90px 80px;
  }
}
@media (min-width: 1620px) {
  .background-image {
    background-image: url(https://pic.zizaihome.com/bfdd683e-8006-11e8-b517-00163e0c001e.jpg);
    padding: 100px 80px;
  }
}
</style>
