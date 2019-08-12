import handlebars from "handlebars";
const tpl = `
<div class="item-0-1" data-share-item="1">
    <img src="{{image}}" data-share-item-image="1">
    <button class="clean common-delete" data-share-item-delete="1">X</button>
</div>
`;
export default handlebars.compile(tpl);
