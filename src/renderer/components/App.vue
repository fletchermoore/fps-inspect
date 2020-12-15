<template>
    <v-app>
      <v-app-bar app color="primary" dark fixed>
        <v-toolbar-title>FPS Inspector</v-toolbar-title>
        <v-spacer></v-spacer>
          
          <v-btn v-on:click="test" text>Debug</v-btn>
      </v-app-bar>
        <v-main>

          <v-stepper v-model="e1" non-linear class="fill-height">
    <v-stepper-header>
      <v-stepper-step
        :complete="e1 > 1"
        step="1"
        editable
      >
        Extract
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="e1 > 2"
        step="2"
        editable
      >
        Process
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3" editable>
        Verify
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items class="fill-height">
      <v-stepper-content step="1" class="fill-height">
        <v-card
          class="mb-12 fill-height"
          flat
        >
        <p>
          <b>Selected file:</b> <span>{{ selectedFile }}</span>
        </p>
        <p>
          Use the open button in the top right to select an MP4 video. 
        </p>
        </v-card>

        <v-btn v-on:click="selectFile" color="primary">Open</v-btn>

  <!--
        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Continue
        </v-btn> 
        -->

      
      </v-stepper-content>

      <v-stepper-content step="2" class="fill-height">
        <v-card
          class="mb-12 fill-height"
         
          flat
        >
        
        <image-viewer/>

        
        </v-card>


                <v-btn
          color="primary"
          
          @click="e1 = 3"
        >
          Continue
        </v-btn>

      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12 fill-height"
          flat
        >
        
        <ocr-results-view/>
        
        </v-card>


      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

        <!--  -->
        <!--  -->

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
// @ts-ignore
import { TaskState } from 'Common/constants.ts';



module.exports = {
  data: function() {
    return {
      selectedFile: "None",
      loading: false,
      e1: 1
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
        window.app.retrieveResults();
        this.e1 = 2;
    });

    window.app.on('alert', (message: string) => {
      alert(message);
    });

    window.app.on('extract-status-updated', (status: string) => {
      console.log('extract status updated:', status);
    })

    console.log(TaskState.Finished);
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
      }
  }
};
</script>

<style scoped>

</style>