# 图片上传组件

```
<template>
  <Upload :images="images" :multiple="multiple" />
</template>

<script>
import Upload from 'com/upload/Upload';

export default {
  name: "App",
  components: {
    Upload,
  },
  data() {
    return {
      images: [],
      multiple: true/false,
    };
  },
}
</script>
```

## 属性

- `images`: `type: array` 图片数组
- `multiple`: `type: bool` 是否上传多张图片
