/**
 * @author senntyou <jiangjinbelief@163.com>
 */

// 当前子域名
const subDomain = window.location.hostname.split('.')[0];

// 服务器环境（0：本地环境，1：测试机，2：灰度机，3：正式机）
const serverEnv = (() => {
  const domains = {
    erptest: 1,
    erprelease: 2,
    zizaihome: 3,
    www: 3,
    erp: 3,
  };

  return domains[subDomain] || 0;
})();

const wxSubDomain = ['localhost', 'test', 'test2', 'wx'][serverEnv];

// 参数后缀
const wxParamSuffix = ['', 'isTest=1', 'isTest=2', ''][serverEnv];

module.exports = {
  // 服务器环境（0：本地环境，1：测试机，2：灰度机，3：正式机）
  serverEnv,
  wxSubDomain,
  // 协议：http, https
  wxProtocol: serverEnv === 3 ? 'https' : 'http',
  // 参数后缀
  wxParamSuffix,
};
