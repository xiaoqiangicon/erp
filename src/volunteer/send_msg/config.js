import juicer from 'juicer';
var appConfig = {
  environment: 0,
};
appConfig.template = appConfig.template || {};
appConfig.template.component = {};
appConfig.template.component.text_list = [
  '{@if data}',
  '{@each data as item, index}',
  '<tr>',
  '<td>${item.msg}</td>',
  '<td>${item.sendDate}</td>',
  '<td>${item.peopleCnt}</td>',
  '<td>${item.msgCnt}</td>',
  '</tr>',
  '{@/each}',
  '{@/if}',
].join('');
appConfig.template.component.group = [
  '{@if typeof data !=="undefined" && data !==null && data !==""}',
  '{@each data as item, index}',
  '<option value="${item.id}">${item.name}</option>',
  '{@/each}',
  '{@/if}',
].join('');
export default appConfig;
