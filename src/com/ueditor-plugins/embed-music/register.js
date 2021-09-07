// 注册插件

const isLocal = window.location.href.indexOf('localhost') > -1;
const displayUrl = `${
  isLocal ? '' : '/static'
}/build/com/ueditor-plugins/embed-music-display.html?_=${Date.now()}`;
const { utils } = window.UE;

window.UE.plugin.register('embedmusic', function() {
  function creatInsertStr(selectData, toEmbed) {
    const props = `d-title="${selectData.title}" d-desc="${selectData.desc}" d-cover="${selectData.cover}" d-audio="${selectData.audio}" d-href="${selectData.href}"`;

    if (toEmbed) {
      return `<embedmusic class="edui-faked-embed-music" ${props}></embedmusic><p><br/></p>`;
    }

    return `<section class="music-ng"><iframe style="background-color:transparent;height:64px;width:100%;border:none;" class="edui-faked-embed-music insertmusic" src="${displayUrl}" ${props}></iframe></section>`;
  }

  return {
    outputRule(b) {
      utils.each(b.getNodesByTagName('iframe'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-music') > -1) {
          const c = creatInsertStr(
            {
              title: b.getAttr('d-title'),
              desc: b.getAttr('d-desc'),
              cover: b.getAttr('d-cover'),
              audio: b.getAttr('d-audio'),
              href: b.getAttr('d-href'),
            },
            !0
          );
          const f = window.UE.uNode.createElement(c);
          b.parentNode.replaceChild(f, b);
        }
      });
    },
    inputRule(b) {
      utils.each(b.getNodesByTagName('embedmusic'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-music') > -1) {
          const c = creatInsertStr(
            {
              title: b.getAttr('d-title'),
              desc: b.getAttr('d-desc'),
              cover: b.getAttr('d-cover'),
              audio: b.getAttr('d-audio'),
              href: b.getAttr('d-href'),
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
       * editor.execCommand('embedmusic', {
       *   selectData: {title, desc, cover, audio, href},
       * });
       * ```
       */
      embedmusic: {
        execCommand(cmd, musicObj) {
          const me = this;
          const str = creatInsertStr(musicObj.selectData);
          try {
            me.execCommand('inserthtml', str);
          } catch (error) {
            console.log(error.message);
          }
        },
        queryCommandState() {
          const me = this;
          const img = me.selection.getRange().getClosedNode();
          const flag = img && img.className === 'edui-faked-embed-music';
          return flag ? 1 : 0;
        },
      },
    },
  };
});
