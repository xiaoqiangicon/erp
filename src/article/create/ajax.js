import $ from 'jquery';
import seeAjax from 'see-ajax';

var requestKeys = {
  modifyCategory: {
    id: 'typeId',
  },
  deleteCategory: {
    id: 'typeId',
  },
  getArticle: {
    id: 'articleId',
  },
  addArticle: {
    category: 'typeId',
    cover: 'pic',
    content: 'detail',
    introduction: 'synopsis',
    usePay: 'isOpenSuiXi',
    payDisplay: 'suixiBtnName',
    payDefault: 'suixiList',
    payGuide: 'suixiDetail',
    showCoverInDetail: 'picIsShowDetail',
    showTempleWebsite: 'isShowTemple',
    publishTime: 'publicTime',
    showTitle: 'isShowTitle',
    showSupport: 'isShowZanBtn',
  },
  updateArticle: {
    id: 'articleId',
    category: 'typeId',
    cover: 'pic',
    content: 'detail',
    introduction: 'synopsis',
    usePay: 'isOpenSuiXi',
    payDisplay: 'suixiBtnName',
    payDefault: 'suixiList',
    payGuide: 'suixiDetail',
    showCoverInDetail: 'picIsShowDetail',
    showTempleWebsite: 'isShowTemple',
    publishTime: 'publicTime',
    showTitle: 'isShowTitle',
    showSupport: 'isShowZanBtn',
  },
};
var responseRefactor = {
  getArticle: {
    data: {
      category: 'typeId',
      cover: 'pic',
      content: 'detail',
      introduction: 'synopsis',
      usePay: 'isOpenSuiXi',
      payDisplay: 'suixiBtnName',
      payDefault: 'suixiList',
      payGuide: 'suixiDetail',
      showCoverInDetail: 'picIsShowDetail',
      showTempleWebsite: 'isShowTemple',
      publishTime: 'publicTime',
      showTitle: 'isShowTitle',
      showSupport: 'isShowZanBtn',
    },
  },
};
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
};

var env = __SEE_ENV__;
seeAjax.setEnv(env);

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
seeAjax.config('addCategory', {
  url: [
    '/zzhadmin/addArticleType/',
    '/src/article/create/mock/add_category_server.json',
    '/src/article/create/mock/add_category.json',
  ],
});
seeAjax.config('modifyCategory', {
  url: [
    '/zzhadmin/updateArticleType/',
    '/src/article/create/mock/modify_category_server.json',
    '/src/article/create/mock/modify_category.json',
  ],
  requestKeys: [requestKeys.modifyCategory, requestKeys.modifyCategory],
});
seeAjax.config('deleteCategory', {
  url: [
    '/zzhadmin/delArticleType/',
    '/src/article/create/mock/delete_category_server.json',
    '/src/article/create/mock/delete_category.json',
  ],
  requestKeys: [requestKeys.deleteCategory, requestKeys.deleteCategory],
});
seeAjax.config('addArticle', {
  method: ['post'],
  url: [
    '/zzhadmin/addArticle/',
    '/src/article/create/mock/add_article_server.json',
    '/src/article/create/mock/add_article.json',
  ],
  requestKeys: [requestKeys.addArticle, requestKeys.addArticle],
});
seeAjax.config('updateArticle', {
  method: ['post'],
  url: [
    '/zzhadmin/updateArticle/',
    '/src/article/create/mock/update_article_server.json',
    '/src/article/create/mock/update_article.json',
  ],
  requestKeys: [requestKeys.updateArticle, requestKeys.updateArticle],
});
seeAjax.config('getArticle', {
  url: [
    '/zzhadmin/getArticle/',
    '/src/article/create/mock/get_article_server.json',
    '/src/article/create/mock/get_article.json',
  ],
  requestKeys: [requestKeys.getArticle, requestKeys.getArticle],
  responseRefactor: [responseRefactor.getArticle, responseRefactor.getArticle],
});
seeAjax.config('saveOtherSiteImage', {
  url: ['/zzhadmin/uploadPic/', '', ''],
  requestKeys: [
    {
      image: 'picUrl',
    },
  ],
});
