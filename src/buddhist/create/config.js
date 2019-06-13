/**
 * Created by Linfe on 2017/3/1.
 */
define([
  './tpl/sub',
  './tpl/ps',
  './tpl/sub_ps',
  './tpl/fb',
  './tpl/modal_saving',
  './tpl/modal_set_tpl',
], function(sub, ps, subPs, fb, modalSaving, modalSetTpl) {
  var appConfig = {
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
  };
  appConfig.argument = {};
  // 附言拟态框的标题文本列表
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
  // URL
  appConfig.urls = appConfig.urls || {};
  var buddistTypeList = [
    '/zzhadmin/createCeremonyTypeList',
    '/src/buddhist/mock/type_list.json',
  ];
  // 标签URL
  appConfig.urls.buddhist = {};
  appConfig.urls.buddhist.typeList = buddistTypeList[appConfig.environment];
  //组件
  appConfig.template.component = {};

  // 选择项模板
  appConfig.template.component.size_tmp = sub;
  // 附言模板
  appConfig.template.component.additionItem_tmp = ps;
  // 选择项附言模板
  appConfig.template.component.sizesAdditionItem_tmp = subPs;
  // 反馈信息模板
  appConfig.template.component.pay_succ_details = fb;
  // 保存中弹框
  appConfig.template.component.savingModal = modalSaving;
  // 设置佛事模板弹框
  appConfig.template.component.templateSetting = modalSetTpl;

  // option
  appConfig.template.component.option = `<option value="\${value}">\${text}</option>`;
  // feedbackType
  appConfig.template.component.feedbackType = `<div data-ele="feedback-type" data-type="\${value}" class="item">\${text}</div>`;
  // 设置打印小票中的选择项列表模板
  appConfig.template.component.print_tmp = `
  {@each data as item, index}
    <div class="selection_div">
    <input type="checkbox" class="selection_checkbox" data-type="selection_checkbox" data-sort="\${item.curId}">
    <span class="selection_content">\${item.name}</span>
    </div>
  {@/each}
  `;
  // 设置打印小票中的无选择项时打印机列表模板
  appConfig.template.component.print_list = `
    {@each data as item, index}
      <div class="printer_div">
      <input type="checkbox" class="printer_checkbox" data-id="\${item.id}" data-type="no_selection_printer_div">
      <span class="printer_content">\${item.address}</span>
      </div>
    {@/each}
  `;
  // 特殊选择项附言预览弹框
  appConfig.template.component.spclSubPsOverview = `
    <div class="spcl-sub-ps-overview-pane" data-ele="spcl-sub-ps-overview-modal-\${index}"><img src="\${src}" /></div>
  `;

  return appConfig;
});
