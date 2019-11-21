import seeAjax from 'see-ajax';

seeAjax.setEnv(__SEE_ENV__);

// 发送手机验证码
seeAjax.config('sendMessageCode', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/templeApplySendCode/',
    '/src/register/find_pwd/utils/mock/templeApplySendCode',
  ],
});

// 重新设置账号密码
seeAjax.config('resetPassword', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/editPwd/', '/src/register/find_pwd/utils/mock/editPwd'],
});
