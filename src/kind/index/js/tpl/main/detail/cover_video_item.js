import handlebars from 'handlebars';
const tpl = `
<div class="item-video-1" data-cover-video-item="1">
    <video src="{{video}}" data-cover-item-image="0" data-cover-item-video="1"></video>
    <button class="clean common-delete" data-cover-item-video-delete="1">X</button>
    <div class="video-mask"></div>
</div>
`;
export default handlebars.compile(tpl);
