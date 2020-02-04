<template>
  <Upload :images="images" :multiple="!0" />
</template>

<script>
import Upload from './Upload';

export default {
  name: 'App',
  components: {
    Upload,
  },
  data() {
    return {
      images: [],
    };
  },
};
</script>
