<template>
  <div class="contain">
    <el-card>
      <div class="header">
        <div class="search-box">
          <div class="search-row">
            <el-select
              v-model="type"
              class="selector"
              placeholder="请输入类型"
              @change="onChangeFilter"
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
          <div class="search-row">
            <el-select
              v-model="userId"
              class="selector"
              placeholder="请输入所有人姓名"
              @change="onChangeFilter"
              filterable
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </div>
          <div class="search-row">
            <el-input
              placeholder="请输入内容"
              v-model="fileName"
              class="input-with-select"
            >
              <i
                slot="append"
                @click="onChangeFilter"
                class="el-icon-search"
                style="font-size: 18px"
              />
            </el-input>
          </div>
        </div>
        <div class="print" ref="fileUpload">上传全员文件</div>
      </div>
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="fileName" label="文件名称" :align="'center'" />
        <el-table-column prop="typeStr" label="类型" :align="'center'" />
        <el-table-column prop="managerName" label="所有人" :align="'center'" />
        <el-table-column prop="addTime" label="添加时间" :align="'center'" />
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <div>
              <span class="btn allow" @click="download(scope.row)">下载</span>
              <span class="btn allow" @click="share(scope.row)">共享</span>
              <span class="btn allow" @click="showRename(scope.row)"
                >重命名</span
              >
              <span class="btn allow" @click="del(scope.row)">删除</span>
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
          <p class="invite-title">重命名</p>
          <span class="invite-close" @click="closeDetail">×</span>
        </div>
        <div class="edit-content">
          <el-input type="text" v-model="newName"></el-input>
        </div>
        <div class="btn-box">
          <div class="cancel-btn" @click="closeDetail">取消</div>
          <div class="save-btn" @click="rename">保存</div>
        </div>
      </div>
    </div>
    <Detail :detail="detail" :userList="userList" />
    <div class="upload-box" v-if="uploading || finish">
      <div class="upload-header" v-if="uploading">
        <p class="upload-title">
          上传中{{ uploadNum }}/{{ uploadFiles.length }}
        </p>
      </div>
      <div class="upload-header" v-if="finish">
        <p class="upload-title">全部上传成功</p>
      </div>
      <div class="upload-progress" v-if="uploading"></div>
      <div class="upload-finish" v-if="finish">
        已上传{{ uploadFiles.length }}个任务，共895KB
      </div>
      <div class="upload-content">
        <div class="upload-item" v-for="(item, key) in uploadFiles" :key="key">
          <p class="">{{ item.name }}</p>
          <p class="">{{ item.size }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { MessageBox, Notification } from 'element-ui';
import { typeList } from './data';
import formatTime from '../../util/format_time';
import Detail from './Detail';
import upload from '../../../../pro-com/src/upload';

let hostNames = location.hostname.split('.');
let hostPrefix = hostNames[0];
let env = hostPrefix == 'erptest' ? 1 : hostPrefix == 'erprelease' ? 2 : 0;

let uploadUrl = [
  'http://mrwx.zizaihome.cn',
  'http://mrt1.zizaihome.cn',
  'https://mrt2.zizaihome.cn',
][env];

export default {
  name: 'APP',
  data() {
    return {
      tableList: [],
      typeList: typeList,
      type: -1,
      userList: [],
      userId: '',
      fileName: '', // 搜索参数

      newName: '',
      detail: {},
      showDetail: !1,
      currentPage: 1,
      total: 0,
      pageSize: 25,

      uploadFiles: [],
      uploadNum: 0,
      uploading: !1,
      finish: !1,
    };
  },
  components: {
    Detail,
  },
  created() {
    this.fetchList();
    this.fetchUserList();
  },
  mounted() {
    const { fileUpload } = this.$refs;
    const This = this;

    upload({
      el: fileUpload,
      multiple: !0,
      name: 'file',
      type: 'file',
      uploadUrl: uploadUrl + '/file/upload',
      progress: (e, data) => {},
      uploadHandle: res => {
        return res.data;
      },
      done: (url, e, data) => {
        seeAjax(
          'saveFile',
          {
            url: url,
            fileName: data.files[0].name,
            fileSize: data.files[0].size,
          },
          res => {
            This.uploadNum += 1;
            if (This.uploadNum === This.uploadFiles.length) {
              This.uploading = !1;
              This.finish = !0;
              This.fetchList();
            }
          }
        );
      },
      uploadOptions: {
        formData: { private: 1 },
        add: (e, data) => {
          console.log(data);
          This.uploading = !0;
          This.uploadFiles.push(data.files[0]);

          data.process().done(() => {
            data.submit();
          });
        },
      },
    });
  },
  methods: {
    fetchList() {
      seeAjax(
        'getFileList',
        {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          type: this.type,
          fileName: this.fileName,
          managerId: this.userId,
        },
        res => {
          if (res.success) {
            this.tableList = res.data.list;
            this.total = res.data.total;
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
    fetchUserList() {
      seeAjax('getUserList', {}, res => {
        if (res.success) {
          this.userList = res.data;
        } else {
          Notification({
            title: '提示',
            message: '接口出错',
            type: 'error',
          });
          return;
        }
      });
    },
    onChangeFilter() {
      this.currentPage = 1;
      this.fetchList();
    },
    download(row) {
      seeAjax('download', { fileId: row.id }, res => {
        if (res.success) {
          window.open(res.data);
        } else {
          Notification({
            title: '提示',
            message: '接口出错',
            type: 'error',
          });
          return;
        }
      });
    },
    share(row) {
      this.detail = row;
      this.$store.commit({ type: 'updateDetailVisible', state: true });
    },
    edit(row) {
      this.showDetail = !0;
    },
    del(row) {
      MessageBox.confirm('确定要删除这个文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.userId !== 0) {
          Notification({
            title: '提示',
            message: '您没有权限删除此文件',
            type: 'error',
          });
          return;
        }
        seeAjax('del', { fileId: row.id }, res => {
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
    rename() {
      if (!this.newName) {
        Notification({
          title: '提示',
          message: '请填写文件名',
          type: 'warning',
        });
        return;
      }
      seeAjax(
        'rename',
        { fileId: this.detail.id, fileName: this.newName },
        res => {
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
        }
      );
    },
    showRename(row) {
      this.detail = row;
      this.newName = this.detail.fileName;
      this.showDetail = !0;
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
  position: relative;
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
  height: 200px;
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
.btn-box {
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  margin-top: 20px;
}
.save-btn {
  width: 110px;
  height: 36px;
  background-color: #409eff;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
.cancel-btn {
  width: 110px;
  height: 36px;
  margin-right: 20px;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  color: #fff;
  border: 1px solid #999;
  color: #333;
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
.upload-box {
  position: fixed;
  bottom: 2px;
  right: 0;
  width: 400px;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}
.upload-header {
  padding: 10px 20px;
  font-size: 18px;
}
.upload-progress {
  width: 100%;
  height: 30px;
  background-color: #eee;
}
</style>
