import handlebars from 'handlebars';
const tpl = `
<div class="ue-pl-video" data-ue-pl-video="{{id}}">
    <div class="inner-1">
        <div class="head-1">插入视频</div>
        <div class="body-1">
            <textarea class="form-control left-1" rows="6" placeholder="请复制视频播放页中带有类似 <iframe ......></iframe> 标记的分享代码，粘贴到此输入框中" data-ue-pl-video-input="{{id}}"></textarea>
            <button class="clean right-1" data-ue-pl-video-ok="{{id}}">确定插入</button>
        </div>
        <button class="clean close-1" data-ue-pl-video-close="{{id}}"></button>
    </div>
</div>
`;
export default handlebars.compile(tpl);
