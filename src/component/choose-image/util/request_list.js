import seeAjax from 'see-ajax';
import $ from 'jquery';
import Pagination from '../../../component/pagination';
import data from '../data';
import loadingTpl from '../tpl/loading';
import imageCellsTpl from '../tpl/image_cells';
import noDataTpl from '../tpl/no_data';
import checkSelected from './check_selected';
import '../ajax';
let requestList = (instanceId, page, init) => {
  !page && (page = 1);
  typeof init === 'undefined' && (init = !0);
  let $chooseImage = $(`[data-zzh-choose-image="${instanceId}"]`);
  let $listContainer = $chooseImage.find(
    '[data-zzh-choose-image-pagination-container]'
  );
  let $paginationContainer = $chooseImage.find(
    '[data-zzh-choose-image-pagination]'
  );
  $listContainer.html(loadingTpl);
  init && $paginationContainer.html('');
  let activeTab = parseInt(
    $chooseImage
      .find('[data-zzh-choose-image-tab-1].active')
      .attr('data-zzh-choose-image-tab-1')
  );
  seeAjax(
    activeTab === 1
      ? 'zzhChooseImageSavedImages'
      : 'zzhChooseImageSystemImages',
    {
      page,
    },
    res => {
      if (!res.success || !res.data || !res.data.length) {
        if (page === 1 && activeTab === 1) {
          $chooseImage
            .find('[data-zzh-choose-image-tab-1="2"]')
            .trigger('click');
          $chooseImage
            .find('[data-zzh-choose-image-to-manage-container]')
            .hide();
        } else {
          $listContainer.html(noDataTpl);
        }
        return;
      }
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
      checkSelected($chooseImage);
    }
  );
};
export default requestList;
