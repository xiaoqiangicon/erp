
(function () {
    $.getJSON('/static/resources/json/menu_items_test.json', {}, function (res) {
        addAccess(res.items);
        addAccess(res.superItems);
    });

    function addAccess(items) {
        items.map(function (item) {
            item.subItems.map(function (subItem) {
                subItem.controlMark && (document.cookie = subItem.controlMark + '=' + 1);
            });
        });
    }

})();