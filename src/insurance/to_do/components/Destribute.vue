<template>
  <transition name="slide-fade">
    <div v-show="visible" class="s-mask" @click.self="onClickMask">
      <el-card class="box-card distribute">
        <div slot="header" class="clearfix">
          <span>批量分配</span>
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
            <p>当前勾选的{{ selected.length }}人</p>
          </div>
          <div class="">
            <el-radio v-model="radio" label="1">
              创建新的保单
            </el-radio>
            <el-radio v-model="radio" label="2">
              添加到已分配保单中
            </el-radio>
          </div>
          <el-select
            v-model="nameId"
            style="width: 250px;"
            clearable
            size="medium"
            filterable
            placeholder="保单"
            :disabled="disabled"
          >
            <el-option
              v-for="item in insuranceIdItem"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
          <div>
            <el-button
              type="primary"
              class="confirm"
              @click="distributeConfirm"
            >
              确认
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
import seeAjax from 'see-ajax';

export default {
  name: 'Destribute',
  components: {},
  data() {
    return {
      radio: '1',
      nameId: '2019-09-12',
      disabled: true,
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
    insuranceIdItem() {
      return this.$store.state.insuranceIdItem;
    },
    visible() {
      return this.$store.state.distributeDialogVisible;
    },
  },
  watch: {
    radio() {
      if (this.radio == '1') {
        this.disabled = true;
        this.nameId = `2019-09-12`;
      } else {
        this.disabled = false;
        this.nameId = '';
      }
    },
  },
  methods: {
    onClickMask() {
      this.$store.commit({ type: 'updateDistributeVisible', state: false });
    },
    distributeConfirm() {
      if (!this.selected.length) {
        alert('请选择');
        return;
      }
      const groupId = this.disabled ? 0 : this.nameId;
      const groupNum = this.disabled ? this.nameId : '';
      seeAjax(
        'insuranceAddToGroup',
        { groupId, ids: this.selected.join(','), groupNum },
        res => {
          this.onClickMask();
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

.box-card {
  width: 480px;
}

.distribute {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.el-select {
  margin-top: 20px;
}
.confirm {
  margin-top: 20px;
}
</style>
