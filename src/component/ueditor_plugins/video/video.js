import "./index.less";
import $ from "jquery";
import data from "./data";
import tpl from "./tpl";
import "./view";
const $body = $("body");
export default class {
  constructor(options = {}) {
    this.options = options;
    this.id = data.id++;
    data.optionsCollection[this.id] = options;
  }
  show() {
    if (!this.$el) {
      this.$el = $(tpl({
        id: this.id
      }));
      $body.append(this.$el);
    }
    this.$el.show();
  }
  hide() {
    this.$el && this.$el.hide();
  }
};
