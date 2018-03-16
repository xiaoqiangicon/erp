
let $ = require('jquery');

let tplContainer = require('./tpl/container');
let tplHeader = require('./tpl/header');
let tplItems = require('./tpl/items');

let fillItemsFields = require('./util/fill_items_fields');
let initAccess = require('./util/init_access');

let $body = $('body');

module.exports = (res) => {
    // 填充字段
    fillItemsFields(res.items);
    fillItemsFields(res.superItems);

    // 初始化UI
    $body.prepend(tplContainer);
    $("#component-nav-header").html(tplHeader);
    $("#component-nav-menu").html(tplItems({items: res.items}));
    $("#super-component-nav-menu").html(tplItems({items: res.superItems}));

    // 初始化权限
    initAccess(res.items);
    initAccess(res.superItems);

    // 展开当前菜单
    let id = $body.attr("data-menu-id");
    let $menuItem = $('[data-menu-sub-item-id="' + id + '"]');

    $menuItem.addClass("active");
    $menuItem.parents(".component-nav-sub-menu-inner").show();
    $menuItem.find("span.glyphicon").removeClass("green");
    $menuItem.parents(".component-nav-menu-item").find(".arrow").toggleClass("active");

    $('[data-temple-name]').text(window.localStorage['templename']);
    $("[data-buddhist-order-count]").text(window.localStorage['orderNumber']);
    $("[data-chanzai-order-count]").text(window.localStorage['chanzai_orderNumber']);
    $("[data-wall-order-count]").text(window.localStorage['buddhaWall_orderNumber']);
};