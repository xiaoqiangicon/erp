import debounce from 'lodash/debounce';
import request from '../../../utils/request';
import { htmlToText } from '../../../../../pro-com/src/utils';

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

export default {
  name: 'EmbedMusicPopup',
  props: {
    onSelect: {
      type: Function,
      required: !0,
    },
  },
  data() {
    return {
      visible: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        searchKey: '',
      },
      list: null,
      total: null,
      listLoading: false,
    };
  },
  created() {
    this.getList = debounce(this.getListInternal, 200);
    this.getList();
  },
  methods: {
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
          type: 5,
        },
      }).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = response.all_items || 0;
      });
    },
    handleSelect(index, row) {
      this.onSelect({
        title: row.title,
        desc: htmlToText(row.content),
        cover: row.imgurl || '',
        audio: row.play_link,
        href: row.jump_link,
      });
    },
  },
};
