import 'juicer';
var tpl = {
  addComponent: `
        {@each components as component}
        <li><a class="component-add" data-action="component-add" data-type="\${component.type}" data-insert="0">\${component.displayName}</a></li>
        {@/each}
    `,
  websiteUrlDisplay: `
        <p>下面的地址是您的寺院微站官方地址，你可以将它分享给好友，或者通过邮件的方式发送出去。</p>
        <div class="clearfix mgt20">
            <div class="left text-center" style="width: 200px;">
                <div id="website-url-qrcode-container"></div>
                <p class="mgb0 mgt10">微信扫一扫预览</p>
            </div>
            <div class="right" style="width: 200px;">
                <textarea rows="3" class="form-control" id="website-url-display">\${url}</textarea>
                <p class="clearfix text-center mgt20"><button class="btn btn-info btn-sm" data-clipboard-target="#website-url-display">复制链接</button></p>
            </div>
        </div>
    `,
  addComponent2: `
        <div class="component-edit component-edit-add"  data-container="component-edit" data-type="0" data-id="0">
            <div class="component-edit-cell">
                <h4 class="fs14 fb text-center">添加内容</h4>
                <ul class="clearfix component-add-container">
                    {@each components as component}
                    <li><a class="component-add" data-action="component-add" data-type="\${component.type}" data-insert="1">\${component.displayName}</a></li>
                    {@/each}
                </ul>
            </div>
        </div>
    `,
  uploadCell: `
        <li data-upload-image-container="\${id}" data-type="\${type}" data-image-id="\${imageId}" data-is-update="\${isUpdate}">
            <img src="\${image}" data-upload-image="\${id}" data-image-id="\${imageId}" data-type="\${type}">
            <button class="clean-button upload-remove" data-upload-image-delete="\${id}" data-image-id="\${imageId}" data-component-type="\${type}">×</button>
        </li>
    `,
  uploadCellForProgress: `
        <li data-upload-progress-container="\${id}" data-type="\${type}">
            <div class="progress">
                <div class="progress-bar progress-bar-success" data-upload-progress-bar="\${id}" data-type="\${type}"></div>
            </div>
        </li>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
