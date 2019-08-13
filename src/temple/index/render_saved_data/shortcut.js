import $ from 'jquery';
import indexData from '../data';
import commonTpl from '../tpl/common';
import shortcutTpl from '../tpl/shortcut';
function postHandleForShortcut($displayComponent, $editContainer, data) {
  var id = data.id,
    $editTitle = $editContainer.find('[data-edit-shortcut-title]'),
    $displayTitle = $displayComponent.find('[data-display-shortcut-title]'),
    $displayBody = $displayComponent.find('[data-display-shortcut-body]'),
    $addEl = $editContainer.find('[data-edit-shortcut-add]');
  $displayTitle.text(data.title || '');
  $editTitle.val(data.title || '');
  !data.title && $displayTitle.hide();
  $displayBody.html('');
  data.items.map(function(item) {
    item.id = id;
    $displayBody.append(shortcutTpl.displayCell.render(item));
    $addEl.before(shortcutTpl.editCell.render(item));
  });
  data.items.length >= indexData.misc.shortcutItemsLimit && $addEl.hide();
  $editContainer.find('[data-shortcut-images-container]').sortable({
    items: 'li:not([data-edit-shortcut-add])',
    stop: function(e) {
      var $shortcutBody = $('[data-display-shortcut-body="' + id + '"]'),
        $shortcutCells = $('[data-edit-shortcut-cell="' + id + '"]'),
        items = [];
      $shortcutCells.map(function() {
        var $this = $(this),
          title = $this.attr('data-title'),
          image = $this.attr('data-image'),
          link = $this.attr('data-link');
        items.push({
          title: title,
          image: image,
          link: link,
        });
      });
      $shortcutBody.html('');
      items.map(function(item) {
        $shortcutBody.append(shortcutTpl.displayCell.render(item));
      });
    },
  });
}
export default postHandleForShortcut;
