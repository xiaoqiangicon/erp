import $ from "jquery";
import seeAjax from "see-ajax";
import ajaxHandle from "./ajax_handle";
import "lib/jquery.seeAjax";
var env = __SEE_ENV__;
seeAjax.default.setEnv(env);
$.seeAjax.config({
  environment: env,
  name: {
    tags: "tags",
    buddhas: "buddhas",
    printers: "printers",
    template: "template",
    detail: "detail",
    deleteTag: "deleteTag",
    createTag: "createTag",
    printerStatus: "printerStatus",
    create: "create",
    edit: "edit"
  },
  url: {
    tags: ["/zzhadmin/buddhaWallTagList/", "/src/wall/set/mock/tags_server.json", "/src/wall/set/mock/tags.json"],
    buddhas: ["/zzhadmin/buddhaList/", "/src/wall/set/mock/buddhas_server.json", "/src/wall/set/mock/buddhas.json"],
    printers: ["/zzhadmin/getPrinterList/", "/src/wall/set/mock/printers_server.json", "/src/wall/set/mock/printers.json"],
    template: ["/zzhadmin/buddhaWall_template/", "/src/wall/set/mock/template_server.json", "/src/wall/set/mock/template.json"],
    detail: ["/zzhadmin/buddhaWall_getBuddha/", "/src/wall/set/mock/detail_server.json", "/src/wall/set/mock/detail.json"],
    deleteTag: ["/zzhadmin/buddhaWall_delTag/", "/src/wall/set/mock/delete_tag_server.json", "/src/wall/set/mock/delete_tag.json"],
    createTag: ["/zzhadmin/buddhaWall_createTag/", "/src/wall/set/mock/create_tag_server.json", "/src/wall/set/mock/create_tag.json"],
    printerStatus: ["/zzhadmin/getPrinterStatus/", "/src/wall/set/mock/printer_status_server.json", "/src/wall/set/mock/printer_status.json"],
    create: ["/zzhadmin/buddhaWall_createBuddha/", "/src/wall/set/mock/create_server.json", "/src/wall/set/mock/create.json"],
    edit: ["/zzhadmin/buddhaWall_editBuddha/", "/src/wall/set/mock/edit_server.json", "/src/wall/set/mock/edit.json"]
  },
  requestKeys: {
    template: [ajaxHandle.requestKeysOuter.template, ajaxHandle.requestKeysOuter.template, {
      id: "id"
    }],
    detail: [ajaxHandle.requestKeysOuter.detail, ajaxHandle.requestKeysOuter.detail, {
      id: "id"
    }],
    deleteTag: [ajaxHandle.requestKeysOuter.deleteTag, ajaxHandle.requestKeysOuter.deleteTag, {
      id: "id"
    }],
    createTag: [ajaxHandle.requestKeysOuter.createTag, ajaxHandle.requestKeysOuter.createTag, {
      name: "name"
    }],
    printerStatus: [ajaxHandle.requestKeysOuter.printerStatus, ajaxHandle.requestKeysOuter.printerStatus, {
      id: "id"
    }],
    create: [ajaxHandle.requestKeysOuter.create, ajaxHandle.requestKeysOuter.create, {
      name: "name",
      category: "category",
      buddhaId: "buddhaId",
      tags: "tags",
      place: "place",
      cover: "cover",
      previewImages: "previewImages",
      intro: "intro",
      randomMoney: "randomMoney",
      memoConfig: "memoConfig",
      usePrinter: "usePrinter",
      printers: "printers",
      printType: "printType",
      printPages: "printPages",
      shareTitle: "shareTitle",
      shareContent: "shareContent",
      shareImage: "shareImage"
    }],
    edit: [ajaxHandle.requestKeysOuter.edit, ajaxHandle.requestKeysOuter.edit, {
      id: "id",
      name: "name",
      category: "category",
      buddhaId: "buddhaId",
      tags: "tags",
      place: "place",
      cover: "cover",
      previewImages: "previewImages",
      intro: "intro",
      randomMoney: "randomMoney",
      memoConfig: "memoConfig",
      usePrinter: "usePrinter",
      printers: "printers",
      printType: "printType",
      printPages: "printPages",
      shareTitle: "shareTitle",
      shareContent: "shareContent",
      shareImage: "shareImage"
    }]
  },
  responseRefactor: {
    tags: [ajaxHandle.responseRefactorOuter.tags, ajaxHandle.responseRefactorOuter.tags],
    printers: [ajaxHandle.responseRefactorOuter.printers, ajaxHandle.responseRefactorOuter.printers],
    template: [ajaxHandle.responseRefactorOuter.template, ajaxHandle.responseRefactorOuter.template],
    detail: [ajaxHandle.responseRefactorOuter.detail, ajaxHandle.responseRefactorOuter.detail],
    createTag: [ajaxHandle.responseRefactorOuter.createTag, ajaxHandle.responseRefactorOuter.createTag]
  },
  preHandle: {
    create: [ajaxHandle.preHandleOuter.create, ajaxHandle.preHandleOuter.create],
    edit: [ajaxHandle.preHandleOuter.edit, ajaxHandle.preHandleOuter.edit]
  },
  postHandle: {
    common: [ajaxHandle.postHandleOuter.common, ajaxHandle.postHandleOuter.common]
  }
});
