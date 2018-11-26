module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 20,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          cover: '/static/images/chan-zai-128x128.png',
          name: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
          totalJoinNum: id * 10,
          totalMoney: id * 2,
          totalPromotionMoney: id * 3,
          online: Math.floor(Math.random() * 2),
        })),
      },
    })
  );
};