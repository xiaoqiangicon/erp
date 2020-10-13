<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div class="s-container">
        <div class="body">
          <div class="cell">
            <div class="cell-title">{{ isModify ? '编辑资料' : '详情' }}</div>
            <div class="cell-body">
              <div class="row mg-b-20">
                <p class="row-title">姓名</p>
                <p v-if="!isModify" class="row-value">{{ detail.name }}</p>
                <input class="input-text" v-else type="text" v-model="name" />
              </div>
              <div class="row mg-b-20">
                <p class="row-title">性别</p>
                <el-select v-if="isModify" v-model="sex">
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <p class="row-value" v-else>{{ detail.sexStr }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">角色</p>
                <el-select v-if="isModify" v-model="type">
                  <el-option
                    v-for="item in roleList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <p class="row-value" v-else>{{ detail.typeStr }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">手机号码</p>
                <input
                  class="input-text"
                  v-if="isModify"
                  type="number"
                  v-model="mobile"
                />
                <p class="row-value" v-else>{{ detail.mobile }}</p>
              </div>
              <div class="row mg-b-20">
                <p class="row-title">备注</p>
                <el-input
                  v-if="isModify"
                  :resize="'none'"
                  :rows="4"
                  type="textarea"
                  v-model="memo"
                ></el-input>
                <p class="row-value" v-else>{{ detail.memo }}</p>
              </div>
              <div class="row">
                <p class="row-title">面部照片</p>
                <img class="avatar" :src="headImg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <div class="foot-btn" v-if="!isModify">
            <div class="edit-btn" @click="isModify = !0">编辑资料</div>
            <div class="del-btn" @click="showDel = !0">删除</div>
          </div>
          <div class="foot-btn" v-else>
            <div class="save-btn" @click="save">保存</div>
          </div>
        </div>
      </div>
      <div class="del-container" v-if="showDel">
        <div class="del-content">
          <div class="del-header">
            <p class="del-title">删除确认</p>
            <span class="close-del">×</span>
          </div>
          <div class="del-body">
            <div class="del-manager">
              <img class="del-avatar" :src="headImg" alt="" />
              <div class="del-info">
                <p class="del-name">{{ name }}</p>
                <p class="del-type">{{ detail.typeStr }}</p>
              </div>
            </div>
            <p class="del-tips">删除后当前人员将不可删除，用于人员离开等用途</p>
          </div>
          <div class="del-foot">
            <div class="del-confirm" @click="del">确认</div>
            <div class="del-cancel" @click="showDel = !1">取消</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';

export default {
  name: 'Detail',
  props: ['detail', 'roleList'],
  data() {
    return {
      showDel: !1,
      isModify: !1,
      sexList: [{ name: '男', value: 1 }, { name: '女', value: 2 }],
      name: '',
      sex: 0,
      type: 0,
      mobile: '',
      memo: '',
      headImg: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },
  watch: {
    detail(newVal) {
      this.name = newVal.name;
      this.sex = newVal.sex;
      this.type = newVal.type;
      this.mobile = newVal.mobile;
      this.memo = newVal.memo;
      this.headImg = newVal.headImg;
    },
  },
  methods: {
    save() {
      seeAjax(
        'update',
        {
          name: this.name,
          sex: this.sex,
          type: this.type,
          mobile: this.mobile,
          memo: this.memo,
          headImg: this.headImg,
        },
        res => {
          if (res.success) {
            window.location.reload();
          }
        }
      );
    },
    del() {
      seeAjax('del', { id: this.detail.id }, res => {
        if (res.success) {
          window.location.reload();
        }
      });
    },
    onClickMask() {
      this.$store.commit({ type: 'updateDetailVisible', state: false });
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
.del-container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3002;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.del-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 220px;
  background-color: #fff;
  border-radius: 8px;
}
.del-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}
.close-del {
  font-size: 22px;
  font-weight: bold;
}
.del-manager {
  display: flex;
  padding: 10px 30px;
  margin: 20px 30px 0;
  background-color: rgba(113, 186, 49, 0.11);
  border-radius: 8px;
}
.del-avatar {
  width: 40px;
  height: 40px;
  margin-right: 20px;
  border-radius: 50%;
}
.del-tips {
  margin-top: 10px;
  padding-left: 30px;
  color: #999;
}
.del-foot {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.del-confirm {
  width: 100px;
  height: 30px;
  margin-right: 20px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  background-color: #71ba31;
  border-radius: 4px;
  cursor: pointer;
}
.del-cancel {
  width: 100px;
  height: 30px;
  margin-right: 20px;
  line-height: 30px;
  text-align: center;
  color: #71ba31;
  border: 1px solid #71ba31;
  border-radius: 4px;
  cursor: pointer;
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
  .body {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 80px;
    width: 100%;
    overflow-y: auto;
    .cell-title {
      height: 50px;
      margin-bottom: 10px;
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
  }
  .foot {
    position: absolute;
    width: 100%;
    height: 82px;
    bottom: 0;
    right: 0;
    background-color: #fff;
    padding: 16px 0;
    border-top: 2px solid #d8d8d8;
    text-align: center;
    z-index: 999;
    .foot-btn {
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
    }
    .edit-btn {
      width: 180px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      background-color: #71ba31;
      text-align: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    .del-btn {
      width: 160px;
      height: 48px;
      line-height: 48px;
      border-radius: 24px;
      background-color: rgba(255, 153, 51, 0.11);
      text-align: center;
      color: rgba(255, 153, 0, 1);
      border: 1px solid rgba(255, 153, 0, 1);
      font-size: 18px;
      cursor: pointer;
    }
    .save-btn {
      width: 233px;
      height: 48px;
      margin: 0 auto;
      line-height: 48px;
      border-radius: 24px;
      background-color: #71ba31;
      text-align: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
.row {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.row-title {
  flex-shrink: 0;
  width: 70px;
  margin-right: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: right;
}
.input-text {
  width: 217px;
  height: 40px;
  padding: 0 15px;
  background-color: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
}
.row-value {
  font-size: 16px;
  font-weight: bold;
}
.avatar {
  width: 100px;
}
</style>
