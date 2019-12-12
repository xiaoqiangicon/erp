import handlebars from "handlebars";
let tpl = `
{{#each data}}
<div class="image-cell" data-zzh-choose-icon-cell="1" data-image-id="{{this.id}}" data-image-src="{{this.image}}">
    <img src="{{this.image}}">
    <i class="selected-mark"></i>
</div>
{{/each}}
`;
export default handlebars.compile(tpl);
