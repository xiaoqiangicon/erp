import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import StoreImage from '../../../../old-com/store-image/src';
import zzhHandling from '../../../../old-com/handling/src';
import '../ajax';
import seeView from 'see-view';
zzhHandling.setOnClickCloseCallback(function() {
  commonFunc.alert('正在保存供奉信息，请勿操作或关闭页面。');
});
seeView({
  events: {
    '!click #action-save': 'onClickActionSave',
  },
  onClickActionSave: function(e) {
    var self = this,
      $this = $('#action-save'),
      handling =
        $this.attr('data-handling') && !!parseInt($this.attr('data-handling'));
    if (handling) return;
    if (!this.onKeepData()) return;
    $this
      .attr({
        'data-handling': 1,
      })
      .text('正在保存...');
    zzhHandling.show();
    new StoreImage(window.contentData.intro, function(handledContent) {
      window.contentData.intro = handledContent;
      self.saveOtherSiteAllImagesSuccess();
    });
  },
  saveOtherSiteAllImagesSuccess: function() {
    if (data.editAction) {
      window.contentData.id = parseInt(commonVars.params.id);
      seeAjax('edit', window.contentData, function(res) {
        $('#action-save')
          .attr({
            'data-handling': 0,
          })
          .text('保存');
        zzhHandling.hide();
        if (res.success) {
          location.href = '/zzhadmin/buddhaManage/';
        } else {
          commonFunc.alert(res.message || '更新失败，请稍后重试');
        }
      });
    } else {
      seeAjax('create', window.contentData, function(res) {
        $('#action-save')
          .attr({
            'data-handling': 0,
          })
          .text('保存');
        if (res.success) {
          location.href = '/zzhadmin/buddhaManage/';
        } else {
          commonFunc.alert(res.message || '创建失败，请稍后重试');
        }
      });
    }
  },
  onKeepData: function() {
    window.contentData = {};
    var name = $('#input-name')
      .val()
      .trim();
    if (!name) {
      commonFunc.alert('标题不能为空');
      return !1;
    }
    var category = parseInt($('#input-category').val());
    var buddhaId =
      category == 2
        ? parseInt($('#input-pai-wei').val())
        : parseInt($('#input-buddha').val());
    if (!buddhaId) {
      commonFunc.alert((category == 2 ? '牌位类型' : '佛像') + '不能为空');
      return !1;
    }
    var tags = [];
    $('[data-content-tag]').map(function() {
      tags.push($(this).attr('data-content-tag'));
    });
    var place = $('#input-place')
      .val()
      .trim();
    if (!place) {
      commonFunc.alert('位置不能为空');
      return !1;
    }
    var $covers = $('[data-cover-image-cell]');
    var cover = ($covers.length && $($covers[0]).attr('data-image')) || '';
    if (!cover) {
      commonFunc.alert('供奉图片不能为空');
      return !1;
    }
    var previewImages = [];
    $('[data-preview-image-cell]').map(function() {
      previewImages.push($(this).attr('data-image'));
    });
    if (!previewImages.length) {
      commonFunc.alert('区域效果图不能为空');
      return !1;
    }
    var intro = data.editor.getContent();
    if (!intro) {
      commonFunc.alert('简介不能为空');
      return !1;
    }
    var usePay = !!parseInt($('[name="content-pay"]:checked').attr('value'));
    var randomMoney = '';
    if (usePay) {
      randomMoney = this.getPureRandomMoney($('#input-random-money').val());
      if (!randomMoney) {
        commonFunc.alert('随喜供奉不能为空');
        return !1;
      }
    }
    if (
      !$('[data-memo-checkbox="1"]').prop('checked') &&
      !$('[data-memo-checkbox="6"]').prop('checked') &&
      !$('[data-memo-checkbox="7"]').prop('checked')
    ) {
      commonFunc.alert('功德芳名、阳上人、往生者请至少选择一个');
      return !1;
    }
    var memoConfig = [];
    $('[data-memo-checkbox]:checked').map(function() {
      var $this = $(this),
        type = parseInt($this.attr('data-memo-checkbox'));
      memoConfig.push({
        type: type,
        length:
          parseInt(
            $('[data-memo-config="' + type + '"]').attr('data-length')
          ) || 0,
        tip: $('[data-memo-tip="' + type + '"]').val(),
        alias: $('[data-memo-alias="' + type + '"]').val() || '',
      });
    });
    var usePrinter = parseInt(
      $('[name="printer-popup-activate"]:checked').attr('value')
    );
    var printers = [];
    $('[data-printer-cell-input]:checked').map(function() {
      printers.push(parseInt($(this).attr('data-printer-cell-input')));
    });
    var printType = parseInt(
      $('[name="printer-popup-print-type"]:checked').attr('value')
    );
    var printPages = parseInt($('#printer-popup-pages').val());
    var shareTitle = $('#input-share-title').val();
    if (!shareTitle) {
      commonFunc.alert('分享标题不能为空');
      return !1;
    }
    var shareContent = $('#input-share-content').val();
    if (!shareContent) {
      commonFunc.alert('分享内容不能为空');
      return !1;
    }
    var $shareImage = $('[data-share-image-cell]');
    var shareImage =
      ($shareImage.length && $($shareImage[0]).attr('data-image')) || '';
    if (!shareImage) {
      commonFunc.alert('分享图片不能为空');
      return !1;
    }
    window.contentData = {
      name: name,
      category: category,
      buddhaId: buddhaId,
      tags: tags,
      place: place,
      cover: cover,
      previewImages: previewImages.join(','),
      intro: intro,
      randomMoney: randomMoney,
      memoConfig: memoConfig,
      usePrinter: usePrinter,
      printers: printers.join(','),
      printType: printType,
      printPages: printPages,
      shareTitle: shareTitle,
      shareContent: shareContent,
      shareImage: shareImage,
    };
    return !0;
  },
  getPureRandomMoney: function(randomMoney) {
    randomMoney = randomMoney.trim();
    randomMoney = randomMoney.replace(/，/g, ',');
    randomMoney.slice(0, 1) == ',' && (randomMoney = randomMoney.slice(1));
    randomMoney.slice(-1) == ',' && (randomMoney = randomMoney.slice(0, -1));
    return randomMoney;
  },
});
