import './css/index.css';
import $ from 'jquery';
import './view';
import data from './data';
import mainTpl from './tpl/main';
import requestList from './util/request_list';
import stopWinScroll from './util/stop_win_scroll';
import revertWinScroll from './util/revert_win_scroll';
import alert from 'util/alert';
import dialog from 'util/dialog';
import confirm from 'util/confirm';

window.zzhChooseImageExtractFail = dialog;
window.zzhChooseImageCanNotDelete = dialog;
window.zzhChooseImageSelectedEmpty = dialog;
window.zzhChooseImageDeleteSuccessful = alert;
window.zzhChooseImageDeleteConfirm = confirm;

$.ajaxSetup({
  cache: !1,
});
class ChooseImage {
  constructor(option) {
    let self = this;
    self.option = $.extend(true, {}, data.defaultOption, option);
    self.id = data.instanceCount++;
    data.options[self.id] = self.option;
    self.__init();
  }
  __init() {
    let self = this;
    self.$el = $(
      mainTpl({
        id: self.id,
        showManage: self.option.showManage,
      })
    );
    self.$el.appendTo('body');
    requestList(self.id);
  }
  show() {
    let self = this;
    if (self.$el.hasClass('in-delete-mode'))
      self.$el.find('[data-zzh-choose-image-cancel-manage]').trigger('click');
    self.$el.show();
    stopWinScroll();
  }
  hide() {
    this.$el.hide();
    revertWinScroll();
  }
}
export default ChooseImage;
