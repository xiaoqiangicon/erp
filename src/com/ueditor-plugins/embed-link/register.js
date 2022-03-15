// 注册插件

const isLocal = window.location.href.indexOf('localhost') > -1;
const displayUrl = `${
  isLocal ? '' : '/static'
}/build/com/ueditor-plugins/embed-link-display.html?_=${Date.now()}`;
const { utils } = window.UE;

window.UE.plugin.register('embedlink', function() {
  function creatInsertStr(selectData, toEmbed) {
    const props = `d-title="${selectData.title}" d-desc="${selectData.desc}" d-cover="${selectData.cover}" d-href="${selectData.href}" d-type="${selectData.type}" d-action="${selectData.action}"`;

    if (toEmbed) {
      return `<embedlink class="edui-faked-embed-link" ${props}></embedlink><p><br/></p>`;
    }

    return `<section class="music-ng"><iframe style="background-color:transparent;height:64px;width:100%;border:none;" class="edui-faked-embed-link insertmusic" src="${displayUrl}" ${props}></iframe></section>`;
  }

  return {
    outputRule(b) {
      utils.each(b.getNodesByTagName('iframe'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-link') > -1) {
          const c = creatInsertStr(
            {
              title: b.getAttr('d-title'),
              desc: b.getAttr('d-desc'),
              cover: b.getAttr('d-cover'),
              href: b.getAttr('d-href'),
              type: b.getAttr('d-type'),
              action: b.getAttr('d-action'),
            },
            !0
          );
          const f = window.UE.uNode.createElement(c);
          b.parentNode.replaceChild(f, b);
        }
      });
    },
    inputRule(b) {
      utils.each(b.getNodesByTagName('embedlink'), b => {
        const klass = b.getAttr('class');
        if (klass && klass.indexOf('edui-faked-embed-link') > -1) {
          const c = creatInsertStr(
            {
              title: b.getAttr('d-title'),
              desc: b.getAttr('d-desc'),
              cover: b.getAttr('d-cover'),
              href: b.getAttr('d-href'),
              type: b.getAttr('d-type'),
              action: b.getAttr('d-action'),
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
       * 插入链接
       *
       * @example
       * ```javascript
       * editor.execCommand('embedlink', {
       *   selectData: {title, desc, cover, href, type, action},
       * });
       * ```
       */
      embedlink: {
        execCommand(cmd, linkObj) {
          const me = this;
          const str = creatInsertStr(linkObj.selectData);

          try {
            me.execCommand('inserthtml', str);
          } catch (error) {
            console.log(error.message);
          }
        },
        queryCommandState() {
          const me = this;
          const img = me.selection.getRange().getClosedNode();
          const flag = img && img.className === 'edui-faked-embed-link';
          return flag ? 1 : 0;
        },
      },
    },
  };
});
