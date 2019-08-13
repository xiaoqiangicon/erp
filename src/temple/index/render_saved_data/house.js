import $ from 'jquery';
import indexData from '../data';
import commonTpl from '../tpl/common';
import util from '../view/house/util';
import 'jquery-confirm';
function postHandleForHouse($displayComponent, $editContainer, data) {
  if (data.houses)
    data.houses.forEach(function(house) {
      house.intro = house.intro.replace(/<br>/g, '\n');
    });
  $editContainer.find('[data-edit-com-house-body]').sortable({
    stop: function(e) {
      util.afterSortable();
    },
  });
}
export default postHandleForHouse;
