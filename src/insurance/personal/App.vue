<template>
  <main>
    <div class="head">
      <div class="search-row">
        <el-select
          v-model="nameId"
          style="width: 100px;"
          clearable
          size="medium"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectSortItem"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input
          v-model="searchInput"
          class="input-content"
          placeholder="请输入内容"
        />
        <el-button type="primary" @click="onClickSearch">
          搜索
        </el-button>
      </div>
      <div class="distribute-row">
        <label for="">分配编号：</label>
        <el-select
          v-model="selectId"
          style="width: 180px;"
          clearable
          size="medium"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectIdItem"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          />
        </el-select>
        <label for="">状态</label>
        <el-select
          v-model="selectStatus"
          style="width: 180px;"
          clearable
          size="medium"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectStatusItem"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div class="content">
      <div class="info-bar">
        <el-button class="distribution" type="primary" @click="exportForm">
          导出表格
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        :data="list"
      >
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div
              v-if="scope.row.status == 1 && !scope.row.expireStatus"
              class="status"
            >
              <span class="invalid">未生效</span>
            </div>
            <div
              v-else-if="scope.row.status == 0 && !scope.row.expireStatus"
              class="status"
            >
              <span class="valid">生效中</span>
              <span v-if="scope.row.isCarryOn == 2" class="invalid"
                >未确认</span
              >
              <span v-if="scope.row.isCarryOn == 1" class="valid"
                >同意续保</span
              >
              <span v-if="scope.row.isCarryOn == 0" class="expired"
                >不续保</span
              >
            </div>
            <div v-else-if="scope.row.expireStatus" class="status">
              <span class="expired">已过期</span>
              <span v-if="scope.row.isCarryOn == 2" class="invalid"
                >未确认</span
              >
              <span v-if="scope.row.isCarryOn == 1" class="valid"
                >同意续保</span
              >
              <span v-if="scope.row.isCarryOn == 0" class="expired"
                >不续保</span
              >
            </div>
            <div
              v-else-if="(scope.row.status == 2) & !scope.row.expireStatus"
              class="status expire-item"
            >
              <el-tooltip
                effect="dark"
                content="失效是指未通过审核或不续保的用户"
                placement="top"
              >
                <i class="el-icon-info" style="font-size: 18px" />
              </el-tooltip>
              <span class="expire">失效用户</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.realName }}</div>
            <div>UID：{{ scope.row.userId }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="法号" show-overflow-tooltip />
        <el-table-column
          prop="templeName"
          label="所在寺院"
          show-overflow-tooltip
        />
        <el-table-column
          width="140"
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
        />
        <el-table-column
          width="180"
          prop="idCard"
          label="身份证号"
          show-overflow-tooltip
        />
        <el-table-column
          width="60"
          prop="sex"
          label="性别"
          show-overflow-tooltip
        />
        <el-table-column
          width="60"
          prop="age"
          label="年龄"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          prop="height"
          label="身高(厘米)"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="type == 3"
          prop="reason"
          label="不通过原因"
          show-overflow-tooltip
        />
        <el-table-column
          v-else
          prop="addTime"
          label="申请时间"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDetail(scope.row)"
              >详情</a
            >
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickDelete(scope.row)"
              >删除</a
            >
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickRenew(scope.row)"
              >续保</a
            >
            <a
              class="s-a"
              href="javascript:void(0);"
              @click="onClickWithdraw(scope.row)"
              >撤回</a
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mg-t-10" style="text-align: center;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="currentSize"
        background=""
        layout="sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <Detail :detail-row="detailRow" />
    <Delete :delete-id="deleteId" />
    <Withdraw :withdraw-id="withdrawId" />
    <Renew :renew-id="renewId" />
  </main>
</template>

<script>
import { Notification } from 'element-ui';
import seeAjax from 'see-ajax';
import { parse } from 'path';
import zzhUtil from '../../com-deprecated/util';
import { getDate, urlParams } from '../../../../pro-com/src/utils';

import Detail from './components/Detail';
import Delete from './components/Delete';
import Withdraw from './components/Withdraw';
import Renew from './components/renew';

export default {
  name: 'App',
  components: {
    Detail,
    Delete,
    Withdraw,
    Renew,
  },
  data() {
    return {
      nameId: '', // 搜索请求参数
      distributeId: '', // 分配编号
      selectSortItem: ['姓名', 'UID', '电话', '批次号码'],
      list: [], // 当前列表
      type: -2,
      searchInput: '', // 搜索的内容
      selectIdItem: [], // 分配编号筛选
      selectId: '', // 选择的id
      selectStatusItem: ['全部', '已过期', '生效中', '未生效', '失效用户'],
      selectStatus: '', // 选择的状态
      downloadList: [], // 下载列表
      withdrawId: '', // 需要撤回的保单
      deleteId: '', // 需要删除的保单
      detailRow: {
        idCardImgFront: '',
        proveImg: '',
      }, // 详情的信息
      renewId: '', // 需要续保的保单
      // 请求参数
      phoneInput: '',
      nameInput: '',
      groupIdInput: '',
      numberAccountInput: '',
      currentPage: 1,
      currentSize: 25,
      totalCount: 0,
    };
  },
  computed: {
    selected() {
      return this.$store.state.selected;
    },
  },
  watch: {
    selectId() {
      this.groupIdInput = this.selectId;
      this.currentPage = 1;
      this.requestList();
    },
    selectStatus() {
      const statusIndex = this.selectStatusItem.indexOf(this.selectStatus);
      const statusArray = [-2, 3, 0, 4, 2];
      this.type = statusArray[statusIndex];
      this.currentPage = 1;
      this.requestList();
    },
  },
  created() {
    const { groupId } = urlParams;
    this.groupIdInput = groupId;
    this.requestList();
    this.requestSelectList();
  },
  methods: {
    requestList() {
      const {
        phoneInput,
        nameInput,
        groupIdInput,
        numberAccountInput,
        type,
        currentPage,
        currentSize,
      } = this;
      seeAjax(
        'getList',
        {
          status: type,
          name: nameInput,
          numberAccount: numberAccountInput,
          phone: phoneInput,
          groupId: parseInt(groupIdInput, 10) | 0,
          pageNum: currentPage - 1,
          pageSize: currentSize,
        },
        res => {
          if (res.success) {
            this.totalCount = res.count;
            const now = new Date(
              `${zzhUtil.today.display} 23:59:59`.replace(/-/g, '\/')
            );

            res.data.forEach(item => {
              item.expireStatus =
                new Date(`${item.expireTime}`.replace(/-/g, '\/')) < now;
            });
            this.list = res.data;
            const downloadList = [];
            this.list.forEach((item, i) => {
              downloadList.push(item.id);
            });
            this.downloadList = downloadList;
          } else {
            Notification({
              title: '提示',
              message: '接口出错',
            });
          }
        }
      );
    },
    requestSelectList() {
      seeAjax('getInsuranceList', { status: -2 }, res => {
        if (!res.success) return;

        this.selectIdItem = res.data.list;
      });
    },
    onClickSearch() {
      if (!this.searchInput | !this.nameId) {
        Notification.info({
          title: '提示',
          message: '请输入搜索内容',
        });
        return;
      }
      if (this.nameId === this.selectSortItem[0]) {
        this.nameInput = this.searchInput;
        this.numberAccountInput = '';
        this.phoneInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectSortItem[1]) {
        this.numberAccountInput = this.searchInput;
        this.nameInput = '';
        this.phoneInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectSortItem[2]) {
        this.phoneInput = this.searchInput;
        this.nameInput = '';
        this.numberAccountInput = '';
        this.groupIdInput = '';
      }
      if (this.nameId === this.selectSortItem[3]) {
        this.groupIdInput = this.searchInput;
        this.nameInput = '';
        this.numberAccountInput = '';
        this.phoneInput = '';
      }
      this.currentPage = 1;
      this.requestList();
    },
    exportForm() {
      if (!this.downloadList.length) {
        Notification({
          title: '提示',
          message: '接口出错',
        });
        return;
      }
      seeAjax(
        'insuranceGetList',
        { ids: this.downloadList.join(',') },
        res => {}
      );
    },
    onClickDetail(row) {
      this.detailRow = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    onClickDelete(row) {
      this.deleteId = row.id;
      this.$store.commit({ type: 'updateSetDeleteVisible', state: true });
    },
    onClickRenew(row) {
      this.renewId = row.id;
      this.$store.commit({ type: 'updateSetRenewVisible', state: true });
    },
    onClickWithdraw(row) {
      this.withdrawId = row.id;
      this.$store.commit({ type: 'updateSetWithdrawVisible', state: true });
    },
    handleSizeChange(size) {
      this.currentSize = size;
      this.currentPage = 1;
      this.requestList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.requestList();
    },
  },
};
</script>

<style lang="less" scoped>
main {
  padding: 15px;
}

.head {
  padding-top: 30px;
  padding-left: 16px;
}
.search-row {
  display: flex;
  align-items: center;
}
.input-content {
  width: 180px;
  margin: 0 20px;
}
.distribute-row {
  margin: 20px 0 0 0;
}

.status span {
  display: inline-block;
  padding: 2px 4px;
  line-height: 16px;
  border-radius: 4px;
}
.invalid {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}
.valid {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}
.expire-item {
  display: flex;
  align-items: center;
}
.expired {
  background: #fff2e8;
  color: #fa541c;
  border: 1px solid #ffbb96;
}
.expire {
  background: #ebebea;
  color: #4b4b4b;
  border: 1px solid #b0b0b0;
  margin-left: 4px;
}

.info-bar {
  float: right;
  height: 60px;
  padding-right: 60px;
  line-height: 60px;
  background: #f0f2f5;
}

.s-a {
  margin-right: 20px;
}
</style>
