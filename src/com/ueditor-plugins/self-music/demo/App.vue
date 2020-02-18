<template>
  <Popup :onOk="okOk"></Popup>
</template>

<script>
import Popup from '../App.vue';

export default {
  name: 'App',
  components: {
    Popup,
  },
  methods: {
    okOk(d) {
      console.log(d);
    },
  },
};
</script>
