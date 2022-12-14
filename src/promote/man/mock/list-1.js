export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 199,
        nickName: '昵称昵称昵称',
        name: '姓名姓名姓名',
        headImg: '/images/logo.png',
        mobile: '12312312312',
        payNum: 321,
        promotionMoney: 789,
        pickUpMoney: 456,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          payTime: '2018-11-01 10:24:43',
          name: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
          price: id * 10,
          promotionPercentage: id * 2,
          promotionMoney: id * 3,
          type: Math.floor(Math.random() * 3) + 1,
        })),
      },
    })
  );
};
