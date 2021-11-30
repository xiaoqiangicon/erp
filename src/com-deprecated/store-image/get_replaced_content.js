export default (content, originUrl, newUrl) => {
  if (originUrl !== newUrl && newUrl.indexOf(originUrl) !== -1)
    throw new Error('新 url 不能包含旧 url，否则会造成内存溢出');

  // 因正则替换有问题（某些特殊的字符串不能处理），就只能以字符串的形式替换
  let oldContent = content;
  let newContent = content;
  /**
   * 避免 "url" "url?123" 替换后变成 "newUrl?params" "newUrl?params?123"
   */
  // newContent = newContent.replace(originUrl, newUrl);
  newContent = newContent.replace(originUrl + ' ', newUrl + ' ');
  newContent = newContent.replace(originUrl + '"', newUrl + '"');
  newContent = newContent.replace(originUrl + ')', newUrl + ')');
  newContent = newContent.replace(originUrl + '&', newUrl + '&');
  while (oldContent !== newContent) {
    oldContent = newContent;

    /**
     * 避免 "url" "url?123" 替换后变成 "newUrl?params" "newUrl?params?123"
     */
    // newContent = newContent.replace(originUrl, newUrl);
    newContent = newContent.replace(originUrl + ' ', newUrl + ' ');
    newContent = newContent.replace(originUrl + '"', newUrl + '"');
    newContent = newContent.replace(originUrl + ')', newUrl + ')');
    newContent = newContent.replace(originUrl + '&', newUrl + '&');
  }
  return newContent;
};
