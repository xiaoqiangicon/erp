<template>
  <div class="contain">
    <div class="content">
      <div class="left">
        <div class="left-header">角色</div>
        <div class="role-list">
          <div
            class="role-item"
            v-for="(item, key) in typeList"
            :key="key"
            @click="changeList(key)"
          >
            <p class="role-name">{{ item.name }}</p>
            <p class="role-num">{{ list[key] ? list[key].length : '' }}人</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="header">
          <div class="role-str">{{ role }}</div>
          <div class="invite-btn" @click="invite">邀请人员</div>
        </div>
        <el-table
          highlight-current-row
          :data="tableList"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="头像" :align="'center'">
            <template slot-scope="scope">
              <div>
                <img class="avatar" :src="scope.row.headImg" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" :align="'center'" />
          <el-table-column prop="sexStr" label="性别" :align="'center'" />
          <el-table-column prop="typeStr" label="角色" :align="'center'" />
          <el-table-column prop="mobile" label="手机号码" :align="'center'" />
          <el-table-column prop="memo" label="备注" :align="'center'" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="detail" @click="showDetail(scope.row)">详情</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <Detail :detail="detail" />
    <div class="mask" v-if="showInvite">
      <div class="mask-content">
        <div class="invite-header">
          <p class="invite-title">邀请人员</p>
          <span class="invite-close" @click="closeInvite">×</span>
        </div>
        <div class="invite-body">
          <p class="invite-body-title">邀请二维码</p>
          <p class="invite-body-tips">人员可通过微信扫描二维码打开小程序加入</p>
          <div class="qrcode">
            <img :src="code" alt="" />
          </div>
          <div class="download" @click="download">下载二维码</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import Detail from './Detail';
import QRCode from '../../../../pro-com/src/libs-es5/qrcode';
import $ from 'jquery';
import Canvas2Image from '@senntyou/canvas2image';

let qrCodeImg;

export default {
  name: 'APP',
  data() {
    return {
      role: '方丈',
      list: [], // 把返回的列表进行组装分类
      tableList: [], // 表数组
      typeList: [], // 角色列表
      detail: {}, // 详情数据
      templeId: 0,
      showInvite: !1,
      qrcode: '', // 二维码
      code: '', // 二维码图片
    };
  },
  components: {
    Detail,
  },
  created() {
    this.templeId = window.localStorage['templeId'];
    this.fetchTypeList();
  },
  methods: {
    fetchList() {
      seeAjax('userDetailList', { status: 0 }, detailRes => {
        if (detailRes.success) {
          this.typeList.forEach((item, key) => {
            this.list[key] = detailRes.data.filter(detailItem => {
              return detailItem.type == item.vaule;
            });
          });
          this.code = detailRes.code;
          this.tableList = this.list[0];
          this.role = this.typeList[0].name;
          this.$forceUpdate();
        }
      });
    },
    fetchTypeList() {
      seeAjax('getUserType', {}, res => {
        if (res.success) {
          this.typeList = res.data;
          this.$store.state.roleList = res.data;
          console.log('typeList', this.typeList);
          this.fetchList();
        }
      });
    },
    invite() {
      let qrcode = 'www.baidu.com';

      this.showInvite = !0;
      // this.$nextTick(() => {
      //   this.$refs.qrcode.innerHTML = '';
      //   qrCodeImg = new QRCode(this.$refs.qrcode, qrcode);
      // })
    },
    changeList(key) {
      this.tableList = this.list[key];
      this.role = this.typeList[key].name;
      this.$forceUpdate();
    },
    showDetail(row) {
      this.detail = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    closeInvite() {
      this.showInvite = !1;
    },
    download() {
      window.open(this.code);
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
}
.content {
  display: flex;
  justify-content: space-between;
}
.left {
  width: 24%;
  flex-shrink: 0;
  background-color: #fff;
}
.left-header {
  height: 60px;
  margin-bottom: 10px;
  padding-left: 14px;
  line-height: 60px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.role-list {
  padding: 0 20px;
}
.role-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  cursor: pointer;
}
.role-name {
  color: #6fba2c;
}
.right {
  width: 74%;
  flex-shrink: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #fff;
}
.role-str {
  font-size: 18px;
  font-weight: bold;
}
.invite-btn {
  width: 120px;
  height: 40px;
  line-height: 40px;
  background-color: #2ecc40;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.detail {
  cursor: pointer;
  color: #2ecc40;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 3000;
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background-color: #fff;
  border-radius: 8px;
}
.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.invite-close {
  font-size: 22px;
  cursor: pointer;
}
.invite-body-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
}
.invite-body-tips {
  color: #999;
  text-align: center;
}
.qrcode {
  width: 162px;
  height: 162px;
  margin: 20px auto;
  img,
  canvas {
    width: 100%;
    height: 100%;
  }
}
.download {
  width: 120px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  color: #2ecc40;
  border-radius: 15px;
  border: 1px solid rgba(46, 204, 64, 0.4);
  text-align: center;
  cursor: pointer;
}
</style>
