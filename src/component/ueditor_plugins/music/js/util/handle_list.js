import $ from "jquery";
const $htmlEntityParse = $("#html-entity-parse");
export default res => {
  $htmlEntityParse.html(JSON.stringify(res));
  res = JSON.parse($htmlEntityParse.html());
  res && res.list && res.list.length && res.list.forEach(item => {
    item.key = item.id;
    item.song = item.songname;
    item.singer = item.singername;
    item.album = item.albumname;
    if (item.m4a) {
      item.m4a = item.m4a.replace("ws.stream.qqmusic.qq.com", "dl.stream.qqmusic.qq.com");
    }
  });
  return res;
};
