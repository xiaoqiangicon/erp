module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: true,
      totalPages: 20,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        cover: '/static/images/chan-zai-128x128.png',
        title: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
        count: id * 10,
        totalMoney: id * 2,
        profit: id * 3,
        online: Math.floor(Math.random() * 2),
        ended: Math.floor(Math.random() * 2),
      })),
    })
  );
};
