import Vue from 'vue';
import cookie from 'js-cookie';
import {
  Dialog,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Loading,
} from 'element-ui';

import './register';
import EmbedMusicPopup from './App.vue';

Vue.component(Dialog.name, Dialog);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.use(Loading);

const EmbedMusicPopupConstructor = Vue.extend(EmbedMusicPopup);

const isLocal = window.location.href.indexOf('localhost') > -1;
// 自营寺院才显示此功能
if (parseInt(cookie.get('is_zizaihome_temple'), 10) || isLocal) {
  // 插入音频
  window.UE.registerUI(
    'zzh-embed-music',
    (editor, uiName) =>
      new window.UE.ui.Button({
        name: uiName,
        title: '插入音频',
        cssRules: 'background-position: -18px -40px;',
        onclick() {
          if (editor.ueEmbedMusic) {
            editor.ueEmbedMusicVm.visible = true;
            return;
          }

          const el = document.createElement('div');

          document.body.append(el);
          editor.ueEmbedMusic = el;

          const vm = new EmbedMusicPopupConstructor({
            el,
            propsData: {
              onSelect(selectData) {
                editor.execCommand('embedmusic', { selectData });
                vm.visible = false;
              },
            },
          });

          editor.ueEmbedMusicVm = vm;
        },
      })
  );
}
