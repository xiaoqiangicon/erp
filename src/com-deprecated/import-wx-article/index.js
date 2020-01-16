import './css/index.css';
import $ from 'jquery';
import './view';
import data from './data';
import tpl from './tpl';
$.ajaxSetup({
  cache: !1,
});
class ImportWxArticle {
  constructor(option) {
    let self = this;
    self.option = $.extend(true, {}, data.defaultOption, option);
    self.id = data.instanceCount++;
    data.options[self.id] = self.option;
    self.__init();
  }
  __init() {
    let self = this;
    self.$el = $(tpl);
    self.$el.attr({
      'data-import-wx-article': self.id,
    });
    self.$el.appendTo('body');
  }
  show() {
    this.$el.show();
  }
  hide() {
    this.$el.hide();
  }
}
export default ImportWxArticle;
