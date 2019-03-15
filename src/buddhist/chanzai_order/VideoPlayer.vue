<template>
  <div class="video-player-mask" v-show="visible" @click.self="onClickMask">
    <div class="video-player-container">
      <video id="video-player" class="video-js" controls preload="auto">
        <source id="video-source" :src="src" type="video/mp4" />
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="http://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';

let videoPlayer;

export default {
  name: 'VideoPlayer',
  props: ['src'],
  data: () => {
    return {
      mounted: false,
    };
  },
  computed: {
    visible() {
      return this.$store.state.videoPlayerVisible;
    },
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        // 每次显示时 要 重置数据
        if (this.mounted) {
          this.init();
        }
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      // 初始化video.js
      videoPlayer = videojs('video-player');
      videoPlayer.ready(() => {
        this.mounted = true;
        console.log('初始化videojs成功');
      });
    });
  },

  methods: {
    init() {
      videoPlayer.src(this.src);
      videoPlayer.load();
    },
    onClickMask() {
      this.$store.commit({ type: 'updateVideoPlayerVisible', state: false });
    },
  },
};
</script>

<style>
.video-player-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}
.video-player-container {
  width: 600px;
  height: 400px;
  margin: 100px auto;
}
.video-js {
  width: 100%;
}
</style>
