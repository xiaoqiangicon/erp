import data from "../data";
const parent = window.parent;
const dialog = parent.$EDITORUI[window.frameElement.id.replace(/_iframe$/, "")];
window.dialog = dialog;
const editor = dialog.editor;
window.editor = editor;
const UE = parent.UE;
window.UE = UE;
const domUtils = UE.dom.domUtils;
window.domUtils = domUtils;
const utils = UE.utils;
window.utils = utils;
const browser = UE.browser;
window.browser = browser;
const ajax = UE.ajax;
window.ajax = ajax;
utils.loadFile(document, {
  href: `${editor.options.themePath + editor.options.theme}/dialogbase.css?cache=${Math.random()}`,
  tag: "link",
  type: "text/css",
  rel: "stylesheet"
});
const lang = editor.getLang(dialog.className.split("-")[2]);
window.lang = lang;
if (lang) {
  domUtils.on(window, "load", () => {
    const langImgPath = `${editor.options.langPath + editor.options.lang}/images/`;
    for (const i in lang.static) {
      const dom = document.getElementById(i);
      if (!dom) continue;
      const tagName = dom.tagName;
      let content = lang.static[i];
      if (content.src) {
        content = utils.extend({}, content, false);
        content.src = langImgPath + content.src;
      }
      if (content.style) {
        content = utils.extend({}, content, false);
        content.style = content.style.replace(/url\s*\(/g, `url(${langImgPath}`);
      }
      switch (tagName.toLowerCase()) {
        case "var":
          dom.parentNode.replaceChild(document.createTextNode(content), dom);
          break;
        case "select":
          var ops = dom.options;
          for (var j = 0, oj; oj = ops[j]; ) {
            oj.innerHTML = content.options[j++];
          }
          for (const p in content) {
            p != "options" && dom.setAttribute(p, content[p]);
          }
          break;
        default:
          domUtils.setAttributes(dom, content);
      }
    }
  });
}
dialog.onok = () => {
  if (!data.selectedItem) return;
  const self = this;
  const selectedItem = data.selectedItem;
  const dataSrc = `/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=${encodeURIComponent(selectedItem.f.split("|")[3])}&music_name=${encodeURIComponent(selectedItem.songname)}`;
  let albumUrl = selectedItem.f.split("|")[22];
  albumUrl = `/${albumUrl.slice(albumUrl.length - 2, albumUrl.length - 1)}/${albumUrl.slice(albumUrl.length - 1, albumUrl.length)}/${albumUrl}.jpg`;
  const selectData = {
    musicid: selectedItem.id,
    mid: selectedItem.f.split("|")[20],
    albumurl: albumUrl,
    audiourl: selectedItem.m4a,
    music_name: selectedItem.songname,
    singer: selectedItem.f.split("|")[3],
    datasrc: dataSrc,
    singername: selectedItem.singername
  };
  const url = `${data.playerUrl}?from=tiebasongwidget&url=&name=${encodeURIComponent(selectedItem.albumname)}&artist=${encodeURIComponent(selectedItem.singername)}&extra=${encodeURIComponent(selectedItem.albumname)}&loop=true`;
  editor.execCommand("music", {
    url,
    width: 400,
    height: 95,
    selectData
  });
};
