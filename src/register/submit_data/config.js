/**
 * Created by Linfe on 2017/6/15.
 */
define(['juicer'], function() {
  var appConfig = {
    environment: 0, //环境标识（用于数组选值）：0->服务器环境, 1->本地环境
  };

  // 模板
  appConfig.template = appConfig.template || {};
  //组件
  appConfig.template.component = {};
  appConfig.template.component.uploadBoxs = [
    '{@each data as item,index}',
    '{@if item != ""}',
    '<div class="uploadImg">',
    '<img src="${item}" alt="" data-id="uploadOthers">',
    '<span class="deleteOthersImg" data-type="deleteOthersImg"></span>',
    '</div>',
    '{@/if}',
    '{@/each}',
    '<div class="uploadImg"><img src="" alt="" data-id="uploadOthers"></div>',
  ].join('');

  appConfig.template.component.uploadBox = [
    '<div class="uploadImg"><img src="" alt="" data-id="uploadOthers"></div>',
  ].join('');

  appConfig.template.component.deleteUpload = [
    '<span class="deleteOthersImg" data-type="deleteOthersImg"></span>',
  ].join('');

  return appConfig;
});
