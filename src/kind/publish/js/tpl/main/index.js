import handlebars from 'handlebars';
import updateContent from './detail/content';
import recordContent from './detail/record';

const tpl = `
<div class="content-container" id="content-container">
    <div class="main-header" id="main-header">
        <div class="header-item publish header-item-active">发布进展</div>
        <div class="header-item record">发布记录</div>
    </div>
    <div class="content update-content">${updateContent}</div>
    <div class="content record-content">${recordContent}</div>
</div>
<div class="video-show">
    <video controls="controls" autoplay class="video-play" src=""></video>
</div>
`;
export default handlebars.compile(tpl);
