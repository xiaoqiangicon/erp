export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      result: 0,
      msg: '获取成功',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
        id: item,
        name: `系统佛事模板类型名${item}`,
      })),
    })
  );
};
