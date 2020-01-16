import seeAjax from 'see-ajax';
import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import './ajax';
toastr.options.positionClass = 'toast-bottom-full-width';
toastr.options.timeOut = 2000;
var func = {};
func.init = function() {
  seeAjax('tags', {}, function(res) {
    if (res.success) {
      var $tagPopupMy = $('#tag-popup-my'),
        $tagPopupSystem = $('#tag-popup-system');
      res.data.custom &&
        res.data.custom.length &&
        res.data.custom.map(function(item) {
          data.tags[item.id] = item;
          item.type = 2;
          $tagPopupMy.append(tpl.tagPopupCell.render(item));
        });
      res.data.system &&
        res.data.system.length &&
        res.data.system.map(function(item) {
          data.tags[item.id] = item;
          item.type = 1;
          $tagPopupSystem.append(tpl.tagPopupCell.render(item));
        });
    }
    func.initPage();
  });
  seeAjax('buddhas', {}, function(res) {
    if (res.success) {
      var $inputBuddha = $('#input-buddha');
      var $inputPaiWei = $('#input-pai-wei');
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          if (item.category == 2)
            $inputPaiWei.append(tpl.buddhaCell.render(item));
          else $inputBuddha.append(tpl.buddhaCell.render(item));
          data.buddhas[item.id] = item;
        });
      func.initPage();
    } else {
      toastr.error('获取佛像列表失败，请稍后再试');
    }
  });
  seeAjax('printers', {}, function(res) {
    if (res.success) {
      var $container = $('#printer-popup-printers');
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          $container.append(tpl.printerCell.render(item));
        });
      res.data && res.data.length && func.requestPrinterStatus(res.data);
    }
    func.initPage();
  });
};
var initPageCount = 0;
func.initPage = function() {
  initPageCount += 1;
  if (initPageCount < 3) return;
  if (commonVars.params.templateId) {
    seeAjax(
      'template',
      {
        id: parseInt(commonVars.params.templateId),
      },
      function(res) {
        if (res.success) {
          func.renderPage(res);
          func.hideLoading();
        } else {
          toastr.error('获取模板数据失败，请稍后再试');
        }
      }
    );
  } else if (typeof commonVars.params.edit != 'undefined') {
    data.editAction = !!parseInt(commonVars.params.edit);
    seeAjax(
      'detail',
      {
        id: parseInt(commonVars.params.id),
      },
      function(res) {
        if (res.success) {
          func.renderPage(res);
          func.hideLoading();
        } else {
          toastr.error('获取数据失败，请稍后再试');
        }
      }
    );
  } else {
    func.fillDefaultShare();
    func.hideLoading();
  }
};
func.renderPage = function(res) {
  $('#input-name').val(res.data.name);
  var $inputCategory = $('#input-category');
  var $inputBuddha = $('#input-buddha');
  var $inputPaiWei = $('#input-pai-wei');
  var $contentRowBuddha = $('#content-row-buddha'),
    $contentRowPaiWei = $('#content-row-pai-wei');
  if (parseInt(res.data.category) == 2) {
    $inputPaiWei.val(res.data.buddhaId);
    $inputCategory.val(2);
    $contentRowBuddha.hide();
    $contentRowPaiWei.show();
  } else {
    $inputBuddha.val(res.data.buddhaId);
    $contentRowBuddha.show();
    $contentRowPaiWei.hide();
  }
  if (data.editAction) {
    $inputBuddha.prop({
      disabled: !0,
    });
    $inputPaiWei.prop({
      disabled: !0,
    });
    $inputCategory.prop({
      disabled: !0,
    });
  }
  var tagsHtml = '';
  res.data.tags &&
    res.data.tags.length &&
    res.data.tags.map(function(tagId) {
      data.tags[tagId] && (tagsHtml += tpl.tagCell.render(data.tags[tagId]));
    });
  $('#content-tags').html(tagsHtml);
  $('#input-place').val(res.data.place);
  var $coverImageAdd = $('#content-cover-image-add');
  if (res.data.cover) {
    $coverImageAdd.before(
      tpl.coverImageCell.render({
        image: res.data.cover,
      })
    );
    $coverImageAdd.hide();
  }
  var $previewImageAdd = $('#content-preview-image-add');
  if (res.data.previewImages) {
    var previewImagesArray = res.data.previewImages.split(',');
    previewImagesArray.map(function(image) {
      $previewImageAdd.before(
        tpl.previewImageCell.render({
          image: image,
        })
      );
    });
    previewImagesArray.length >= 3 && $previewImageAdd.hide();
  }
  data.editor.setContent(res.data.intro);
  var usePay = res.data.randomMoney ? 1 : 0;
  $('input[name="content-pay"][value="' + usePay + '"]').prop({
    checked: !0,
  });
  if (usePay) {
    $('#input-random-money').val(res.data.randomMoney);
  } else {
    $('#content-random-money').hide();
  }
  res.data.memoConfig &&
    res.data.memoConfig.length &&
    res.data.memoConfig.map(function(item) {
      $('[data-memo-checkbox="' + item.type + '"]').prop({
        checked: !0,
      });
      $('[data-memo-alias="' + item.type + '"]').val(item.alias || '');
      $('[data-memo-tip="' + item.type + '"]').val(item.tip || '');
      $('[data-memo-config="' + item.type + '"]').attr({
        'data-length': item.length || '',
      });
    });
  if (typeof res.data.usePrinter != 'undefined') {
    $(
      'input[name="printer-popup-activate"][value="' +
        res.data.usePrinter +
        '"]'
    ).prop({
      checked: !0,
    });
    res.data.printers &&
      res.data.printers.split(',').map(function(printerId) {
        $('[data-printer-cell-input="' + printerId + '"]').prop({
          checked: !0,
        });
      });
    $('#printer-popup-pages').val(res.data.printPages);
    $(
      'input[name="printer-popup-print-type"][value="' +
        res.data.printType +
        '"]'
    ).prop({
      checked: !0,
    });
    data.currentPrinterPages = res.data.printPages;
  }
  if (res.data.shareTitle) {
    $('#input-share-title').val(res.data.shareTitle);
    $('[data-words-count-show="1"]').text(res.data.shareTitle.length);
  }
  if (res.data.shareContent) {
    $('#input-share-content').val(res.data.shareContent);
    $('[data-words-count-show="2"]').text(res.data.shareContent.length);
  }
  var $shareImageAdd = $('#content-share-image-add');
  if (res.data.shareImage) {
    $shareImageAdd.before(
      tpl.shareImageCell.render({
        image: res.data.shareImage,
      })
    );
    $shareImageAdd.hide();
  }
  if (!res.data.shareTitle && !res.data.shareContent && !res.data.shareImage) {
    func.fillDefaultShare();
  }
};
func.hideLoading = function() {
  $('#loading-toast').hide();
};
func.requestPrinterStatus = function(items) {
  items.map(function(item) {
    seeAjax(
      'printerStatus',
      {
        id: item.id,
      },
      function(res) {
        var $status = $('[data-printer-cell-status="' + item.id + '"]');
        $status.text(res.message);
        $status.addClass(res.success ? 'green' : 'red');
        $status.removeClass('hide');
      }
    );
  });
};
func.fillDefaultShare = function() {
  $('#input-share-title').val(data.defaultShareTitle);
  $('[data-words-count-show="1"]').text(data.defaultShareTitle.length);
  $('#input-share-content').val(data.defaultShareContent);
  $('[data-words-count-show="2"]').text(data.defaultShareContent.length);
  var $shareImageAdd = $('#content-share-image-add');
  $shareImageAdd.before(
    tpl.shareImageCell.render({
      image: data.defaultShareImage,
    })
  );
  $shareImageAdd.hide();
};
export default func;
