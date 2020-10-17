<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="search-box">
          <div class="search-row">
            <p class="search-title">入库时间</p>
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
          <div class="search-row">
            <p class="search-title">资产类型</p>
            <el-select
              v-model="searchType"
              class="selector"
              placeholder=""
              filterable
              @change="onChangeFilter"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </div>
        </div>
        <div class="print" @click="print">打印标签码</div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="name" label="资产名称" :align="'center'" />
        <el-table-column prop="typeStr" label="资产类型" :align="'center'" />
        <el-table-column label="状态" :align="'center'">
          <template slot-scope="scope">
            <div
              :class="{
                'status-0': scope.row.status === 0,
                'status-1': scope.row.status === 1,
                'status-2': scope.row.status === 2,
                'status-3': scope.row.status === 3,
              }"
            >
              {{ scope.row.statusStr }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="资产价值(元)" :align="'center'" />
        <el-table-column label="照片" :align="'center'">
          <template slot-scope="scope">
            <div>
              <img :src="scope.row.pic" class="row-pic" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="入库操作人" :align="'center'">
          <template slot-scope="scope">
            <div>
              <p class="time">{{ scope.row.addTime }}</p>
              <div class="info-box">
                <img class="avatar" :src="scope.row.pic" alt="" />
                <span>{{ scope.row.name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近盘点人" :align="'center'">
          <template slot-scope="scope">
            <div>
              <p class="time">{{ scope.row.addTime }}</p>
              <div class="info-box">
                <img class="avatar" :src="scope.row.pic" alt="" />
                <span>{{ scope.row.name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
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
        :total="total"
      ></el-pagination>
    </el-card>
    <div class="mask" v-if="showDetail">
      <div class="mask-content">
        <div class="invite-header">
          <p class="invite-title">资产编辑</p>
          <span class="invite-close" @click="closeDetail">×</span>
        </div>
        <div class="edit-content">
          <div class="edit-left">
            <div class="row">
              <p class="row-title">资产名称</p>
              <el-input type="text" v-model="name"></el-input>
            </div>
            <div class="row">
              <p class="row-title">资产类型</p>
              <el-select
                v-model="type"
                class="selector"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </div>
            <div class="row">
              <p class="row-title">照片</p>
              <div class="row-image">
                <div class="row-img-box" v-if="!1">
                  <img :src="covers[0]" alt="" class="pic" />
                  <span class="row-img-remove" @click="removeImg">×</span>
                </div>
                <Upload :images="covers" :multiple="false" />
              </div>
            </div>
          </div>
          <div class="edit-right">
            <div class="row">
              <p class="row-title">资产价值(元)</p>
              <el-input type="text" v-model="price"></el-input>
            </div>
            <div class="row">
              <p class="row-title">资产来源</p>
              <el-select
                v-model="source"
                class="selector"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in sourceList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </div>
            <div class="row">
              <p class="row-title">资产状态</p>
              <el-select
                v-model="status"
                class="selector"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </div>
            <div class="row">
              <p class="row-title">备注</p>
              <el-input
                type="textarea"
                :resize="'none'"
                :rows="3"
                v-model="remarks"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="edit-btn" @click="save">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { MessageBox } from 'element-ui';
import { typeList, sourceList, statusList } from './data';
import Upload from '../../com/upload/Upload';
import formatTime from '../../util/format_time';

export default {
  name: 'APP',
  data() {
    return {
      searchType: '',
      date: ['', ''],
      formatDate: ['', ''],
      tableList: [],
      detail: {},
      showDetail: !1,
      typeList,
      sourceList,
      statusList,
      source: '',
      name: '',
      pic: '',
      covers: [],
      type: '',
      price: '',
      remarks: '',
      status: '',
      id: '',
      remarks: '',
      currentPage: 1,
      total: 0,
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
        'getSupplyList',
        {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          startTime: this.formatDate[0],
          endTime: this.formatDate[1],
          type: this.searchType,
        },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
            this.total = res.data.total;
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
    print() {
      let templeName = window.localStorage['templeName'];
      window.location.href = `/zzhadmin/supplyPrintIndex?templeName=${templeName}`;
    },
    edit(row) {
      this.detail = row;
      this.name = this.detail.name;
      this.pic = this.detail.pic;
      this.covers = [this.detail.pic];
      this.remarks = this.detail.remarks;
      this.id = this.detail.id;
      this.source = this.detail.sourceType;
      this.type = this.detail.type;
      this.status = this.detail.status;
      this.price = this.detail.price;
      this.showDetail = !0;
    },
    removeImg() {
      this.covers = [];
    },
    save() {
      if (
        !this.name ||
        !this.type ||
        !this.source ||
        !this.covers.length ||
        (this.status !== 0 && !this.status) ||
        (this.price !== 0 && !this.price)
      ) {
        return;
      }
      seeAjax(
        'update',
        {
          name: this.name,
          price: this.price,
          type: this.type,
          sourceType: this.source,
          pic: this.pic,
          remarks: this.remarks,
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
  padding: 0 40px;
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
  width: 600px;
  height: 480px;
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
.edit-btn {
  width: 110px;
  height: 36px;
  margin: 10px auto 0;
  background-color: #409eff;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
</style>
