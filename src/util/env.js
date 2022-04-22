const domains = {
  erptest: 1,
  erprelease: 2,
  zizaihome: 3,
  www: 3,
  erp: 3,
};

// 当前子域名
export const subDomain = window.location.hostname.split('.')[0];

// 服务器环境（0：本地环境，1：测试环境，2：灰度环境，3：产品环境）
export const serverEnv = domains[subDomain] || 0;

// 协议
export const wxProtocol = ['', 'https', 'https', 'https'][serverEnv];

// 微信端子域名
export const wxSubDomain = ['localhost', 'wxapp1', 'wxapp2', 'wx'][serverEnv];

// 参数后缀
export const wxParamSuffix = ['', 'isTest=1', 'isTest=2', ''][serverEnv];
