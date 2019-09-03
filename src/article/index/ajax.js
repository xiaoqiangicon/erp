import $ from 'jquery';
import seeAjax from 'see-ajax';
var statuses = {
  1: '草稿',
  2: '正式发布',
  3: '系统屏蔽',
};
var requestKeys = {
  list: {
    category: 'typeId',
    searchKey: 'title',
    page: 'pageNumber',
  },
  deleteArticle: {
    id: 'articleId',
  },
};
var responseRefactor = {
  list: {
    data: [
      {
        cover: 'pic',
        readCount: 'read_num',
        support: 'zan_num',
        payAmount: 'price_sum',
      },
    ],
  },
};
var preHandle = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = 20;
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  list: function(res) {
    res.totalPages = Math.ceil((res.total || 1) / 20);
    res.data.map(function(item) {
      item.statusInt = item.status;
      item.status = statuses[item.status];
    });
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: [postHandle.common, postHandle.common],
});

seeAjax.config('categories', {
  url: [
    '/zzhadmin/articleGetArticleTypeList/',
    '/src/article/index/mock/categories_server.json',
    '/src/article/index/mock/categories.json',
  ],
});
seeAjax.config('list', {
  url: [
    '/zzhadmin/articleGetArticleList/',
    '/src/article/index/mock/list_server.json',
    '/src/article/index/mock/list.json',
  ],
  requestKeys: [requestKeys.list, requestKeys.list],
  responseRefactor: [responseRefactor.list, responseRefactor.list],
  preHandle: [preHandle.list, preHandle.list],
  postHandle: [postHandle.list, postHandle.list],
});
seeAjax.config('deleteArticle', {
  url: [
    '/zzhadmin/delArticle/',
    '/src/article/index/mock/delete_article_server.json',
    '/src/article/index/mock/delete_article.json',
  ],
  requestKeys: [requestKeys.deleteArticle, requestKeys.deleteArticle],
});
