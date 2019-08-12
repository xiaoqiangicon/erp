import $ from "jquery";
import "jquery-confirm";
import "jquery-confirm/dist/jquery-confirm.min.css";
export default (title, content) => {
  if (!content) {
    content = title;
    title = "提示";
  }
  $.dialog({
    title,
    content
  });
};
