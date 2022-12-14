import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import Clipboard from 'clipboard';
import ChooseImage from '../../com-deprecated/choose-image';
import StoreImage from '../../com-deprecated/store-image';
import * as zzhHandling from '../../../../pro-com/src/handling';
import purifyATarget from 'util/purify_a_target';
import '../../../../pro-com/src/libs-es5/jquery-qrcode';
import './ajax';
import seeAjax from 'see-ajax';
import seeView from 'see-view';

seeView({
  events: {
    'click #edit-category': 'onClickEditCategory',
    'click [data-popup]': 'onClickPopup',
    'click [data-popup-category-add]': 'onClickPopupCategoryAdd',
    'click [data-popup-category-cell-modify]': 'onClickPopupCategoryCellModify',
    'click [data-popup-category-cell-delete]': 'onClickPopupCategoryCellDelete',
    'click #upload-cover': 'onClickUploadCover',
    'click #remove-cover': 'onClickRemoveCover',
    'click [data-save]': 'onClickSave',
    'click #tip-section-close': 'onClickTipSectionClose',
    'click #input-pay-default-random': 'onClickInputPayDefaultRandom',
    'keyup #input-pay-default': 'onKeyupInputPayDefault',
    'change [name="use-pay"]': 'onChangeUsePay',
    'click [data-switch-qrcode]': 'onClickSwitchQrcode',
    'click [data-cancel]': 'onClickCancel',
  },
  stopWindowScroll: function() {
    $('body').css({
      overflow: 'hidden',
    });
  },
  revertWindowScroll: function() {
    $('body').css({
      overflow: 'inherit',
    });
  },
  onClickEditCategory: function(e) {
    var $popup = $('[data-popup="category"]'),
      $popupBody;
    if (!$popup.length) {
      $popup = $(tpl.categoryPopup.render({}));
      $popupBody = $popup.find('[data-popup-category-body]');
      data.categories.map(function(item) {
        $popupBody.append(tpl.categoryPopupCell.render(item));
      });
      $popup.appendTo('body');
    }
    $popup.show();
    this.stopWindowScroll();
  },
  onClickPopup: function(e) {
    var $this = $(e.target),
      $popup = $(e.currentTarget),
      close =
        !!$this.attr('data-popup-close') || !!$this.attr('data-popup-overlay');
    if (close) {
      $popup.hide();
      this.revertWindowScroll();
      commonFunc.removeCloseWindowHint();
      $popup.attr('data-type') == 'article-view' &&
        (location.href = data.indexUrl);
    }
  },
  onClickPopupCategoryAdd: function(e) {
    var $this = $(e.target),
      $input = $('[data-popup-category-add-input]'),
      handling = !!parseInt($this.attr('data-handling')),
      value = $input.val().trim();
    if (handling || !value) return;
    $this.text('?????????...');
    $this.attr({
      'data-handling': 1,
    });
    seeAjax(
      'addCategory',
      {
        name: value,
      },
      function(res) {
        var item = {},
          $popupBody = $('[data-popup-category-body]'),
          $inputCategory = $('#input-category');
        $this.text('??????');
        $this.attr({
          'data-handling': 0,
        });
        if (res.success) {
          $input.val('');
          item.id = res.id;
          item.name = value;
          data.categories.push(item);
          $inputCategory.append(tpl.categoryCell.render(item));
          $popupBody.append(tpl.categoryPopupCell.render(item));
        }
      }
    );
  },
  onClickPopupCategoryCellModify: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-popup-category-cell-modify')),
      $input = $('[data-popup-category-cell-input="' + id + '"]'),
      handling = !!parseInt($this.attr('data-handling')),
      value = $input.val().trim();
    if (handling || !value) return;
    $this.text('?????????...');
    $this.attr({
      'data-handling': 1,
    });
    seeAjax(
      'modifyCategory',
      {
        id: id,
        name: value,
      },
      function(res) {
        var currentItem;
        $this.text('??????');
        $this.attr({
          'data-handling': 0,
        });
        if (res.success) {
          data.categories.map(function(item) {
            if (item.id == id) {
              currentItem = item;
              return !1;
            }
          });
          currentItem.name = value;
          $('[data-category-cell="' + id + '"]').text(value);
        }
      }
    );
  },
  onClickPopupCategoryCellDelete: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-popup-category-cell-delete')),
      handling = !!parseInt($this.attr('data-handling'));
    if (handling) return;
    commonFunc.confirm('???????????????????????????', function() {
      $this.text('?????????...');
      $this.attr({
        'data-handling': 1,
      });
      seeAjax(
        'deleteCategory',
        {
          id: id,
        },
        function(res) {
          $this.text('??????');
          $this.attr({
            'data-handling': 0,
          });
          if (res.success) {
            data.categories.map(function(item, index) {
              if (item.id == id) {
                delete data.categories[index];
                return !1;
              }
            });
            $('[data-category-cell="' + id + '"]').remove();
            $('[data-popup-category-cell="' + id + '"]').remove();
          }
        }
      );
    });
  },
  onClickUploadCover: function(e) {
    var self = this;
    if (!data.uploadCoverInstance) {
      data.uploadCoverInstance = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(data) {
          self.afterUploadCover(data);
        },
      });
    }
    data.uploadCoverInstance.show();
  },
  afterUploadCover: function(result) {
    var $coverImage = $('#upload-cover-image'),
      $coverShow = $('#upload-cover-show'),
      $uploadContainer = $('#upload-cover-container');
    if (!result.length) {
      return;
    }
    result.map(function(item) {
      const url = item.src;
      const param = data.imageParams.cover;
      item.src =
        (url.indexOf('?') !== -1 ? url.slice(0, url.indexOf('?')) : url) +
        param;
    });
    $coverImage.attr({
      src: result[0].src,
    });
    $coverShow.show();
    $uploadContainer.hide();
  },
  onClickRemoveCover: function(e) {
    var $coverImage = $('#upload-cover-image'),
      $coverShow = $('#upload-cover-show'),
      $uploadContainer = $('#upload-cover-container');
    $coverShow.hide();
    $uploadContainer.show();
    $coverImage.attr({
      src: '',
    });
  },
  onClickSave: function(e) {
    var self = this,
      $this = $(e.target),
      saveType = parseInt($this.attr('data-save')),
      handling = !!parseInt($this.attr('data-handling'));
    if (handling) return;
    if (!self.onKeepData()) return;
    $this.text('?????????...');
    $('[data-save]').attr({
      'data-handling': 1,
    });
    zzhHandling.show();
    data.saveType = saveType;
    new StoreImage(
      window.contentData.content,
      function(handledContent) {
        window.contentData.content = purifyATarget(handledContent);
        zzhHandling.setText('????????????');
        self.saveOtherSiteAllImagesSuccess();
      },
      function(uploaded, total) {
        zzhHandling.setText('?????? ' + uploaded + '/' + total);
      }
    );
  },
  saveOtherSiteAllImagesSuccess: function() {
    var self = this,
      urlName;
    window.contentData.status = data.saveType;
    parseInt(window.contentData.status) == 2 &&
      !window.contentData.publishTime &&
      (window.contentData.publishTime = commonVars.today.display + ' 00:00:00');
    data.formatedParams.action == 'update'
      ? ((window.contentData.id = data.formatedParams.articleId),
        (urlName = 'updateArticle'))
      : (urlName = 'addArticle');
    seeAjax(urlName, window.contentData, function(res) {
      $('[data-save="' + data.saveType + '"]').text(
        data.saveTypeOriginText[data.saveType - 1]
      );
      $('[data-save]').attr({
        'data-handling': 0,
      });
      if (res.success) {
        self.onSaveDataSuccess(res.articleId, data.saveType);
        zzhHandling.hide();
      } else {
        zzhHandling.hide();
        commonFunc.alert(res.msg || '??????????????????????????????');
      }
    });
  },
  onSaveDataSuccess: function(articleId, status) {
    var url = data.shareLink + articleId,
      $viewPopup;
    $viewPopup = $(
      tpl.viewPopup.render({
        id: articleId,
        link: url,
        status: status,
      })
    );
    $('body').append($viewPopup);
    new Clipboard($viewPopup.find('[data-clipboard-target]')[0]);
    $viewPopup.find('[data-qrcode-container]').qrcode({
      width: data.qrcodeSizes[0],
      height: data.qrcodeSizes[0],
      text: url,
    });
  },
  onKeepData: function() {
    window.contentData = {};
    var title = $('#input-title')
        .val()
        .trim(),
      category = parseInt($('#input-category').val()),
      cover = $('#upload-cover-image').attr('src'),
      content = data.editor.getContent(),
      introduction = $('#input-introduction').val(),
      usePay = parseInt($('input[name="use-pay"]:checked').val()),
      payDisplay = $('#input-pay-display').val(),
      payDefault = $('#input-pay-default').val(),
      payGuide = $('#input-pay-guide').val(),
      showCoverInDetail = parseInt(
        $('input[name="show-cover-in-detail"]:checked').val()
      ),
      showTempleWebsite = parseInt(
        $('input[name="show-temple-website"]:checked').val()
      ),
      showBlank = parseInt($('input[name="show-blank"]:checked').val()),
      publishTime = $('#input-publish-time').val(),
      showTitle = parseInt($('input[name="show-title"]:checked').val()),
      showSupport = parseInt($('input[name="show-support"]:checked').val());
    var showAd = parseInt($('input[name="show-adv"]:checked').val());
    if (!title) {
      commonFunc.alert('??????????????????');
      return !1;
    }
    if (!cover) {
      commonFunc.alert('??????????????????');
      return !1;
    }
    if (!content) {
      commonFunc.alert('??????????????????');
      return !1;
    }
    if (!introduction) {
      commonFunc.alert('??????????????????');
      return !1;
    }
    if (!!usePay && !payDisplay) {
      commonFunc.alert('????????????????????????');
      return !1;
    }
    if (!!usePay && !payDefault) {
      commonFunc.alert('??????????????????????????????');
      return !1;
    }
    if (!!usePay && !payGuide) {
      commonFunc.alert('??????????????????????????????');
      return !1;
    }
    if (!publishTime) {
      commonFunc.alert('????????????????????????');
      return !1;
    }
    window.contentData = {
      title: title,
      category: category,
      cover:
        cover.indexOf('?') > -1 ? cover.slice(0, cover.indexOf('?')) : cover,
      content: content,
      introduction: introduction,
      usePay: usePay,
      payDisplay: payDisplay,
      payDefault: payDefault,
      payGuide: payGuide,
      showCoverInDetail: showCoverInDetail,
      showTempleWebsite: showTempleWebsite,
      is_show_blank: showBlank,
      publishTime: publishTime,
      showTitle: showTitle,
      showSupport: showSupport,
      isShowAd: showAd,
    };
    return !0;
  },
  onClickTipSectionClose: function(e) {
    $('#tip-section').remove();
  },
  onClickInputPayDefaultRandom: function(e) {
    var $this = $(e.target),
      $input = $('#input-pay-default');
    $input.val(data.randomMoney);
  },
  onKeyupInputPayDefault: function(e) {
    var $this = $(e.target),
      value = $this.val(),
      newValue;
    if (data.randomInputInvalidRegExp.test(value)) {
      newValue = value.replace(data.randomInputInvalidRegExp, '');
      data.chineseCommaRegExp.test(newValue) &&
        (newValue = newValue.replace(data.chineseCommaRegExp, ','));
      $this.val(newValue);
      return;
    }
    data.chineseCommaRegExp.test(value) &&
      ((value = value.replace(data.chineseCommaRegExp, ',')), $this.val(value));
  },
  onChangeUsePay: function(e) {
    var $this = $('[name="use-pay"]:checked'),
      value = parseInt($this.val()),
      $paySections = $('[data-pay-select-section]');
    !!value ? $paySections.show() : $paySections.hide();
  },
  onClickSwitchQrcode: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-switch-qrcode')),
      type = parseInt($this.attr('data-type')),
      url = data.shareLink + id,
      $qrcodeContainer = $('[data-qrcode-container="' + id + '"]'),
      activeSwitch = $('[data-switch-qrcode="' + id + '"].active');
    if ($this.hasClass('active')) return;
    activeSwitch.removeClass('active');
    $this.addClass('active');
    $qrcodeContainer.html('');
    $qrcodeContainer.qrcode({
      width: data.qrcodeSizes[type - 1],
      height: data.qrcodeSizes[type - 1],
      text: url,
    });
  },
  onClickCancel: function(e) {
    commonFunc.confirm('???????????????????????????????????????????????????????', function() {
      commonFunc.removeCloseWindowHint();
      history.back();
    });
  },
});
