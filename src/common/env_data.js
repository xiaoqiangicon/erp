var env = (function () {
  var hostNames = location.hostname.split("."), hostPrefix = hostNames[0], env = hostPrefix == "erptest" ? 1 : hostPrefix == "erprelease" ? 2 : 0;
  return env;
})();
var envParamMark = env == 1 ? "isTest=1" : env == 2 ? "isTest=2" : "";
export default {
  env: env,
  envParamMark: envParamMark
};
