/**
 * Created by Linfe on 2017/2/22.
 */
define(['./config', 'old/utils', 'old/backbone'], function(config, doRequest) {
  $.ajaxSetup({
    cache: false,
  });
  var View = Backbone.View.extend({
    beforeTop: 0, // 距离顶部位置
    contentItems: null,
    contentView: null,
    articleTitle: '', // 分享标题
    articleDescription: '', // 分享描述
    isMobile: false, // 判断是否是手机
    content_id: '', // 二级栏目I
    skip_id: '', // 跳转到目标位置的ID
    el: 'body',
    events: {
      'click .js-toolbar-action': 'toggleMenu', // 切换菜单
    },
    UrlSearch: function() {
      var name,
        value,
        str = location.href, //取得整个地址栏
        num = str.indexOf('?');
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split('&'); //各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=');
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this[name] = value;
        }
      }
    },
    initialize: function(e) {
      var self = this;
      /* 浏览器检测 */
      window.mobilecheck = (function() {
        var check = false;
        (function(a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
              a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substr(0, 4)
            )
          )
            check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        self.isMobile = check;
      })();
      if (self.isMobile == false) {
        $('.js-toolbar-action')
          .eq(0)
          .click();
      }
      /* 浏览器检测结束 */
      /*获取微信权限*/
      (function() {
        var url = encodeURIComponent(window.location.href);

        $.getJSON('https://wx.zizaihome.com/getSign/?url=' + url, function(
          json
        ) {
          var signature = json;
          wx.checkJsApi({
            jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            },
          });

          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: signature.appId, // 必填，公众号的唯一标识
            timestamp: signature.timestamp, // 必填，生成签名的时间戳
            nonceStr: signature.noncestr, // 必填，生成签名的随机串
            signature: signature.sign, // 必填，签名，见附录1
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error(function(res) {});
        });
      })();
      /*获取url参数信息*/
      var UrlSearch = new self.UrlSearch();
      self.content_id = UrlSearch.contentId;
      self.skip_id = UrlSearch.id;
      // 找到content_id中包含的#号跳转
      if (typeof self.content_id != 'undefined') {
        var skip_key_index = self.content_id.indexOf('#');
        if (skip_key_index > -1) {
          self.content_id = self.content_id.slice(0, skip_key_index);
        }
      }
      /*获取url参数信息结束*/
      self.getHelpMenu();
      self.contentItems = new contentModel();
      self.contentView = new contentView({
        el: '#book-search-results',
        model: self.contentItems,
      });
      self.changeContent();
      $('#book-search-results').removeClass('hide');
      // 如果有跳转ID，就跳转到目标ID位置
      if (typeof self.skip_id != 'undefined') {
        var distance = $('#' + self.skip_id).offset().top;
        $('.body-inner')
          .eq(0)
          .animate({ scrollTop: distance }, 100);
      }
      /*分别进行移动端与pc端绑定屏幕滚动触发事件*/
      if (self.isMobile == 1) {
        $('.book-body')
          .eq(0)
          .bind('scroll', function() {
            var afterTop = $('.book-body')
              .eq(0)
              .scrollTop();
            if (afterTop != 0 && afterTop > self.beforeTop) {
              setTimeout(self.renderPictures(), 100);
            }
          });
      } else {
        $('.body-inner')
          .eq(0)
          .bind('scroll', function() {
            var afterTop = $('.body-inner')
              .eq(0)
              .scrollTop();
            if (afterTop != 0 && afterTop > self.beforeTop) {
              setTimeout(self.renderPictures(), 100);
            }
          });
      }

      // 分享标题
      self.articleTitle = $('#book-search-results > h1')
        .eq(0)
        .text();
      // 分享描述
      var articleText = $('#book-search-results > p')
          .text()
          .substring(0, 100),
        firstSentenceStopIndex = articleText.indexOf('。') + 1;
      if (firstSentenceStopIndex == -1) {
        self.articleDescription = articleText;
      } else {
        self.articleDescription = articleText.substring(
          0,
          firstSentenceStopIndex
        );
      }
      wx.ready(function() {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
          title: self.articleTitle, // 分享标题
          link: self.articleDescription, // 分享链接
          imgUrl:
            'http://www.zizaihome.cn/icon/temple_128px_1162857_easyicon.net.ico', // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        // 分享给朋友
        wx.onMenuShareAppMessage({
          title: self.articleTitle, // 分享标题
          desc: self.articleDescription, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl:
            'http://www.zizaihome.cn/icon/temple_128px_1162857_easyicon.net.ico', // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        // 分享到QQ
        wx.onMenuShareQQ({
          title: self.articleTitle, // 分享标题
          desc: self.articleDescription, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl:
            'http://www.zizaihome.cn/icon/temple_128px_1162857_easyicon.net.ico', // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        // 分享到微博
        wx.onMenuShareWeibo({
          title: self.articleTitle, // 分享标题
          desc: self.articleDescription, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl:
            'http://www.zizaihome.cn/icon/temple_128px_1162857_easyicon.net.ico', // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
        // 分享到QQ空间
        wx.onMenuShareQZone({
          title: self.articleTitle, // 分享标题
          desc: self.articleDescription, // 分享描述
          link: window.location.href, // 分享链接
          imgUrl:
            'http://www.zizaihome.cn/icon/temple_128px_1162857_easyicon.net.ico', // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          },
        });
      });
    },
    toggleMenu: function(e) {
      $('.book').toggleClass('with-summary');
    },
    renderPictures: function(e) {
      var self = this,
        getContentPics = $('#book-search-results').find('img'),
        bodyHeight = document.body.offsetHeight;
      if (self.isMobile == 0) {
        var bodyTop = $('.body-inner')
          .eq(0)
          .scrollTop();
      } else {
        var bodyTop = $('.book-body')
          .eq(0)
          .scrollTop();
      }
      self.beforeTop = bodyTop; // 将当前距离顶部高度保存，方便判断滚动条滚动方向
      $.each(getContentPics, function(index, ele) {
        var distance = $(ele).offset().top - bodyTop - bodyHeight;
        if (distance < bodyHeight / 2) {
          console.log('渲染图片' + index);
          var pic_src = $(ele).attr('data-src');
          if (typeof pic_src != 'undefined') {
            $(ele)
              .attr('src', pic_src)
              .removeAttr('data-src');
          }
        }
      });
    },
    getHelpMenu: function(e) {
      $.ajax({
        type: 'get',
        url: '/zzhadmin/helpMenu/',
        async: false,
        success: function(res) {
          var template = juicer(config.template.component.menu_list);
          var html = template.render(res);
          $('.summary')
            .eq(0)
            .html(html);
        },
        error: function(res) {
          console.log('获取菜单列表失败！');
        },
      });
    },
    changeContent: function(e) {
      var self = this;
      $('.articles .chapter').removeClass('active');
      if (typeof self.content_id == 'undefined' || self.content_id == '') {
        var $tar = $('.articles')
            .eq(0)
            .find('li')
            .eq(0)
            .find('a')
            .eq(0),
          cur_content_id = $tar.attr('data-id');
      } else {
        var $tar = $('.sub_chapter')
            .find('[data-id=' + self.content_id + ']')
            .eq(0),
          cur_content_id = self.content_id;
      }
      $tar.parent().addClass('active');
      var $contentList = $tar.parents('.articles').find('a'),
        contentIdsArr = [],
        contentIds = '';
      $contentList.each(function() {
        contentIdsArr.push($(this).attr('data-id'));
      });
      contentIds = contentIdsArr.join(',');
      $.ajax({
        type: 'get',
        url:
          '/zzhadmin/helpContent/?contentId=' +
          cur_content_id +
          '&ids=' +
          contentIds,
        async: false,
        success: function(res) {
          var get_content = res['data'];
          get_content['content'] = res['data']['content'];
          console.log(res['data']['content']);
          self.contentItems = new contentModel(get_content);
          self.contentView = new contentView({
            el: '#book-search-results',
            model: self.contentItems,
          });
          self.contentView.render();
        },
        error: function(res) {
          console.log('获取内容失败！');
        },
      });
    },
  });

  var contentModel = Backbone.Model.extend({
    defaults: {
      addTime: '',
      content: '',
      id: '',
      ids: '',
      title: '',
      preContent: '',
      nextContent: '',
    },
  });
  var contentView = Backbone.View.extend({
    tagName: 'div',
    className: 'search-noresults',
    initialize: function() {
      this.model.on(
        'change:addTime change:content change:id change:ids change:title',
        this.render,
        this
      );
    },
    render: function() {
      var aa = this.model.toJSON();
      var template = juicer(config.template.component.help_content);
      var html = template.render(this.model.toJSON());
      this.$el.html(html);
      return this;
    },
  });
  var helpCenterView = new View();
});
