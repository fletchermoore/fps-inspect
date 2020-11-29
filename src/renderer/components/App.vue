<template>
    <div>

    <status-label/>
    <p>
      Select an MP4 video. <button v-on:click="selectFile">Open</button>
      <button v-on:click="test">Debug</button>
      <button v-on:click="load">Load Manually</button>
    </p>

    <p>
      <b>Selected FILE:</b> <span>{{ selectedFile }}</span>
    </p>

    <image-viewer/>
</div>
    
</template>

<script lang=ts>
// @ts-ignore
import StatusLabel from 'Components/StatusLabel.vue';
// @ts-ignore
import ImageViewer from 'Components/ImageViewer.vue';




module.exports = {
  data: function() {
    return {
      selectedFile: "None"
    };
  },
  components: {
      'status-label': StatusLabel,
      'image-viewer': ImageViewer
  },
  mounted: function() {
    window.app.on('file-selected', (fileName: string) => {
        this.selectedFile = fileName;
    });
  },
  methods: {
      selectFile: function() {
          window.app.selectFile();
      },
      test: function() {
          window.app.test();
      },
      load: function() {
          window.app.selectImage();
      }
  }
};
</script>

<style scoped>

</style>