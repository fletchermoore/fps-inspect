<template>
    <div id="image-viewer">
      <img :src="imagePath"/>
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
    let testPath = 'file:///C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0100_tess.jpg'
    //this.imagePath = testPath;
      //this.imagePath = 'C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0001_tess.jpg'
    window.app.on('image-set', (path: string) => {
      this.imagePath = path;
    //     var viewer = document.getElementById('viewer');
    //     if (viewer) {
    //         let img = new Image();
    //         img.onload = () => {
    //             //removeChildren(viewer);
    //             viewer?.appendChild(img);
    //         }
    //         img.src = path;
    //     }
    //     console.log('did i set image?');
    })
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