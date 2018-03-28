
const $ = require('jquery');

let data = require('../data');
let mainTpl = require('../tpl/main');

let $body = $('body');

module.exports = _ => {
    $body.append(mainTpl(data.info))
};