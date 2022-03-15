import handlebars from 'handlebars';
const tpl = `
<div class="item-0-1" data-share-item="1">
    <img src="{{image}}" data-share-item-image="{{sort}}">
    <button class="clean common-delete" data-share-item-delete="{{sort}}">X</button>
</div>
`;
export default handlebars.compile(tpl);
