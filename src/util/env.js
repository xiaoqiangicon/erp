const domains = {
  erptest: 1,
  erprelease: 2,
  zizaihome: 3,
  www: 3,
  erp: 3,
};

// 当前子域名
export const subDomain = window.location.hostname.split('.')[0];

// 服务器环境（0：本地环境，1：测试机，2：灰度机，3：正式机）
export const serverEnv = domains[subDomain] || 0;

// 协议
export const wxProtocol = ['', 'http', 'http', 'https'][serverEnv];

// 微信端子域名
export const wxSubDomain = ['localhost', 'test', 'test2', 'wx'][serverEnv];

// 参数后缀
export const wxParamSuffix = ['', 'isTest=1', 'isTest=2', ''][serverEnv];
