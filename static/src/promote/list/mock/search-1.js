module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 1,
      data: [1, 2, 3, 4].map(id => ({
        id,
        name: `本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记） ${id}`,
        added: Math.floor(Math.random() * 2),
      })),
    })
  );
};
