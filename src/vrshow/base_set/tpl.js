import juicer from 'juicer';
var tpl = {
  musicCell: `
    <div class="content-cell">
        <input style="vertical-align: top;margin-right: 10px;" id="music-\${id}" data-id="\${id}" type="radio" name="music" {@if isSelect === 1} checked="checked"{@/if}>
        <label for="music-\${id}">\${name}</label>
        <span class="play-music music-play" data-music-play="0" data-src="\${url}"></span>
    </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
