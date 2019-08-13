import $ from 'jquery';
var data = {
  winWidth: $(window).width(),
  regions: {},
  detailData: {},
  cellData: {},
  currentRegionId: 0,
  currentSequence: '',
  currentRow: 0,
  currentColumn: 0,
  lastOnlineRow: 0,
  lastOnlineColumn: 0,
  currentActionIsAdd: !0,
  currentEditIsOnline: !1,
  hoverPopupFreezing: !1,
  seatsArray: {},
  rowsArray: {},
  columnsArray: {},
};
export default data;
