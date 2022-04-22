// 注册插件

const isLocal = window.location.href.indexOf('localhost') > -1;
const displayUrl = `${
  isLocal ? '' : '/static'
}/build/com/ueditor-plugins/embed-video-display.html?_=${Date.now()}`;
const { utils } = window.UE;

window.UE.plugin.register('embedvideo', function() {
  function creatInsertStr(selectData, toEmbed) {
    const props = `d-video="${selectData.video}"`;

    if (toEmbed) {
      return `<video preload="true" controls class="edui-faked-embed-video" poster=${selectData.video +
        '?vframe/jpg/offset/1'} src=${selectData.video}></video><p><br/></p>`;
    }

    return `<section class="video-ng"><iframe style="background-color:transparent;width:100%;border:none;" class="edui-faked-embed-video insertvideo" src="${displayUrl}" ${props}></iframe></section>`;
  }

  return {
    outputRule(b) {
      utils.each(b.getNodesByTagName('iframe'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-video') > -1) {
          const c = creatInsertStr(
            {
              video: b.getAttr('d-video'),
            },
            !0
          );
          const f = window.UE.uNode.createElement(c);
          b.parentNode.replaceChild(f, b);
        }
      });
    },
    inputRule(b) {
      utils.each(b.getNodesByTagName('embedvideo'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-video') > -1) {
          const c = creatInsertStr(
            {
              video: b.getAttr('d-video'),
            },
            !1
          );
          const f = window.UE.uNode.createElement(c);
          b.parentNode.replaceChild(f, b);
        }
      });
    },
    commands: {
      /**
       * 插入音乐
       *
       * @example
       * ```javascript
       * editor.execCommand('embedvideo', {
       *   selectData: {video},
       * });
       * ```
       */
      embedvideo: {
        execCommand(cmd, videoObj) {
          const me = this;
          console.log(videoObj, 'videoObj');
          const str = creatInsertStr(videoObj.selectData);
          try {
            me.execCommand('inserthtml', str);
          } catch (error) {
            console.log(error.message);
          }
        },
        queryCommandState() {
          const me = this;
          const img = me.selection.getRange().getClosedNode();
          const flag = img && img.className === 'edui-faked-embed-video';
          return flag ? 1 : 0;
        },
      },
    },
  };
});
