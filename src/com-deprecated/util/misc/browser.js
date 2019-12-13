let ua = navigator.userAgent;
let lowerUa = ua.toLowerCase();
let browser = {
  isMobile: !!ua.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  ),
  isWeiXin: lowerUa.indexOf('micromessenger') !== -1,
  isIos: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isChanZai:
    lowerUa.indexOf('chanzai') !== -1 || lowerUa.indexOf('shanzai') !== -1,
  isXiaoMi: lowerUa.indexOf('mi ') !== -1,
  isHongMi: lowerUa.indexOf('redmi') !== -1,
  isMiniProgram: () => window.__wxjs_environment === 'miniprogram',
};
export default browser;
