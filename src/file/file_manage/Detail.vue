<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div class="s-container">
        <div class="body">
          <div class="cell">
            <div class="cell-title">文件共享人</div>
            <div class="cell-body">
              <el-select
                v-model="userId"
                class="selector"
                placeholder="搜索姓名添加共享"
                @change="onChangeList"
                filterable
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
              <div class="shared-box">
                <p class="shared-title">已共享</p>
                <div class="shared-list">
                  <div
                    class="shared-item"
                    v-for="(item, key) in shareList"
                    :key="key"
                  >
                    <div class="shared-item-left">
                      <img class="shared-avatar" :src="item.headImg" alt="" />
                      <div class="shared-item-info">
                        <p class="shared-item-name">{{ item.name }}</p>
                        <p class="shared-item-type">{{ item.typeStr }}</p>
                      </div>
                    </div>
                    <div class="shared-item-right" @click="share(item)">
                      移除
                    </div>
                  </div>
                </div>
              </div>
              <div class="manager-box">
                <p class="manager-title">未共享</p>
                <div class="manager-list">
                  <div
                    class="shared-item"
                    v-for="item in managerList"
                    :key="item.id"
                  >
                    <div class="shared-item-left">
                      <img class="shared-avatar" :src="item.headImg" alt="" />
                      <div class="shared-item-info">
                        <p class="shared-item-name">{{ item.name }}</p>
                        <p class="shared-item-type">{{ item.typeStr }}</p>
                      </div>
                    </div>
                    <div
                      class="shared-item-right manager-item-right"
                      @click="share(item)"
                    >
                      共享
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';
import { MessageBox, Notification } from 'element-ui';

export default {
  name: 'Detail',
  props: ['detail', 'userList'],
  data() {
    return {
      userId: '',
      shareList: [],
      managerList: [],
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.onChangeList();
      }
    },
  },
  methods: {
    onChangeList() {
      seeAjax(
        'getShareList',
        { fileId: this.detail.id, managerId: this.userId },
        res => {
          if (res.success) {
            this.shareList = res.data.shareList;
            this.managerList = res.data.managerList;
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
              type: 'error',
            });
            return;
          }
        }
      );
    },
    share(item) {
      seeAjax(
        'share',
        { fileId: item.fileId, managerId: item.managerId },
        res => {
          if (res.success) {
            this.onChangeList();
            Notification({
              title: '提示',
              message: '操作成功',
              type: 'success',
            });
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
              type: 'error',
            });
            return;
          }
        }
      );
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
.shared-box {
  margin: 30px 0;
}
.shared-title,
.manager-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.shared-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.shared-item-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.shared-avatar {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50%;
}
.shared-item-name {
  margin-bottom: 4px;
  font-size: 16px;
  color: #333;
}
.shared-item-type {
  font-size: 12px;
  color: #999;
}
.shared-item-right {
  padding: 2px 10px;
  border-radius: 16px;
  border: 1px solid #f60;
  color: #f60;
  cursor: pointer;
}
.manager-item-right {
  border: 1px solid #71ba31;
  color: #71ba31;
}
</style>
