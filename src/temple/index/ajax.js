import $ from 'jquery';
import seeAjax from 'see-ajax';
import handle from './ajax_handle';
import 'lib/jquery.seeAjax';
var env = __SEE_ENV__;
seeAjax.setEnv(env);
$.seeAjax.config({
  environment: env,
  name: {
    upload: 'upload',
    buddhist: 'buddhist',
    article: 'article',
    buddhistTypes: 'buddhistTypes',
    savedData: 'savedData',
    save: 'save',
    calendarBuddhist: 'calendarBuddhist',
    calendarNewTitle: 'calendarNewTitle',
    deleteActivityOfCalendar: 'deleteActivityOfCalendar',
    activitiesOfCalendar: 'activitiesOfCalendar',
    articleTypes: 'articleTypes',
    appTypes: 'appTypes',
    deleteComponent: 'deleteComponent',
    updateSort: 'updateSort',
    delGaoSeng: 'delGaoSeng',
    delDianTang: 'delDianTang',
  },
  url: {
    upload: [
      '/zzhadmin/uploadPic/',
      '/src/temple/index/mock/upload.json',
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
  requestKeys: {
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
    delGaoSeng: [
      {
        id: 'abbotId',
      },
      {
        id: 'abbotId',
      },
      {
        id: 'id',
      },
    ],
    delDianTang: [
      {
        id: 'scenceId',
      },
      {
        id: 'scenceId',
      },
      {
        id: 'id',
      },
    ],
  },
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
  preHandle: {
    buddhist: [handle.outerPreHandle.buddhist, handle.outerPreHandle.buddhist],
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
