const $ = require('jquery');
const seeView = require('see-view');

const payItemTpl = require('../tpl/main/detail/pay_item');

seeView({
  events: {
    // 点击支付选择项图标
    'click [data-pay-item-icon-delete]': 'onClickPayItemIconDelete',
    // 点击删除一个支付选择项
    'click [data-pay-item-delete]': 'onClickPayItemDelete',
    // 点击复制一个支付选择项
    'click [data-pay-item-copy]': 'onClickPayItemCopy',
    // 点击添加支付选择项
    'click #pay-add': 'onClickPayAdd',
  },
  // 点击支付选择项图标
  onClickPayItemIconDelete: e => {
    const $this = $(e.target);
    const $parent = $this.parent();
    const $grand = $parent.parent();

    $parent.find('[data-pay-item-image]').attr({ src: '' });
    $parent.addClass('hide');
    $grand.find('[data-pay-item-add]').removeClass('hide');
  },
  // 点击删除一个支付选择项
  onClickPayItemDelete: e => {
    $(e.target)
      .parents('[data-pay-item]')
      .remove();
  },
  // 点击复制一个支付选择项
  onClickPayItemCopy: e => {
    const $container = $(e.target).parents('[data-pay-item]');
    const name = $container.find('[data-pay-item-name]').val();
    const price = $container.find('[data-pay-item-price]').val();
    const desc = $container.find('[data-pay-item-desc]').val();
    const icon = $container.find('[data-pay-item-image]').attr('src') || '';

    const $payContainer = $('#pay-container');
    const $el = $(
      payItemTpl({
        id: 0,
        name,
        price,
        desc,
        icon,
      })
    );
    $payContainer.append($el);
  },
  // 点击添加支付选择项
  onClickPayAdd: e => {
    const $payContainer = $('#pay-container');
    const $el = $(
      payItemTpl({
        id: 0,
        name: '',
        price: '',
        desc: '',
        icon: '',
      })
    );
    $payContainer.append($el);
  },
});
