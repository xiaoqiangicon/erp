/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var statuses = {
    1: '草稿',
    2: '正式发布',
    3: '系统屏蔽',
  };
  var requestKeysOuter = {
    list: {
      category: 'typeId',
      status: 'status',
      searchKey: 'title',
      page: 'pageNumber',
    },
    deleteArticle: {
      id: 'articleId',
    },
  };
  var responseRefactorOuter = {
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
  var preHandleOuter = {
    list: function(data) {
      data.pageNumber -= 1;
      data.pageSize = 20;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
    list: function(res) {
      res.nextPage = res.pageNumber + 1;
      res.data.map(function(item) {
        item.statusInt = item.status;
        item.status = statuses[item.status];
      });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 分类
      categories: 'categories',
      // 获取捐赠列表
      list: 'list',
      // 删除文章
      deleteArticle: 'deleteArticle',
    },
    //url请求地址
    url: {
      categories: [
        '/zzhadmin/articleGetArticleTypeList/',
        '/src/article/index/mock/categories_server.json',
        '/src/article/index/mock/categories.json',
      ],
      list: [
        '/zzhadmin/articleGetArticleList/',
        '/src/article/index/mock/list_server.json',
        '/src/article/index/mock/list.json',
      ],
      deleteArticle: [
        '/zzhadmin/delArticle/',
        '/src/article/index/mock/delete_article_server.json',
        '/src/article/index/mock/delete_article.json',
      ],
    },
    // 请求参数
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          category: 'category',
          status: 'status',
          searchKey: 'searchKey',
          page: 'page',
        },
      ],
      deleteArticle: [
        requestKeysOuter.deleteArticle,
        requestKeysOuter.deleteArticle,
        {
          id: 'id',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
    },
    //ajax请求前置处理
    preHandle: {
      list: [preHandleOuter.list, preHandleOuter.list],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      list: [postHandleOuter.list, postHandleOuter.list],
    },
  });
});
