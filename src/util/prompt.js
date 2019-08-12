import $ from "jquery";
import "jquery-confirm";
import "jquery-confirm/dist/jquery-confirm.min.css";
import alert from "./alert";
export default (title, callback) => {
  if (typeof title === "function") {
    callback = title;
    title = !1;
  }
  $.confirm({
    title,
    content: `<div class="form-group"><label>请输入</label><input type="text" class="form-control"></div>`,
    buttons: {
      formSubmit: {
        text: "确定",
        action() {
          const value = this.$content.find("input").val();
          if (!value) {
            alert("输入不能为空，请重新输入");
            return !1;
          }
          callback(value);
        }
      },
      cancel: {
        text: "取消"
      }
    },
    theme: "white"
  });
};
