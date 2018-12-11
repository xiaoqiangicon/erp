module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: true,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        title: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
        added: Math.floor(Math.random() * 2),
      })),
    })
  );
};
