<template>
    <v-app>
      <v-app-bar app color="primary" dark fixed>
        <v-toolbar-title>FPS Inspector</v-toolbar-title>
        <v-spacer></v-spacer>
          <v-btn v-on:click="selectFile" text='true'>Open</v-btn>
          <v-btn v-on:click="test" text='true'>Debug</v-btn>
      </v-app-bar>
        <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

        
        <p>
          Use the open button in the top right to select an MP4 video. 
        </p>

        <p>
          <b>Selected file:</b> <span>{{ selectedFile }}</span>
        </p>

        <!-- <image-viewer/> -->
        <ocr-results-view/>
    </v-container>
  </v-main>
  <v-footer fixed>
        <status-label /> 
        <v-spacer></v-spacer>
        <v-progress-circular v-show="loading" indeterminate size="20"></v-progress-circular>
  </v-footer>

</v-app>
    
</template>

<script lang=ts>
// @ts-ignore
import StatusLabel from 'Components/StatusLabel.vue';
// @ts-ignore
import ImageViewer from 'Components/ImageViewer.vue';
// @ts-ignore
import OCRResultsView from 'Components/OCRResultsView.vue';



module.exports = {
  data: function() {
    return {
      selectedFile: "None",
      loading: false
    };
  },
  components: {
      'status-label': StatusLabel,
      'image-viewer': ImageViewer,
      'ocr-results-view': OCRResultsView
      
  },
  mounted: function() {
    window.app.on('file-selected', (fileName: string) => {
        this.selectedFile = fileName;
    });

    window.app.on('alert', (message: string) => {
      alert(message);
    });
  },
  methods: {
      selectFile() {
          window.app.selectFile();
          // start loading
          //@ts-ignore
          this.loading = true
          setTimeout(() => {
            //@ts-ignore
            this.loading = false;
          }, 2000);
      },
      test() {
          window.app.test();
          window.app.retrieveResults();
      }
  }
};
</script>

<style scoped>

</style>