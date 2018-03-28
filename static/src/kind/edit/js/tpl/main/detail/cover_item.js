
const handlebars = require('handlebars');

let tpl = `
<div class="item-0-1" data-cover-item-delete="1">
    <img src="{{image}}">
    <button class="clean common-delete" data-cover-item-delete="1">X</button>
</div>
`;

module.exports = handlebars.compile(tpl);