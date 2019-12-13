import $ from 'jquery';
export default $chooseImage => {
  let $selectAll = $chooseImage.find('[data-zzh-choose-image-select-all]');
  let $selectedCount = $chooseImage.find(
    '[data-zzh-choose-image-selected-count]'
  );
  let totalCount = $chooseImage.find('[data-zzh-choose-image-cell]').length;
  let selectCount = $chooseImage.find(
    '[data-zzh-choose-image-cell].delete-active'
  ).length;
  if (totalCount === selectCount)
    $selectAll.prop({
      checked: !0,
    });
  else
    $selectAll.prop({
      checked: !1,
    });
  $selectedCount.text(selectCount);
};
