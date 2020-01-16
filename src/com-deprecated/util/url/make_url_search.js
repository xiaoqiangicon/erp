export default params => {
  var urlParams = [];
  for (var attr in params) {
    if (params.hasOwnProperty(attr))
      urlParams.push(
        attr + '=' + (params[attr] ? encodeURIComponent(params[attr]) : '')
      );
  }
  return urlParams.join('&');
};
