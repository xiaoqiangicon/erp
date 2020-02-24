<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="40%"
    top="8vh"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div v-if="hasPrinter" class="content">
      <div>
        <label class="strong mg-b-10">选择打印机：</label>

        <el-checkbox-group v-model="printer">
          <div v-for="item in printerList">
            <el-checkbox :label="item.id" :disabled="!item.status">
              {{ item.address }}
              <span v-if="item.status" class="status"
                >在线，工作状态正常。</span
              >
              <span v-else class="status">离线</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <div class="mg-t-20">
        <label class="strong">打印联数：</label>
        <el-select v-model="printNum" placeholder="请选择">
          <el-option
            v-for="item in printNumArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value === 1 && printQrcode === 2"
          >
          </el-option>
        </el-select>
      </div>

      <div class="mg-t-20">
        <label class="strong">二维码：</label>
        <el-radio-group v-model="printQrcode">
          <el-radio :label="2" :disabled="printNum === 1"
            ><span class="strong">隔联打印</span></el-radio
          >
          <el-radio :label="1"><span class="strong">全部打印</span></el-radio>
          <el-radio :label="3"><span class="strong">不打印</span></el-radio>
        </el-radio-group>
        <p class="mg-t-20">
          二维码使用于内部工作流程处理，假如要把小票给客户，请选择“隔联打印”，可以打出无二维码的一联，将该联给客户。
        </p>
      </div>

      <div class="mg-t-20">
        <label class="strong">电话号码：</label>
        <el-radio-group v-model="printTel">
          <el-radio :label="1"><span class="strong">打印</span></el-radio>
          <el-radio :label="0"><span class="strong">不打印</span></el-radio>
        </el-radio-group>
        <p class="mg-t-20">
          如果不希望透露功德主的联系方式，可以选择不打印电话号码。
        </p>
      </div>

      <div class="mg-t-20 text-center">
        <el-button type="success" @click="onClickPrint" size="medium"
          >立即打印</el-button
        >
      </div>
    </div>

    <div v-else class="content">
      <div class="qrcode-container">
        <img
          class="qrcode"
          src="../../../images/buddhist/rechargeMsg.jpg"
          alt=""
        />
      </div>
      <div class="text">
        <p>步骤1：扫描左侧二维码选购小票打印机。</p>
        <p>步骤2：联系自在家平台管理员开通功能。</p>
        <p>步骤3：收到小票打印机，按照指示设置。</p>
        <p>然后就可以实现订单自动打印啦！</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';

export default {
  name: 'Printer',
  props: {},
  data() {
    return {
      hasPrinter: true,
      printerList: [],

      printNumArr: [
        { value: 1, label: '1联' },
        { value: 2, label: '2联' },
        { value: 3, label: '3联' },
        { value: 4, label: '4联' },
        { value: 5, label: '5联' },
      ],
      printNum: 1,
      printQrcode: 1, // 2 1 3 隔 全 不
      printTel: 1,
      printer: [],
    };
  },
  computed: {
    dialogTitle() {
      return this.hasPrinter ? '小票打印' : '小票打印机';
    },
    selected() {
      return this.$store.state.selected;
    },
    visible() {
      return this.$store.state.printerDialogVisible;
    },
  },
  created() {
    this.getPrinterList();
  },

  methods: {
    getPrinterList() {
      seeAjax('getPrinterList', {}, res => {
        if (res.success) {
          this.hasPrinter = true;

          const printerList = res.data;
          const length = printerList.length;
          let count = 0;

          res.data.forEach(item => {
            seeAjax('getPrinterStatus', { printerId: item.id }, res => {
              if (res.msg === '离线。') {
                item.status = 0;
              } else {
                item.status = 1;
              }
              // item.status = res.success;
              count += 1;
              if (count === length) {
                this.printerList = printerList;
              }
            });
          });
        } else {
          this.hasPrinter = false;
          Notification({
            title: '提示',
            message: '您还没有添加打印机',
          });
        }
      });
    },
    handleClose() {
      this.$store.commit({
        type: 'updatePrinterVisible',
        state: false,
      });
    },
    onClickPrint() {
      const {
        selected: orderIdList,
        printer: printerIdList,
        printNum,
        printQrcode,
        printTel,
      } = this;

      if (!orderIdList.length) {
        Notification({
          title: '提示',
          message: '请选择订单',
          type: 'warning',
        });
        return;
      }

      if (!printerIdList.length) {
        Notification({
          title: '提示',
          message: '请选择打印机',
          type: 'warning',
        });
        return;
      }

      seeAjax(
        'print',
        {
          orderIdList,
          printerIdList,
          printNum,
          printQrcode,
          printTel,
        },
        res => {
          if (res.success) {
            Notification({
              title: '提示',
              message: `正在打印 ${orderIdList.length} 笔订单，请稍候...`,
            });

            this.handleClose();
          } else {
            Notification({
              title: '提示',
              message: '网络出错！',
              type: 'error',
            });
          }
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  overflow: hidden;
}

.strong {
  font-weight: bold;
  color: #333;
}

.status {
  margin-left: 20px;
  font-size: 14px;
  color: #f90;
}

.qrcode-container {
  float: left;
  position: relative;
  width: 30%;
  height: 0;
  padding-top: 30%;
}

.qrcode {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.text {
  float: left;
  margin-left: 20px;
}

.el-dialog__header {
  padding: 0 !important;
}
</style>
