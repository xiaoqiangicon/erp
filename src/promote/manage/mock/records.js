module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: true,
      totalPages: 20,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        title: `选择项名称 ${id}`,
        time: '2018-11-01 10:24:43',
        price: 2000,
        salesmanName: `推销员 ${id}`,
        salesmanPhone: '12345678901',
        reward: id * 10,
        charge: id * 11,
        status: Math.floor(Math.random() * 3) + 1,
      })),
    })
  );
};
