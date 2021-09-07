import { Notification } from 'element-ui';

export const makeUploadImageOptions = ({
  el,
  done,
  progress,
  multiple,
  name,
  uploadOptions,
}) => ({
  el,
  done,
  progress,
  multiple,
  name,
  type: 'image',
  uploadOptions,
  uploadUrl: '/zzhadmin/uploadPic/',
  uploadHandle(res) {
    return res.url;
  },
  uploadFail(msg) {
    Notification({
      title: '提示',
      message: msg,
    });
  },
});

export const makeUploadFileOptions = ({
  el,
  done,
  progress,
  multiple,
  name,
}) => ({
  el,
  done,
  progress,
  multiple,
  name,
  uploadUrl: '/zzhadmin/uploadPic/',
  uploadOptions: {
    dataType: 'json',
    paramName: 'file',
    maxFileSize: 20 * 1024 * 1024,
    messages: {
      // 没有效果，不知为什么
      maxFileSize: '啊哦，文件太大啦。不要超过 20MB 哦',
    },
  },
  uploadHandle(res) {
    return res.url;
  },
  uploadFail(msg) {
    Notification({
      title: '提示',
      message: msg,
    });
  },
});
