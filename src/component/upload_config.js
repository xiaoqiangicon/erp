// 本地测试环境
if (location.hostname === 'localhost') {
  window.zzhUploadImageUrl = '/json/menu_items_test.json';
  window.zzhUploadImageHandle = res => '/images/logo.png';
}
