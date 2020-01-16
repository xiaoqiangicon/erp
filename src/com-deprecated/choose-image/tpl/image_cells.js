import handlebars from 'handlebars';
let tpl = `
{{#each data}}
<div class="image-cell" data-zzh-choose-image-cell="1" data-image-id="{{this.id}}" data-image-src="{{this.image}}">
    <div class="delete-active-mark"></div>
    <div class="image-cell-inner">
        <img src="{{this.image}}">
        <i class="selected-mark"></i>
    </div>
    <div class="delete-cell" data-zzh-choose-image-cell-delete="1">删除</div>
    <div class="see-cell" data-zzh-choose-image-cell-see="1">查看大图</div>
</div>
{{/each}}
`;
export default handlebars.compile(tpl);
