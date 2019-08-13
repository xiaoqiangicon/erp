import $ from 'jquery';
import share from '../../share';
import tpl from '../../tpl/house';
var util = {};
util.render = function() {
  var $displayWrapper = $('[data-com-house-wrapper]');
  var $editBody = $('[data-edit-com-house-body]');
  $displayWrapper.html(tpl.displayComponents.render(share.houseComponent));
  $editBody.html(tpl.editComponents.render(share.houseComponent));
};
util.afterSortable = function() {
  var $items = $('[data-edit-com-house-row]');
  var houses = share.houseComponent.houses;
  var newHouses = [];
  $items.map(function() {
    var $this = $(this);
    var id = parseInt($this.attr('data-edit-com-house-row'));
    newHouses.push(
      houses.find(function(i) {
        return i.id === id;
      })
    );
  });
  share.houseComponent.houses = newHouses;
  util.render();
};
export default util;
