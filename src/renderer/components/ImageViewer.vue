<template>
    <div id="image-viewer">
      <img :src="imagePath"/>
      <div v-show="imagePath == ''">No image loaded.</div>
    </div>    
</template>

<script lang=ts>


module.exports = {
  data: function() {
    return {
      imagePath: ""
    };
  },

  mounted: function() {
    window.app.on('image-set', (path: string) => {
      this.imagePath = path;

    })
  },
  methods: {

  }
};
</script>

<style scoped>
img {
  width: 100%;
}
</style>