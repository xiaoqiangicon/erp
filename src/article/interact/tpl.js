require('juicer');
const loading = require('../../../images/loading.gif');

var tpl = {
  payCell: `
        <div class="pay-cell">
            <span class="pay-article">\${title}</span>
            <span class="pay-nick-name">
                <img src="\${avatar}" class="pay-avatar">
                <span>\${nickname}</span>
            </span>
            <span class="pay-amount">\${amount}元</span>
            <span class="pay-time">\${time}</span>
        </div>
    `,
};

var compiledTpl = {};

Object.keys(tpl).map(function(key) {
  compiledTpl[key] = juicer(tpl[key]);
});

module.exports = compiledTpl;
