<template>
  <div class="content-container" id="content-container">
    <div class="notice-title">通知中心</div>

    <div class="notice-main">
      <div class="notice-list" v-if="noticeList.length">
        <div
          :class="['notice-item', item.open ? 'notice-open' : '']"
          v-for="(item, index) in noticeList"
          :key="item.id"
          @click="openNoticeItem(item, index)"
        >
          <div class="n-container">
            <div class="n-head">
              <div class="n-title">{{ item.title }}</div>
              <div class="n-info">
                <div class="n-tab" v-if="item.isRead === 0">未读</div>
                <div class="n-date">{{ item.addTime }}</div>
                <div class="n-icon"></div>
              </div>
            </div>
            <div class="n-content">
              <div class="n-content-text">{{ item.content }}</div>
              <a class="n-url" :href="item.url" v-if="item.url">查看详情</a>
            </div>
          </div>
        </div>
      </div>

      <div class="list-null" v-else>
        <div class="l-img">
          <img
            src="https://pic.zizaihome.com/884ef18b-7fcd-45ac-ba2f-c99a86183436.png"
            alt=""
          />
        </div>
        <div class="l-text">抱歉，暂时没有任何通知</div>
        <a href="/zzhadmin/" class="l-btn">返回首页</a>
      </div>
    </div>

    <div class="notice-pagination">
      <el-pagination
        v-show="noticeTotal > 0"
        :total="noticeTotal"
        :current-page="noticeParams.pageNumber"
        :page-size="noticeParams.pageSize"
        background
        layout="total, prev, pager, next, sizes, jumper"
        style="margin-top: 30px; text-align: center;"
        @size-change="pageSizeChange"
        @current-change="getNoticeList"
      />
    </div>
  </div>
</template>

<script>
import variables from './../../common/variables';
export default {
  data() {
    return {
      defaultNoticeOpen: '',
      noticeList: [],
      noticeTotal: 0,
      noticeParams: {
        type: 0,
        pageNumber: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    if (variables.params.showId) {
      this.defaultNoticeOpen = parseInt(variables.params.showId);
    }
    this.getNoticeList();
  },
  methods: {
    // 获取广告数据
    getNoticeList(page) {
      const that = this;
      if (page) that.noticeParams.pageNumber = page;
      that.$api.getNoticeList(that.noticeParams).then(res => {
        if (res.result === 0) {
          let defaultNotice = {};
          res.data.forEach((e, i) => {
            if (e.id === that.defaultNoticeOpen) {
              defaultNotice = {
                item: { ...e },
                index: i,
              };
            }
            e.open = false;
          });
          that.noticeList = res.data || [];
          that.noticeTotal = res.total || 0;
          // 对showId参数通知ID 展开并标记为已读
          if (defaultNotice.item) {
            that.openNoticeItem(defaultNotice.item, defaultNotice.index);
          }
        } else {
          console.log(res);
        }
      });
    },
    // 收缩通知/展开通知并标记已读
    openNoticeItem(item, index) {
      const that = this;
      that.noticeList[index].open = !that.noticeList[index].open;
      if (item.isRead === 0) {
        that.$api
          .updateNoticeRead({
            id: item.id,
          })
          .then(res => {
            if (res.result === 0) {
              that.noticeList[index].isRead = 1;
            } else {
              that.$message.error(res.msg || '标记已读失败！');
            }
          });
      }
    },
    // 分页大小改变更新
    pageSizeChange(pageSize) {
      this.noticeParams.pageSize = pageSize;
      this.getNoticeList();
    },
  },
};
</script>

<style lang="less">
.content-container {
  padding: 30px 30px 30px 15px;
  color: #333333;
  .notice-title {
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
  }
  .notice-main {
    margin-top: 20px;
    background-color: #ffffff;
    .notice-list {
      .notice-item {
        padding: 30px 25px 0px;
        cursor: pointer;
        .n-container {
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(112, 112, 112, 0.15);
          .n-head {
            display: flex;
            justify-content: space-between;
            .n-title {
              flex: 1;
              font-size: 18px;
              line-height: 25px;
            }
            .n-info {
              display: flex;
              align-items: center;
              .n-tab {
                width: 65px;
                height: 25px;
                margin-right: 20px;
                line-height: 25px;
                text-align: center;
                background: rgba(248, 112, 36, 1);
                border-radius: 15px;
                font-size: 18px;
                line-height: 25px;
                color: #ffffff;
              }
              .n-date {
                margin-right: 10px;
                font-size: 15px;
                line-height: 21px;
                color: #606060;
              }
              .n-icon {
                width: 20px;
                height: 10px;
                background-image: url(https://pic.zizaihome.com/711245d9-96bb-46fe-93cb-1a49b20c7426.png);
                background-size: 100%;
              }
            }
          }
          .n-content {
            display: none;
            margin-top: 10px;
            .n-content-text {
              font-size: 16px;
              line-height: 26px;
              word-break: break-all;
              color: #606060;
            }
            .n-url {
              display: inline-block;
              margin-top: 10px;
              color: #6293e2;
            }
          }
        }
      }
      .notice-open {
        background: rgba(152, 194, 246, 0.15);
        .n-container {
          .n-head {
            .n-info {
              .n-icon {
                transform: rotate(180deg);
              }
            }
          }
          .n-content {
            display: block;
          }
        }
      }
      .notice-item:last-child {
        .n-container {
          border-bottom: none;
        }
      }
    }
  }

  .list-null {
    height: 600px;
    padding-top: 160px;
    text-align: center;
    .l-img {
      > img {
        width: 150px;
      }
    }
    .l-text {
      margin-top: 25px;
      font-size: 16px;
    }
    .l-btn {
      display: block;
      margin: 66px auto 0;
      width: 234px;
      height: 47px;
      line-height: 47px;
      text-align: center;
      background: rgba(113, 186, 49, 1);
      border-radius: 24px;
      font-size: 18px;
      color: #ffffff;
    }
    .l-btn:hover {
      text-decoration: none;
    }
  }
}
</style>
