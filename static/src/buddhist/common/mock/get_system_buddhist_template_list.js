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
          'http://dev.zizaihome.cn/prd/LICHEE/images/%E3%80%90%E4%BC%98%E5%8C%96%E3%80%91%E6%96%B0%E5%BB%BA%E4%BD%9B%E4%BA%8B%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E6%A8%A1%E7%89%88%E5%88%86%E7%B1%BB/u4322.png',
        templateTypeId: item,
      })),
    })
  );
};
