/**
 *Create by kang on 2018/11/13.
 */
module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      result: 0,
      msg: '获取成功',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
        id: item,
        name: `系统佛事模板名${item}`,
        coverPic:
          'https://pic.zizaihome.com/38c8e2ad-303f-44bb-9a1b-14a29e6c689a.png',
        templateTypeId: item,
      })),
    })
  );
};
