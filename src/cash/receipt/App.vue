<template>
  <div class="contain">
    <div class="header">
      <div class="header-left">
        <p class="header-title">开票说明</p>
        <p class="header-tips">1、企业可申请增值税普通发票（电子）</p>
        <p class="header-tips">2、开票内容：信息技术服务费</p>
        <p class="header-tips">
          3、提交申请后，工作人员将在7个工作日内为您处理
        </p>
        <p class="header-tips">
          4、申请过程中请注意保证信息的正确性，因为信息填写错误导致的发票开具、将不能重开
        </p>
      </div>
      <div class="line"></div>
      <div class="hearder-right">
        <el-button type="primary" @click="applyReceipt">申请开票</el-button>
      </div>
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="addTime" label="申请时间" :align="'cente'" />
      <el-table-column label="抬头类型" :align="'center'">
        <template slot-scope="scope" :align="'center'">
          <div>
            企业
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" :align="'center'">
        <template slot-scope="scope" :align="'center'">
          <div>
            增值税普通发票（电子）
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="发票金额（元）" :align="'center'" />
      <el-table-column
        prop="invoiceCompany"
        label="发票抬头"
        :align="'center'"
      />
      <el-table-column prop="statusText" label="发票状态" :align="'center'">
        <template slot-scope="scope">
          <div
            :class="{
              status0: scope.row.status === 0,
              status1: scope.row.status === 1,
            }"
          >
            {{ scope.row.status === 0 ? '已开发票' : '' }}
          </div>
          <div
            :class="{
              status0: scope.row.status === 0,
              status1: scope.row.status === 1,
            }"
          >
            {{ scope.row.status === 1 ? '待开发票' : '' }}
          </div>
          <div
            :class="{
              status0: scope.row.status === 0,
              status1: scope.row.status === 1,
            }"
          >
            {{ scope.row.status === 2 ? '已取消' : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" :align="'center'">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-tooltip
              content="若浏览器直接打开预览了发票文件，在右上角点击“保存”或“下载”"
              placement="top"
              effect="dark"
            >
              <el-button
                type="primary"
                @click="download(scope)"
                v-if="scope.row.status === 0"
                >下载发票</el-button
              >
            </el-tooltip>
            <el-button
              type="primary"
              @click="detail(scope)"
              v-if="scope.row.status === 1"
              >详情</el-button
            >
            <el-button
              type="danger"
              @click="cancel(scope)"
              v-if="scope.row.status === 1"
              >取消申请</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="pageNum"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      @current-change="pageChange"
    />
    <el-dialog title="详情" :visible.sync="showDetail">
      <p>
        <span>开户银行：</span>
        <span>{{ item.bankName }}</span>
      </p>
      <p>
        <span>开户账号：</span>
        <span>{{ item.bankNo }}</span>
      </p>
      <p>
        <span>发票金额：</span>
        <span>{{ item.price }}</span>
      </p>
      <p>
        <span>发票抬头：</span>
        <span>{{ item.invoiceCompany }}</span>
      </p>
      <p>
        <span>纳税识别号：</span>
        <span>{{ item.ratepayingNo }}</span>
      </p>
      <p>
        <span>注册场所地址：</span>
        <span>{{ item.registerAddress }}</span>
      </p>
      <p>
        <span>注册固定电话：</span>
        <span>{{ item.registerMobile }}</span>
      </p>
      <p>
        <span>开票备注：</span>
        <span>{{ item.note }}</span>
      </p>
      <p>
        <span>申请时间：</span>
        <span>{{ item.addTime }}</span>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { Notification, MessageBox } from 'element-ui';

export default {
  name: 'APP',
  data() {
    return {
      list: [],
      total: 0,
      invoicePrice: 0,
      pageNum: 1,
      pageSize: 25,
      loading: !0,
      showDetail: !1,
      item: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      seeAjax(
        'list',
        { pageSize: this.pageSize, pageNum: this.pageNum },
        res => {
          if (res.success) {
            this.list = res.data;
            this.total = res.total;
            this.loading = !1;
            this.invoicePrice = res.invoicePrice;
          }
        }
      );
    },
    applyReceipt() {
      if (!parseInt(this.invoicePrice, 0)) {
        Notification({
          title: '提示',
          message: '当前可开票金额为0哦~',
        });
        return;
      }
      window.location.href = `/zzhadmin/applyReceipt?price=${this.invoicePrice}`;
    },
    cancel(scope) {
      MessageBox.confirm('确定取消开发票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          seeAjax(
            'cancelInvoice',
            {
              id: scope.row.id,
            },
            res => {
              if (res.result !== 1) return;

              window.location.reload();
            }
          );
        })
        .catch(() => {});
    },
    download(scope) {
      window.open(scope.row.pdfUrl);
    },
    detail(scope) {
      this.showDetail = !0;
      this.item = scope.row;
    },
    pageChange(page) {
      this.pageNum = page;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-button--primary {
  background-color: #71ba31;
  border-color: #71ba31;
}
.el-button--danger {
  background-color: #e96725;
  border-color: #e96725;
}
.el-pagination {
  padding: 20px 0;
  background-color: #fff;
}

.contain {
  padding: 20px 30px;
  // background-color: #fff;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10% 20px 26px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  background-image: url('https://pic.zizaihome.com/001e8d58-c59a-11ea-a284-00163e060b31.png');
  background-repeat: no-repeat;
  background-position: 10px 16px;
  background-size: 6px 27px;
}
.header-left {
  padding-right: 15%;
  border-right: 1px solid #f5f5f5;
}
.header-title {
  font-size: 16px;
  font-weight: bold;
}
.line {
  width: 1px;
  height: 100%;
  background-color: #ccc;
}
.status0 {
  color: #71ba31;
}
.status1 {
  color: #4a90e2;
}
</style>
