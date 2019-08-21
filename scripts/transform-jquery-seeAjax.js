const names = {
  getList: 'getList',
  getTag: 'getTag',
  updateTag: 'updateTag',
  delTag: 'delTag',
  addMeritToGroup: 'addMeritToGroup',
  delMeritFromGroup: 'delMeritFromGroup',
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
