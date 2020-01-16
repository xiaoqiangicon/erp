export default url => {
  url.slice(0, 2) === '//' && (url = 'http:' + url);
  return url;
};
