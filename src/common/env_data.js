/**
 * 环境值
 *
 * Created by senntyou on 2017/3/7.
 */
define([], function() {
  // 获取环境变量(1->test, 2->prod-test, 0->prod)
  var env = (function() {
    var hostNames = location.hostname.split('.'),
      hostPrefix = hostNames[0],
      env = hostPrefix == 'erptest' ? 1 : hostPrefix == 'erprelease' ? 2 : 0;

    return env;
  })();
  // 环境变量URL标识后缀
  var envParamMark = env == 1 ? 'isTest=1' : env == 2 ? 'isTest=2' : '';

  return {
    env: env,
    envParamMark: envParamMark,
  };
});
