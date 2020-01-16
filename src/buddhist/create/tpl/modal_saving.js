const tpl = `
    <div class="promotion" data-role="submit-container" style="display: none">
      <div class="promotion-background"></div>
      <div class="promotion-pane-submit">
        <div class="promotion-content-submit">
          <div class="loader loader4 loader4-green duration-3s-after">
            <a href="javascript:;">保存中</a>
          </div>
          <div class="promotion-close-submit">
            <button type="button" data-action="close" data-type="promotion" data-id="\${id}" class="btn btn-success">关闭</button>
          </div>
        </div>
      </div>
    </div>
  `;
export default tpl;
