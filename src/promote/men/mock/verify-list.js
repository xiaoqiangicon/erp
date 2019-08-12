export default (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify({
    success: true,
    totalPages: 20,
    pendingCount: 11,
    hasPromoteUrl: 1,
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
      id,
      avatar: "/images/chan-zai-128x128.png",
      nickname: `昵称昵称昵称 ${id}`,
      name: `姓名姓名姓名 ${id}`,
      phone: "12345678901",
      count: id * 10,
      amount: id * 100,
      requestTime: "2018-09-22 12:30",
      status: Math.floor(Math.random() * 2) + 1
    }))
  }));
};
