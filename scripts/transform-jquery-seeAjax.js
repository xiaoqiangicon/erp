const names = {
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
};
let tpl = `
seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});
`;
Object.keys(names).forEach(name => {
  tpl += `
seeAjax.config('${name}', {
  url: configs.url.${name},
  requestKeys: configs.requestKeys.${name},
  preHandle: configs.preHandle.${name},
  responseRefactor: configs.responseRefactor.${name},
  postHandle: configs.postHandle.${name},
});  
  `;
});

console.log(tpl);
