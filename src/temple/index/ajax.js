/**
 * Created by senntyou on 2016/12/5.
 */
define(['jquery', 'see-ajax', './ajax_handle', 'lib/jquery.seeAjax'], function(
  $,
  seeAjax,
  handle
) {
  var env = __SEE_ENV__;

  seeAjax.default.setEnv(env);

  //ajax请求相关
  $.seeAjax.config({
    environment: env,
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 上传
      upload: 'upload',
      // 请求佛事
      buddhist: 'buddhist',
      // 请求文章
      article: 'article',
      // 佛事类型
      buddhistTypes: 'buddhistTypes',
      // 获取已添加的数据
      savedData: 'savedData',
      // 保存数据
      save: 'save',
      // 佛历组件请求佛事列表
      calendarBuddhist: 'calendarBuddhist',
      // 佛历添加新条目
      calendarNewTitle: 'calendarNewTitle',
      // 删除佛历已添加条目
      deleteActivityOfCalendar: 'deleteActivityOfCalendar',
      // 请求已添加的佛历数据
      activitiesOfCalendar: 'activitiesOfCalendar',
      // 文章类型
      articleTypes: 'articleTypes',
      // 应用分类
      appTypes: 'appTypes',
      // 删除组件
      deleteComponent: 'deleteComponent',
      // 更新组件顺序
      updateSort: 'updateSort',
      // 删除高僧法师子组件
      delGaoSeng: 'delGaoSeng',
      // 删除寺院殿堂子组件
      delDianTang: 'delDianTang',
    },
    //url请求地址
    url: {
      upload: [
        '/zzhadmin/uploadPic/',
        '/src/temple/index/mock/upload_server.json',
        '//localhost/server/',
      ],
      buddhist: [
        '/zzhadmin/getCeremonyList/',
        '/src/temple/index/mock/buddhist_server.json',
        '/src/temple/index/mock/buddhist.json',
      ],
      article: [
        '/zzhadmin/getArticleList/',
        '/src/temple/index/mock/article_server.json',
        '/src/temple/index/mock/article.json',
      ],
      buddhistTypes: [
        '/zzhadmin/getCeremonyTypeList/',
        '/src/temple/index/mock/buddhist_types_server.json',
        '/src/temple/index/mock/buddhist_types.json',
      ],
      savedData: [
        '/zzhadmin/getWebsiteSubassembly/',
        '/src/temple/index/mock/saved_data_server.json',
        '/src/temple/index/mock/saved_data.json',
      ],
      save: [
        '/zzhadmin/updateAndAddSubassembly/',
        '/src/temple/index/mock/save_server.json',
        '/src/temple/index/mock/save.json',
      ],
      calendarBuddhist: [
        '/zzhadmin/getCeremonyList/',
        '/src/temple/index/mock/buddhist_server.json',
        '/src/temple/index/mock/calendar_buddhist.json',
      ],
      calendarNewTitle: [
        '',
        '',
        '/src/temple/index/mock/calendar_new_title.json',
      ],
      deleteActivityOfCalendar: [
        '/zzhadmin/calendarDelEvent/',
        '/src/temple/index/mock/calendar_delete_activity_server.json',
        '/src/temple/index/mock/calendar_delete_activity.json',
      ],
      activitiesOfCalendar: [
        '/zzhadmin/calendarEventList/',
        '/src/temple/index/mock/activities_of_calendar_server.json',
        '/src/temple/index/mock/activities_of_calendar.json',
      ],
      articleTypes: [
        '/zzhadmin/getArticleTypeList/',
        '/src/temple/index/mock/article_types_server.json',
        '/src/temple/index/mock/article_types.json',
      ],
      appTypes: [
        '/zzhadmin/getQuickEntryTypeList/',
        '/src/temple/index/mock/app_types_server.json',
        '/src/temple/index/mock/app_types.json',
      ],
      // 删除组件
      deleteComponent: [
        '/zzhadmin/delSubassembly/',
        '/src/temple/index/mock/delete_component_server.json',
        '/src/temple/index/mock/delete_component.json',
      ],
      updateSort: [
        '/zzhadmin/sortSubassembly/',
        '/src/temple/index/mock/update_sort_server.json',
        '/src/temple/index/mock/update_sort.json',
      ],
      delGaoSeng: [
        '/zzhadmin/delAbbotOrScence/',
        '/src/temple/index/mock/del_gao_seng_server.json',
        '/src/temple/index/mock/del_gao_seng.json',
      ],
      delDianTang: [
        '/zzhadmin/delAbbotOrScence/',
        '/src/temple/index/mock/del_dian_tang_server.json',
        '/src/temple/index/mock/del_dian_tang.json',
      ],
    },
    //请求的键名
    requestKeys: {
      //可以是一维数组，也可是二维数组，如果是一维数组，代表没有键，如果是二维数组，代表键值都有
      upload: [],
      buddhist: [
        handle.outerRequestKeys.buddhist,
        handle.outerRequestKeys.buddhist,
        {
          page: 'page',
          componentId: 'componentId',
        },
      ],
      article: [
        handle.outerRequestKeys.article,
        handle.outerRequestKeys.article,
        {
          page: 'page',
          componentId: 'componentId',
        },
      ],
      save: [
        handle.outerRequestKeys.save,
        handle.outerRequestKeys.save,
        {
          data: 'data',
        },
      ],
      calendarBuddhist: [
        handle.outerRequestKeys.calendarBuddhist,
        handle.outerRequestKeys.calendarBuddhist,
        {
          page: 'page',
        },
      ],
      calendarNewTitle: [
        handle.outerRequestKeys.calendarNewTitle,
        handle.outerRequestKeys.calendarNewTitle,
        {
          text: 'text',
        },
      ],
      deleteActivityOfCalendar: [
        handle.outerRequestKeys.deleteActivityOfCalendar,
        handle.outerRequestKeys.deleteActivityOfCalendar,
        {
          date: 'date',
          //type: 'type',
          // 根据后台的接口更改
          componentId: 'componentId',
          id: 'id',
        },
      ],
      activitiesOfCalendar: [
        handle.outerRequestKeys.activitiesOfCalendar,
        handle.outerRequestKeys.activitiesOfCalendar,
        {
          page: 'page',
          date: 'date',
          componentId: 'componentId',
        },
      ],
      deleteComponent: [
        handle.outerRequestKeys.deleteComponent,
        handle.outerRequestKeys.deleteComponent,
        {
          id: 'id',
          sortId: 'sortId',
        },
      ],
      updateSort: [
        handle.outerRequestKeys.updateSort,
        handle.outerRequestKeys.updateSort,
        {
          data: 'data',
        },
      ],
      delGaoSeng: [{ id: 'abbotId' }, { id: 'abbotId' }, { id: 'id' }],
      delDianTang: [{ id: 'scenceId' }, { id: 'scenceId' }, { id: 'id' }],
    },
    // 重构json数据
    responseRefactor: {
      buddhist: [
        handle.outerResponseRefactor.buddhist,
        handle.outerResponseRefactor.buddhist,
      ],
      article: [
        handle.outerResponseRefactor.article,
        handle.outerResponseRefactor.article,
      ],
      save: [
        handle.outerResponseRefactor.save,
        handle.outerResponseRefactor.save,
      ],
      buddhistTypes: [
        handle.outerResponseRefactor.buddhistTypes,
        handle.outerResponseRefactor.buddhistTypes,
      ],
      // 这个借口与图文组件的佛事数据后台接口是同一个，故使用同一个处理方式
      calendarBuddhist: [
        handle.outerResponseRefactor.buddhist,
        handle.outerResponseRefactor.buddhist,
      ],
      activitiesOfCalendar: [
        handle.outerResponseRefactor.activitiesOfCalendar,
        handle.outerResponseRefactor.activitiesOfCalendar,
      ],
      articleTypes: [
        handle.outerResponseRefactor.articleTypes,
        handle.outerResponseRefactor.articleTypes,
      ],
      appTypes: [
        handle.outerResponseRefactor.appTypes,
        handle.outerResponseRefactor.appTypes,
      ],
    },
    // pre handle
    preHandle: {
      buddhist: [
        handle.outerPreHandle.buddhist,
        handle.outerPreHandle.buddhist,
      ],
      article: [handle.outerPreHandle.article, handle.outerPreHandle.article],
      calendarBuddhist: [
        handle.outerPreHandle.calendarBuddhist,
        handle.outerPreHandle.calendarBuddhist,
      ],
      activitiesOfCalendar: [
        handle.outerPreHandle.activitiesOfCalendar,
        handle.outerPreHandle.activitiesOfCalendar,
      ],
    },
    // post handle
    postHandle: {
      common: [handle.outerPostHandle.common, handle.outerPostHandle.common],
      upload: [
        handle.outerPostHandle.upload,
        handle.outerPostHandle.upload,
        function(res) {
          typeof res.success == 'undefined' && (res.success = true);
        },
      ],
      buddhist: [
        handle.outerPostHandle.buddhist,
        handle.outerPostHandle.buddhist,
      ],
      article: [handle.outerPostHandle.article, handle.outerPostHandle.article],
      // 这个借口与图文组件的佛事数据后台接口是同一个，故使用同一个处理方式
      calendarBuddhist: [
        handle.outerPostHandle.buddhist,
        handle.outerPostHandle.buddhist,
      ],
      activitiesOfCalendar: [
        handle.outerPostHandle.activitiesOfCalendar,
        handle.outerPostHandle.activitiesOfCalendar,
      ],
      buddhistTypes: [
        handle.outerPostHandle.buddhistTypes,
        handle.outerPostHandle.buddhistTypes,
      ],
      articleTypes: [
        handle.outerPostHandle.articleTypes,
        handle.outerPostHandle.articleTypes,
      ],
      appTypes: [
        handle.outerPostHandle.appTypes,
        handle.outerPostHandle.appTypes,
      ],
    },
  });
});
