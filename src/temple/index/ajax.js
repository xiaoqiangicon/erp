import $ from 'jquery';
import seeAjax from 'see-ajax';
import handle from './ajax_handle';

const configs = {
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
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('upload', {
  url: configs.url.upload,
  requestKeys: configs.requestKeys.upload,
  preHandle: configs.preHandle.upload,
  responseRefactor: configs.responseRefactor.upload,
  postHandle: configs.postHandle.upload,
});

seeAjax.config('buddhist', {
  url: configs.url.buddhist,
  requestKeys: configs.requestKeys.buddhist,
  preHandle: configs.preHandle.buddhist,
  responseRefactor: configs.responseRefactor.buddhist,
  postHandle: configs.postHandle.buddhist,
});

seeAjax.config('article', {
  url: configs.url.article,
  requestKeys: configs.requestKeys.article,
  preHandle: configs.preHandle.article,
  responseRefactor: configs.responseRefactor.article,
  postHandle: configs.postHandle.article,
});

seeAjax.config('buddhistTypes', {
  url: configs.url.buddhistTypes,
  requestKeys: configs.requestKeys.buddhistTypes,
  preHandle: configs.preHandle.buddhistTypes,
  responseRefactor: configs.responseRefactor.buddhistTypes,
  postHandle: configs.postHandle.buddhistTypes,
});

seeAjax.config('savedData', {
  url: configs.url.savedData,
  requestKeys: configs.requestKeys.savedData,
  preHandle: configs.preHandle.savedData,
  responseRefactor: configs.responseRefactor.savedData,
  postHandle: configs.postHandle.savedData,
});

seeAjax.config('save', {
  method: ['post'],
  url: configs.url.save,
  requestKeys: configs.requestKeys.save,
  preHandle: configs.preHandle.save,
  responseRefactor: configs.responseRefactor.save,
  postHandle: configs.postHandle.save,
});

seeAjax.config('calendarBuddhist', {
  url: configs.url.calendarBuddhist,
  requestKeys: configs.requestKeys.calendarBuddhist,
  preHandle: configs.preHandle.calendarBuddhist,
  responseRefactor: configs.responseRefactor.calendarBuddhist,
  postHandle: configs.postHandle.calendarBuddhist,
});

seeAjax.config('calendarNewTitle', {
  url: configs.url.calendarNewTitle,
  requestKeys: configs.requestKeys.calendarNewTitle,
  preHandle: configs.preHandle.calendarNewTitle,
  responseRefactor: configs.responseRefactor.calendarNewTitle,
  postHandle: configs.postHandle.calendarNewTitle,
});

seeAjax.config('deleteActivityOfCalendar', {
  method: ['post'],
  url: configs.url.deleteActivityOfCalendar,
  requestKeys: configs.requestKeys.deleteActivityOfCalendar,
  preHandle: configs.preHandle.deleteActivityOfCalendar,
  responseRefactor: configs.responseRefactor.deleteActivityOfCalendar,
  postHandle: configs.postHandle.deleteActivityOfCalendar,
});

seeAjax.config('activitiesOfCalendar', {
  url: configs.url.activitiesOfCalendar,
  requestKeys: configs.requestKeys.activitiesOfCalendar,
  preHandle: configs.preHandle.activitiesOfCalendar,
  responseRefactor: configs.responseRefactor.activitiesOfCalendar,
  postHandle: configs.postHandle.activitiesOfCalendar,
});

seeAjax.config('articleTypes', {
  url: configs.url.articleTypes,
  requestKeys: configs.requestKeys.articleTypes,
  preHandle: configs.preHandle.articleTypes,
  responseRefactor: configs.responseRefactor.articleTypes,
  postHandle: configs.postHandle.articleTypes,
});

seeAjax.config('appTypes', {
  url: configs.url.appTypes,
  requestKeys: configs.requestKeys.appTypes,
  preHandle: configs.preHandle.appTypes,
  responseRefactor: configs.responseRefactor.appTypes,
  postHandle: configs.postHandle.appTypes,
});

seeAjax.config('deleteComponent', {
  url: configs.url.deleteComponent,
  requestKeys: configs.requestKeys.deleteComponent,
  preHandle: configs.preHandle.deleteComponent,
  responseRefactor: configs.responseRefactor.deleteComponent,
  postHandle: configs.postHandle.deleteComponent,
});

seeAjax.config('updateSort', {
  method: ['post'],
  url: configs.url.updateSort,
  requestKeys: configs.requestKeys.updateSort,
  preHandle: configs.preHandle.updateSort,
  responseRefactor: configs.responseRefactor.updateSort,
  postHandle: configs.postHandle.updateSort,
});

seeAjax.config('delGaoSeng', {
  url: configs.url.delGaoSeng,
  requestKeys: configs.requestKeys.delGaoSeng,
  preHandle: configs.preHandle.delGaoSeng,
  responseRefactor: configs.responseRefactor.delGaoSeng,
  postHandle: configs.postHandle.delGaoSeng,
});

seeAjax.config('delDianTang', {
  url: configs.url.delDianTang,
  requestKeys: configs.requestKeys.delDianTang,
  preHandle: configs.preHandle.delDianTang,
  responseRefactor: configs.responseRefactor.delDianTang,
  postHandle: configs.postHandle.delDianTang,
});
