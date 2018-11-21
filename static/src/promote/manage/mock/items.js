module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: true,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        title: `选择项名称 ${id}`,
        cover: '/static/images/chan-zai-128x128.png',
        // 1：需支付，2：无需支付，3：随喜
        priceType: Math.floor(Math.random() * 3) + 1,
        price: id * 10,
        hasCharge: Math.floor(Math.random() * 2),
        // 1：比例，2：金额
        chargeType: Math.floor(Math.random() * 2) + 1,
        charge: id * 10,
        hasProfit: Math.floor(Math.random() * 2),
        // 1：比例，2：金额
        profitType: Math.floor(Math.random() * 2) + 1,
        profit: id * 10,
      })),
    })
  );
};
