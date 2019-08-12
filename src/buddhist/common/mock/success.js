export default (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify({
    result: 0,
    msg: "获取成功",
    data: {}
  }));
};
