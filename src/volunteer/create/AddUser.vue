<template>
  <el-dialog
    :visible.sync="showSelectManage"
    width="30%"
    :title="selectManage.length ? '请选择本次招募的义工管理员' : ''"
  >
    <div style="text-align: center" v-if="selectManage.length">
      <div class="select-manager">
        <div
          class="single-manager"
          v-for="(item, key) in selectManage"
          :key="key"
        >
          <img
            class="avatar"
            :class="{ isSelected: item.isSelected }"
            :src="item.headImg"
            alt=""
          />
          <p class="nickname">{{ item.name }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showSelectManage = !1"
          >添加</el-button
        >
      </span>
    </div>
    <div v-else>
      <div class="no-manager" v-if="!showQrcode">
        <span>暂无义工管理员，请先设置</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showQrcode = !0"
            >设置义工管理员</el-button
          >
        </span>
      </div>
      <div class="set-manager" v-else>
        <div class="qrcode-box">
          <div ref="qrcode" class="qrcode"></div>
          <div class="qrcode-tips">
            <p>请微信扫描左侧二维码，加入本寺义工管理员。</p>
            <p>
              如需设置他人为义工管理员，可拍下二维码图片，微信发给对方，然后长按图片识别。
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showSelectManage = !1"
            >取消</el-button
          >
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import QRCode from '../../../pro-com/src/libs-es5/qrcode';

let qrCodeImg;
export default {
  name: 'AddUser',
  props: {
    selectManage: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      showQrcode: !1,
      qrcode: 'https://www.baidu.com/', // 二维码
    };
  },
  watch: {
    showQrcode() {
      if (this.showQrcode) {
        this.$nextTick(() => {
          this.$refs.qrcode.innerHTML = '';
          qrCodeImg = new QRCode(this.$refs.qrcode, {
            text: this.qrcode,
            width: 100,
            height: 100,
          });
        });
      }
    },
    selectManage: {
      handler: function() {
        console.log(1234);
      },
      deep: true,
    },
  },
  computed: {
    showSelectManage: {
      get: function() {
        return this.$store.state.showSelectManage;
      },
      set: function(newValue) {
        this.$store.state.showSelectManage = newValue;
      },
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.select-manager {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.avatar {
  width: 60px;
  border-radius: 4px;
}
.isSelected {
  border: 2px solid #409eff;
  box-sizing: border-box;
}
.single-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}

.no-manager {
  text-align: center;
}
.dialog-footer {
  display: block;
  margin-top: 10px;
}
.set-manager {
  text-align: center;
}
.qrcode-box {
  display: flex;
}
.qrcode-tips {
  margin-left: 20px;
  p {
    margin: 0;
    line-height: 20px;
    text-align: left;
  }
}
</style>
