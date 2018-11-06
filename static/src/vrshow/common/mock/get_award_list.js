/**
 *Create by kang on 2018/10/26.
 */
module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 1,
      msg: '成功',
      total: 11,
      pageNum: 1,
      unDealNum: 10,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
        id: item,
        type: 2,
        content: item,
        name: `hhh${item}`,
        mobile: `1231231231${item}`,
        status: 1,
        alivePeople: `阳上人${item}`,
        deadman: `往生者${item}`,
        disposedPic: '',
      })),
    })
  );
};
