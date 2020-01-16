import handlebars from 'handlebars';
let tpl = `
<li class="image-cell" data-zzh-choose-image-upload-image-cell="1" data-image-src="{{image}}">
    <img src="{{image}}">
    <button class="zzh-choose-image-clean image-cell-remove" data-zzh-choose-image-upload-image-delete="1">X</button>
</li>
`;
export default handlebars.compile(tpl);
