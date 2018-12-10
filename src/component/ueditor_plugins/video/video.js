require('./index.less');

const $ = require('jquery');

const data = require('./data');
const tpl = require('./tpl');

require('./view');

const $body = $('body');

module.exports = class {
  /**
   * 构造函数
   *
   * @param options
   * @param options.onSubmit 确定的回调函数 `code => { ... }`
   */
  constructor(options = {}) {
    this.options = options;
    this.id = data.id++;
    data.optionsCollection[this.id] = options;
  }

  show() {
    if (!this.$el) {
      this.$el = $(tpl({ id: this.id }));
      $body.append(this.$el);
    }

    this.$el.show();
  }

  hide() {
    this.$el && this.$el.hide();
  }
};
