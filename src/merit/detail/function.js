/**
 * Created by kang on 2017/11/8.
 */

define([
  'jquery',
  '../../../old-com/qrcode',
  'common/function',
  './data',
  './api',
  './tpl',
  '../../../old-com/pagination/src',
  'common/variables',
  './ajax',
  'bootstrap-select',
], function($, QRCode, commonFunc, Data, api, tpl, Pagination, commonVars) {
  var func = {};
  func.init = function() {
    // 获取url里的参数
    var id = commonVars.params.id,
      numberAccount = commonVars.params.numberAccount;
    Data.getListParams.id = id;
    $('#loading-toast').addClass('hide');
    api.getList(Data.getListParams, function(res) {
      func.renderList(res);
      api.getUserInfo(Data.getUserInfoParams, function(res) {
        func.renderUserInfoCtnr(res);
      });
      api.getTag({ userId: Data.getUserInfoParams.id }, function(res) {
        func.renderTag(res);
      });
    });
    $('#zizai_code')
      .find('span')
      .html(numberAccount);
  };

  // 渲染列表数据
  func.renderList = function(res) {
    // 渲染页面的其它数据
    $('#head_pic').attr('src', res.data.pic);
    $('#user_name').text(res.data.name);
    $('#merit_total_money').text('¥' + res.data.money);
    $('#merit_total_number').text(res.data.payTimes);
    // 渲染列表数据
    var $container = $('#table-body'),
      htmlStr = '';
    res.data.orderList.map(function(item) {
      htmlStr += tpl.tableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $container.html(htmlStr);
    //生成分页器
    if (res.total > Data.getListParams.pageSize) {
      func.createPagination(
        res.total,
        Data.getListParams.pageSize,
        Data.getListParams.page,
        function(page) {
          Data.getListParams.page = page;
          api.getList(Data.getListParams, function(res) {
            func.renderList(res);
          });
        }
      );
    } else {
      $('#pagination-container').html('');
    }
  };
  // 生成分页器
  func.createPagination = function(
    totalCount,
    pageSize,
    currentPage,
    callback
  ) {
    // 总数传0时会生成空的分页器容器代替之前的分页器
    var totalPages = Math.ceil(totalCount / pageSize),
      pagination = new Pagination($('#pagination-container'), {
        onChange: function(pageToChange) {
          // 回调中调用currentPage获取的是点击前的页数
          callback(pageToChange - 1);
        }, // 切换页码回调函数，页面以 1 开始索引
        showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
        showGoTo: !1, // 是否显示右边跳转到某一页
        currentPage: currentPage + 1, // 初始化当前页
        totalPages: totalPages, // 总页数
        totalCount: totalCount, // 总条数
        perPage: pageSize, // 每页条数
      });
    pagination.render();
  };
  // 渲染用户标签
  func.renderTag = function(res) {
    var $ctnr = $('#tag-ctnr'),
      htmlStr = '';
    res.data.map(function(item) {
      htmlStr += tpl.tagCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.noTagCell.render({}));
    $ctnr.html(htmlStr);
  };
  // 渲染用户信息
  func.renderUserInfoCtnr = function(res) {
    var $container = $('#merit-info-ctnr'),
      htmlStr = '';
    // 渲染分类

    res.data.map(function(item, index, arr) {
      htmlStr += tpl.userDetail.render(item);
      if (index !== arr.length - 1) {
        htmlStr += '<hr>';
      }
    });
    !htmlStr && (htmlStr = tpl.userDetailEmpty.render({}));
    $container.html(htmlStr);
  };
  // 渲染添加到关注分组modal的下拉
  func.renderTagSelect = function(handleData) {
    var $select = $('[data-ele="tag-select"]'),
      htmlStr = '';
    Object.keys(handleData).map(function(id) {
      htmlStr += tpl.selectOption.render(handleData[id]);
    });
    $select.html(htmlStr);
    $select.selectpicker('refresh');
  };
  func.renderBuddhistDetlModal = function(res) {
    var $ctnr = $('#buddhist-popup-cont'),
      htmlStr = tpl.BuddhistOrderDetl.render(res.data);
    $ctnr.html(htmlStr);
    // 二维码
    var $qrCodeContainer = $('#buddhist-popup-qr-code');
    $qrCodeContainer.html('');
    // init qrcode
    new QRCode($qrCodeContainer[0], {
      text: res.data.qrcode,
      width: 100,
      height: 100,
    });
    // 反馈图
    var feedImages =
      res.data.dispose_pic_url && res.data.dispose_pic_url.split(',');
    var $imageContainer = $('#buddhist-popup-feed-images');
    $imageContainer.html('');
    if (feedImages) {
      feedImages.map(function(image) {
        $imageContainer.append(tpl.imgCell.render({ image: image }));
      });
    } else {
      $imageContainer.html('无');
    }

    // 备注
    if (res.data.remark) {
      $('#buddhist-popup-memo').html(res.data.remark);
    } else {
      $('#buddhist-popup-memo').html('无');
    }
    $('body').addClass('overflow-hidden');
    $('#buddhist-popup')
      .show()
      .scrollTop(0);
  };
  func.renderWallDetlModal = function(res) {
    $('#wall-popup-title').text(res.data.name + ' ' + res.data.place);
    $('#wall-popup-sequence').text(res.data.sequence);
    $('#wall-popup-time').text(res.data.time);
    $('#wall-popup-money').text(res.data.money);
    $('#wall-popup-type').text(res.data.type);
    $('#wall-popup-order-number').text(res.data.orderNumber);
    $('#wall-popup-flow-number').text(res.data.flowNumber);
    // 二维码
    var $qrCodeContainer = $('#wall-popup-qr-code');
    $qrCodeContainer.html('');
    // init qrcode
    new QRCode($qrCodeContainer[0], {
      text: res.data.url,
      width: 100,
      height: 100,
    });

    var $writeName = $('#wall-popup-write-name');
    var $writeNameContainer = $writeName.parent();
    if (res.data.writeName) {
      $writeNameContainer.removeClass('hide');
      $writeName.text(res.data.writeName);
    } else {
      $writeNameContainer.addClass('hide');
    }
    var $yangSahngRen = $('#wall-popup-yang-shang-ren');
    var $yangSahngRenContainer = $yangSahngRen.parent();
    if (res.data.yangShangRen) {
      $yangSahngRenContainer.removeClass('hide');
      $yangSahngRen.text(res.data.yangShangRen);
    } else {
      $yangSahngRenContainer.addClass('hide');
    }
    var $wangShengZhe = $('#wall-popup-wang-sheng-zhe');
    var $wangShengZheContainer = $wangShengZhe.parent();
    if (res.data.wangShengZhe) {
      $wangShengZheContainer.removeClass('hide');
      $wangShengZhe.text(res.data.wangShengZhe);
    } else {
      $wangShengZheContainer.addClass('hide');
    }
    var $wish = $('#wall-popup-wish');
    var $wishContainer = $wish.parent();
    if (res.data.wish) {
      $wishContainer.removeClass('hide');
      $wish.text(res.data.wish);
    } else {
      $wishContainer.addClass('hide');
    }

    var feedImages = res.data.feedImage && res.data.feedImage.split(',');
    var $imageContainer = $('#wall-popup-feed-images');
    $imageContainer.html('');
    if (feedImages) {
      feedImages.map(function(image) {
        $imageContainer.append(tpl.imgCell.render({ image: image }));
      });
    }

    var $contact = $('#wall-popup-contact');
    $contact.html('');
    res.data.contactList &&
      res.data.contactList.length &&
      res.data.contactList.map(function(item) {
        $contact.append(tpl.contactCell.render(item));
      });

    if (res.data.memo) {
      $('#wall-popup-memo').html(res.data.memo);
    } else {
      $('#wall-popup-memo').html('无');
    }

    $('body').addClass('overflow-hidden');
    $('#wall-popup')
      .show()
      .scrollTop(0);
  };

  return func;
});
