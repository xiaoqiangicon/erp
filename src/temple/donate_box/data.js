import envData from "common/env_data";
var data = {
  totalPagesRecord: {},
  templeId: window.localStorage["templeid"],
  shareLink: "https://wx.zizaihome.com/website/meritBoxAuth?templeId=" + window.localStorage["templeid"] + (!!envData.envParamMark ? "&" + envData.envParamMark : ""),
  qrcodeSizes: [300, 500, 1000],
  filter: {
    startDate: "",
    endDate: ""
  },
  pagination: undefined
};
export default data;
