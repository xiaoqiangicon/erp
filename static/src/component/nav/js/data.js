
let urls = [
    // 测试机地址
    '/static/resources/json/menu_items_test.json',
    // 正式机地址
    '/static/resources/json/menu_items.json'
];

let subDomain = location.hostname.split('.')[0];

module.exports = {
    // 获取菜单项的地址
    url: subDomain === 'erptest' || subDomain === 'localhost' ? urls[0] : urls[1]
};