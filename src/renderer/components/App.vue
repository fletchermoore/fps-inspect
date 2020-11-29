<template>
    <div>
  <p>{{ greeting }} you!d</p>

    <p>Status: <span id="statusLabel"></span></p>
    <p>
      Select an MP4 video. <button v-on:click="selectFile">Open</button>
      <button v-on:click="test">Debug</button>
    </p>

    <p>
      <b>Selected File:</b> <span id="selectedFileLabel">None</span>
    </p>

    <div id="viewer">
      <button v-on:click="load">Load Manually</button>
    </div>
</div>
    
</template>

<script lang=ts>
import { BehaviorSubject } from 'rxjs';


const fileSelected = new BehaviorSubject('');
const statusUpdated = new BehaviorSubject('');

const removeChildren = (parent: any) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

window.app.on('file-selected', (fileName: string) => {
    fileSelected.next(fileName);
});

window.app.on('status-updated', (status: string) => {
    statusUpdated.next(status);
});

window.app.on('image-set', (path: string) => {
    var viewer = document.getElementById('viewer');
    if (viewer) {
        let img = new Image();
        img.onload = () => {
            removeChildren(viewer);
            viewer?.appendChild(img);
        }
        img.src = path;
    }
})

statusUpdated.subscribe((status: string) => {
    let statusLabel = document.getElementById('statusLabel');
    if (statusLabel) {
        statusLabel.innerText = status;
    }
});

fileSelected.subscribe((fileName: string) => {
    var selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel) {
        selectedFileLabel.innerHTML = fileName;
    }
});



module.exports = {
  data: function() {
    return {
      greeting: "Hello"
    };
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
p {
  font-size: 2em;
  text-align: center;
}
</style>