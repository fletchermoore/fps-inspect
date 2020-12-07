<template>
    <div>
      <ocr-result v-for="result in results" 
        :key="result.id"
        :frame="result.id"
        :ocrNum="result.num"
        :imageSrc="result.src"/>
    </div>    
</template>

<script lang=ts>
// @ts-ignore
import OCRResult from 'Components/OCRResult.vue';



module.exports = {
  data: function() {
    return {
      results: []
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

  }
};
</script>

<style scoped>
img {
  /*width: 100%;*/
}
</style>