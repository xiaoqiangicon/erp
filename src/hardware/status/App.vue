<template>
  <div class="contain">
    <div class="header">
      <div class="title">设备状态</div>
      <div class="status-box">
        <div class="status-btn" @click="showDetail">设备日志</div>
      </div>
    </div>
    <div class="body">
      <el-table
        highlight-current-row
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="typeStr" label="设备类型" :align="'center'" />
        <el-table-column
          prop="deviceSerial"
          label="设备编号"
          :align="'center'"
        />
        <el-table-column prop="name" label="设备名称" :align="'center'" />
        <el-table-column prop="addTime" label="添加时间" :align="'center'" />
        <el-table-column label="状态" :align="'center'">
          <template slot-scope="scope">
            <div>{{ scope.row.statusStr }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="refuceReason"
          label="拒绝原因"
          :align="'center'"
          v-if="status === 2"
        />
        <el-table-column label="操作" :align="'center'" v-if="status === 1">
          <template slot-scope="scope">
            <div v-if="status === 1">
              <span
                v-if="scope.row.type === 'guest_ipc'"
                class="btn allow"
                @click="inspect(scope.row)"
                >实时监控</span
              >
              <span
                class="btn reject"
                v-if="scope.row.type === 'gate_way'"
                @click="clear(scope.row)"
                >一键消警</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Detail :logList="logList" />
    <div class="mask" v-if="showReject" @click="hideReject">
      <div class="mask-content" v-loading="loading">
        <video id="hlsVideo" class="video" ref="hlsVideo"></video>
      </div>
    </div>
  </div>
</template>

<script>
import Detail from './Detail';
import seeAjax from 'see-ajax';
import { MessageBox, Notification } from 'element-ui';
import Hls from 'hls.js';

export default {
  name: 'APP',
  data() {
    return {
      loading: !1,
      status: 1,
      tableList: [],
      logList: [],
      detail: {},
      reason: '',
      showReject: !1,
      hls: '',
    };
  },
  components: {
    Detail,
  },
  created() {
    this.fetchList();
  },
  beforeDestory() {
    this.hls.destroy();
  },
  methods: {
    fetchList() {
      seeAjax('getDeviceList', {}, detailRes => {
        this.tableList = detailRes.data;
      });
    },
    showDetail() {
      seeAjax('getDeviceLogList', {}, res => {
        if (res.success) {
          this.logList = res.data.list;
          this.$store.commit({ type: 'updateDetailVisible', state: true });
        }
      });
    },
    changeTab(status) {
      this.status = status;
      this.fetchList();
    },
    inspect(row) {
      if (row.status === 2) {
        Notification({
          title: '提示',
          message: '设备处在离线状态哦~',
          type: 'error',
        });
        return;
      }
      this.showReject = !0;
      this.loading = !0;
      seeAjax('getCameraUrl', { deviceId: row.id }, res => {
        if (res.success) {
          const video = this.$refs.hlsVideo;
          let This = this;

          if (Hls.isSupported()) {
            const hls = new Hls();
            this.hls = hls;
            hls.loadSource(res.data);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              This.loading = !1;
              video.play();
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = res.data;
            video.addEventListener('loadedmetadata', function() {
              video.play();
            });
          }
        } else {
          Notification({
            title: '提示',
            message: res.msg,
            type: 'error',
          });
        }
      });
    },
    clear(row) {
      if (row.status === 2) {
        Notification({
          title: '提示',
          message: '设备处在离线状态哦~',
          type: 'error',
        });
        return;
      }
      seeAjax('cancelAlarm', { deviceId: row.id }, res => {
        if (res.success) {
          window.location.reload();
        } else {
          Notification({
            title: '提示',
            message: res.msg,
            type: 'error',
          });
        }
      });
    },
    confirmReject() {
      if (!this.reason) {
        MessageBox.alert(`请填写拒绝原因？`);
        return;
      }
      seeAjax(
        'verifyManager',
        { id: this.detail.id, status: 2, content: this.reason },
        res => {
          if (res.success) {
            window.location.reload();
          } else {
            Notification({
              title: '提示',
              message: res.msg,
              type: 'error',
            });
          }
        }
      );
    },
    hideReject(e) {
      if (e.currentTarget === e.target) {
        this.showReject = !1;
        this.hls.destroy();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  padding: 20px 0;
  font-size: 20px;
  font-weight: bold;
}
.status-box {
  display: flex;
}
.status-box {
  display: flex;
  justify-content: flex-end;
  padding: 0 40px;
}
.status-btn {
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  background-color: #71ba31;
  border-radius: 8px;
  color: #fff;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.mask-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 60%;
  //background-color: #fff;
  border-radius: 8px;
}
.video {
  width: 100%;
  height: 100%;
}
.reject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.reject-close {
  font-size: 22px;
  cursor: pointer;
}
.reject-body-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
}
.reject-tips {
  margin: 20px 0 20px;
  text-align: center;
  color: #333;
  font-size: 16px;
}
.el-textarea {
  margin: 0 auto;
  textarea {
    display: block;
    margin: 0 auto;
  }
}
.reject-btn {
  width: 100px;
  height: 36px;
  margin: 30px auto 0;
  background-color: #2ecc40;
  border-radius: 6px;
  text-align: center;
  line-height: 36px;
  color: #fff;
  cursor: pointer;
}
</style>
