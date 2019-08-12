var ua = navigator.userAgent;
var lowerUa = ua.toLowerCase();
var browser = {
  isMobile: !!ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i),
  isWeixin: lowerUa.indexOf("micromessenger") != -1,
  isIos: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isChanZai: lowerUa.indexOf("chanzai") != -1 || lowerUa.indexOf("shanzai") != -1
};
browser.isWeixinAndXiaoMi = browser.isWeixin && lowerUa.indexOf("mi ") != -1;
browser.isWeixinAndHongMi = browser.isWeixin && lowerUa.indexOf("redmi") != -1;
export default browser;
