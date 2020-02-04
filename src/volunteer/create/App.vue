<template>
  <div class="contain">
    <div>
      <div class="navigateBar">
        <span class="icon smallHouse"></span><span>微义工</span>
        <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
        <span
          ><a
            style="color:rgb(111, 186, 44);"
            href="/zzhadmin/volunteerRecruit/"
            >招募管理</a
          ></span
        >
        <span
          class="glyphicon glyphicon-menu-right green "
          aria-hidden="true"
        ></span>
        <span v-if="isCreate" class="green" data-id="titleName">新建招募</span>
        <span v-else class="green" data-id="titleName">编辑招募信息</span>
      </div>
      <p class="title">设置基本信息</p>
      <hr />
      <div class="form">
        <div class="form-group">
          <span>招募标题：</span>
          <input class="form-input" v-model="title" type="text" />
        </div>
        <div class="form-group" style="width: 80%">
          <span>分享图片：</span>
          <div class="activity-img-box">
            <div
              class="activity-img"
              v-for="(value, key) in activityImg"
              :key="key"
            >
              <img :src="value" width="80" alt="" />
              <div @click="removeImg(key)" class="activity-img-mask">
                <span>×</span>
              </div>
            </div>
            <div class="activity-img" v-if="activityImg.length < 1">
              <img
                @click="upload"
                width="80"
                src="https://pic.zizaihome.com/0f919be8-308e-11e8-b78b-00163e0c001e.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div v-if="!1" class="form-group">
          <span>招募简介：</span>
          <input class="form-input" v-model="introduction" type="text" />
        </div>
        <div class="form-group form-group-edit">
          <span>招募说明：</span>
          <div id="recruit-edit-editor" class="edit-editor" />
        </div>
        <div class="form-group form-group-edit">
          <span>登记须知说明：</span>
          <div id="register-edit-editor" class="edit-editor" />
        </div>
        <div class="form-group" v-if="!1">
          <span>管理员：</span>
          <div class="administor" @click="addUser">
            <img
              class="avatar"
              src="https://pic.zizaihome.com/1feb79b8-2601-11ea-9bec-00163e060b31.png"
              alt=""
            />
            <p class="nickname">添加</p>
          </div>
        </div>
      </div>
      <div class="save" @click="save">保存</div>
    </div>
    <AddUser v-if="!1" :selectManage="selectManage" />
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import * as env from '../../util/env';
// import StoreImage from '../../../pro-com/src/store-image';
import StoreImage from '../../com-deprecated/store-image';
import AddUser from './Adduser';
import ChooseImage from '../../com-deprecated/choose-image';
import { Notification } from 'element-ui';
import { urlParams } from '../../../pro-com/src/utils';
import * as zzhHandling from '../../../pro-com/src/handling';

let recruitEditor;
let registerEditor;
export default {
  name: 'App',
  data() {
    return {
      isCreate: !0,
      id: 0,
      title: '', // 招募标题
      introduction: '', // 招募简介
      activityImg: [], // 活动图片
      selectManage: [
        {
          name: 'lee1',
          headImg:
            'https://pic.zizaihome.com/3197fbf3dde91c2f7fded2b1534b2ffe.jpg',
          isSelected: !0,
        },
        {
          name: 'lee1',
          headImg:
            'https://pic.zizaihome.com/3197fbf3dde91c2f7fded2b1534b2ffe.jpg',
          isSelected: !1,
        },
        {
          name: 'lee1',
          headImg:
            'https://pic.zizaihome.com/3197fbf3dde91c2f7fded2b1534b2ffe.jpg',
          isSelected: !0,
        },
        {
          name: 'lee1',
          headImg:
            'https://pic.zizaihome.com/3197fbf3dde91c2f7fded2b1534b2ffe.jpg',
          isSelected: !0,
        },
      ], // 已选择的管理员
      manageList: [], // 历史设置过的管理员
      activity_details: '', // 活动详情
      join_succ_details: '', // 参与成功后的详情
    };
  },
  components: {
    AddUser,
  },
  created() {
    // 初始化图片上传
    this.chooseImage = new ChooseImage({
      multiUpload: false,
      multiSelect: false,
      onSubmit: items => {
        let images = [...this.activityImg];
        items.map(({ src }) => {
          images.push(src);
        });

        this.activityImg = images;
      },
    });
    if (urlParams.id) {
      this.id = urlParams.id;
      this.isCreate = !1;
      document.title = '编辑招募信息';
      seeAjax('getTempleActivity', { id: urlParams.id }, res => {
        this.title = res.data.name;
        this.activityImg = [res.data.activity_img];
        this.activity_details = res.data.activity_details;
        this.join_succ_details = res.data.join_succ_details;

        // mounted 执行时 dom 并没有渲染完成
        this.$nextTick(() => {
          // 初始化 ueditor
          recruitEditor = window.UE.getEditor('recruit-edit-editor');
          recruitEditor.ready(() => {
            recruitEditor.setContent(this.activity_details);
          });

          registerEditor = window.UE.getEditor('register-edit-editor');
          registerEditor.ready(() => {
            registerEditor.setContent(this.join_succ_details);
          });
        });
      });
    } else {
      recruitEditor = window.UE.getEditor('recruit-edit-editor');
      recruitEditor.ready(() => {
        recruitEditor.setContent('');
      });

      registerEditor = window.UE.getEditor('register-edit-editor');
      registerEditor.ready(() => {
        registerEditor.setContent('');
      });
    }
  },
  mounted() {},
  methods: {
    addUser() {
      this.$store.state.showSelectManage = !0;
    },
    upload() {
      this.chooseImage.show();
    },
    removeImg(key) {
      this.activityImg.splice(key, 1);
    },
    save() {
      const recruitInfo = recruitEditor.getContent(); // 招募信息
      const registerInfo = registerEditor.getContent(); // 注册信息

      zzhHandling.show();
      new StoreImage(
        recruitInfo,
        newDetail => {
          new StoreImage(
            registerInfo,
            newDesc => {
              seeAjax(
                'save',
                {
                  id: this.id,
                  name: this.title,
                  activityImg: this.activityImg[0],
                  activityDetails: newDetail,
                  joinSuccDetails: newDesc,
                },
                res => {
                  if (res.success) {
                    Notification({
                      title: '提示',
                      message: '添加成功！',
                      type: 'success',
                    });
                    window.location.href = '/zzhadmin/volunteerRecruit';
                  }
                }
              );
            },
            function(uploaded, total) {
              zzhHandling.setText('上传 ' + uploaded + '/' + total);
            }
          );
        },
        function(uploaded, total) {
          zzhHandling.setText('上传 ' + uploaded + '/' + total);
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding-bottom: 40px;
}
.navigateBar {
  padding: 10px 20px;
}
.title {
  padding: 20px 0 0 20px;
  font-size: 16px;
}
.form-group {
  display: flex;
  margin-top: 20px;
  margin-bottom: 15px;
  span {
    display: inline-block;
    width: 100px;
    margin-right: 10px;
    text-align: right;
  }
}
.form-group-edit {
  display: flex;
}
.form-input {
  width: 60%;
  height: 30px;
  margin: 0;
  padding-left: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.edit-editor {
  width: 80%;
}

.administor {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.activity-img-box {
  display: flex;
}

.activity-img {
  position: relative;
  margin-right: 14px;
}

.activity-img:hover {
  .activity-img-mask {
    display: block;
  }
}

.activity-img-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 32px;
  line-height: 100%;
  color: white;
  cursor: pointer;
  display: none;
  span {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}

.avatar {
  width: 50px;
}

.nickname {
  margin-top: 4px;
  margin-bottom: 0;
}

.save {
  width: 100px;
  height: 40px;
  margin: 0 auto;
  background-color: #6699ff;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
</style>
