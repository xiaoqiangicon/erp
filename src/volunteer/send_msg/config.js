/**
 * Created by Linfe on 2017/7/6.
 */
define(['juicer'], function() {
  var appConfig = {
    environment: 0, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
  };

  appConfig.template = appConfig.template || {};
  //组件
  appConfig.template.component = {};

  // 短信列表模板
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
  // 获取用户标签模板
  appConfig.template.component.group = [
    '{@if typeof data !=="undefined" && data !==null && data !==""}',
    '{@each data as item, index}',
    '<option value="${item.id}">${item.name}</option>',
    '{@/each}',
    '{@/if}',
  ].join('');

  return appConfig;
});
