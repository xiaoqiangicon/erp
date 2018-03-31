
// 本地测试环境
if (location.hostname === 'localhost') {
    window.zzhUploadImageUrl = '/static/resources/json/menu_items_test.json';
    window.zzhUploadImageHandle = res => {
        return '/static/images/chan-zai-128x128.png';
    };
}