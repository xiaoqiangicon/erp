/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  'old/toast',
  './../data',
  './../api',
  './../tpl',
  './../function',
  'toastr',
  'jquery-confirm',
  './../ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, Toast, Data, api, tpl, func, toastr) {
  $.seeView({
    events: {
      // 点击加入关注分组
      'click #add-to-follow': 'onClickAddToFollow',
      // 点击保存功德主为某些关注分组
      'click #save-add-to-follow': 'onClickSaveAddToFollow',
      // 点击详情操作
      'click [data-opt="detl"]': 'onClickOptDetl',
    },
    // 点击加入关注分组
    onClickAddToFollow: function(e) {
      var $modal = $('#add-to-follow-modal');
      api.getTag({}, function(res) {
        if (res.data.length) {
          func.renderTagSelect(Data.getTagHandleData);
          $modal.modal('show');
        } else {
          toastr.error('当前无任何分组,请前往添加！');
        }
      });
    },
    // 点击保存功德主为某些关注分组
    onClickSaveAddToFollow: function(e) {
      var $modal = $('#add-to-follow-modal'),
        $select = $('[data-ele="tag-select"]'),
        tagIds = $select.val(), // 单个也字符串数组 未选中为null
        userIds = Data.getUserInfoParams.id.toString();
      if (tagIds) {
        tagIds = tagIds.join(',');
        api.addMeritToGroup({ tagIds: tagIds, userIds: userIds }, function() {
          toastr.success('添加成功！');
          $modal.modal('hide');
          api.getTag({ userId: Data.getUserInfoParams.id }, function(res) {
            func.renderTag(res);
          });
        });
      } else {
        toastr.error('请选择分组！');
      }
    },
    // 点击详情操作
    onClickOptDetl: function(e) {
      e.preventDefault();
      var $curTar = $(e.currentTarget),
        typeId = parseInt($curTar.attr('data-typeId')),
        orderId = parseInt($curTar.attr('data-orderId'));
      if (typeId === 2) {
        api.getBuddhistOrderDetl({ id: orderId }, function(res) {
          func.renderBuddhistDetlModal(res);
        });
      } else if (typeId === 4) {
        api.getWallOrderDetl({ id: orderId }, function(res) {
          func.renderWallDetlModal(res);
        });
      } else {
      }
    },
  });
});
