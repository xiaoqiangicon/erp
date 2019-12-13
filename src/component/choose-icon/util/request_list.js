import seeAjax from 'see-ajax';
import $ from 'jquery';
import Pagination from '../../../component/pagination';
import data from '../data';
import loadingTpl from '../tpl/loading';
import imageCellsTpl from '../tpl/image_cells';
import '../ajax';
let requestList = (instanceId, page, init) => {
  !page && (page = 1);
  typeof init === 'undefined' && (init = !0);
  let $chooseIcon = $(`[data-zzh-choose-icon="${instanceId}"]`);
  let $listContainer = $chooseIcon.find(
    '[data-zzh-choose-icon-pagination-container]'
  );
  let $paginationContainer = $chooseIcon.find(
    '[data-zzh-choose-icon-pagination]'
  );
  $listContainer.html(loadingTpl);
  init && $paginationContainer.html('');
  seeAjax(
    'zzhChooseIconIcons',
    {
      page,
    },
    res => {
      if (!res.success || !res.data || !res.data.length) return;
      $listContainer.html(imageCellsTpl(res));
      if (init) {
        data.pagination[instanceId] = new Pagination($paginationContainer, {
          totalPages: res.totalPages,
          onChange: page => {
            requestList(instanceId, page, !1);
            data.pagination[instanceId].render();
          },
        });
        data.pagination[instanceId].render();
      }
    }
  );
};
export default requestList;
