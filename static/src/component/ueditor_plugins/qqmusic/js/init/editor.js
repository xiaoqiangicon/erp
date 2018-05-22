
let data = require('../data');


let parent = window.parent;

//dialog对象
let dialog = parent.$EDITORUI[window.frameElement.id.replace( /_iframe$/, '' )];
window.dialog = dialog;

//当前打开dialog的编辑器实例
let editor = dialog.editor;
window.editor = editor;

let UE = parent.UE;
window.UE = UE;

let domUtils = UE.dom.domUtils;
window.domUtils = domUtils;

let utils = UE.utils;
window.utils = utils;

let browser = UE.browser;
window.browser = browser;

let ajax = UE.ajax;
window.ajax = ajax;

utils.loadFile(document,{
    href: editor.options.themePath + editor.options.theme + "/dialogbase.css?cache=" + Math.random(),
    tag:'link',
    type:'text/css',
    rel:'stylesheet'
});

let lang = editor.getLang(dialog.className.split( "-" )[2]);
window.lang = lang;

if(lang){
    domUtils.on(window,'load', () => {

        let langImgPath = editor.options.langPath + editor.options.lang + "/images/";
        //针对静态资源
        for ( var i in lang["static"] ) {
            var dom = document.getElementById( i );
            if(!dom) continue;
            var tagName = dom.tagName,
                content = lang["static"][i];
            if(content.src){
                //clone
                content = utils.extend({},content,false);
                content.src = langImgPath + content.src;
            }
            if(content.style){
                content = utils.extend({},content,false);
                content.style = content.style.replace(/url\s*\(/g,"url(" + langImgPath)
            }
            switch ( tagName.toLowerCase() ) {
                case "var":
                    dom.parentNode.replaceChild( document.createTextNode( content ), dom );
                    break;
                case "select":
                    var ops = dom.options;
                    for ( var j = 0, oj; oj = ops[j]; ) {
                        oj.innerHTML = content.options[j++];
                    }
                    for ( var p in content ) {
                        p != "options" && dom.setAttribute( p, content[p] );
                    }
                    break;
                default :
                    domUtils.setAttributes( dom, content);
            }
        }
    });
}


dialog.onok = () => {
    if (!data.selectedItem) return;

    let self = this;
    let selectedItem = data.selectedItem;

    let dataSrc = "/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=" +
        encodeURIComponent(selectedItem.f.split("|")[3]) +
        "&music_name=" + encodeURIComponent(selectedItem.songname);
    let albumUrl = selectedItem.f.split("|")[22];
    albumUrl = "/" + albumUrl.slice(albumUrl.length - 2, albumUrl.length - 1) +
        "/" + albumUrl.slice(albumUrl.length - 1, albumUrl.length) + "/" + albumUrl + ".jpg";
    let selectData = {
        musicid: selectedItem.id,
        mid: selectedItem.f.split("|")[20],
        albumurl: albumUrl,
        audiourl: selectedItem.m4a,
        music_name: selectedItem.songname,
        singer: selectedItem.f.split("|")[3],
        datasrc: dataSrc,
        singername: selectedItem.singername
    };

    let url = data.playerUrl + "?from=tiebasongwidget&url=&name=" + encodeURIComponent(selectedItem.albumname) +
        "&artist=" + encodeURIComponent(selectedItem.singername) +
        "&extra=" + encodeURIComponent(selectedItem.albumname) +
        "&loop=true";
    editor.execCommand('music', {
        url,
        width: 400,
        height: 95,
        selectData: selectData
    });
};
