// 本地测试环境

define([], function() {
  if (window.location.hostname === 'localhost') {
    window.zzhUploadImageUrl = '/json/menu_items_test.json';
    window.zzhUploadImageHandle = res => '/images/chan-zai-128x128.png';
  } else {
  }
});
