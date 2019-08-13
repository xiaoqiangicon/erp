import 'juicer';
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
export default compiledTpl;
