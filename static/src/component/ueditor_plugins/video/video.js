
const $ = require('jquery');

const data = require('./data');
const tpl = require('./tpl');

const $body = $('body');

module.exports = class {
    constructor(options = {}) {
        this.options = options;
        this.id = data.id++;
        data.optionsCollection[this.id] = options;
    }
    show() {
        if (!this.$el) {
            this.$el = $(tpl({id: this.id}));
            $body.append(this.$el);
        }

        this.$el.show();
    }
    hide() {
        this.$el && this.$el.hide();
    }
};
