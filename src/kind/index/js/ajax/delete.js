import seeAjax from "see-ajax";
const requestKeys = {
  id: "charityId"
};
seeAjax.config("delete", {
  url: ["/zzhadmin/charityDel/", "/src/kind/index/data/delete_server.json", "/src/kind/index/data/delete.json"],
  requestKeys: [requestKeys, requestKeys]
});
