
const $ = require('jquery');

require('component/ueditor_config');
require('@zzh/ueditor/src/ueditor.config');
require('@zzh/ueditor');

let data = require('../data');
let mainTpl = require('../tpl/main');

let $body = $('body');

module.exports = _ => {
    $body.append(mainTpl(data.info));

    data.editor = window.UE.getEditor('editor');

    // 需要延迟，不然dom还没创建好
    setTimeout(_ => {
        data.info.intro && data.editor.setContent(data.info.intro);
    }, 1000);


};