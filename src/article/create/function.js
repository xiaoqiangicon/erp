import $ from 'jquery';
import seeAjax from 'see-ajax';
import data from './data';
import tpl from './tpl';
import './ajax';
var func = {};
func.init = function() {
  var $pageTitle = $('#page-title'),
    $saveDraft = $('[data-save="1"]'),
    $saveProd = $('[data-save="2"]');
  data.formatedParams.action == 'copy'
    ? $pageTitle.text('复制文章')
    : data.formatedParams.action == 'update' &&
      ($('[data-cancel="1"]').removeClass('hide'),
      (data.saveTypeOriginText[0] = '更新草稿'),
      parseInt(data.params.status) != 1 &&
        ((data.saveTypeOriginText[1] = '提交修改'), $saveDraft.hide()),
      $pageTitle.text('更新文章'),
      (document.title = '更新文章'),
      $saveDraft.text(data.saveTypeOriginText[0]),
      $saveProd.text(data.saveTypeOriginText[1]));
  func.getCategories();
};
func.getCategories = function() {
  seeAjax('categories', {}, function(res) {
    var $inputCategory = $('#input-category');
    if (res.success) {
      data.categories = res.data;
      res.data.map(function(item) {
        $inputCategory.append(tpl.categoryCell.render(item));
      });
      func.afterGetCategories();
    }
  });
};
func.afterGetCategories = function() {
  if (data.formatedParams.action != 'add') {
    seeAjax(
      'getArticle',
      {
        id: data.formatedParams.articleId,
      },
      function(res) {
        if (res.success) {
          func.renderArticle(res);
          func.initPage();
        }
      }
    );
  } else {
    func.initPage();
  }
};
func.renderArticle = function(res) {
  var $paySections = $('[data-pay-select-section]');
  $('#input-title').val(res.data.title);
  $('#input-category').val(
    !!$('[data-category-cell="' + res.data.category + '"]').length
      ? res.data.category
      : 0
  );
  !!res.data.cover &&
    ($('#upload-cover-image').attr('src', res.data.cover),
    $('#upload-cover-show').show(),
    $('#upload-cover-container').hide());
  data.editor.setContent(res.data.content);
  $('#input-introduction').val(res.data.introduction);
  $('input[name="use-pay"][value="' + res.data.usePay + '"]').prop({
    checked: !0,
  });
  !!res.data.usePay ? $paySections.show() : $paySections.hide();
  $('#input-pay-display').val(res.data.payDisplay);
  $('#input-pay-default').val(res.data.payDefault);
  $('#input-pay-guide').val(res.data.payGuide);
  $(
    'input[name="show-cover-in-detail"][value="' +
      res.data.showCoverInDetail +
      '"]'
  ).prop({
    checked: !0,
  });
  $(
    'input[name="show-temple-website"][value="' +
      res.data.showTempleWebsite +
      '"]'
  ).prop({
    checked: !0,
  });
  // 当前为复制文章时 不对发布时间进行复制
  if (!(data.params.action && data.params.action == 'copy')) {
    $('#input-publish-time').val(res.data.publishTime);
  }
  typeof res.data.showTitle !== 'undefined' &&
    $('input[name="show-title"][value="' + res.data.showTitle + '"]').prop({
      checked: !0,
    });
  typeof res.data.showSupport !== 'undefined' &&
    $('input[name="show-support"][value="' + res.data.showSupport + '"]').prop({
      checked: !0,
    });
  typeof res.data.isShowAd !== 'undefined' &&
    $('input[name="show-adv"][value="' + res.data.isShowAd + '"]').prop({
      checked: !0,
    });
};
func.initPage = function() {
  $('#loading-toast')
    .removeClass('unloaded')
    .hide();
};
export default func;
