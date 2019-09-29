<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card reply">
        <div slot="header" class="clearfix">
          <span v-if="replyContent">回复评价</span>
          <span v-else>修改评价</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="content">
          <div class="text-form">
            <textarea
              placeholder="请认真的回复评价内容，解答用户遇到的问题"
              class="text-input"
              v-model="newContent"
            ></textarea>
            <div class="text-length">
              <span>{{ newContent.length }}</span
              ><span>/300</span>
            </div>
          </div>
          <div class="tips">
            <i class="el-icon-info"></i>
            <p>
              回复评价的内容会通知用户并公开，请勿泄漏本单位或评价人的隐私以及关键信息。
            </p>
          </div>
          <div class="modify">
            <span class="btn" v-if="replyContent" @click="confirmReply"
              >确认修改</span
            >
            <span class="btn" v-else @click="confirmReply">发表回复</span>
          </div>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';
import { Message } from 'element-ui';

export default {
  name: 'Reply',
  props: {
    replyContent: { required: true },
    replyId: { required: true },
  },
  data() {
    return {
      newContent: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.replyDialogVisible;
    },
  },
  watch: {
    replyContent() {
      this.newContent = this.replyContent;
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateReplyVisible', state: false });
    },
    confirmReply() {
      if (this.newContent == '') {
        Message({
          message: '请输入内容',
          type: 'warning',
        });
        return;
      }
      if (this.newContent == this.replyContent) {
        Message({
          message: '未修改',
          type: 'warning',
        });
        return;
      }

      seeAjax(
        'replyEvaluation',
        { content: this.newContent, id: parseInt(this.replyId, 10) },
        res => {
          if (!res.success) return;

          Message({
            message: '操作成功',
            type: 'success',
          });
          this.newContent = '';
          this.$store.commit({ type: 'updateReplyVisible', state: false });
          window.location.reload();
        }
      );
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

.reply {
  width: 520px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.text-form {
  position: relative;
  width: 100%;
}
.text-input {
  width: 100%;
  height: 200px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(128, 128, 128, 0.4);
  resize: none;
  outline: none;
  color: #b1b1b1;
  font-size: 16px;
}
.text-length {
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: #b1b1b1;
  font-size: 16px;
}

.tips {
  display: flex;
  padding: 4px 8px;
  margin-top: 10px;
  border: 1px solid rgba(74, 144, 226, 1);
  border-radius: 4px;
  background: rgba(74, 144, 226, 0.11);
  .el-icon-info {
    display: inline-block;
    margin-top: 4px;
    color: #1890ff;
  }
  p {
    margin: 0;
    margin-left: 10px;
    font-size: 14px;
  }
}

.modify {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  .btn {
    width: 162px;
    text-align: center;
    line-height: 46px;
    border-radius: 31px;
    font-size: 20px;
    background-color: #386ad1;
    color: white;
    padding: 0;
  }
}
</style>
