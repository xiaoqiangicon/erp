export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      result: 1,
      data: {
        total: 199,
        commodityName:
          '本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记）',
        addPromotionTime: '2018-09-20',
        isFinish: 0,
        isPromotion: 1,
        senilitySale: 1,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
          id,
          name: `选择项名称 ${id}`,
          pic: '/images/chan-zai-128x128.png',
          isSubdivide: Math.floor(Math.random() * 2),
          isNeedPay: Math.floor(Math.random() * 2),
          isRandow: Math.floor(Math.random() * 2),
          price: id * 10,
          serviceMoney: id * 10,
          promotionType: Math.floor(Math.random() * 3) + 1,
          promotionPrice: id * 10,
          percent: (id * 10) / 100,
        })),
      },
    })
  );
};
