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
          <div class="header-right">
            <div class="invite-btn" @click="set">邀请设置</div>
            <div class="invite-btn" @click="invite">邀请人员</div>
          </div>
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
    <div class="mask" v-if="showSet">
      <div class="mask-content set-content">
        <div class="invite-header set-header">
          <p class="invite-title">寺院设置</p>
          <span class="invite-close" @click="closeSet">×</span>
        </div>
        <div class="invite-body set-body">
          <div class="invite-text-set">
            <p class="title">小程序欢迎语</p>
            <div>
              <input class="input-text" type="text" v-model="inviteText" />
              <span class="input-tips">{{ inviteText.length }}/25</span>
            </div>
            <p class="tips">邀请用户加入自在云管家小程序的欢迎语，最多25个字</p>
          </div>
          <div class="invite-img-set">
            <p class="title">小程序封面图</p>
            <div class="upload">
              <Upload
                v-if="!covers.length"
                :images="covers"
                :multiple="false"
              />
              <div v-else class="upload-cover">
                <img :src="covers[0]" class="covers" />
                <span class="remove" @click="remove">×</span>
              </div>
            </div>
            <p class="tips">
              邀请用户加入自在云管家小程序的寺院封面，图片宽高比例375*184最佳(注意不要上传黑色背景图)
            </p>
          </div>
          <div class="save" @click="save">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import Detail from './Detail';
import Upload from '../../com/upload/Upload';
import { Notification } from 'element-ui';

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
      code: '', // 二维码图片

      covers: [],
      inviteText: '',
      showSet: !1,
    };
  },
  components: {
    Detail,
    Upload,
  },
  created() {
    this.templeId = window.localStorage['templeId'];
    this.fetchTypeList();
  },
  watch: {
    inviteText(newVal) {
      if (newVal.length >= 25) {
        this.inviteText = newVal.slice(0, 25);
      }
    },
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
    fetchInfo() {
      seeAjax('info', {}, res => {
        if (res.success) {
          this.inviteText = res.data.managerInviteTitle;
          this.covers = [res.data.managerInviteCover];
          this.showSet = !0;
        } else {
          Notification({
            title: '提示',
            message: '接口出错了哦~',
            type: 'error',
          });
        }
      });
    },
    set() {
      this.fetchInfo();
    },
    remove() {
      this.covers = [];
    },
    save() {
      if (!this.covers.length || !this.inviteText) {
        Notification({
          title: '提示',
          message: '请填写必要数据',
          type: 'error',
        });
        return;
      }

      seeAjax(
        'save',
        { cover: this.covers[0], title: this.inviteText },
        res => {
          if (res.success) {
            this.showSet = !1;
            Notification({
              title: '提示',
              message: '保存成功',
              type: 'success',
            });
          } else {
            Notification({
              title: '提示',
              message: '保存失败',
              type: 'error',
            });
          }
        }
      );
    },
    invite() {
      this.showInvite = !0;
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
    closeSet() {
      this.showSet = !1;
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
.header-right {
  display: flex;
}
.invite-btn {
  width: 120px;
  height: 40px;
  margin-right: 20px;
  line-height: 40px;
  background-color: #2ecc40;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  &:nth-of-type(2) {
    margin-right: 0;
  }
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
  z-index: 999;
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

.set-content {
  height: 430px;
}
.set-header {
  padding: 10px 30px 10px;
}
.set-body {
  padding: 20px 0 0 30px;
}
.invite-text-set {
  margin-bottom: 20px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}
.input-text {
  width: 400px;
  height: 40px;
  padding-left: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}
.input-tips {
  margin-left: 10px;
}
.tips {
  margin-top: 5px;
  color: #999;
  max-width: 450px;
}
.upload-cover {
  position: relative;
  width: 188px;
  height: 92px;
}
.remove {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #fff;
  background-color: red;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
}
.covers {
  width: 188px;
  height: 92px;
}
.remove {
  width: 20px;
  height: 20px;
}
.save {
  width: 120px;
  height: 40px;
  margin: 20px auto 0;
  background-color: #6fba2c;
  color: #fff;
  border-radius: 6px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  cursor: pointer;
}
</style>
