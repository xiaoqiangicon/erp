export default (content, originUrl, newUrl) => {
  let oldContent = content;
  let newContent = content.replace(originUrl, newUrl);
  while (oldContent !== newContent) {
    oldContent = newContent;
    newContent = newContent.replace(originUrl, newUrl);
  }
  return newContent;
};
