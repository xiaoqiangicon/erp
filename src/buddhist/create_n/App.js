import { Message, MessageBox } from 'element-ui';
import draggable from 'vuedraggable';
import ChooseImage from '../../com-deprecated/choose-image';
import upload from '../../../../pro-com/src/upload';
import Types from './com/Types.vue';
import GuiGe from './com/GuiGe.vue';
import FuYan from './com/FuYan.vue';

export default {
  name: 'App',
  components: {
    draggable,
    Types,
    GuiGe,
    FuYan,
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
        // 简介
        custom_introduce: '',
        // 规格
        subdivideStr: [],
        // 公共附言
        postScript: [],
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
      // 是否正在上传视频
      uploadingVideo: false,
      // 通过视频获取封面需要的后缀
      videoCoverSuffix: '?vframe/jpg/offset/1',
      // 选取封面组件实例
      chooseCoverIns: null,
      // 详情编辑器实例
      detailEditor: null,
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

    // 初始化详情编辑器
    this.detailEditor = window.UE.getEditor(this.$refs.detailEditor, {
      initialFrameWidth: 700,
      initialFrameHeight: 400,
    });
  },
  methods: {
    toTypesDialog() {
      this.$store.state.typesDialogShowing = true;
    },
    delCover(index) {
      this.form.pics.splice(index, 1);
    },
    addCover() {
      if (!this.chooseCoverIns) {
        this.chooseCoverIns = new ChooseImage({
          onSubmit: data => {
            data.forEach(item => {
              if (this.form.pics.length < 5) {
                this.form.pics.push(item.src);
              }
            });
          },
        });
      }
      this.chooseCoverIns.show();
    },
    delVideo(index) {
      this.form.video.splice(index, 1);
    },
  },
};
