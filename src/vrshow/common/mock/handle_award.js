/**
 *Create by kang on 2018/10/26.
 */
module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 0,
      msg: '成功',
    })
  );
};
