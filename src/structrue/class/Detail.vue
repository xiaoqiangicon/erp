<template>
  <transition name="slide-fade">
    <div class="s-mask" v-show="visible" @click.self="onClickMask">
      <div class="s-container">
        <div class="body">
          <div class="cell">
            <div class="cell-title">{{ isModify ? '编辑资料' : '添加' }}</div>
            <div class="cell-content">
              <div class="cell-item">
                <p class="cell-item-title">寺务名称</p>
                <el-input type="text" v-model="name"></el-input>
              </div>
              <div class="cell-item">
                <div class="cell-item-header">
                  <p class="cell-item-title">签到方式</p>
                  <el-select v-model="type" class="select-box">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="cell-item-body" v-if="type === 1">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox
                      v-for="(item, key) in deviceList"
                      :label="item.name"
                      :key="key"
                    ></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="cell-item">
                <p class="cell-item-title">签到时间</p>
                <div>
                  <span>起始时间：</span>
                  <el-time-select
                    class="time-select"
                    placeholder="起始时间"
                    v-model="startTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '21:00',
                    }"
                  >
                  </el-time-select>
                </div>
                <div>
                  <span>结束时间：</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="endTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '21:30',
                      minTime: startTime,
                    }"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="foot">
          <div class="foot-btn">
            <div class="save-btn" @click="save">保存</div>
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
  props: ['detail', 'deviceList'],
  data() {
    return {
      isModify: !1,
      name: '',
      type: '',
      checkList: [],
      typeList: [
        {
          name: '面部识别',
          value: 1,
        },
        {
          name: '扫码签到',
          value: 2,
        },
      ],
      startTime: '',
      endTime: '',
      id: '',
    };
  },
  computed: {
    visible() {
      return this.$store.state.detailDialogVisible;
    },
  },
  watch: {
    detail(newVal) {
      if (newVal.name) {
        this.isModify = !0;
      }
      this.name = newVal.name;
      this.type = newVal.type;
      this.selectDeviceList = newVal.deviceList;
      this.checkList = newVal.deviceStr || [];
      this.startTime = newVal.startTime;
      this.endTime = newVal.endTime;
      this.id = newVal.id || 0;
    },
  },
  methods: {
    onChangeDatePicker() {
      const { date } = this;
      this.formatDate = date.map(item => this.formatTime(`${item}`));
    },
    save() {
      let selectList = [];

      this.checkList.forEach(item => {
        this.deviceList.forEach(deviceItem => {
          if (item === deviceItem.name) {
            selectList.push(deviceItem.id);
          }
        });
      });
      seeAjax(
        'update',
        {
          id: this.id,
          name: this.name,
          type: this.type,
          startTime: this.startTime,
          endTime: this.endTime,
          deviceList: this.type === 1 ? selectList.join(',') : '',
        },
        res => {
          if (res.success) {
            window.location.reload();
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
    padding: 0 20px;
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
.cell-content {
  padding-top: 10px;
}
.cell-item {
  margin-bottom: 20px;
}
.cell-item-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.select-box {
  margin-bottom: 10px;
}
.time-select {
  margin-bottom: 10px;
}
</style>
