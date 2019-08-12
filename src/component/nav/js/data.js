const urls = ["/static/resources/json/menu_items_test.json", "/static/resources/json/menu_items.json"];
const subDomain = location.hostname.split(".")[0];
export default {
  url: subDomain === "localhost" ? "/json/menu_items_test.json" : subDomain === "erptest" ? urls[0] : urls[1]
};
