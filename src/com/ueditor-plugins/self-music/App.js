import { Notification } from 'element-ui';
import Upload from '../../upload/Upload';
import { makeUploadFileOptions } from '../../../configs/upload';
import upload from '../../../../pro-com/src/upload';

export default {
  name: 'SelfMusicPopup',
  props: {
    onOk: {
      type: Function,
      required: !0,
    },
  },
  components: {
    Upload,
  },
  data() {
    return {
      title: '',
      desc: '',
      covers: [],
      audio: '',
      audioUploading: !1,
      audioUploadProgress: 0,
    };
  },
  mounted() {
    const self = this;
    const { uploadFile } = this.$refs;

    upload(
      makeUploadFileOptions({
        el: uploadFile,
        done(url) {
          self.audioUploading = !1;
          self.audio = url;
        },
        progress(e, data) {
          self.audioUploading = !0;
          self.audioUploadProgress = parseInt(
            (data.loaded / data.total) * 100,
            10
          );
        },
      })
    );
  },
  methods: {
    ok() {
      let error = '';

      if (!this.title) error = '标题不能为空';
      else if (!this.desc) error = '描述不能为空';
      else if (!this.covers.length) error = '封面不能为空';
      else if (!this.audio) error = '音频不能为空';

      if (error) {
        Notification.info({
          title: '提示',
          message: error,
        });
        return;
      }

      this.onOk({
        title: this.title,
        desc: this.desc,
        cover: this.covers[0],
        audio: this.audio,
      });
    },
  },
};
