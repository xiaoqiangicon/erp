import images from './images';
import juicer from 'juicer';
var tpl = {
  payCell: `
        <div class="pay-cell">
            <span class="pay-nick-name">
                <img src="\${avatar}" class="pay-avatar">
                <span>\${nickname}</span>
            </span>
            <span class="pay-wish">\${wish}</span>
            <span class="pay-source">\${source}</span>
            <span class="pay-amount">\${amount}元</span>
            <span class="pay-time">\${time}</span>
        </div>
    `,
  promotionPopup: `
        <div class="promotion" data-popup="1" id="promotion-popup">
            <div class="promotion-background" data-popup-overlay="1"></div>
            <div class="promotion-pane">
                <div class="promotion-top">
                    <div class="promotion-title">预览</div>
                    <div class="promotion-close" data-popup-close="1">X</div>
                </div>
                <div class="promotion-content">
                    <div class="promotion-content-container">
                        <div class="promotion-content-cell left pdr20 bdr-eeeeee">
                            <div class="promotion-content-title">微信二维码</div>
                            <div class="promotion-content-content" id="website-url-qrcode-container"></div>
                            <div class="promotion-content-action">
                                <a class="active" data-switch-qrcode="1" data-type="1">小图</a>
                                <span>|</span>
                                <a data-switch-qrcode="1" data-type="2">中图</a>
                                <span>|</span>
                                <a data-switch-qrcode="1" data-type="3">大图</a>
                            </div>
                            <div class="mgt20">
                                <p class="mgb0">用法：</p>
                                <p class="mgb0 pdl20">1、印于传单、海报上，现场推广。</p>
                                <p class="mgb0 pdl20">2、嵌于微信文章内，长按识别进入。</p>
                            </div>
                        </div>
                        <div class="promotion-content-cell right pdl20">
                            <div class="promotion-content-title">微信推广链接</div>
                            <div class="promotion-content-content">
                                <input class="form-control mgt60" data-clipboard-input="1" value="\${link}">
                            </div>
                            <div class="promotion-content-action">
                                <a class="btn btn-green white-force pdl10 pdr10" data-clipboard-target="[data-clipboard-input]">复制链接</a>
                            </div>
                            <div class="mgt20">
                                <p class="mgb0">用法：</p>
                                <p class="mgb0 pdl20">1、设置为微信公众号菜单项。</p>
                                <p class="mgb0 pdl20">2、放在微信“阅读原文”入口里。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
