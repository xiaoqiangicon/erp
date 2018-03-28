
const $ = require('jquery');
const seeView = require('see-view');

let payItemTpl = require('../tpl/main/detail/pay_item');
let initPayUpload = require('../init/pay_upload');

seeView({
    events: {
        // 点击支付选择项图标
        'click [data-pay-item-icon-delete]': 'onClickPayItemIconDelete',
        // 点击删除一个支付选择项
        'click [data-pay-item-delete]': 'onClickPayItemDelete',
        // 点击复制一个支付选择项
        'click [data-pay-item-copy]': 'onClickPayItemCopy',
        // 点击添加支付选择项
        'click #pay-add': 'onClickPayAdd'
    },
    // 点击支付选择项图标
    onClickPayItemIconDelete: e => {
        let $this = $(e.target);
        let $parent = $this.parent();
        let $grand = $parent.parent();

        $parent.find('[data-pay-item-image]').attr({src: ''});
        $parent.addClass('hide');
        $grand.find('[data-pay-item-add]').removeClass('hide');
    },
    // 点击删除一个支付选择项
    onClickPayItemDelete: e => {
        $(e.target).parents('[data-pay-item]').remove();
    },
    // 点击复制一个支付选择项
    onClickPayItemCopy: e => {
        let $container = $(e.target).parents('[data-pay-item]');
        let name = $container.find('[data-pay-item-name]').val();
        let price = $container.find('[data-pay-item-price]').val();
        let desc = $container.find('[data-pay-item-desc]').val();
        let icon = $container.find('[data-pay-item-image]').attr('src') || '';

        let $payContainer = $('#pay-container');
        let $el = $(payItemTpl({
            id: 0,
            name,
            price,
            desc,
            icon
        }));
        $payContainer.append($el);

        initPayUpload($el.find('[data-pay-item-add]'));
    },
    // 点击添加支付选择项
    onClickPayAdd: e => {
        let $payContainer = $('#pay-container');
        let $el = $(payItemTpl({
            id: 0,
            name: '',
            price: '',
            desc: '',
            icon: ''
        }));
        $payContainer.append($el);

        initPayUpload($el.find('[data-pay-item-add]'));
    }
});