<template>
  <div>
    <div class="dp-inline-block">
      <div
        v-for="(image, index) in images"
        :key="image"
        class="image"
        @click="delImage(index)"
      >
        <img :src="image" class="image-img" />
        <button class="clean image-close">
          X
        </button>
      </div>
    </div>
    <div v-show="!hideUpload" ref="upload" class="image cs-pointer">
      <img
        class="image-img"
        src="https://pic.zizaihome.com/0f919be8-308e-11e8-b78b-00163e0c001e.png"
      />
    </div>
  </div>
</template>

<script>
import '@senntyou/shortcut.css';
import { makeUploadImageOptions } from '../../configs/upload';
import upload from '../../../pro-com/src/upload';

export default {
  name: 'Upload',
  props: {
    images: {
      type: Array,
      required: !0,
      default() {
        return [];
      },
    },
    multiple: {
      type: Boolean,
      default() {
        return !0;
      },
    },
  },
  computed: {
    hideUpload() {
      return !this.multiple && this.images.length;
    },
  },
  mounted() {
    const { upload: uploadEl } = this.$refs;

    upload(
      makeUploadImageOptions({
        el: uploadEl,
        done: url => {
          this.images.push(url);
        },
        multiple: this.multiple,
      })
    );
  },
  methods: {
    delImage(index) {
      this.images.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.image {
  position: relative;
  display: inline-block;
  height: 100px;
  margin-right: 10px;
}

.image-img {
  height: 100%;
}

.image-close {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 18px;
  display: none;
}

.image:hover .image-close {
  display: block;
}
</style>
