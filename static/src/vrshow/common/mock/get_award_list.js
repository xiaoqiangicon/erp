/**
 *Create by kang on 2018/10/26.
 */
module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 0,
      msg: '成功',
      total: 11,
      pageNum: -1,
      data: [
        {
          id: 1,
          type: 1,
          content: 1,
          name: 'hahah',
          mobile: '1231231231',
          status: 1,
          alivePeople: '阳上人',
          deadman: '往生者',
          disposedPic: '',
        },
        {
          id: 2,
          type: 1,
          content: 1,
          name: 'hahah',
          mobile: '1231231231',
          status: 1,
          alivePeople: '阳上人',
          deadman: '往生者',
          disposedPic: '',
        },
        {
          id: 3,
          type: 1,
          content: 1,
          name: 'hahah',
          mobile: '1231231231',
          status: 0,
          alivePeople: '阳上人',
          deadman: '往生者',
          disposedPic: '',
        },
      ],
    })
  );
};
