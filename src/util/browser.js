/* eslint-disable */

/**
 * Created by senntyou on 2017/12/6.
 */

define(function() {
  var ua = navigator.userAgent;
  var lowerUa = ua.toLowerCase();

  var browser = {
    // 移动端
    isMobile: !!ua.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),
    // 微信浏览器
    isWeixin: lowerUa.indexOf('micromessenger') != -1,
    // ios终端
    isIos: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    // 是否是禅在客户端
    isChanZai:
      lowerUa.indexOf('chanzai') != -1 || lowerUa.indexOf('shanzai') != -1,
  };

  // 微信浏览器+小米手机
  browser.isWeixinAndXiaoMi = browser.isWeixin && lowerUa.indexOf('mi ') != -1;
  // 微信浏览器+红米手机
  browser.isWeixinAndHongMi =
    browser.isWeixin && lowerUa.indexOf('redmi') != -1;

  return browser;
});
