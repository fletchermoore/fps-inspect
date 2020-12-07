<template>
    <div>
      <ocr-result v-for="result in results" 
        :key="result.id"
        :frame="result.id"
        :ocrNum="result.num"
        :imageSrc="result.src"
        v-on:result-updated="onResultUpdated"/>
    </div>    
</template>

<script lang=ts>
// @ts-ignore
import OCRResult from 'Components/OCRResult.vue';



module.exports = {
  data: function() {
    return {
      results: [],
      dirtyUpdate: [],
      timeouts: [],
    };
  },

  components: {
    'ocr-result': OCRResult
  },

  mounted: function() {
    let testPath = 'file:///C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0001_tess.jpg'
    this.imagePath = testPath;
    
    window.app.on('results-retrieved', (results: any) => {
      this.results = results;
    })

    window.app.retrieveResults();
  },
  methods: {
    onResultUpdated(update: any) {
      //@ts-ignore
      if (this.dirtyUpdate.filter((priorUpdate) => {
        return priorUpdate.frame == update.frame;
      }).length == 0) {
        //@ts-ignore
        this.dirtyUpdate.push(update);
      }
      else {
        //@ts-ignore
        this.dirtyUpdate = this.dirtyUpdate.map((priorUpdate) => {
          if (priorUpdate.frame == update.frame) {
            return update;
          }
          else {
            return priorUpdate;
          }
        });
      }    
      //@ts-ignore
      console.log(this.dirtyUpdate);

      this.clearTimeouts(); // eliminate other updates

      //@ts-ignore
      let timeoutId = setTimeout(() => {
        

        //@ts-ignore
        if (this.dirtyUpdate.length > 0) {
          //@ts-ignore
          this.sendUpdate();
        }
        else {
          console.log('timeout called')
        }
      }, 2000);
      // console.log('pushing timeout',timeoutId);

      //@ts-ignore
      this.timeouts.push(timeoutId);
    },

    clearTimeouts() {
      //@ts-ignore
      for(const timeoutId of this.timeouts)
      {
        // console.log('clearing timeout', timeoutId);
        clearTimeout(timeoutId);
      }
    },

    sendUpdate() {
      console.log('sending update');
      //@ts-ignore
      window.app.updateResults(this.dirtyUpdate);
      //@ts-ignore
      this.dirtyUpdate = [];
    }
  }
};
</script>

<style scoped>
img {
  /*width: 100%;*/
}
</style>