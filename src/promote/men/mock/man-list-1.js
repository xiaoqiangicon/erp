export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 20,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          headImg: '/images/logo.png',
          nickName: `昵称昵称昵称 ${id}`,
          name: `姓名姓名姓名 ${id}`,
          mobile: '12345678901',
          userId: id * 10,
          payNum: id * 10,
          payMoney: id * 100,
          promotionMoney: id * 1000,
          addTime: '2018-09-22 12:30',
          status: [0, 3][Math.floor(Math.random() * 2)],
        })),
      },
    })
  );
};
