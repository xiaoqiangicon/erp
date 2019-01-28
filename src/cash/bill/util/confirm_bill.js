define(['jquery', 'toastr', '../data', 'util/dialog'], function(
  $,
  toastr,
  data,
  dialog
) {
  var $prizeDialog = $('#dialog-prize');

  return function($this) {
    var handling = !!parseInt($this.attr('data-handling'));

    if (handling) return;

    $this.attr({ 'data-handling': 1 }).text('正在处理');

    $.seeAjax.get(
      'confirmBills',
      {
        ids: JSON.stringify(data.saveBillIds),
        extra: '',
        reward: data.currentDonateMoney,
      },
      function(res) {
        if (res.success) {
          $this.attr({ 'data-handling': 0 }).text('确认支持');
          $prizeDialog.hide();
          toastr.success('提交账单成功');
        } else {
          dialog(res.message || '操作失败，请稍后重试');
        }
      }
    );
  };
});