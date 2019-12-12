import seeView from "see-view";
import $ from "jquery";
import data from "./data";
import getArticle from "./get_article";
seeView({
  events: {
    "click [data-import-wx-article-close]": "onClickClose",
    "click [data-import-wx-article]": "onClickMain",
    "click [data-import-wx-article-cancel]": "onClickCancel",
    "click [data-import-wx-article-ok]": "onClickOk"
  },
  onClickClose: e => {
    $(e.target).parents("[data-import-wx-article]").hide();
  },
  onClickMain: e => {
    if (e.target === e.currentTarget) $(e.target).hide();
  },
  onClickCancel: e => {
    let $main = $(e.target).parents("[data-import-wx-article]");
    let id = parseInt($main.attr("data-import-wx-article"));
    let option = data.options[id];
    option && option.onCancel && option.onCancel();
    $main.hide();
  },
  onClickOk: e => {
    let $this = $(e.target);
    let $main = $this.parents("[data-import-wx-article]");
    let handling = parseInt($this.attr("data-handling"));
    if (handling) return;
    let $input = $main.find("[data-import-wx-article-input]");
    let value = $input.val().trim();
    if (!value) {
      let errorFn = window.importWxArticleEmptyHandle || alert;
      errorFn("地址输入为空，请输入后再试");
      return;
    }
    let submitFn = window.importWxArticleGetArticle || getArticle;
    $this.attr({
      "data-handling": 1
    }).text("正在导入...");
    submitFn(value, content => {
      $this.attr({
        "data-handling": 0
      }).text("导入");
      let id = parseInt($main.attr("data-import-wx-article"));
      let option = data.options[id];
      option && option.onSubmit && option.onSubmit(content);
      $input.val("");
      $main.hide();
    });
  }
});
