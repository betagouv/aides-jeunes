<template>
  <iframe
    id="iframe"
    :src="`/?iframe`"
    scrolling="no"
    @load="iframeLoaded"
  ></iframe>
</template>

<script>
import { iframeResize } from "iframe-resizer"

export default {
  name: "IFrame",
  methods: {
    iframeLoaded() {
      iframeResize({ log: false }, "#iframe")
    },
  },
}
</script>

<style scoped>
#iframe {
  margin: 0 auto;
  width: 100%;
  border: none;
  min-height: 700px;
}
</style>
