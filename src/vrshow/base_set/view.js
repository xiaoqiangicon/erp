import $ from 'jquery';
import Toast from 'old/toast';
import data from './data';
import tpl from './tpl';
import func from './function';
import '../../../old-com/jquery-qrcode';
import './ajax';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'click [data-switch-qrcode]': 'changeQrcode',
    'click [data-music-play]': 'playMusic',
    'click #save-temple-set': 'saveTempleSet',
  },
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
  playMusic: function(e) {
    var $tar = $(e.target),
      $audio = $('audio'),
      $curPlayMusic = $('[data-music-play=' + 1 + ']'),
      audio = $audio.get(0),
      src = $tar.attr('data-src'),
      curSrc = $audio.prop('src');
    if ($curPlayMusic.length && $tar[0] !== $curPlayMusic[0]) {
      $curPlayMusic.attr('data-music-play', 0);
      $curPlayMusic.removeClass('music-stop').addClass('music-play');
    }
    if (curSrc !== src) {
      $audio.prop('src', src);
    }
    if (parseInt($tar.attr('data-music-play')) === 0) {
      $tar.attr('data-music-play', 1);
      $tar.removeClass('music-play').addClass('music-stop');
      audio.play();
    } else {
      $tar.attr('data-music-play', 0);
      $tar.removeClass('music-stop').addClass('music-play');
      audio.pause();
    }
  },
  saveTempleSet: function(e) {
    data.updateTempleSetParams.giftList.map(function(item) {
      var content = $('[data-input-day-type=' + item.type + ']').val(),
        formType = parseInt(
          $('[data-select-day-type=' + item.type + ']').val()
        );
      item.content = content;
      item.formType = formType;
    });
    var $limitRadio = $('#free-incense-limit'),
      $limitNumInput = $('#limit-num'),
      limit = $limitRadio.prop('checked'),
      num = parseInt($limitNumInput.val());
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
    $('#music-list-container')
      .find('[type="radio"]')
      .each(function(index, ele) {
        if ($(ele).prop('checked')) {
          data.updateTempleSetParams.musicId = parseInt($(ele).attr('data-id'));
        }
      });
    if (data.updateTempleSetParams.musicId === '') {
      Toast('请选择背景音乐', 2, 3000, false);
      return;
    }
    func.updateTempleSet(data.updateTempleSetParams, function(res) {
      Toast('保存成功', 1, 2000, false);
    });
  },
});
