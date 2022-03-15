import Vue from 'vue';
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

// 插入音频
window.UE.registerUI(
  'ue-embed-music',
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
        el.classList.add('ue-embed-music');

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
