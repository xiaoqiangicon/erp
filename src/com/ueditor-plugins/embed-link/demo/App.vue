<template>
  <EmbedLinkPopup :onSelect="onSelect"></EmbedLinkPopup>
</template>

<script>
import EmbedLinkPopup from '../App.vue';

export default {
  name: 'App',
  components: {
    EmbedLinkPopup,
  },
  methods: {
    onSelect(d) {
      console.log(d);
    },
  },
};
</script>
