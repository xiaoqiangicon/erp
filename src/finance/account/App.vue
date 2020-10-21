<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="search-box">
          <div class="search-row">
            <p class="search-title">选择时间</p>
            <el-date-picker
              v-model="date"
              @change="onChangeDatePicker"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="print" @click="edit">添加一笔账目</div>
      </div>
      <div class="count-box">
        <div class="count-item out">
          <p class="count-title">支出</p>
          <div class="count-content">
            <p class="count-num">{{ payNum }}笔</p>
            <p class="count-price">-￥{{ pay }}元</p>
          </div>
        </div>
        <div class="count-item get">
          <p class="count-title">收入</p>
          <div class="count-content">
            <p class="count-num">{{ getNum }}笔</p>
            <p class="count-price">+￥{{ get }}元</p>
          </div>
        </div>
        <div class="count-item total">
          <p class="count-title">总计</p>
          <p class="count-total">
            {{
              total >= 0 ? `+￥${Math.abs(total)}元` : `-￥${Math.abs(total)}元`
            }}
          </p>
        </div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="记录名称" :align="'center'" />
        <el-table-column label="类型" :align="'center'">
          <template slot-scope="scope">
            <div
              :class="{
                'status-1': scope.row.type === 1,
                'status-2': scope.row.type === 2,
              }"
            >
              {{ scope.row.typeStr }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="金额(元)" :align="'center'" />
        <el-table-column prop="fillTime" label="记录时间" :align="'center'" />
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <div>
              <span class="btn allow" @click="edit(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="pagination"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="count"
      ></el-pagination>
    </el-card>
    <div class="mask" v-if="showDetail">
      <div class="mask-content">
        <div class="invite-header">
          <p class="invite-title">{{ isEdit ? '编辑' : '添加' }}</p>
          <span class="invite-close" @click="closeDetail">×</span>
        </div>
        <div class="edit-content">
          <div class="edit-left">
            <div class="row">
              <p class="row-title">记录名称</p>
              <el-input type="text" v-model="name"></el-input>
            </div>
            <div class="row">
              <p class="row-title">类型</p>
              <el-select
                v-model="type"
                class="selector"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.name"
                />
              </el-select>
            </div>
            <div class="row">
              <p class="row-title">金额</p>
              <el-input type="number" v-model="price"></el-input>
            </div>
            <div class="row">
              <p class="row-title">记录时间</p>
              <el-date-picker
                v-model="selectDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div v-if="!isEdit" class="save-btn" @click="save">保存</div>
        <div v-else class="edit-btn">
          <div class="update-btn" @click="save">更新</div>
          <div class="del-btn" @click="del">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { MessageBox, Notification } from 'element-ui';
import Upload from '../../com/upload/Upload';
import formatTime from '../../util/format_time';

export default {
  name: 'APP',
  data() {
    return {
      date: ['', ''],
      formatDate: ['', ''],
      tableList: [],
      total: '',
      pay: '',
      payNum: '',
      get: '',
      getNum: '',
      typeList: [{ name: '支出', value: 1 }, { name: '收入', value: 2 }],
      type: '',
      name: '',
      price: '',
      isEdit: '',
      selectDate: '',
      detail: {},
      showDetail: !1,
      id: '',
      currentPage: 1,
      count: 0,
      pageSize: 25,
    };
  },
  components: {
    Upload,
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      seeAjax(
        'getBillList',
        {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          startDate: this.formatDate[0],
          endDate: this.formatDate[1],
        },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
            this.count = res.data.count;
            this.total = (res.data.get - res.data.pay).toFixed(2);
            this.get = res.data.get;
            this.pay = res.data.pay;
            this.getNum = res.data.getNum;
            this.payNum = res.data.payNum;
          }
        }
      );
    },
    onChangeDatePicker() {
      const { date } = this;
      this.formatDate = date.map(item => formatTime(`${item}`));
      this.onChangeFilter();
    },
    onChangeFilter() {
      this.currentPage = 1;
      this.fetchList();
    },
    edit(row) {
      if (row.name) {
        this.isEdit = !0;
        this.type = row.type;
        this.name = row.name;
        this.price = row.price;
        this.selectDate = row.fillTime;
        this.id = row.id;
      } else {
        this.isEdit = !1;
        this.type = '';
        this.name = '';
        this.price = '';
        this.selectDate = '';
        this.id = 0;
      }
      this.showDetail = !0;
    },
    del() {
      MessageBox.confirm('确定要删除这条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        seeAjax('update', { status: -1, id: this.id }, res => {
          if (res.success) {
            window.location.reload();
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
              type: 'error',
            });
            return;
          }
        });
      });
    },
    save() {
      if (!this.name || !this.price || !this.selectDate || !this.type) {
        Notification({
          title: '提示',
          message: '请输入必要数据',
          type: 'warning',
        });
        return;
      }
      seeAjax(
        'update',
        {
          name: this.name,
          price: this.price,
          type: this.type,
          fillTime: formatTime(`${this.selectDate}`),
          id: this.id,
        },
        res => {
          if (res.success) {
            window.location.reload();
          }
        }
      );
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchList();
    },
    closeDetail() {
      this.showDetail = !1;
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
}
.header {
  height: 60px;
  padding: 0 40px 0 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-box {
  display: flex;
  align-items: center;
}
.search-row {
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.search-title {
  margin-right: 10px;
}
.print {
  width: 120px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: #409eff;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
}
.count-box {
  display: flex;
}
.count-item {
  width: 200px;
  height: 90px;
  padding: 16px 20px;
  margin-right: 20px;
  margin-bottom: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.count-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}
.count-content {
  display: flex;
  justify-content: space-between;
}
.count-total {
  text-align: center;
}
.row-pic {
  max-width: 100%;
  height: 100px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 460px;
  background-color: #fff;
  border-radius: 8px;
}
.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.invite-close {
  cursor: pointer;
  font-size: 22px;
}
.edit-content {
  display: flex;
  padding: 20px 30px 0;
}
.row {
  margin: 0 0 10px;
}
.edit-left,
.edit-right {
  width: 50%;
  flex-shrink: 0;
}
.row-img-box {
  position: relative;
  width: 217px;
}
.row-img-remove {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  background-color: red;
  color: #fff;
  cursor: pointer;
}
.image {
  max-width: 217px !important;
  height: 150px !important;
}
.row-title {
  margin-bottom: 5px;
}
.save-btn {
  width: 110px;
  height: 36px;
  margin: 20px auto 0;
  background-color: #409eff;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
.edit-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.del-btn,
.update-btn {
  width: 110px;
  height: 36px;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
.update-btn {
  margin-right: 40px;
  background-color: #409eff;
}
.del-btn {
  background-color: #f60;
}
</style>
