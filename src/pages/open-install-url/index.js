import 'bootstrap/dist/css/bootstrap.css';
import 'colors.css/css/colors.css';
import '@senntyou/shortcut.css';
import 'toastr/build/toastr.css';
import 'jquery-confirm/dist/jquery-confirm.min.css';

import $ from 'jquery';
import { makeTranPageLink } from '../../../pro-com/src/open-install';

const $ok = $('#ok');
const $userMark = $('#user-mark');
const $openUrl = $('#open-url');
const $channel = $('#channel');
const $result = $('#result');

$ok.click(() => {
  const userMark = $userMark.val();
  const openUrl = $openUrl.val();
  const channel = $channel.val();

  $result.text(
    makeTranPageLink({
      userMark,
      openUrl,
      channel,
    })
  );
});
