import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import Toast from 'old/toast';
import Data from './../data';
import api from './../api';
import tpl from './../tpl';
import func from './../function';
import toastr from 'toastr';
import 'jquery-confirm';
import './../ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click #add-to-follow': 'onClickAddToFollow',
    'click #save-add-to-follow': 'onClickSaveAddToFollow',
    'click [data-opt="detl"]': 'onClickOptDetl',
  },
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
  onClickSaveAddToFollow: function(e) {
    var $modal = $('#add-to-follow-modal'),
      $select = $('[data-ele="tag-select"]'),
      tagIds = $select.val(),
      userIds = Data.getUserInfoParams.id.toString();
    if (tagIds) {
      tagIds = tagIds.join(',');
      api.addMeritToGroup(
        {
          tagIds: tagIds,
          userIds: userIds,
        },
        function() {
          toastr.success('添加成功！');
          $modal.modal('hide');
          api.getTag(
            {
              userId: Data.getUserInfoParams.id,
            },
            function(res) {
              func.renderTag(res);
            }
          );
        }
      );
    } else {
      toastr.error('请选择分组！');
    }
  },
  onClickOptDetl: function(e) {
    e.preventDefault();
    var $curTar = $(e.currentTarget),
      typeId = parseInt($curTar.attr('data-typeId')),
      orderId = parseInt($curTar.attr('data-orderId'));
    if (typeId === 2) {
      api.getBuddhistOrderDetl(
        {
          id: orderId,
        },
        function(res) {
          func.renderBuddhistDetlModal(res);
        }
      );
    } else if (typeId === 4) {
      api.getWallOrderDetl(
        {
          id: orderId,
        },
        function(res) {
          func.renderWallDetlModal(res);
        }
      );
    } else {
    }
  },
});
