<template>
  <div class="contain">
    <div class="navigateBar">
      <span class="icon smallHouse"></span><span>微义工</span>
      <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
      <span
        ><a style="color:rgb(111, 186, 44);" href="/zzhadmin/volunteerRecruit/"
          >招募管理</a
        ></span
      >
      <span
        class="glyphicon glyphicon-menu-right green "
        aria-hidden="true"
      ></span>
      <span class="green" data-id="titleName">新建招募</span>
    </div>
    <p class="title">设置基本信息</p>
    <hr />
    <div class="form">
      <div class="form-group">
        <span>招募标题：</span>
        <input class="form-input" v-model="title" type="text" />
      </div>
      <div class="form-group">
        <span>招募简介：</span>
        <input class="form-input" v-model="introduction" type="text" />
      </div>
      <div class="form-group form-group-edit">
        <span>招募说明：</span>
        <div id="recruit-edit-editor" class="edit-editor" />
      </div>
      <div class="form-group form-group-edit">
        <span>登记后说明：</span>
        <div id="register-edit-editor" class="edit-editor" />
      </div>
      <div class="form-group">
        <span>管理员：</span>
        <div class="administor">
          <img
            src="https://pic.zizaihome.com/1feb79b8-2601-11ea-9bec-00163e060b31.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="save" @click="save">保存</div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import * as env from '../../util/env';

let recruitEditor;
let registerEditor;
export default {
  name: 'App',
  data() {
    return {
      title: '',
      introduction: '',
    };
  },
  mounted() {
    // mounted 执行时 dom 并没有渲染完成
    this.$nextTick(() => {
      // 初始化 ueditor
      recruitEditor = window.UE.getEditor('recruit-edit-editor');
      recruitEditor.ready(() => {
        recruitEditor.setContent('');
      });

      registerEditor = window.UE.getEditor('register-edit-editor');
      registerEditor.ready(() => {
        registerEditor.setContent('');
      });
    });
  },
  methods: {
    save() {
      const recruitInfo = recruitEditor.getContent();
      const registerInfo = registerEditor.getContent();
      console.log(recruitInfo, registerInfo);
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
.form-group {
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

.save {
  width: 100px;
  height: 40px;
  margin: 0 auto;
  background-color: #6699ff;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
  color: white;
}
</style>
