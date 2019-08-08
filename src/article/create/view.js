/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  'clipboard',
  '@zzh/choose-image',
  '@zzh/store-image',
  '../../../old-com/handling/src',
  'util/purify_a_target',
  '../../lib/jquery.qrcode.min',
  './ajax',
  'lib/jquery.seeView',
], function(
  $,
  commonFunc,
  commonVars,
  data,
  tpl,
  Clipboard,
  ChooseImage,
  StoreImage,
  zzhHandling,
  purifyATarget
) {
  zzhHandling.setOnClickCloseCallback(function() {
    commonFunc.alert('正在保存文章数据，请勿操作或关闭页面。');
  });

  $.seeView({
    events: {
      // 点击编辑分类
      'click #edit-category': 'onClickEditCategory',
      // 点击弹出框
      'click [data-popup]': 'onClickPopup',
      // 点击添加分类
      'click [data-popup-category-add]': 'onClickPopupCategoryAdd',
      // 点击更改分类
      'click [data-popup-category-cell-modify]':
        'onClickPopupCategoryCellModify',
      // 点击删除分类
      'click [data-popup-category-cell-delete]':
        'onClickPopupCategoryCellDelete',
      // 点击添加封面
      'click #upload-cover': 'onClickUploadCover',
      // 点击删除图片
      'click #remove-cover': 'onClickRemoveCover',
      // 点击保存
      'click [data-save]': 'onClickSave',
      // 点击关闭提示
      'click #tip-section-close': 'onClickTipSectionClose',
      // 点击生成随机金额
      'click #input-pay-default-random': 'onClickInputPayDefaultRandom',
      // 随机金额输入改变
      'keyup #input-pay-default': 'onKeyupInputPayDefault',
      // 是否使用随喜改变
      'change [name="use-pay"]': 'onChangeUsePay',
      // 点击切换二维码
      'click [data-switch-qrcode]': 'onClickSwitchQrcode',
      // 点击取消保存
      'click [data-cancel]': 'onClickCancel',
    },
    // 阻止窗口滚动
    stopWindowScroll: function() {
      $('body').css({
        overflow: 'hidden',
      });
    },
    // 恢复窗口滚动
    revertWindowScroll: function() {
      $('body').css({
        overflow: 'inherit',
      });
    },
    // 点击编辑分类
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
    // 点击弹出框
    onClickPopup: function(e) {
      var $this = $(e.target),
        $popup = $(e.currentTarget),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-overlay');

      if (close) {
        $popup.hide();
        this.revertWindowScroll();
        // 去掉阻止窗口关闭
        commonFunc.removeCloseWindowHint();
        $popup.attr('data-type') == 'article-view' &&
          //location.href = data.formatedParams.action == 'copy' || data.formatedParams.action == 'update' ?
          //    data.indexUrl : data.createUrl
          (location.href = data.indexUrl);
      }
    },
    // 点击添加分类
    onClickPopupCategoryAdd: function(e) {
      var $this = $(e.target),
        $input = $('[data-popup-category-add-input]'),
        handling = !!parseInt($this.attr('data-handling')),
        value = $input.val().trim();

      if (handling || !value) return;

      $this.text('添加中...');
      $this.attr({
        'data-handling': 1,
      });
      $.seeAjax.get('addCategory', { name: value }, function(res) {
        var item = {},
          $popupBody = $('[data-popup-category-body]'),
          $inputCategory = $('#input-category');
        $this.text('添加');
        $this.attr({
          'data-handling': 0,
        });
        if (res.success) {
          $input.val('');
          item.id = res.id;
          item.name = value;
          // 添加到数据中
          data.categories.push(item);
          // 添加到分类展示区域
          $inputCategory.append(tpl.categoryCell.render(item));
          // 添加到分类编辑区域
          $popupBody.append(tpl.categoryPopupCell.render(item));
        }
      });
    },
    // 点击更改分类
    onClickPopupCategoryCellModify: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-popup-category-cell-modify')),
        $input = $('[data-popup-category-cell-input="' + id + '"]'),
        handling = !!parseInt($this.attr('data-handling')),
        value = $input.val().trim();

      if (handling || !value) return;

      $this.text('修改中...');
      $this.attr({
        'data-handling': 1,
      });
      $.seeAjax.get('modifyCategory', { id: id, name: value }, function(res) {
        var currentItem;

        $this.text('修改');
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

          // 修改到数据中
          currentItem.name = value;
          // 修改到分类展示区域
          $('[data-category-cell="' + id + '"]').text(value);
        }
      });
    },
    // 点击删除分类
    onClickPopupCategoryCellDelete: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-popup-category-cell-delete')),
        handling = !!parseInt($this.attr('data-handling'));

      if (handling) return;

      commonFunc.confirm('确定删除这个分类吗', function() {
        $this.text('删除中...');
        $this.attr({
          'data-handling': 1,
        });
        $.seeAjax.get('deleteCategory', { id: id }, function(res) {
          $this.text('删除');
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

            // 修改到分类展示区域
            $('[data-category-cell="' + id + '"]').remove();
            $('[data-popup-category-cell="' + id + '"]').remove();
          }
        });
      });
    },
    // 点击添加封面
    onClickUploadCover: function(e) {
      var self = this;

      // 尚未实例化
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
    // 添加图片成功
    afterUploadCover: function(result) {
      var $coverImage = $('#upload-cover-image'),
        $coverShow = $('#upload-cover-show'),
        $uploadContainer = $('#upload-cover-container');

      // 没有数据，返回
      if (!result.length) {
        return;
      }

      result.map(function(item) {
        // 添加图片裁剪后缀
        item.src += data.imageParams.cover;
      });

      $coverImage.attr({
        src: result[0].src,
      });
      $coverShow.show();
      $uploadContainer.hide();
    },
    // 点击删除图片
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
    // 点击保存
    onClickSave: function(e) {
      var self = this,
        $this = $(e.target),
        saveType = parseInt($this.attr('data-save')),
        handling = !!parseInt($this.attr('data-handling'));

      if (handling) return;

      // 获取数据失败，返回
      if (!self.onKeepData()) return;

      $this.text('保存中...');
      // 两者都要设为正在处理
      $('[data-save]').attr({
        'data-handling': 1,
      });
      zzhHandling.show();

      data.saveType = saveType;

      new StoreImage(
        window.contentData.content,
        function(handledContent) {
          window.contentData.content = purifyATarget(handledContent);

          zzhHandling.setText('保存数据');

          self.saveOtherSiteAllImagesSuccess();
        },
        function(uploaded, total) {
          zzhHandling.setText('上传 ' + uploaded + '/' + total);
        }
      );
    },

    saveOtherSiteAllImagesSuccess: function() {
      var self = this,
        urlName;
      // 草稿标识
      window.contentData.status = data.saveType;
      // 如果是正式发布，并且没有发布时间，则填充当前的时间
      parseInt(window.contentData.status) == 2 &&
        !window.contentData.publishTime &&
        (window.contentData.publishTime =
          commonVars.today.display + ' 00:00:00');
      data.formatedParams.action == 'update'
        ? ((window.contentData.id = data.formatedParams.articleId),
          (urlName = 'updateArticle'))
        : (urlName = 'addArticle');
      $.seeAjax.post(urlName, window.contentData, function(res) {
        $('[data-save="' + data.saveType + '"]').text(
          data.saveTypeOriginText[data.saveType - 1]
        );
        $('[data-save]').attr({
          'data-handling': 0,
        });
        if (res.success) {
          //commonFunc.alert('保存成功', function () {

          self.onSaveDataSuccess(res.articleId, data.saveType);
          zzhHandling.hide();
          //})
        } else {
          commonFunc.alert(res.message || '保存出错，请稍后重试');
        }
      });
    },
    // 保存成功
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
      // 添加复制
      new Clipboard($viewPopup.find('[data-clipboard-target]')[0]);
      // 二维码
      $viewPopup.find('[data-qrcode-container]').qrcode({
        width: data.qrcodeSizes[0],
        height: data.qrcodeSizes[0],
        text: url,
      });
    },
    // 保存数据
    onKeepData: function() {
      // 清空上次保存的数据
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
        publishTime = $('#input-publish-time').val(),
        showTitle = parseInt($('input[name="show-title"]:checked').val()),
        showSupport = parseInt($('input[name="show-support"]:checked').val());

      if (!title) {
        commonFunc.alert('标题不能为空');
        return !1;
      }
      if (!cover) {
        commonFunc.alert('封面不能为空');
        return !1;
      }
      if (!content) {
        commonFunc.alert('内容不能为空');
        return !1;
      }
      if (!introduction) {
        commonFunc.alert('简介不能为空');
        return !1;
      }
      if (!!usePay && !payDisplay) {
        commonFunc.alert('随喜按钮不能为空');
        return !1;
      }
      if (!!usePay && !payDefault) {
        commonFunc.alert('随喜默认金额不能为空');
        return !1;
      }
      if (!!usePay && !payGuide) {
        commonFunc.alert('随喜引导文字不能为空');
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
        publishTime: publishTime,
        showTitle: showTitle,
        showSupport: showSupport,
      };

      return !0;
    },
    // 点击关闭提示
    onClickTipSectionClose: function(e) {
      $('#tip-section').remove();
    },
    // 点击生成随机金额
    onClickInputPayDefaultRandom: function(e) {
      var $this = $(e.target),
        $input = $('#input-pay-default');

      $input.val(data.randomMoney);
      //$this.hide();
    },
    // 随机金额输入改变
    onKeyupInputPayDefault: function(e) {
      var $this = $(e.target),
        value = $this.val(),
        newValue;

      // 有非法字符
      if (data.randomInputInvalidRegExp.test(value)) {
        newValue = value.replace(data.randomInputInvalidRegExp, '');
        data.chineseCommaRegExp.test(newValue) &&
          (newValue = newValue.replace(data.chineseCommaRegExp, ','));
        $this.val(newValue);
        return;
      }
      data.chineseCommaRegExp.test(value) &&
        ((value = value.replace(data.chineseCommaRegExp, ',')),
        $this.val(value));
    },
    // 是否使用随喜改变
    onChangeUsePay: function(e) {
      var $this = $('[name="use-pay"]:checked'),
        value = parseInt($this.val()),
        $paySections = $('[data-pay-select-section]');

      !!value ? $paySections.show() : $paySections.hide();
    },
    // 点击切换二维码
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
    // 点击取消保存
    onClickCancel: function(e) {
      commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
        commonFunc.removeCloseWindowHint();
        history.back();
      });
    },
  });
});
