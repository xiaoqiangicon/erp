import $ from 'jquery';
import seeAjax from 'see-ajax';
import toastr from 'toastr';
import data from '../data';
import dialog from 'util/dialog';
var $prizeDialog = $('#dialog-prize');

export default function($this) {
  if (parseInt($this.attr('data-handling'))) return;

  $this
    .attr({
      'data-handling': 1,
    })
    .text('正在处理');
  seeAjax(
    'confirmBills',
    {
      ids: JSON.stringify(data.saveBillIds),
      extra: '',
      reward: data.currentDonateMoney,
    },
    function(res) {
      if (res.success) {
        $this
          .attr({
            'data-handling': 0,
          })
          .text('确认支持');
        $prizeDialog.hide();
        toastr.success('提交账单成功');
      } else {
        dialog(res.message || '操作失败，请稍后重试');
      }
    }
  );
}
