export default {
  perPage: 18,
  instanceCount: 1,
  defaultOption: {
    multiUpload: !0,
    multiSelect: !0,
    showManage: !0,
    onSubmit: items => {}
  },
  options: {},
  pagination: {},
  deleteConfirm: (msg, callback) => {
    callback();
  }
};
