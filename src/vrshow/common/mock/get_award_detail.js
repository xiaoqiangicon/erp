export default (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      result: 0,
      msg: '成功',
      data: {
        id: 1,
        type: 1,
        content: 'ddddddd',
        name: 'hahah',
        mobile: '1231231231',
        status: 1,
        alivePeople: 'dddd',
        deadman: 'dddd',
        disposedPic:
          'https://pic.zizaihome.com/692097f6-db6d-11e8-9f9a-00163e0c001e.png, https://pic.zizaihome.com/38c6edd6-5269-11e8-ba71-00163e0c1e1c.jpg',
        fromType: 0,
        writeName: '',
        address: '',
        receiveTime: '',
      },
    })
  );
};
