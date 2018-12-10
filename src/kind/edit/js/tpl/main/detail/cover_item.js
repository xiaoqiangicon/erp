
const handlebars = require('handlebars');

let tpl = `
<div class="item-0-1" data-cover-item="1">
    <img src="{{image}}" data-cover-item-image="1">
    <button class="clean common-delete" data-cover-item-delete="1">X</button>
</div>
`;

module.exports = handlebars.compile(tpl);