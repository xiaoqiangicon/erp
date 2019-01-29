/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '@zzh/choose-image',
  'common/function',
  '../../data',
  '../../tpl/common',
  '../../tpl/person_saying',
  '../../../../util/dialog',
  '../../share',
  './util',
  'lib/jquery.seeView',
  'component/choose_icon_config/index',
], function(
  $,
  ChooseImage,
  commonFunc,
  indexData,
  commonTpl,
  figureTpl,
  dialog,
  share,
  util
) {
  var choose;

  $.seeView({
    events: {
      'click [data-edit-pop-figure-avatar-row-del]': 'clickAvatarRowDel',
      'click #edit-pop-figure-add-avatar': 'clickAddAvatar',
      'propertychange #edit-pop-figure-input-description':
        'changeInputDescription',
      'input #edit-pop-figure-input-description': 'changeInputDescription',
      'click #edit-pop-figure-ok': 'clickOk',
    },
    clickAvatarRowDel: function(e) {
      $(e.target)
        .parent()
        .remove();
      $('#edit-pop-figure-add-avatar-box').removeClass('hide');
    },
    clickAddAvatar: function(e) {
      if (!choose) {
        choose = new ChooseImage({
          multiSelect: !1,
          onSubmit: function(data) {
            var $addBox = $('#edit-pop-figure-add-avatar-box');

            $addBox.before(figureTpl.avatarRow.render({ image: data[0].src }));
            $addBox.addClass('hide');
          },
        });
      }

      choose.show();
    },
    changeInputDescription: function(e) {
      var $this = $(e.target);
      $('#edit-pop-figure-input-description-count').text($this.val().length);
    },
    clickOk: function() {
      var $image = $('[data-edit-pop-figure-avatar-row-image]');

      if (!$image.length) {
        dialog('照片不能为空');
        return;
      }

      var image = $image.attr('src');
      var name = $('#edit-pop-figure-input-name').val();
      var honorName = $('#edit-pop-figure-input-honor-name').val();
      var description = $('#edit-pop-figure-input-description').val();

      if (!name) {
        dialog('法师名称不能为空');
        return;
      }

      if (!honorName) {
        dialog('法师称谓不能为空');
        return;
      }

      if (!description) {
        dialog('简介不能为空');
        return;
      }

      var formatImage =
        image.indexOf('?') < 0 ? image + indexData.imagesParams[2] : image;

      // 编辑
      if (share.editFigureId) {
        var editItem = share.figureComponent.components.find(function(i) {
          return i.id === share.editFigureId;
        });

        editItem.avatar = formatImage;
        editItem.name = name;
        editItem.honorName = honorName;
        editItem.description = description;
      }
      // 添加
      else {
        var newId = 1;
        share.figureComponent.components.forEach(function(i) {
          if (i.id >= newId) newId = i.id + 1;
        });

        share.figureComponent.components.push({
          id: newId,
          newAdded: !0,
          avatar: formatImage,
          name: name,
          honorName: honorName,
          description: description,
        });
      }

      util.render();
      $('#edit-pop-figure').hide();
    },
  });
});
