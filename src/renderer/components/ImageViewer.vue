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
p {
  font-size: 2em;
  text-align: center;
}
img {
  width: 100%;
}
</style>