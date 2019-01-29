/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '@zzh/choose-image',
  'common/function',
  '../../data',
  '../../tpl/common',
  '../../tpl/house',
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
  houseTpl,
  dialog,
  share,
  util
) {
  var choose;

  $.seeView({
    events: {
      'click [data-edit-pop-house-cover-row-del]': 'clickCoverRowDel',
      'click #edit-pop-house-add-cover': 'clickAddCover',
      'propertychange #edit-pop-house-input-intro': 'changeInputIntro',
      'input #edit-pop-house-input-intro': 'changeInputIntro',
      'click #edit-pop-house-ok': 'clickOk',
    },
    clickCoverRowDel: function(e) {
      $(e.target)
        .parent()
        .remove();
    },
    clickAddCover: function(e) {
      if (!choose) {
        choose = new ChooseImage({
          multiSelect: !0,
          onSubmit: function(data) {
            var $addBox = $('#edit-pop-house-add-cover-box');

            data.forEach(function(item) {
              $addBox.before(houseTpl.coverRow.render({ image: item.src }));
            });
          },
        });
      }

      choose.show();
    },
    changeInputIntro: function(e) {
      var $this = $(e.target);
      $('#edit-pop-house-input-intro-count').text($this.val().length);
    },
    clickOk: function() {
      var $images = $('[data-edit-pop-house-cover-row-image]');

      if (!$images.length) {
        dialog('照片不能为空');
        return;
      }

      var covers = [];

      $images.map(function() {
        var $this = $(this);
        covers.push($this.attr('src'));
      });

      var name = $('#edit-pop-house-input-name').val();
      var intro = $('#edit-pop-house-input-intro').val();

      if (!name) {
        dialog('殿堂名称不能为空');
        return;
      }

      if (!intro) {
        dialog('殿堂简介不能为空');
        return;
      }

      /* 按理说，这里应该要判断一下 subType 的值，然后确定
       * 然后判断用 indexData.imagesParams[7][0] 还是 indexData.imagesParams[7][1]
       *
       * 但这里就免了
       */
      var formatCovers = covers.map(function(cover) {
        return cover.indexOf('?') < 0
          ? cover + indexData.imagesParams[7][0]
          : cover;
      });

      // 编辑
      if (share.editHouseId) {
        var editItem = share.houseComponent.houses.find(function(i) {
          return i.id === share.editHouseId;
        });

        editItem.covers = formatCovers;
        editItem.name = name;
        editItem.intro = intro;
      }
      // 添加
      else {
        var newId = 1;
        share.houseComponent.houses.forEach(function(i) {
          if (i.id >= newId) newId = i.id + 1;
        });

        share.houseComponent.houses.push({
          id: newId,
          newAdded: !0,
          covers: formatCovers,
          name: name,
          intro: intro,
        });
      }

      util.render();
      $('#edit-pop-house').hide();
    },
  });
});
