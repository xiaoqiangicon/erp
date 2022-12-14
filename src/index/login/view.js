import $ from 'jquery';
import seeView from 'see-view';
import seeAjax from 'see-ajax';
import dialog from 'util/dialog';

seeView({
  events: {
    'click #login': 'onClickLogin',
    'click #prompt': 'onClickPrompt',
    'click #close': 'onClickClose',
    'click #fs-login': 'onClickFsLogin',
  },
  onClickLogin() {
    var username = $('#username').val();
    var password = $('#password').val();

    if (!username || !password) {
      dialog('请输入账号及密码');
      return;
    }
    console.log(1234);
    seeAjax('prelogin', { username, password }, res => {
      if (res.result === 0) {
        $('#login-btn')
          .get(0)
          .click();
      } else {
        dialog(res.msg);
      }
    });
  },
  onClickPrompt() {
    $('#qr-box').removeClass('hide');
  },
  onClickClose() {
    $('#qr-box').addClass('hide');
  },
  onClickFsLogin() {
    window.location.href =
      'https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=https%3A%2F%2Fwww.zizaihome.com%2Faccounts%2Flogin%2F&app_id=cli_a0b99107d7789013&state=';
  },
});
