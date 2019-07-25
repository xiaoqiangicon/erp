/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', './data', './tpl', './ajax'], function($, data, tpl) {
  var func = {};

  func.init = function() {
    var $pageTitle = $('#page-title'),
      $saveDraft = $('[data-save="1"]'),
      $saveProd = $('[data-save="2"]');
    // 更新标题
    data.formatedParams.action == 'copy'
      ? $pageTitle.text('复制文章')
      : data.formatedParams.action == 'update' &&
        // 显示取消按钮
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
    $.seeAjax.get('categories', {}, function(res) {
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
    // 更新或复制
    if (data.formatedParams.action != 'add') {
      $.seeAjax.get(
        'getArticle',
        { id: data.formatedParams.articleId },
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
    // 标题
    $('#input-title').val(res.data.title);
    // 分类
    $('#input-category').val(
      !!$('[data-category-cell="' + res.data.category + '"]').length
        ? res.data.category
        : 0
    );
    // 封面
    !!res.data.cover &&
      ($('#upload-cover-image').attr('src', res.data.cover),
      $('#upload-cover-show').show(),
      $('#upload-cover-container').hide());

    // 编辑器
    data.editor.setContent(res.data.content);
    // 介绍
    $('#input-introduction').val(res.data.introduction);
    // 启用支付
    $('input[name="use-pay"][value="' + res.data.usePay + '"]').prop({
      checked: !0,
    });
    !!res.data.usePay ? $paySections.show() : $paySections.hide();
    // 支付按钮字
    $('#input-pay-display').val(res.data.payDisplay);
    // 默认支付金额
    $('#input-pay-default').val(res.data.payDefault);
    // 默认支付提示
    $('#input-pay-guide').val(res.data.payGuide);
    // 显示封面
    $(
      'input[name="show-cover-in-detail"][value="' +
        res.data.showCoverInDetail +
        '"]'
    ).prop({ checked: !0 });
    // 显示微站
    $(
      'input[name="show-temple-website"][value="' +
        res.data.showTempleWebsite +
        '"]'
    ).prop({ checked: !0 });
    // 发布时间
    $('#input-publish-time').val(res.data.publishTime);

    // 显示标题
    typeof res.data.showTitle !== 'undefined' &&
      $('input[name="show-title"][value="' + res.data.showTitle + '"]').prop({
        checked: !0,
      });
    // 显示赞
    typeof res.data.showSupport !== 'undefined' &&
      $(
        'input[name="show-support"][value="' + res.data.showSupport + '"]'
      ).prop({ checked: !0 });
  };
  func.initPage = function() {
    $('#loading-toast')
      .removeClass('unloaded')
      .hide();
  };

  return func;
});
