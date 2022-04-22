<template>
  <EmbedVideoPopup :onSubmit="onSubmit"></EmbedVideoPopup>
</template>

<script>
import EmbedVideoPopup from '../App.vue';

export default {
  name: 'App',
  components: {
    EmbedVideoPopup,
  },
  methods: {
    onSubmit(d) {
      console.log(d);
    },
  },
};
</script>
