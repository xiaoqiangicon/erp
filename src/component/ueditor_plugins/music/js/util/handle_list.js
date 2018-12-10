
const $ = require('jquery');

let $htmlEntityParse = $('#html-entity-parse');

/**
 * 处理返回的数据
 *
 * @param res
 */
module.exports = res => {
    // 因为其中很多文本被 html entity 编码了，所以需要转成正常的 uft-8 文本
    $htmlEntityParse.html(JSON.stringify(res));
    res = JSON.parse($htmlEntityParse.html());

    res && res.list && res.list.length && res.list.forEach(item => {
        // react 列表渲染需要这个字段
        item.key = item.id;
        item.song = item.songname;
        item.singer = item.singername;
        item.album = item.albumname;

        if (item.m4a) {
            // 接口中返回的地址：http://ws.stream.qqmusic.qq.com/C100003ap15N1I0lOH.m4a?fromtag=46
            // 真实能播放的地址：http://dl.stream.qqmusic.qq.com/C100003ap15N1I0lOH.m4a?fromtag=46
            item.m4a = item.m4a.replace('ws.stream.qqmusic.qq.com', 'dl.stream.qqmusic.qq.com');
        }
    });

    return res;
};
