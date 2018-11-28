module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 199,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          name: `选择项名称 ${id}`,
          pic: '/static/images/chan-zai-128x128.png',
          isNeedPay: Math.floor(Math.random() * 2),
          isRandow: Math.floor(Math.random() * 2),
          price: id * 10,
          serviceMoney: id * 10,
          promotionType: Math.floor(Math.random() * 3) + 1,
          promotionPrice: id * 10,
          percent: id * 10,
        })),
      },
    })
  );
};
