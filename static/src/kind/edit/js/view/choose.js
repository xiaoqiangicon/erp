
const $ = require('jquery');
const seeView = require('see-view');

require('component/upload_config');

require('@zzh/upload/dist/upload.css');
require('@zzh/pagination/dist/pagination.css');
require('less/pagination.less');
require('@zzh/choose-image/dist/choose-image.css');
const ChooseImage = require('@zzh/choose-image');

require('component/choose_image_config');

let coverItemTpl = require('../tpl/main/detail/cover_item');
let shareItemTpl = require('../tpl/main/detail/share_item');

let coverChooseImage;
let shareChooseImage;
let payChooseImage;

let $currentPayItemAdd;

seeView({
    events: {
        // 点击添加封面
        'click #cover-add': 'onClickCoverAdd',
        // 点击添加分享图标
        'click #share-icon-add': 'onClickShareIconAdd',
        // 点击添加支付选择项图标
        'click [data-pay-item-add]': 'onClickPayItemAdd'
    },
    // 点击添加封面
    onClickCoverAdd: e => {
        if (!coverChooseImage) {
            coverChooseImage = new ChooseImage({
                onSubmit: items => {
                    let existLength = $('[data-cover-item]').length;
                    let remainLength = 3 - existLength;
                    let $coverContainer = $('#cover-container');
                    let $coverAdd = $('#cover-add');
                    items.forEach((item, index) => {
                        index < remainLength && $coverContainer.append(coverItemTpl({image: item.src}));
                    });

                    (items.length + existLength) >= 3 && $coverAdd.addClass('hide');
                }
            });
        }

        coverChooseImage.show();
    },
    // 点击添加分享图标
    onClickShareIconAdd: e => {
        if (!shareChooseImage) {
            shareChooseImage = new ChooseImage({
                multiSelect: !1,
                onSubmit: items => {
                    let $shareIconContainer = $('#share-icon-container');
                    let $shareIconAdd = $('#share-icon-add');
                    $shareIconContainer.append(shareItemTpl({image: items[0].src}));
                    $shareIconAdd.addClass('hide');
                }
            });
        }

        shareChooseImage.show();
    },
    // 点击添加支付选择项图标
    onClickPayItemAdd: e => {
        $currentPayItemAdd = $(e.target);
        if (!payChooseImage) {
            payChooseImage = new ChooseImage({
                multiSelect: !1,
                onSubmit: items => {
                    let $container = $currentPayItemAdd.parents('[data-pay-item-icon-container]');

                    $container.find('[data-pay-item-image]').attr({src: items[0].src});
                    $container.find('[data-pay-item-add]').addClass('hide');
                    $container.find('[data-pay-item-icon]').removeClass('hide');
                }
            });
        }

        payChooseImage.show();
    }
});