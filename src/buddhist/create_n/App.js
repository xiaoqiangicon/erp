import { Message, MessageBox } from 'element-ui';
import draggable from 'vuedraggable';
import Types from './com/Types.vue';
import ChooseImage from '../../com-deprecated/choose-image';
import upload from '../../../../pro-com/src/upload';

let chooseCoverIns;

export default {
  name: 'App',
  components: {
    draggable,
    Types,
  },
  data() {
    return {
      form: {
        // 标题
        title: '',
        // 是否显示分享标题参与人次
        allow_showVistNum: 1,
        // 分类Id
        ceremonyTypeId: null,
        // 封面图片
        pics: [
          // "https://pic.zizaihome.com/9e286110-725a-11ea-973a-00163e0c1e1c.jpg?imageMogr/auto-orient",
          // "https://pic.zizaihome.com/1b014332-89e9-11ea-a4c7-00163e0c1e1c.jpg?imageMogr/auto-orient",
          // "https://pic.zizaihome.com/4576b190-5c2d-11ea-9450-00163e0c1e1c.jpg?imageMogr/auto-orient",
        ],
        // 封面视频
        video: [],
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
      // 是否正在上传视频
      uploadingVideo: false,
      // 通过视频获取封面需要的后缀
      videoCoverSuffix: '?vframe/jpg/offset/1',
    };
  },
  computed: {
    ceremonyTypes() {
      return this.$store.state.ceremonyTypes;
    },
  },
  mounted() {
    // 初始化视频上传组件
    upload({
      el: this.$refs.uploadVideo,
      uploadUrl: '/zzhadmin/uploadPic/',
      done: url => {
        this.uploadingVideo = false;
        this.form.video.push(url);
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
            MessageBox.alert('请上传正确的视频格式');
            return;
          }
          if (size > limitSize) {
            MessageBox.alert('请上传不超过50M的文件');
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

    // other
  },
  methods: {
    toTypesDialog() {
      this.$store.state.typesDialogShowing = true;
    },
    delCover(index) {
      this.form.pics.splice(index, 1);
    },
    addCover() {
      if (!chooseCoverIns) {
        chooseCoverIns = new ChooseImage({
          onSubmit: data => {
            data.forEach(item => {
              if (this.form.pics.length < 5) {
                this.form.pics.push(item.src);
              }
            });
          },
        });
      }
      chooseCoverIns.show();
    },
    delVideo(index) {
      this.form.video.splice(index, 1);
    },
  },
};
