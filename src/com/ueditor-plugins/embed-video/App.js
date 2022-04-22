import { htmlToText } from '../../../../../pro-com/src/utils';
import upload from '../../../../../pro-com/src/upload';

export default {
  name: 'EmbedVideoPopup',
  props: {
    onSubmit: {
      type: Function,
      required: !0,
    },
  },
  data() {
    return {
      visible: true,
      activeName: 'local',
      code: '',
      uploadingVideo: false,
      url: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化视频上传组件
      upload({
        el: this.$refs.uploadVideo,
        uploadUrl: '/zzhadmin/uploadPic/',
        done: url => {
          this.uploadingVideo = false;
          this.url = url;
        },
        uploadHandle: res => res.url,
        uploadOptions: {
          formData: {},
          add: (e, data) => {
            const fileName = data.files[0].name.toLowerCase();
            const size = data.files[0].size;
            const limitSize = 50 * 1024 * 1024;

            if (
              fileName.indexOf('mp4') < 0 &&
              fileName.indexOf('rmvb') < 0 &&
              fileName.indexOf('mov') < 0
            ) {
              alert('请上传正确的视频格式');
              return;
            }
            if (size > limitSize) {
              alert('请上传不超过50M的文件');
              return;
            }

            this.uploadingVideo = true;

            data.process().done(() => {
              data.submit();
            });
          },
          fail: () => {
            this.uploadingVideo = false;
            Message.error('上传视频失败');
          },
        },
      });
    });
  },
  methods: {
    insert() {
      const regExp = /^<iframe .*<\/iframe>$/i;
      const code = this.code;

      if (!code) {
        alert('请先填入需要插入的代码');
        return;
      }

      if (!regExp.test(code)) {
        alert('填入的代码需要是如下模式：&lt;iframe ......&gt;&lt;/iframe&gt;');
        return;
      }

      const extract = / src=['"]([^'"]+)['"]/gi;
      const result = extract.exec(code);

      if (!result) {
        alert('填入的代码提取不到视频地址，请确认后重试');
        return;
      }

      const insert = `<iframe frameborder="0" width="100%" height="240" src="${
        result[1]
      }" allowfullscreen></iframe>`;

      console.log(insert, 'insert');
      this.onSubmit(insert);

      this.code = '';
      this.visible = false;
    },
    insertLocalVideo() {
      if (this.uploadingVideo) {
        alert('视频正在上传中...');
        return;
      }

      console.log(this.url, 'https://v.qq.com/x/page/g33299h3c20.html');
      this.onSubmit(this.url);
      this.url = '';
      this.visible = false;
    },
    delCover() {
      this.url = '';
      this.uploadingVideo = false;
    },
    onClickVideoUploadDelete() {
      this.$refs.uploadVideo.abort();
      this.url = '';
      this.uploadingVideo = false;
    },
  },
};
