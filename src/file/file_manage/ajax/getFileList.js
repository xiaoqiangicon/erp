/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const typeStr = [
  '其他文档',
  '图片',
  '视频',
  'word',
  'pdf',
  'excel',
  '压缩文件',
];

const post = res => {
  res.data.list.forEach(item => {
    item.typeStr = typeStr[item.type];
  });
};

seeAjax.config('getFileList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: ['/zzhadmin/fileList/', '/src/file/file_manage/mock/getFileList'],
});
