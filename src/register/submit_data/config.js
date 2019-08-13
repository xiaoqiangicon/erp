import 'juicer';
var appConfig = {
  environment: 0,
};
appConfig.template = appConfig.template || {};
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
export default appConfig;
