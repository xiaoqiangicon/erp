import jsonRefactor from "json-refactor";
export default req => {
  req.img = [];
  req.covers.forEach(url => {
    req.img.push({
      url
    });
  });
  delete req.covers;
  jsonRefactor(req.specs, [{
    benison: "desc",
    indexImg: "icon"
  }]);
};
