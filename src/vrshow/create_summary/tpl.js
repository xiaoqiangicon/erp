/**
 * Created by kang on 2017/11/21.
 * 添加/编辑简介
 */

require('juicer');

var tpl = {
  imgCell: `
        <div class="img-cell">
            <div class="delete-img" data-ele="delete-img"></div>
            <img src="\${src}" data-ele="img" data-id="\${id}" data-type="\${type}">
        </div>
    `,
  sceneSelect: `
        <option value="\${sceneId}">\${sceneName}</option>
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
