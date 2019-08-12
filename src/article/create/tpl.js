import "juicer";
var tpl = {
  categoryCell: `
        <option value="\${id}" data-category-cell="\${id}">\${name}</option>
    `,
  categoryPopup: `
        <div class="popup" data-popup="category">
            <div class="popup-background" data-popup-overlay="category"></div>
            <div class="popup-pane">
                <div class="popup-top">
                    <div class="popup-title">编辑分类</div>
                    <div class="popup-close" data-popup-close="category">X</div>
                </div>
                <div class="popup-content">
                    <div class="popup-category-body" data-popup-category-body="1"></div>
                    <div class="popup-category-foot">
                        <div class="popup-category-cell">
                            <input class="form-control input" value="" data-popup-category-add-input="1">
                            <div class="actions">
                                <button class="btn btn-green btn-sm" data-popup-category-add="1" data-handling="0">添加</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  categoryPopupCell: `
        <div class="popup-category-cell" data-popup-category-cell="\${id}">
            <input class="form-control input" value="\${name}" data-popup-category-cell-input="\${id}">
            <div class="actions">
                <button class="btn btn-info btn-sm mgr10" data-popup-category-cell-modify="\${id}" data-handling="0">修改</button>
                <button class="btn btn-warning btn-sm" data-popup-category-cell-delete="\${id}" data-handling="0">删除</button>
            </div>
        </div>
    `,
  viewPopup: `
        <div class="promotion" data-popup="\${id}" data-type="article-view">
            <div class="promotion-background" data-popup-overlay="1"></div>
            <div class="promotion-pane">
                <div class="promotion-top">
                    <div class="promotion-title">预览</div>
                    <div class="promotion-close" data-popup-close="1">X</div>
                </div>
                <div class="promotion-content">
                    <div class="promotion-content-container">
                        <div class="clearfix">
                        <div class="promotion-content-cell left pdr20 bdr-eeeeee" {@if status == 1}style="height: auto;"{@/if}>
                            <div class="promotion-content-title">微信二维码</div>
                                <div class="promotion-content-content" data-qrcode-container="\${id}"></div>
                                <div class="promotion-content-action">
                                    <a class="active" data-switch-qrcode="\${id}" data-type="1">小图</a>
                                    <span>|</span>
                                    <a data-switch-qrcode="\${id}" data-type="2">中图</a>
                                    <span>|</span>
                                    <a data-switch-qrcode="\${id}" data-type="3">大图</a>
                                </div>
                                 {@if status != 1}
                                <div class="mgt20">
                                    <p class="mgb0">用法：</p>
                                    <p class="mgb0 pdl20">1、印于传单、海报上，现场推广。</p>
                                    <p class="mgb0 pdl20">2、嵌于微信文章内，长按识别进入。</p>
                                </div>
                                {@/if}
                                </div>
                                <div class="promotion-content-cell right pdl20" {@if status == 1}style="height: auto;"{@/if}>
                                    <div class="promotion-content-title">微信推广链接</div>
                                    <div class="promotion-content-content">
                                        <input class="form-control mgt60" data-clipboard-input="\${id}" value="\${link}">
                                    </div>
                                    <div class="promotion-content-action">
                                        <a class="btn btn-green white-force pdl10 pdr10" data-clipboard-target="[data-clipboard-input='\${id}']">复制链接</a>
                                  </div>
                                  {@if status != 1}
                                  <div class="mgt20">
                                      <p class="mgb0">用法：</p>
                                      <p class="mgb0 pdl20">1、设置为微信公众号菜单项。</p>
                                      <p class="mgb0 pdl20">2、放在微信“阅读原文”入口里。</p>
                                  </div>
                                  {@/if}
                            </div>
                        </div>
                        {@if status == 1}<div class="promotion-tip">此链接为临时链接，仅用于草稿预览。</div>{@/if}
                    </div>
                </div>
            </div>
        </div>
    `
};
var compiledTpl = {};
Object.keys(tpl).map(function (key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
