import $ from "jquery";
import seeAjax from "see-ajax";
import "lib/jquery.seeAjax";
var env = __SEE_ENV__;
seeAjax.setEnv(env);
var requestKeysOuter = {
  addCategory: {
    name: "name"
  },
  modifyCategory: {
    id: "typeId",
    name: "name"
  },
  deleteCategory: {
    id: "typeId"
  },
  getArticle: {
    id: "articleId"
  },
  addArticle: {
    title: "title",
    category: "typeId",
    cover: "pic",
    content: "detail",
    introduction: "synopsis",
    usePay: "isOpenSuiXi",
    payDisplay: "suixiBtnName",
    payDefault: "suixiList",
    payGuide: "suixiDetail",
    showCoverInDetail: "picIsShowDetail",
    showTempleWebsite: "isShowTemple",
    publishTime: "publicTime",
    status: "status",
    showTitle: "isShowTitle",
    showSupport: "isShowZanBtn"
  },
  updateArticle: {
    id: "articleId",
    title: "title",
    category: "typeId",
    cover: "pic",
    content: "detail",
    introduction: "synopsis",
    usePay: "isOpenSuiXi",
    payDisplay: "suixiBtnName",
    payDefault: "suixiList",
    payGuide: "suixiDetail",
    showCoverInDetail: "picIsShowDetail",
    showTempleWebsite: "isShowTemple",
    publishTime: "publicTime",
    status: "status",
    showTitle: "isShowTitle",
    showSupport: "isShowZanBtn"
  }
};
var responseRefactorOuter = {
  getArticle: {
    data: {
      category: "typeId",
      cover: "pic",
      content: "detail",
      introduction: "synopsis",
      usePay: "isOpenSuiXi",
      payDisplay: "suixiBtnName",
      payDefault: "suixiList",
      payGuide: "suixiDetail",
      showCoverInDetail: "picIsShowDetail",
      showTempleWebsite: "isShowTemple",
      publishTime: "publicTime",
      showTitle: "isShowTitle",
      showSupport: "isShowZanBtn"
    }
  }
};
var preHandleOuter = {};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg != "undefined" && (res.message = res.msg);
  }
};
$.seeAjax.config({
  environment: env,
  name: {
    categories: "categories",
    addCategory: "addCategory",
    modifyCategory: "modifyCategory",
    deleteCategory: "deleteCategory",
    addArticle: "addArticle",
    updateArticle: "updateArticle",
    getArticle: "getArticle",
    saveOtherSiteImage: "saveOtherSiteImage"
  },
  url: {
    categories: ["/zzhadmin/articleGetArticleTypeList/", "/src/article/index/mock/categories_server.json", "/src/article/index/mock/categories.json"],
    addCategory: ["/zzhadmin/addArticleType/", "/src/article/create/mock/add_category_server.json", "/src/article/create/mock/add_category.json"],
    modifyCategory: ["/zzhadmin/updateArticleType/", "/src/article/create/mock/modify_category_server.json", "/src/article/create/mock/modify_category.json"],
    deleteCategory: ["/zzhadmin/delArticleType/", "/src/article/create/mock/delete_category_server.json", "/src/article/create/mock/delete_category.json"],
    addArticle: ["/zzhadmin/addArticle/", "/src/article/create/mock/add_article_server.json", "/src/article/create/mock/add_article.json"],
    updateArticle: ["/zzhadmin/updateArticle/", "/src/article/create/mock/update_article_server.json", "/src/article/create/mock/update_article.json"],
    getArticle: ["/zzhadmin/getArticle/", "/src/article/create/mock/get_article_server.json", "/src/article/create/mock/get_article.json"],
    saveOtherSiteImage: ["/zzhadmin/uploadPic/", "", ""]
  },
  requestKeys: {
    addCategory: [requestKeysOuter.addCategory, requestKeysOuter.addCategory, {
      name: "name"
    }],
    modifyCategory: [requestKeysOuter.modifyCategory, requestKeysOuter.modifyCategory, {
      id: "id",
      name: "name"
    }],
    deleteCategory: [requestKeysOuter.deleteCategory, requestKeysOuter.deleteCategory, {
      id: "id"
    }],
    addArticle: [requestKeysOuter.addArticle, requestKeysOuter.addArticle, {
      title: "title",
      category: "category",
      cover: "cover",
      content: "content",
      introduction: "introduction",
      usePay: "usePay",
      payDisplay: "payDisplay",
      payDefault: "payDefault",
      payGuide: "payGuide",
      showCoverInDetail: "showCoverInDetail",
      showTempleWebsite: "showTempleWebsite",
      publishTime: "publishTime",
      status: "status",
      showTitle: "showTitle",
      showSupport: "showSupport"
    }],
    updateArticle: [requestKeysOuter.updateArticle, requestKeysOuter.updateArticle, {
      id: "id",
      title: "title",
      category: "category",
      cover: "cover",
      content: "content",
      introduction: "introduction",
      usePay: "usePay",
      payDisplay: "payDisplay",
      payDefault: "payDefault",
      payGuide: "payGuide",
      showCoverInDetail: "showCoverInDetail",
      showTempleWebsite: "showTempleWebsite",
      publishTime: "publishTime",
      status: "status",
      showTitle: "showTitle",
      showSupport: "showSupport"
    }],
    getArticle: [requestKeysOuter.getArticle, requestKeysOuter.getArticle, {
      id: "id"
    }],
    saveOtherSiteImage: [{
      image: "picUrl"
    }]
  },
  responseRefactor: {
    getArticle: [responseRefactorOuter.getArticle, responseRefactorOuter.getArticle]
  },
  preHandle: {},
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common]
  }
});
