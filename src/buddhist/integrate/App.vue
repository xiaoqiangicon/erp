<template>
  <div class="contain">
    <div class="credits-box">
      <div class="header">
        <p class="level">会员等级：{{ level }}</p>
      </div>
      <div class="gray-block"></div>
      <div :class="{ 'task-list': list.length }">
        <div class="task-title">任务积分</div>
        <div v-if="list.length">
          <div
            :class="{ 'single-task': true, 'single-task-odd': index % 2 == 0 }"
            v-for="(item, index) in list"
            :key="index"
          >
            <p class="mission">{{ item.mission }}</p>
            <div class="sign plus" v-if="item.coin > 0">增加</div>
            <div class="sign minus" v-else>减少</div>
            <span class="coin">{{ Math.abs(item.coin) }}</span>
          </div>
        </div>
        <div class="empty-list" v-else>
          <img
            src="https://pic.zizaihome.com/7a93169c-2786-11ea-af6b-00163e060b31.png"
            class="empty-img"
            alt=""
          />
          <p class="empty-tips">还没有获得任务积分</p>
        </div>
      </div>
      <div
        v-if="list.length"
        style="text-align: center; width: 100%; margin-top: 40px;"
      >
        <el-pagination
          small
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          background=""
          layout="prev, pager, next"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <div class="iframe-box" ref="iframeBox" id="iframe-box">
      <!-- <iframe id="frame-content" ref="frameContent" :src="url" scrolling="auto" frameborder="0"></iframe> -->
    </div>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { Notification } from 'element-ui';
import { setTimeout } from 'timers';

let timer = null;
export default {
  data() {
    return {
      level: 1,
      list: [],
      url: '',
      pageSize: 10,
      currentPage: 1,
      totalCount: 10,
    };
  },
  created() {
    this.fetchList();
    this.fetchInfo();
  },
  mounted() {
    let ifr = document.getElementById('frame-content');
    let { frameContent } = this.$refs;
    frameContent.onload = function() {
      //   let iDoc = ifr.contentDocument || ifr.document || ifr.contentWindow;
      //   let cHeight = Math.max(iDoc.body.clientHeight, iDoc.documentElement.clientHeight);
      //   let sHeight = Math.max(iDoc.body.scrollHeight, iDoc.documentElement.scrollHeight);
      //   let height = Math.max(cHeight, sHeight);
      //   ifr.style.height = 1200 + 'px';
      //   console.log(height, iDoc.body.scrollHeight);
      // ifrBox.style.overflow = 'auto';
      // setTimeout(() => {
      //   frameContent.style.display = 'block';
      // }, 2000)
    };
    // console.log(ifr);
  },
  beforeDestroy() {
    timer = null;
  },
  methods: {
    fetchList() {
      seeAjax(
        'getList',
        { pageSize: this.pageSize, pageNum: this.currentPage - 1 },
        res => {
          if (!res.success) {
            Notification({
              title: 'fjdks',
              type: 'warning',
            });
            return;
          }
          this.list = res.data;
          this.totalCount = res.total;
        }
      );
    },
    fetchInfo() {
      seeAjax('creditsInfo', {}, res => {
        this.url = res.data.url;
        this.level = res.data.level;

        // 插入iframe
        let ifr = document.createElement('iframe');
        const { iframeBox } = this.$refs;
        iframeBox.appendChild(ifr);
        ifr.className = 'iframe-item';
        ifr.style.width = '100%';
        ifr.style.height = '100%';
        ifr.style.border = 'none';
        ifr.src = res.data.url;
        ifr.onload = function() {
          timer = setTimeout(() => {
            ifr.style.display = 'block';
          }, 1000);
        };
      });
    },
    handleCurrentChange() {
      this.fetchList();
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.contain {
  display: flex;
  padding: 10px;
}
.credits-box {
  width: 375px;
  height: 667px;
  margin-right: 30px;
  background-color: white;
  box-shadow: 4px 4px 10px #999;
  overflow-y: auto;
}
.header {
  padding: 10px;
}
.level {
  height: 44px;
  line-height: 44px;
  padding-left: 37px;
  background-color: rgba(248, 250, 249, 1);
  background-image: url('https://pic.zizaihome.com/d9bb4654-26c2-11ea-b3ed-00163e060b31.png');
  background-repeat: no-repeat;
  background-size: 17px;
  background-position: 10px center;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
}
.gray-block {
  height: 10px;
  background-color: #f5f5f5;
}

.task-list {
  border-bottom: 1px solid #eee;
}
.task-title {
  position: relative;
  padding: 14px 0 14px 14px;
  font-size: 16px;
  font-weight: bold;
}
.task-title::after {
  position: absolute;
  left: 0;
  top: 19px;
  display: block;
  content: '';
  width: 5px;
  height: 10px;
  background-color: #71ba31;
}
.single-task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-top: 1px solid #eee;
}
.single-task-odd {
  background-color: #f8faf9;
}

.mission {
  width: 200px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.sign {
  padding: 0 14px;
  line-height: 24px;
  border-radius: 24px;
}
.plus {
  background-color: #e9f9e9;
  border: 1px solid #3fd071;
  color: #3fd071;
}
.minus {
  background-color: #fef4ea;
  border: 1px solid #fa9a33;
  color: #fa9a33;
}
.coin {
  display: inline-block;
  min-width: 60px;
  text-align: right;
}

.empty-list {
  padding-top: 70px;
  text-align: center;
}
.empty-tips {
  margin-top: 30px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 18px;
}

.iframe-box {
  width: 375px;
  height: 667px;
  box-shadow: 4px 4px 10px #999;
  overflow: auto;
  .iframe-item {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
