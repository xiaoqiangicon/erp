/**
 * Created by Linfe on 2017/3/13.
 */
define(['juicer'], function() {
  var appConfig = {
    environment: 0, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试
  };
  // 模板
  appConfig.template = appConfig.template || {};
  // 组件
  appConfig.template.component = {};
  // 价格类型模板
  appConfig.template.component.menu_list = [
    '<li class="my-logo custom-link">',
    '<a href="/" target="_blank" class="custom-link"></a>',
    '</li>',
    '{@each data as item, index}',
    '<li class="chapter">',
    '<a href="javascript:void[0]" data-id="${item.id}" class="firstMenu">',
    '${item.name}',
    '</a>',
    '{@if item.contentList && item.contentList.length>0}',
    '<ul class="articles">',
    '{@each item.contentList as subitem, subindex}',
    '<li class="chapter sub_chapter">',
    '<a href="/zzhadmin/helpIndex/?contentId=${subitem.id}" data-id="${subitem.id}">',
    '${subitem.title}',
    '</a>',
    '</li>',
    '{@/each}',
    '</ul>',
    '{@/if}',
    '</li>',
    '{@/each}',
  ].join(' ');

  appConfig.template.component.help_content = [
    '<h1 id="${id}">${title}</h1>',
    '<div class="addTimeDiv"><span class="addTime">${addTime}</span></div>',
    '$${content}',
    '{@if preContent != ""}',
    '<div id="prevArticle">上一条: <a href="/zzhadmin/helpIndex/?contentId=${preContent.id}" data-id="${preContent.id}">${preContent.title}</a></div>',
    '{@/if}',
    '{@if nextContent != ""}',
    '<div id="nextArticle">下一条: <a href="/zzhadmin/helpIndex/?contentId=${nextContent.id}" data-id="${nextContent.id}">${nextContent.title}</a></div>',
    '{@/if}',
  ].join(' ');
  return appConfig;
});
