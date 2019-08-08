/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
  '../tpl',
  '../function',
  '@zzh/store-image',
  '../../../../old-com/handling/src',
  '../ajax',
  'lib/jquery.seeView',
], function(
  $,
  toastr,
  commonFunc,
  commonVars,
  data,
  tpl,
  func,
  StoreImage,
  zzhHandling
) {
  zzhHandling.setOnClickCloseCallback(function() {
    commonFunc.alert('正在保存供奉信息，请勿操作或关闭页面。');
  });

  $.seeView({
    events: {
      // 点击保存
      '!click #action-save': 'onClickActionSave',
    },
    // 点击保存
    onClickActionSave: function(e) {
      var self = this,
        $this = $('#action-save'),
        handling =
          $this.attr('data-handling') &&
          !!parseInt($this.attr('data-handling'));

      if (handling) return;

      // 获取数据失败，返回
      if (!this.onKeepData()) return;

      $this.attr({ 'data-handling': 1 }).text('正在保存...');
      zzhHandling.show();

      new StoreImage(window.contentData.intro, function(handledContent) {
        window.contentData.intro = handledContent;
        self.saveOtherSiteAllImagesSuccess();
      });
    },
    saveOtherSiteAllImagesSuccess: function() {
      // 编辑
      if (data.editAction) {
        window.contentData.id = parseInt(commonVars.params.id);
        $.seeAjax.post(
          'edit',
          window.contentData,
          function(res) {
            $('#action-save')
              .attr({ 'data-handling': 0 })
              .text('保存');
            zzhHandling.hide();
            if (res.success) {
              location.href = '/zzhadmin/buddhaManage/';
            } else {
              commonFunc.alert(res.message || '更新失败，请稍后重试');
            }
          },
          !0
        );
      }
      // 创建
      else {
        $.seeAjax.post(
          'create',
          window.contentData,
          function(res) {
            $('#action-save')
              .attr({ 'data-handling': 0 })
              .text('保存');
            if (res.success) {
              location.href = '/zzhadmin/buddhaManage/';
            } else {
              commonFunc.alert(res.message || '创建失败，请稍后重试');
            }
          },
          !0
        );
      }
    },
    // 保存数据
    onKeepData: function() {
      // 清空上次保存的数据
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
    // 获取正常化的能解析的金额（取消一些中文字符和特殊字符）
    getPureRandomMoney: function(randomMoney) {
      randomMoney = randomMoney.trim();
      // 用英文的逗号替换中文逗号
      randomMoney = randomMoney.replace(/，/g, ',');
      // 去掉开始的逗号
      randomMoney.slice(0, 1) == ',' && (randomMoney = randomMoney.slice(1));
      // 去掉结束的逗号
      randomMoney.slice(-1) == ',' && (randomMoney = randomMoney.slice(0, -1));

      return randomMoney;
    },
  });
});
