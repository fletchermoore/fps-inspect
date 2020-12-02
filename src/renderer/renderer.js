// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



import Vue from "vue";
// import Vuetify from "vuetify";
// import "vuetify/dist/vuetify.min.css";
// @ts-ignore
// import TifyTest from 'Components/TifyTest.vue';
import App from "Components/App.vue";

// @ts-ignore
import vuetify from 'Plugins/veutify';


new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');

