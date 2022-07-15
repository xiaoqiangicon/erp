import juicer from 'juicer';
import loading from '../../../images/loading.gif';
var tpl = {
  payCell: `
        <div class="pay-cell">
            <span class="pay-article">\${title}</span>
            <span class="pay-nick-name">
                <img src="\${avatar}" class="pay-avatar">
                <span>\${nickname}</span>
            </span>
            {@if isStaff}
            <span class="pay-amount">\${amount}元</span>
            {@/if}
            <span class="pay-time">\${time}</span>
        </div>
    `,
};
var compiledTpl = {};
Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});
export default compiledTpl;
