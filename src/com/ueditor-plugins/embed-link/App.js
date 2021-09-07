import { Message } from 'element-ui';
import debounce from 'lodash/debounce';
import request from '../../../utils/request';
import { makeUploadImageOptions } from '../../../configs/upload';
import upload from '../../../../../pro-com/src/upload';
import { htmlToText } from '../../../../../pro-com/src/utils';

const types = [
  { value: 1, name: '自营寺院佛事', action: '参与' },
  { value: 2, name: '自在好物佛事', action: '结缘' },
  { value: 3, name: '自营寺院文章', action: '阅读' },
  { value: 4, name: '自在家H5', action: '查看' },
  { value: 5, name: '功课', action: '修行' },
  { value: 6, name: '梵音', action: '播放' },
  { value: 7, name: '共修', action: '加入' },
  { value: 8, name: '自定义链接', action: '查看' },
];

const domainMap = {
  'http://erptest.zizaihome.com': 'https://chanzai-develop.zizaihome.com',
  'http://erprelease.zizaihome.com': 'https://chanzai-gray.zizaihome.com',
  'http://erp.zizaihome.com': 'https://chanzai.zizaihome.com',
  'http://www.zizaihome.com': 'https://chanzai.zizaihome.com',
  'http://zizaihome.com': 'https://chanzai.zizaihome.com',
  'https://erp.zizaihome.com': 'https://chanzai.zizaihome.com',
  'https://www.zizaihome.com': 'https://chanzai.zizaihome.com',
  'https://zizaihome.com': 'https://chanzai.zizaihome.com',
  'http://gstest.zizaihome.com': 'https://chanzai-develop.zizaihome.com',
  'http://cms.miaoyan.org': 'https://chanzai.zizaihome.com',
};

const crossDomain = domainMap[window.location.origin] || '';

function getRequestType(type) {
  if (type > 4 && type < 8) return type - 1;
  return type;
}

export default {
  name: 'EmbedLinkPopup',
  props: {
    onSelect: {
      type: Function,
      required: !0,
    },
  },
  data() {
    return {
      types,
      visible: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        searchKey: '',
        type: 1,
      },
      list: null,
      total: null,
      listLoading: false,

      inputTitle: '',
      inputDesc: '',
      inputCover: '',
      inputHref: '',
    };
  },
  created() {
    this.getList = debounce(this.getListInternal, 200);
    this.getList();
  },
  updated() {
    // mounted 中 this.$refs.imageUpload 是 undefined
    const { coverUpload } = this.$refs;

    if (coverUpload && !this.uploadInitialized) {
      this.uploadInitialized = true;
      upload(
        makeUploadImageOptions({
          el: coverUpload,
          done: url => {
            if (url) {
              this.inputCover = url;
            }
          },
        })
      );
    }
  },
  methods: {
    handleChangeType() {
      if ([4, 8].indexOf(this.listQuery.type) < 0) {
        this.handleSearchList();
      }
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getListInternal() {
      this.listLoading = true;
      request({
        url: crossDomain + '/app_h5/backend/search',
        method: 'get',
        params: {
          page: this.listQuery.pageNum,
          limit: this.listQuery.pageSize,
          key: this.listQuery.searchKey,
          type: getRequestType(this.listQuery.type),
        },
      }).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = (response.all_page || 1) * (response.limit || 1);
      });
    },
    handleSelect(index, row) {
      const typeItem = types[this.listQuery.type - 1];

      this.onSelect({
        title: row.title,
        desc: htmlToText(row.content),
        cover: row.imgurl || '',
        href: row.jump_link,
        type: this.listQuery.type,
        action: typeItem ? typeItem.action : '查看',
      });
    },
    confirmInsert() {
      const title = this.inputTitle.trim();
      const desc = this.inputDesc.trim();
      const cover = this.inputCover.trim();
      const href = this.inputHref.trim();

      if (!title) return Message.warning('请输入标题');
      if (!desc) return Message.warning('请输入描述');
      if (!cover) return Message.warning('请上传封面');
      if (!href) return Message.warning('请输入链接');

      // 必须是自在家的链接
      if (this.listQuery.type === 4) {
        if (href.slice(0, 7) !== 'http://' && href.slice(0, 8) !== 'https://')
          return Message.warning(
            '输入链接格式不对，必须是http://或https://开头'
          );
        if (href.split('/')[2].indexOf('zizaihome.com') < 0)
          return Message.warning('输入链接格式不对，必须是zizaihome.com的链接');
      }

      const typeItem = types[this.listQuery.type - 1];

      this.onSelect({
        title,
        desc,
        cover,
        href,
        type: this.listQuery.type,
        action: typeItem ? typeItem.action : '查看',
      });
    },
  },
};
