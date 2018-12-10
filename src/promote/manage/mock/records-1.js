module.exports = (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 199,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          name: `选择项名称 ${id}`,
          payTime: '2018-11-01 10:24:43',
          price: 2000,
          userId: id,
          userName: `推销员 ${id}`,
          mobile: '12345678901',
          promotionMoney: id * 10,
          serviceMoney: id * 11,
          type: Math.floor(Math.random() * 3) + 1,
        })),
      },
    })
  );
};
