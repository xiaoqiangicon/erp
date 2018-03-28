
// 本地测试环境
if (location.hostname === 'localhost') {
    window.zzhUploadImageUrl = 'http://localhost:1337/upload';
    window.zzhUploadImageHandle = res => {
        return '/static/images/chan-zai-128x128.png';
    };
}