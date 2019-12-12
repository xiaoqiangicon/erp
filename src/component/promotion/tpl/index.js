import handlebars from 'handlebars';
import cell1 from './cell_1';
import cell2 from './cell_2';
import cell3 from './cell_3';

let tpl = `
<div class="zzh-promotion {{#if showPost}}zzh-promotion-three-columns{{/if}} {{#if hideDesc}}zzh-promotion-hide-desc{{/if}}" data-zzh-promotion-close="1">
    <div class="inner-1">
        <div class="top-1">
            <div class="tab-1 {{#unless showPost}}dp-none{{/unless}}" data-zzh-promotion-tab-1="3"><span class="text-1">海报图片</span></div>
            <div class="tab-1 active" data-zzh-promotion-tab-1="1"><span class="text-1">微信二维码</span></div>
            <div class="tab-1" data-zzh-promotion-tab-1="2"><span class="text-1">微信链接</span></div>
        </div>
        ${cell3}
        ${cell1}
        ${cell2}
        <button class="clean close-1" data-zzh-promotion-close="1"></button>
    </div>
</div>
`;

export default handlebars.compile(tpl);
