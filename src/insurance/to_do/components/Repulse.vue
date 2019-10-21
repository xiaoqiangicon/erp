<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card v-show="isRepulse === 1" class="box-card distribute">
        <div slot="header" class="clearfix">
          <span>打回</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="onClickMask"
          >
            ×
          </el-button>
        </div>
        <div class="text item">
          <div class="info">
            <p class="name">姓名：{{ repulseRow.realName }}</p>
            <p class="nickName">法号：{{ repulseRow.name }}</p>
            <p class="temple_name">所在寺院：{{ repulseRow.templeName }}</p>
          </div>
          <div class="reason">
            <el-input
              v-model="textarea"
              type="textarea"
              :rows="4"
              resize="none"
              placeholder="请输入内容"
            />
          </div>
          <el-button type="primary" class="confirm" @click="confirmRepulse">
            确认
          </el-button>
        </div>
      </el-card>
      <div v-show="isRepulse === 2" class="distribute-card">
        <div class="distribute-head">
          <span class="distribute-title">分配</span>
          <span class="close-distribute" @click="onClickMask">×</span>
        </div>
        <div class="distribute-content">
          <p>
            <span>姓名：</span><span>{{ distributeRow.realName }}</span>
          </p>
          <p>
            <span>法号：</span><span>{{ distributeRow.name }}</span>
          </p>
          <p>
            <span>所在寺院：</span><span>{{ distributeRow.templeName }}</span>
          </p>
        </div>
        <div class="insurance-item-select">
          <span>添加至表单</span>
          <el-select
            v-model="insuranceId"
            class="insurance-select"
            clearable
            size="medium"
            filterable
            placeholder="请选择搜索项"
          >
            <el-option
              v-for="item in insuranceIdItem"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </div>
        <div
          class="distribute-confirm"
          :plain="true"
          @click="confirmDistribute"
        >
          确认
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';
import { Message } from 'element-ui';

export default {
  name: 'Repulse',
  components: {},
  props: {
    isRepulse: {
      required: true,
    },
    distributeRow: {},
    repulseRow: {},
  },
  data() {
    return {
      textarea: '',
      insuranceId: '',
      groupNum: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.repulseDialogVisible;
    },
    insuranceIdItem() {
      return this.$store.state.insuranceIdItem;
    },
  },
  created() {
    // this.getInsuranceList();
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateRepulseVisible', state: false });
    },
    confirmRepulse() {
      if (!this.textarea) {
        Message({
          message: '请输入打回原因！',
          type: 'warning',
        });
        return;
      }
      seeAjax(
        'insuranceEditUserInfo',
        { id: this.repulseRow.id, content: this.textarea, status: 2 },
        res => {
          this.onClickMask();
          Message({
            message: '恭喜，修改成功！',
            type: 'success',
          });
        }
      );
    },
    confirmDistribute(row) {
      seeAjax(
        'insuranceAddToGroup',
        { groupId: this.insuranceId, ids: this.distributeRow.id },
        res => {
          this.onClickMask();
          Message({
            message: '恭喜，修改成功！',
            type: 'success',
          });
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}
.clearfix::after {
  clear: both;
}

.el-card {
  width: 480px;
  height: 366px;
}

.distribute {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.confirm {
  margin-top: 20px;
}

// 分配开始
.distribute-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 280px;
  background: white;
  border-radius: 10px;
}
.distribute-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #ccc;
}
.distribute-title {
  font-size: 16px;
  font-weight: bold;
}
.close-distribute {
  font-size: 28px;
  color: #409eff;
  cursor: pointer;
}
.distribute-content {
  width: 80%;
  margin: 20px auto 0;
  padding: 8px 10px;
  background-color: #e6f7ff;
}
.insurance-item-select {
  width: 80%;
  margin: 10px auto 0;
}
.insurance-select {
  width: calc(100% - 74px);
}
.distribute-confirm {
  width: 80px;
  height: 30px;
  margin: 20px auto 0;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
  color: white;
  background-color: #1890ff;
  cursor: pointer;
}
</style>
