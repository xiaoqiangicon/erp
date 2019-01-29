/**
 * Created by kang on 2017/10/23.
 */

define([
  'jquery',
  'old/toast',
  './data',
  './tpl',
  './function',
  '@zzh/jquery-qrcode',
  './ajax',
  'lib/jquery.seeView',
], function($, Toast, data, tpl, func) {
  $.seeView({
    events: {
      // 点击切换二维码大小
      'click [data-switch-qrcode]': 'changeQrcode',
      // 点击播放音乐
      'click [data-music-play]': 'playMusic',
      // 保存寺庙设置
      'click #save-temple-set': 'saveTempleSet',
    },
    // 点击切换二维码大小
    changeQrcode: function(e) {
      var $tar = $(e.target),
        $qrcodeContainer = $('#qrcode-container'),
        type = parseInt($tar.attr('data-switch-qrcode'));
      $('[data-switch-qrcode]').removeClass('active');
      $tar.addClass('active');
      $qrcodeContainer.html('');
      $qrcodeContainer.qrcode({
        width: data.qrcodeSizes[type - 1],
        height: data.qrcodeSizes[type - 1],
        text: data.templeSetRes.url,
      });
    },
    // 点击播放音乐
    playMusic: function(e) {
      // 注意状态的0和1和样式的play/stop是相反的
      var $tar = $(e.target),
        $audio = $('audio'),
        $curPlayMusic = $('[data-music-play=' + 1 + ']'),
        audio = $audio.get(0),
        src = $tar.attr('data-src'),
        curSrc = $audio.prop('src');
      // 存在正在播放的歌曲时重置其它的暂停按钮
      if ($curPlayMusic.length && $tar[0] !== $curPlayMusic[0]) {
        $curPlayMusic.attr('data-music-play', 0);
        $curPlayMusic.removeClass('music-stop').addClass('music-play');
      }
      // 切换歌曲链接:会导致播放器初始化回到暂停状态
      if (curSrc !== src) {
        $audio.prop('src', src);
      }
      // 切换播放器状态
      if (parseInt($tar.attr('data-music-play')) === 0) {
        // 未播放的开始播放
        $tar.attr('data-music-play', 1);
        $tar.removeClass('music-play').addClass('music-stop');
        audio.play();
      } else {
        $tar.attr('data-music-play', 0);
        $tar.removeClass('music-stop').addClass('music-play');
        audio.pause();
      }
    },
    // 保存寺庙设置
    saveTempleSet: function(e) {
      // 获取奖励设置参数
      data.updateTempleSetParams.giftList.map(function(item) {
        var content = $('[data-input-day-type=' + item.type + ']').val(),
          formType = parseInt(
            $('[data-select-day-type=' + item.type + ']').val()
          );
        item.content = content;
        item.formType = formType;
      });
      // 获取免费香设置参数
      var $limitRadio = $('#free-incense-limit'),
        $limitNumInput = $('#limit-num'),
        limit = $limitRadio.prop('checked'), // 获取的是true/false
        num = parseInt($limitNumInput.val());
      // 数据校验
      if (limit && isNaN(num)) {
        $limitNumInput.select();
        Toast('请正确填写每日限额！', 2, 3000, false);
        return;
      }
      if (limit) {
        data.updateTempleSetParams.freeNumber = num;
      } else {
        data.updateTempleSetParams.freeNumber = -1;
      }
      // 获取音乐设置参数
      $('#music-list-container')
        .find('[type="radio"]')
        .each(function(index, ele) {
          if ($(ele).prop('checked')) {
            data.updateTempleSetParams.musicId = parseInt(
              $(ele).attr('data-id')
            );
          }
        });
      if (data.updateTempleSetParams.musicId === '') {
        Toast('请选择背景音乐', 2, 3000, false);
        return;
      }
      // debugger;
      // 更新寺院设置
      func.updateTempleSet(data.updateTempleSetParams, function(res) {
        Toast('保存成功', 1, 2000, false);
      });
    },
  });
});
