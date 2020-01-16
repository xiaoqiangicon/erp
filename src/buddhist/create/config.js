import sub from './tpl/sub';
import ps from './tpl/ps';
import subPs from './tpl/sub_ps';
import fb from './tpl/fb';
import modalSaving from './tpl/modal_saving';
import modalSetTpl from './tpl/modal_set_tpl';
var appConfig = {
  environment: __SEE_ENV__,
};
appConfig.argument = {};
appConfig.argument.addition_list = [
  '',
  '自定义-单行文本框',
  '自定义-日期选择',
  '自定义-下拉列表',
  '联系人',
  '手机号码',
  '地址',
  '自定义-多行文本框',
  '性别',
  '出生日期',
  '阳上人',
  '往生者',
  '功德芳名',
  '自定义-提示框',
  '自定义-图片上传',
  '心愿',
];
appConfig.template = appConfig.template || {};
appConfig.urls = appConfig.urls || {};
var buddistTypeList = [
  '/zzhadmin/createCeremonyTypeList',
  '/src/buddhist/mock/type_list.json',
];
appConfig.urls.buddhist = {};
appConfig.urls.buddhist.typeList = buddistTypeList[appConfig.environment];
appConfig.template.component = {};
appConfig.template.component.size_tmp = sub;
appConfig.template.component.additionItem_tmp = ps;
appConfig.template.component.sizesAdditionItem_tmp = subPs;
appConfig.template.component.pay_succ_details = fb;
appConfig.template.component.savingModal = modalSaving;
appConfig.template.component.templateSetting = modalSetTpl;
appConfig.template.component.option = `<option value="\${value}">\${text}</option>`;
appConfig.template.component.feedbackType = `<div data-ele="feedback-type" data-type="\${value}" class="item">\${text}</div>`;
appConfig.template.component.print_tmp = `
  {@each data as item, index}
    <div class="selection_div">
    <input type="checkbox" class="selection_checkbox" data-type="selection_checkbox" data-sort="\${item.curId}">
    <span class="selection_content">\${item.name}</span>
    </div>
  {@/each}
  `;
appConfig.template.component.print_list = `
    {@each data as item, index}
      <div class="printer_div">
      <input type="checkbox" class="printer_checkbox" data-id="\${item.id}" data-type="no_selection_printer_div">
      <span class="printer_content">\${item.address}</span>
      </div>
    {@/each}
  `;
appConfig.template.component.spclSubPsOverview = `
    <div class="spcl-sub-ps-overview-pane" data-ele="spcl-sub-ps-overview-modal-\${index}"><img src="\${src}" /></div>
  `;
export default appConfig;
