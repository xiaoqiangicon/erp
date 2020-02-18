/* eslint-disable no-param-reassign */
import Vue from 'vue';
import './index.less';
import SelfMusicPopup from './App.vue';

const SelfMusicPopupConstructor = Vue.extend(SelfMusicPopup);

const tpl = `
<div class="wrap-1">
  <div class="content-1"></div>
</div>
`;

// 插入音频
window.UE.registerUI(
  'ue-self-music',
  (editor, uiName) =>
    new window.UE.ui.Button({
      name: uiName,
      title: '插入音频',
      cssRules: 'background-position: -18px -40px;',
      onclick() {
        if (editor.ueSelfMusic) {
          editor.ueSelfMusic.style.display = 'block';
          editor.ueSelfMusicVm.title = '';
          editor.ueSelfMusicVm.desc = '';
          editor.ueSelfMusicVm.covers = [];
          editor.ueSelfMusicVm.audio = '';
          return;
        }

        const el = document.createElement('div');
        el.classList.add('ue-self-music');

        document.body.append(el);
        editor.ueSelfMusic = el;

        el.innerHTML = tpl;

        el.addEventListener(
          'click',
          e => {
            if (e.target === e.currentTarget) el.style.display = 'none';
          },
          !1
        );

        const contentEl = el.getElementsByClassName('content-1')[0];

        const vm = new SelfMusicPopupConstructor({
          el: contentEl,
          propsData: {
            onOk({ title, desc, cover, audio }) {
              editor.execCommand('music', {
                url: audio,
                width: 400,
                height: 95,
                selectData: {
                  // ueditor 固定写法
                  musicid: '',
                  mid: '',
                  albumurl: cover,
                  audiourl: audio,
                  music_name: title,
                  singer: '',
                  datasrc: '',
                  singername: desc,
                },
              });
              editor.ueSelfMusic.style.display = 'none';
            },
          },
        });

        editor.ueSelfMusicVm = vm;
      },
    })
);
