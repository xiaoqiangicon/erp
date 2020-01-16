<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card v-show="type === 0" class="box-card batch">
        <div slot="header" class="clearfix">
          <span>设为生效</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="text item">
          <div class="">
            <p class="info">
              1. 下载当前保单表格并设置；
            </p>
            <el-button type="primary" class="download" @click="download">
              下载Excel表格
            </el-button>
            <p class="info">
              2. 填写已下载表格中的：承保标示和承保方案；
            </p>
            <p class="info">
              3. 上传填写好的表格，保存后会批量同步信息到系统中。
            </p>
            <div ref="upload" type="primary" class="upload">
              上传Excel表格
            </div>
          </div>
          <div class="operate">
            <el-button type="primary" class="cancel" @click="onClickMask">
              取消
            </el-button>
            <el-button type="primary" class="set-valid" @click="setValid">
              保存
            </el-button>
          </div>
        </div>
      </el-card>
      <div v-show="type === 1" class="valid-success valid-status-box">
        <div class="valid-info success-info">
          <img
            class="valid-status-img"
            src="https://pic.zizaihome.com/66cf50f4-cef7-11e9-8c8c-00163e0c001e.png"
            alt=""
          />
          <p class="valid-status-info">
            保存成功
          </p>
          <p class="valid-status-tips">
            当前保单变更为 "生效中" 的状态
          </p>
        </div>
        <div class="confirm-valid" @click="onClickMask">
          我知道了
        </div>
      </div>
      <div v-show="type === 2" class="valid-failed valid-status-box">
        <div class="valid-info failed-info">
          <img
            class="valid-status-img"
            src="https://pic.zizaihome.com/65c60ad6-cef7-11e9-a166-00163e0c001e.png"
            alt=""
          />
          <p class="valid-status-info">
            保存失败
          </p>
          <p>请核对并修改以下信息后，再重新提交</p>
          <div class="failed-tips">
            <p>表格中用户的"自在家号"与系统不一致，请核查</p>
            <p>“不通过的原因”的填写项不能为空，请核查</p>
          </div>
        </div>
        <div class="upload-btn">
          <div class="upload-btn-1 upload-cancel" @click="onClickMask">
            取消
          </div>
          <div class="upload-btn-1 reupload">
            重新上传
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';
import { Message } from 'element-ui';
import uploadCom from '../../../../pro-com/src/upload';
import { makeUploadFileOptions } from '../../../configs/upload';

export default {
  name: 'Batch',
  components: {},
  data() {
    return {
      type: 0, // 0时操作页，1保存成功， 2 保存失败
      file: '', // 上传的文件
    };
  },
  computed: {
    visible() {
      return this.$store.state.setBatchDialogVisible;
    },
    insuranceIdItem() {
      return this.$store.state.selected;
    },
  },
  mounted() {
    uploadCom(
      makeUploadFileOptions({
        el: this.$refs.upload,
        done: (url, e, data) => {},
      })
    );
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateBatchVisible', state: false });
      this.type = 0;
    },
    download() {
      if (!this.insuranceIdItem.length) {
        Message({
          message: '请选择保单',
          type: 'warning',
        });
        return;
      }
      seeAjax(
        'insuranceGetList',
        { ids: this.insuranceIdItem.join(',') },
        res => {}
      );
    },
    setValid() {
      if (!this.file) {
        Message({
          message: '请上传文件',
          type: 'warning',
        });
        return;
      }
      seeAjax('insuranceUploadList', { myfile: this.file }, res => {
        if (res.success) this.type = 1;
        else this.type = 2;
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
  transform: translateY(-20px);
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

.text {
  font-size: 14px;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}
.clearfix::after {
  clear: both;
}

.box-card {
  width: 480px;
}
.upload {
  position: relative;
  width: 132px;
  height: 40px;
  color: white;
  text-align: center;
  line-height: 40px;
  background-color: #409eff;
  border-radius: 4px;
}
.batch {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.confirm {
  margin-top: 20px;
}

.operate {
  margin-top: 10px;
  text-align: center;
}

// 邀请成功，失败
.valid-status-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 320px;
  border-radius: 20px;
  background: white;
}
.valid-info {
  padding-top: 60px;
  margin: 0 auto;
  text-align: center;
  .valid-status-img {
    width: 50px;
    margin: 0 auto 16px;
  }
}
.valid-status-info {
  width: 70px;
  text-align: center;
  font-size: 16px;
  color: #272727;
  margin: 0 auto 10px;
}
.valid-status-tips {
  color: #8d8d8d;
}
.confirm-valid {
  width: 100px;
  margin: 40px auto 0;
  border-radius: 8px;
  line-height: 30px;
  text-align: center;
  color: white;
  cursor: pointer;
  background: #1890ff;
}

// 失败框
.upload-btn {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.upload-btn-1 {
  width: 60px;
  line-height: 30px;
}
.upload-cancel {
  border: 1px solid #ccc;
  color: black;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
}
.reupload {
  width: 80px;
  margin-left: 16px;
  text-align: center;
  border-radius: 6px;
  color: white;
  background: #1890ff;
  cursor: pointer;
}
</style>
