
require('component/upload_config');

require('@zzh/upload/dist/upload.css');
require('@zzh/pagination/dist/pagination.css');
require('less/pagination.less');
require('@zzh/choose-image/dist/choose-image.css');
const ChooseImage = require('@zzh/choose-image');

require('component/choose_image_config');

// 多选图片
window.UE.registerUI('zzh-choose-image-multi', (editor,uiName) => {

    //创建一个button
    let btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:'添加多张图片',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -726px -77px;',
        //点击时执行的命令
        onclick:function () {
            if (!editor.zizaiUploadMultiSelect) {
                editor.zizaiUploadMultiSelect = new ChooseImage({
                    multiSelect: !0,
                    onSubmit: items => {
                        let formatedImages = [];
                        items.map(item => {
                            formatedImages.push({
                                src: item.src,
                                width: 600
                            });
                        });

                        editor.execCommand( 'insertimage', formatedImages);
                    }
                });
            }
            editor.zizaiUploadMultiSelect.show();
        }
    });
    return btn;
});