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
        <el-select
          style="width: 300px;"
          clearable
          size="medium"
          v-model="printer"
          filterable
          placeholder="请选择或填写关键词搜索"
          @change="changePrinter"
        >
          <el-option
            v-for="item in printerList"
            :disabled="!item.status"
            :key="item.id"
            :label="
              item.address + (item.status ? '在线，工作状态正常。' : '离线')
            "
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-checkbox-group v-model="printer" v-if="!1">
          <div v-for="item in printerList" :key="item.id">
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

      <div class="mg-t-20" v-if="printerType === 0">
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
        <el-radio-group v-model="printQrcode" v-if="printerType === 0">
          <el-radio :label="2" :disabled="printNum === 1"
            ><span class="strong">隔联打印</span></el-radio
          >
          <el-radio :label="1"><span class="strong">全部打印</span></el-radio>
          <el-radio :label="3"><span class="strong">不打印</span></el-radio>
        </el-radio-group>
        <el-radio-group v-model="printQrcode" v-else>
          <el-radio :label="1"><span class="strong">打印</span></el-radio>
          <el-radio :label="2"><span class="strong">不打印</span></el-radio>
        </el-radio-group>
        <p class="mg-t-10" v-if="printerType === 0">
          二维码使用于内部工作流程处理，假如要把小票给客户，请选择“隔联打印”，可以打出无二维码的一联，将该联给客户。
        </p>
        <p class="mg-t-10" v-if="printerType === 1">
          二维码适用于扫码对此订单进行拍照或者拍摄视频，为用户进行反馈。
        </p>
      </div>

      <div class="mg-t-20" v-if="printerType === 1">
        <p class="strong">印章效果</p>
        <p class="mg-t-10">打印牌位时可自动印出印章效果（印章颜色为：黑色）</p>
        <el-radio-group v-model="sealType" style="display: flex">
          <el-radio class="seal-radio" :label="1">
            <div class="seal-radio-wrap">
              <div class="seal1-img">
                <img
                  class="seal1"
                  src="https://pic.zizaihome.com/3bc20e17-64cd-4b4a-a9da-67e490271447.png"
                  alt=""
                />
              </div>
              <span class="strong">不打印</span>
            </div>
          </el-radio>
          <el-radio class="seal-radio" :label="2">
            <div class="seal-radio-wrap">
              <div class="seal2-img">
                <img
                  class="seal2"
                  src="https://pic.zizaihome.com/9c4ac595-24cb-4d4e-9525-f4cc1e96bfc9.png"
                  alt=""
                />
              </div>
              <span class="strong">万字印</span>
            </div>
          </el-radio>
          <el-radio class="seal-radio" :label="3">
            <div class="seal-radio-wrap">
              <div class="seal3-img">
                <img
                  class="seal3"
                  src="https://pic.zizaihome.com/bbf60ebf-06ba-475a-9274-5a982deabe66.png"
                  alt=""
                />
              </div>
              <span class="strong">三宝印</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <div class="mg-t-20" v-if="printerType === 1">
        <p class="strong">打印字体</p>
        <p class="mg-t-10">仅功德芳名、心愿等区域可提供手写特殊字体</p>
        <el-select v-model="fontType" placeholder="请选择字体名称" size="small">
          <el-option
            v-for="item in fontList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value === 1 && printQrcode === 2"
          >
          </el-option>
        </el-select>
        <span>这是一条字体显示的预览内容</span>
      </div>

      <div class="mg-t-20" v-if="printerType === 0">
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
      fontList: [{ value: 0, label: '默认' }],
      printNum: 1,
      printQrcode: 1, // 2 1 3 隔 全 不
      printTel: 1,
      printer: '',
      printerType: 0, // 0 普通打印机 1 排位打印机
      sealType: 1, // 印章类型
      fontType: 0, // 默认字体
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
    changePrinter() {
      let selectPrinter = this.printerList.filter(
        item => item.id == this.printer
      );
      console.log(selectPrinter);
      if (parseInt(selectPrinter[0].type, 10) === 0) {
        this.printerType = 0;
      } else {
        this.printerType = 1;
      }
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
        printer,
        printNum,
        printQrcode,
        printTel,
        printerType,
        fontType,
        sealType,
      } = this;

      let printerIdList = [printer];
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

      let params = {}; // 提交的参数
      if (printerType === 0) {
        params = {
          orderIdList,
          printerIdList,
          printNum,
          printQrcode,
          printTel,
          printerType,
        };
      } else {
        params = {
          orderIdList,
          printerIdList,
          printQrcode,
          printerType,
          fontType,
          sealType,
        };
      }

      seeAjax('print', params, res => {
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
      });
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

.seal-radio {
  display: flex;
  justify-content: center;
  align-items: center;
  .seal-radio-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.seal1-img {
  height: 78px;
  line-height: 78px;
}
.seal1 {
  width: 10px;
}
.seal2-img {
  height: 78px;
  line-height: 78px;
}
.seal2 {
  width: 45px;
}
.seal3-img {
  height: 78px;
  line-height: 78px;
}
.seal3 {
  width: 45px;
}

.el-dialog__header {
  padding: 0 !important;
}
</style>
