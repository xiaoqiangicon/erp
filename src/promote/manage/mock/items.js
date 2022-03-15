export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      success: true,
      title: '本焕寺第廿四期施放千台吉祥焰口及供灯法会（农历十月在线登记）',
      statusText: '进行中',
      addTime: '2018-09-20',
      ended: 0,
      online: 1,
      canOnline: 1,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
        id,
        title: `选择项名称 ${id}`,
        cover: '/images/logo.png',
        isXuanZe: Math.floor(Math.random() * 2),
        priceType: Math.floor(Math.random() * 3) + 1,
        price: id * 10,
        hasCharge: Math.floor(Math.random() * 2),
        chargeType: Math.floor(Math.random() * 2) + 1,
        charge: id * 10,
        hasReward: Math.floor(Math.random() * 2),
        rewardType: Math.floor(Math.random() * 2) + 1,
        reward: id * 10,
        hasPromote: Math.floor(Math.random() * 2),
        promoteType: Math.floor(Math.random() * 2) + 1,
        promote: id * 10,
      })),
    })
  );
};
