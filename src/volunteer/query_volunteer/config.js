/**
 * Created by Linfe on 2017/4/1.
 */
define(['./images', 'juicer'], function(images) {
  var appConfig = {
    environment: 0, //环境标识（用于数组选值）：0->',服务器环境, 1->',本地服务器测试
  };
  // 模板
  appConfig.template = appConfig.template || {};
  // 组件
  appConfig.template.component = {};
  // 义工面板列表模板
  appConfig.template.component.volunteer_panel_temp = [
    '{@each data as item, index}',
    '<div class="volGroupPanel" data-id="${item.volunteer_id}">',
    '<div class="panelTop jsMaskWrp">',
    '<div class="topleft pull-left">',
    '{@if item.head_img == ""}',
    '{@if item.sex == "男"}',
    '<img src="' + images.maleImage + '" alt="头像" class="portrait"/>',
    '{@else if item.sex == "女"}',
    '<img src="' + images.femaleImage + '" alt="默认头像" class="portrait"/>',
    '{@else}',
    '<img src="' + images.userImage + '" alt="默认头像" class="portrait"/>',
    '{@/if}',
    '{@else}',
    '<img src="${item.head_img}" alt="头像" class="portrait"/>',
    '{@/if}',
    '</div>',
    '<div class="topRight pull-right">',
    '<div class="">',
    '<span class="apostrophes">${item.name}</span>',
    '<span class="pull-right addMargin">${item.age}岁</span>',
    '<span class="pull-right addMargin">${item.sex}</span>',
    '</div>',
    '<div>',
    '{@if item.signup_way == 1}',
    '<span class="apostrophe">微信名：</span><span class="apostrophe" title="${item.nick_name}">${item.nick_name}</span>',
    '{@else}',
    '<span>来源：</span><span>',
    '{@if item.user_id>0}',
    '微信注册',
    '{@else}',
    '管理员录入',
    '{@/if}',
    '</span>',
    '{@/if}',
    '</div>',
    '</div>',
    '<div class="mask" data-id="${item.volunteer_id}">',
    '</div>',
    '<div class="maskDown" data-id="${item.volunteer_id}">',
    '</div>',
    '</div>',
    '<div class="panelBottom jsMaskWrp" data-id="${item.volunteer_id}">',
    '<div class="detailInfo">',
    '<div>',
    '<span>登记时间：</span><span>${item.register_time}</span>',
    '</div>',
    '<div>',
    '<span>手机号：</span><span>${item.mobile}</span>',
    '</div>',
    '<div>',
    '<span>工作单位：</span><span>${item.workplace}</span>',
    '</div>',
    '<div>',
    '<span>职务：</span><span>${item.job}</span>',
    '</div>',
    '<div class="labelSingle" data-id="${item.volunteer_id}" data-toggle="modal">',
    '<span>标签：</span>',
    '{@each item.tag as subItem, subIndex}',
    '<span data-type="tags" data-id="${subItem.tagId}" style="color: rgb(111, 186, 44)">${subItem.tagName}</span>',
    '{@/each}',
    '</div>',
    '</div>',
    '<div class="weChat-msg-del-box pull-right" data-id="${item.volunteer_id}">',
    '<span class="del-icon" data-tooltip="删除" data-toggle="popover"></span>',
    '</div>',
    '</div>',
    '</div>',
    '{@/each}',
  ].join(' ');
  // 义工标签模板
  appConfig.template.component.labelGroupTemp = [
    '{@each list as item,index}',
    '<label for="_checkbox_${index}" class="frm_checkbox_label">',
    '<i class="icon_checkbox"></i>',
    '<input type="checkbox" class="frm_checkbox" name="${item.id}" id="_checkbox_${index}" value="${item.name}">',
    '<span class="lbl_content">${item.name}</span>',
    '</label>',
    '{@/each}',
  ].join(' ');

  return appConfig;
});
