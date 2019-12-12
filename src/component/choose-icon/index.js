import "./css/index.css";
import $ from "jquery";
import "./view";
import data from "./data";
import mainTpl from "./tpl/main";
import requestList from "./util/request_list";
import stopWinScroll from "./util/stop_win_scroll";
import revertWinScroll from "./util/revert_win_scroll";
$.ajaxSetup({
  cache: !1
});
class ChooseIcon {
  constructor(option) {
    let self = this;
    self.option = $.extend(true, {}, data.defaultOption, option);
    self.id = data.instanceCount++;
    data.options[self.id] = self.option;
    self.__init();
  }
  __init() {
    let self = this;
    self.$el = $(mainTpl({
      id: self.id
    }));
    self.$el.appendTo("body");
    requestList(self.id);
  }
  show() {
    this.$el.show();
    stopWinScroll();
  }
  hide() {
    this.$el.hide();
    revertWinScroll();
  }
}
export default ChooseIcon;
