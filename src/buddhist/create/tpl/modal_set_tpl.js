define([], function() {
  const tpl = `
    <div class="my_modal" data-role="my_modal" style="display: none">
    <div class="my_modal-background"></div>
    <div class="my_modal-pane">
    <h4>将此佛事添加到佛事模板库中</h4>
    <p style="text-align: center;color: #989898;">请填写备注名称</p>
    <input type="text" class="form-control template_name" data-type="template_name" maxlength="12" placeholder="最多12字">
    <div class="operation">
    <button type="button" class="btn btn-success" data-type="confirm_template">确定</button>
    <button type="button" class="btn" data-type="cancel_template" style="margin-left: 30px;">取消</button>
    </div>
    </div>
    </div>
  `;

  return tpl;
});
