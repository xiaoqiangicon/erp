<template>
  <EmbedMusicPopup :onSelect="onSelect"></EmbedMusicPopup>
</template>

<script>
import EmbedMusicPopup from '../App.vue';

export default {
  name: 'App',
  components: {
    EmbedMusicPopup,
  },
  methods: {
    onSelect(d) {
      console.log(d);
    },
  },
};
</script>
