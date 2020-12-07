<template>
  <div class="d-flex align-center justify-start ma-0 pa-0">
    <v-card flat tile class="mr-6">{{ frame }}</v-card>
    <v-card flat tile><img :src="imageSrc"/> </v-card>
    <v-card flat tile><v-text-field dense class="mx-8 my-0 pa-0 ocr-textfield"
           
            :label="ocrNum"></v-text-field><v-spacer/></v-card>
  </div>
    <!-- <v-container class="ma-0 pa-0">
      
      
      
      
      <v-row dense class="ma-0 pa-0">
        <v-col class="ma-0 pa-0">
          <img :src="imagePath"/> 
        </v-col>
        <v-col class="ma-0 pa-0">
          <v-text-field dense outlined class="ma-0 pa-0 ocr-textfield"
           
            label="999"></v-text-field><v-spacer/>
        </v-col>
      </v-row>
    </v-container>  -->
</template>

<script lang=ts>


module.exports = {
  props: ['frame','imageSrc', 'ocrNum'],

  data: function() {
    return {
      imagePath: ""
    };
  },

  mounted: function() {
    let testPath = 'file:///C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0100_tess.jpg'
    this.imagePath = testPath;
      //this.imagePath = 'C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0001_tess.jpg'

  },
  methods: {

  }
};
</script>

<style scoped>
img {
  /*width: 100%;*/
}

.ocr-textfield {
  width: 100px;
}
</style>