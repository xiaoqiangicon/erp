/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'see-ajax', 'lib/jquery.seeAjax'], function($, seeAjax) {
  var env = __SEE_ENV__;

  seeAjax.default.setEnv(env);

  var requestKeysOuter = {
    addCategory: {
      name: 'name',
    },
    modifyCategory: {
      id: 'typeId',
      name: 'name',
    },
    deleteCategory: {
      id: 'typeId',
    },
    getArticle: {
      id: 'articleId',
    },
    addArticle: {
      title: 'title',
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
      status: 'status',
      showTitle: 'isShowTitle',
      showSupport: 'isShowZanBtn',
    },
    updateArticle: {
      id: 'articleId',
      title: 'title',
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
      status: 'status',
      showTitle: 'isShowTitle',
      showSupport: 'isShowZanBtn',
    },
  };
  var responseRefactorOuter = {
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
  var preHandleOuter = {};
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: env, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 分类
      categories: 'categories',
      // 添加分类
      addCategory: 'addCategory',
      // 修改分类
      modifyCategory: 'modifyCategory',
      // 删除分类
      deleteCategory: 'deleteCategory',
      // 添加文章
      addArticle: 'addArticle',
      // 更新文章
      updateArticle: 'updateArticle',
      // 获取已发布的文章
      getArticle: 'getArticle',
      // 转存其他服务器上的图片到我们自己的服务器
      saveOtherSiteImage: 'saveOtherSiteImage',
    },
    //url请求地址
    url: {
      categories: [
        '/zzhadmin/articleGetArticleTypeList/',
        '/src/article/index/mock/categories_server.json',
        '/src/article/index/mock/categories.json',
      ],
      addCategory: [
        '/zzhadmin/addArticleType/',
        '/src/article/create/mock/add_category_server.json',
        '/src/article/create/mock/add_category.json',
      ],
      modifyCategory: [
        '/zzhadmin/updateArticleType/',
        '/src/article/create/mock/modify_category_server.json',
        '/src/article/create/mock/modify_category.json',
      ],
      deleteCategory: [
        '/zzhadmin/delArticleType/',
        '/src/article/create/mock/delete_category_server.json',
        '/src/article/create/mock/delete_category.json',
      ],
      addArticle: [
        '/zzhadmin/addArticle/',
        '/src/article/create/mock/add_article_server.json',
        '/src/article/create/mock/add_article.json',
      ],
      updateArticle: [
        '/zzhadmin/updateArticle/',
        '/src/article/create/mock/update_article_server.json',
        '/src/article/create/mock/update_article.json',
      ],
      getArticle: [
        '/zzhadmin/getArticle/',
        '/src/article/create/mock/get_article_server.json',
        '/src/article/create/mock/get_article.json',
      ],
      saveOtherSiteImage: ['/zzhadmin/uploadPic/', '', ''],
    },
    // 请求参数
    requestKeys: {
      addCategory: [
        requestKeysOuter.addCategory,
        requestKeysOuter.addCategory,
        {
          name: 'name',
        },
      ],
      modifyCategory: [
        requestKeysOuter.modifyCategory,
        requestKeysOuter.modifyCategory,
        {
          id: 'id',
          name: 'name',
        },
      ],
      deleteCategory: [
        requestKeysOuter.deleteCategory,
        requestKeysOuter.deleteCategory,
        {
          id: 'id',
        },
      ],
      addArticle: [
        requestKeysOuter.addArticle,
        requestKeysOuter.addArticle,
        {
          title: 'title',
          category: 'category',
          cover: 'cover',
          content: 'content',
          introduction: 'introduction',
          usePay: 'usePay',
          payDisplay: 'payDisplay',
          payDefault: 'payDefault',
          payGuide: 'payGuide',
          showCoverInDetail: 'showCoverInDetail',
          showTempleWebsite: 'showTempleWebsite',
          publishTime: 'publishTime',
          status: 'status',
          showTitle: 'showTitle',
          showSupport: 'showSupport',
        },
      ],
      updateArticle: [
        requestKeysOuter.updateArticle,
        requestKeysOuter.updateArticle,
        {
          id: 'id',
          title: 'title',
          category: 'category',
          cover: 'cover',
          content: 'content',
          introduction: 'introduction',
          usePay: 'usePay',
          payDisplay: 'payDisplay',
          payDefault: 'payDefault',
          payGuide: 'payGuide',
          showCoverInDetail: 'showCoverInDetail',
          showTempleWebsite: 'showTempleWebsite',
          publishTime: 'publishTime',
          status: 'status',
          showTitle: 'showTitle',
          showSupport: 'showSupport',
        },
      ],
      getArticle: [
        requestKeysOuter.getArticle,
        requestKeysOuter.getArticle,
        {
          id: 'id',
        },
      ],
      saveOtherSiteImage: [
        {
          image: 'picUrl',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      getArticle: [
        responseRefactorOuter.getArticle,
        responseRefactorOuter.getArticle,
      ],
    },
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
