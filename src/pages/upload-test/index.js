import 'normalize.css/normalize.css';
import '@senntyou/shortcut.css';
import 'colors.css/css/colors.css';
import '../../styles/base.less';

import $ from 'jquery';
import axios from 'axios';
import multipartUpload from '../../com/multipartUpload';

const $result = $('#result');
multipartUpload({
  el: '#upload-box',
  done(url) {
    $result.text(url);
  },
  progress(e, data) {
    $result.text(parseInt((data.loaded / data.total) * 100, 10) + '%');
  },
  uploadFail(msg) {
    alert(msg);
  },
});

// window.axios = axios;
//
// const uploadInit = '/upload/multipart/init';
// const uploadUpload = '/upload/multipart/upload';
// const uploadComplete = '/upload/multipart/complete';
// $('#chunk-upload').fileupload({
//   url: '/',
//   dataType: 'json',
//   paramName: 'file',
//   maxChunkSize: 1024*1024,
//   add(e, data) {
//     const d = new URLSearchParams();
//     d.append('name', data.files[0].name);
//
//     axios({
//       url: uploadInit,
//       method: 'post',
//       responseType: 'json',
//       data: d,
//     }).then(({data: res}) => {
//       if (res.result > 0) {
//         data.url = uploadUpload;
//         data.formData = {mark: res.data.mark};
//
//         data.submit();
//       }
//       else {
//         alert(res.msg);
//       }
//     }).catch(error => {
//       console.error(error);
//       alert(error);
//     });
//   },
//   processfail(e, data) {
//     console.error('processfail', e, data);
//   },
//   done(e, data) {
//     const d = new URLSearchParams();
//     d.append('mark', data.formData.mark);
//
//     axios({
//       url: uploadComplete,
//       method: 'post',
//       responseType: 'json',
//       data: d,
//     }).then(({data: res}) => {
//       if (res.result > 0) {
//         console.log('done: ' + res.data.url);
//       }
//       else {
//         alert(res.msg);
//       }
//     }).catch(error => {
//       console.error(error);
//       alert(error);
//     });
//   },
//   progress(e, data) {
//     console.info('progress: ' + parseInt(data.loaded / data.total * 100, 10) + '%');
//   },
// });

// $('#chunk-upload').fileupload({
//   url: '/zzhadmin/uploadPic',
//   dataType: 'json',
//   paramName: 'file',
//   maxChunkSize: 5*1024*1024,
//   add(e, data) {
//     console.log('add', e, data);
//     data.haha=1;
//
//     // 可以通过这里修改上传的url
//     // data.url = '/haha';
//
//     // 可以通过这里修改上传的formData
//     data.formData = {mark: '123456'};
//
//     data.submit();
//   },
//   processfail(e, data) {
//     console.log('processfail', e, data);
//     console.log('data.haha: ', data.haha);
//   },
//   done(e, data) {
//     console.log('done', e, data);
//     console.log('data.haha: ', data.haha);
//   },
//   progress(e, data) {
//     console.log('progress', e, data);
//     console.log('data.haha: ', data.haha);
//     console.log(parseInt(data.loaded / data.total * 100, 10) + '%');
//   },
//   // 不止为何，chunkbeforesend不能触发
//   // chunkbeforesend(e, data) {
//   //   console.log('chunkbeforesend', e, data);
//   //   console.log('data.haha: ', data.haha);
//   // },
//   // chunksend(e, data) {
//   //   console.log('chunksend', e, data);
//   //   console.log('data.haha: ', data.haha);
//   // },
// });
