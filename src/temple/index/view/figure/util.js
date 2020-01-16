import $ from 'jquery';
import share from '../../share';
import tpl from '../../tpl/person_saying';
var util = {};
util.render = function() {
  var $displayWrapper = $('[data-com-figure-wrapper]');
  var $editBody = $('[data-edit-com-figure-body]');
  $displayWrapper.html(tpl.displayComponents.render(share.figureComponent));
  $editBody.html(tpl.editComponents.render(share.figureComponent));
};
util.afterSortable = function() {
  var $items = $('[data-edit-com-figure-row]');
  var components = share.figureComponent.components;
  var newComponents = [];
  $items.map(function() {
    var $this = $(this);
    var id = parseInt($this.attr('data-edit-com-figure-row'));
    newComponents.push(
      components.find(function(i) {
        return i.id === id;
      })
    );
  });
  share.figureComponent.components = newComponents;
  util.render();
};
export default util;
