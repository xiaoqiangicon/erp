<template>
  <div id="app">
    <div class="integral-header">
      <h3>积分兑换</h3>
      <span class="coin">可用积分：{{ coin }}</span>
    </div>
    <div class="contain">
      <div class="credits-box">
        <div class="header">
          <p class="level">会员等级：{{ level }}</p>
        </div>
        <div class="credits-container">
          <div class="credits-tab">
            <div
              :class="['c-tab-item', currTab === 1 ? 'c-tab-item-active' : '']"
              @click="switchTabItem(1)"
            >
              积分任务
            </div>
            <div
              :class="['c-tab-item', currTab === 2 ? 'c-tab-item-active' : '']"
              @click="switchTabItem(2)"
            >
              已完成
            </div>
          </div>
          <!-- 积分任务 Tab内容 -->
          <div
            class="credits-tab-con credits-tab-con-task"
            :style="{ display: currTab === 1 ? 'block' : 'none' }"
          >
            <div class="t-list" v-if="task.list.length">
              <div class="t-item" v-for="item in task.list" :key="item.title">
                <div class="t-head">
                  <div class="t-title">{{ item.title }}</div>
                  <div class="t-integral">
                    <span class="t-integral-text">完成获得</span>
                    <span class="t-integral-num">{{ item.integral }}</span>
                  </div>
                </div>
                <div class="t-content">{{ item.content }}</div>
              </div>
              <el-pagination
                small
                background
                class="task-pagination"
                @current-change="getTaskList"
                :page-size="task.params.pageSize"
                :current-page="task.params.pageNumber"
                layout="prev, pager, next"
                :total="task.total"
              ></el-pagination>
            </div>
            <div class="t-null" v-else>
              <div class="t-null-img">
                <img
                  src="https://pic.zizaihome.com/884ef18b-7fcd-45ac-ba2f-c99a86183436.png"
                  alt=""
                />
              </div>
              <div class="t-null-text">您暂时没有积分任务</div>
            </div>
          </div>
          <!-- 已完成 Tab内容 -->
          <div
            class="credits-tab-con credits-tab-con-finish"
            :style="{ display: currTab === 2 ? 'block' : 'none' }"
          >
            <div :class="{ 'task-list': list.length }">
              <div v-if="list.length">
                <div
                  :class="{ 'single-task': true }"
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
        </div>
      </div>

      <div class="iframe-box" ref="iframeBox" id="iframe-box" v-if="!1">
        <!-- <iframe id="frame-content" ref="frameContent" :src="url" scrolling="auto" frameborder="0"></iframe> -->
      </div>
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
      currTab: 1,
      level: 1,
      list: [],
      url: '',
      pageSize: 10,
      currentPage: 1,
      totalCount: 10,
      coin: 0,
      task: {
        total: 0,
        params: {
          pageNumber: 1,
          pageSize: 5,
        },
        list: [],
      },
    };
  },
  created() {
    this.getTaskList();
    this.fetchList();
    this.fetchInfo();
  },
  beforeDestroy() {
    timer = null;
  },
  methods: {
    // 获取积分任务列表
    getTaskList(page) {
      const task = this.task;
      if (page) task.params.pageNumber = page;
      seeAjax('getTaskList', { ...task.params }, res => {
        if (!res.success) {
          Notification({
            title: '获取积分任务失败',
            type: 'warning',
          });
          return;
        }
        this.task.list = res.data;
        this.task.total = res.total;
      });
    },
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
        this.coin = res.data.coin;

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
    // 切换tab页
    switchTabItem(type) {
      this.currTab = type;
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  .integral-header {
    display: flex;
    align-items: center;
    margin: 10px;
    padding: 1px 20px;
    background-color: #ffffff;
    h3 {
      margin-top: 18px;
      margin-bottom: 18px;
    }
    .coin {
      margin-top: 10px;
      margin-left: 40px;
    }
  }

  .credits-container {
    .credits-tab {
      display: flex;
      padding: 10px 0 8px;
      border-bottom: 1px solid rgba(112, 112, 112, 0.15);
      .c-tab-item {
        flex: 1;
        text-align: center;
        font-size: 18px;
        line-height: 22px;
        cursor: pointer;
        color: #000000;
      }
      .c-tab-item-active {
        color: #70b931;
      }
    }

    .credits-tab-con-task {
      padding: 20px;
      .t-list {
        .t-item {
          border: 1px solid rgba(51, 51, 51, 0.15);
          border-radius: 8px;
          margin-bottom: 10px;
          .t-head {
            padding: 10px 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(112, 112, 112, 0.1);
            .t-title {
              flex: 1;
              word-break: break-all;
              font-size: 16px;
              font-weight: bold;
              line-height: 22px;
              color: rgba(51, 51, 51, 1);
            }
            .t-integral {
              display: flex;
              align-items: center;
              padding: 0 10px;
              height: 33px;
              line-height: 33px;
              background: rgba(248, 250, 249, 1);
              border-radius: 8px;
              .t-integral-text {
                font-size: 16px;
                color: #70b931;
              }
              .t-integral-num {
                margin-left: 8px;
                font-size: 28px;
                color: #333333;
              }
            }
          }
          .t-content {
            padding: 10px 10px 20px;
            word-break: break-all;
            line-height: 20px;
            color: #5d5d5d;
          }
        }
        .task-pagination {
          padding: 20px 0 10px;
          text-align: center;
        }
      }
      .t-null {
        padding: 150px 0 0;
        .t-null-img {
          text-align: center;
          > img {
            width: 150px;
          }
        }
        .t-null-text {
          margin-top: 40px;
          text-align: center;
          font-size: 16px;
        }
      }
    }
  }
  p {
    margin: 0;
  }
  .contain {
    display: flex;
    padding: 10px;
  }
  .credits-box {
    width: 500px;
    flex-shrink: 0;
    margin-right: 30px;
    background-color: white;
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
    padding: 15px 30px 15px 12px;
    border-bottom: 1px solid #eee;
  }
  .single-task-odd {
    background-color: #f8faf9;
  }

  .mission {
    width: 280px;
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
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    overflow: auto;
    .iframe-item {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>
