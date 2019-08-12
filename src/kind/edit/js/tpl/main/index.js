import handlebars from 'handlebars';
import detail from './detail';

const tpl = `
<div class="content-container" id="content-container">
    <div class="main-nav">
        <span>微寺院</span>
        <i class="icon-1"></i>
        <a href="/zzhadmin/charityIndex/">日行一善</a>
        <i class="icon-1"></i>
        <span>{{#if isEdit}}编辑{{else}}创建{{/if}}</span>
    </div>
    ${detail}
</div>
`;

export default handlebars.compile(tpl);
