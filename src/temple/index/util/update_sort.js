import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import * as zzhHandling from '../../../../../pro-com/src/handling';
import '../ajax';
export default function() {
  var $components = $('[data-container="component-display"]');
  var update = [];
  var newComponentsCount = 0;
  $components.map(function(index) {
    var $this = $(this);
    var isUpdate = parseInt($this.attr('data-is-update'));
    var sortId = parseInt($this.attr('data-server-sort-id'));
    if (isUpdate) {
      update.push({
        id: sortId,
        sort: index + 1 - newComponentsCount,
      });
    } else {
      newComponentsCount += 1;
    }
  });
  if (update.length < 2) return;
  zzhHandling.show();
  seeAjax(
    'updateSort',
    {
      data: JSON.stringify(update),
    },
    function(res) {
      if (!res.success) return;
      zzhHandling.hide();
      toastr.success('保存组件顺序成功');
    }
  );
}
