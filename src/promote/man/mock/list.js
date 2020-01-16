export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      success: true,
      totalPages: 20,
      nickname: '昵称昵称昵称',
      name: '姓名姓名姓名',
      avatar: '/images/chan-zai-128x128.png',
      phone: '12312312312',
      promoteCount: 321,
      totalIncome: 789,
      gotIncome: 456,
      pendingIncome: 123,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        time: '2018-11-01 10:24:43',
        title: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
        amount: id * 10,
        rewardRate: id * 2,
        reward: id * 3,
        status: Math.floor(Math.random() * 3) + 1,
      })),
    })
  );
};
