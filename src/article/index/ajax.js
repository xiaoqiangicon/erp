import $ from "jquery";
import "lib/jquery.seeAjax";
var statuses = {
  1: "草稿",
  2: "正式发布",
  3: "系统屏蔽"
};
var requestKeysOuter = {
  list: {
    category: "typeId",
    status: "status",
    searchKey: "title",
    page: "pageNumber"
  },
  deleteArticle: {
    id: "articleId"
  }
};
var responseRefactorOuter = {
  list: {
    data: [{
      cover: "pic",
      readCount: "read_num",
      support: "zan_num",
      payAmount: "price_sum"
    }]
  }
};
var preHandleOuter = {
  list: function (data) {
    data.pageNumber -= 1;
    data.pageSize = 20;
  }
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg != "undefined" && (res.message = res.msg);
  },
  list: function (res) {
    res.totalPages = Math.ceil((res.total || 1) / 20);
    res.data.map(function (item) {
      item.statusInt = item.status;
      item.status = statuses[item.status];
    });
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    categories: "categories",
    list: "list",
    deleteArticle: "deleteArticle"
  },
  url: {
    categories: ["/zzhadmin/articleGetArticleTypeList/", "/src/article/index/mock/categories_server.json", "/src/article/index/mock/categories.json"],
    list: ["/zzhadmin/articleGetArticleList/", "/src/article/index/mock/list_server.json", "/src/article/index/mock/list.json"],
    deleteArticle: ["/zzhadmin/delArticle/", "/src/article/index/mock/delete_article_server.json", "/src/article/index/mock/delete_article.json"]
  },
  requestKeys: {
    list: [requestKeysOuter.list, requestKeysOuter.list, {
      category: "category",
      status: "status",
      searchKey: "searchKey",
      page: "page"
    }],
    deleteArticle: [requestKeysOuter.deleteArticle, requestKeysOuter.deleteArticle, {
      id: "id"
    }]
  },
  responseRefactor: {
    list: [responseRefactorOuter.list, responseRefactorOuter.list]
  },
  preHandle: {
    list: [preHandleOuter.list, preHandleOuter.list]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    list: [postHandleOuter.list, postHandleOuter.list]
  }
});
