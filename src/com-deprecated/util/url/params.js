var params = {};
if (location.search)
  location.search
    .slice(1)
    .split('&')
    .forEach(item => {
      var itemArray = item.split('=');
      params[itemArray[0]] = itemArray[1] || '';
    });
export default params;
