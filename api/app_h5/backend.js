export const search = {
  msg: 'success', // success
  code: 1, // 1 成功
  all_page: 100, // 总页数
  limit: 10, // 每页条数
  data: '.'
    .repeat(5)
    .split('')
    .map((d, i) => ({
      content:
        '内容描述内容描述内容描述内容描述内容描述述内容描述述内容描述' + i, // 内容描述
      jump_link: 'chanzai://postDetail?id=20196&title=我们&pid=0', // 跳转链接
      imgurl: '/images/logo.png', // 图片链接
      title: '我们一起打疫苗 一起喵喵喵喵喵喵一起喵喵喵喵喵喵' + i, // 标题
      play_link: 'http://xxx' + i, //  播放链接 类型为梵音时返回
    })),
};
