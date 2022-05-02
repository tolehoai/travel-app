import Vue from "vue";
import App from "./App.vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import VueSession from "vue-session";
Vue.use(VueSession);

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

/* Establish Connection */
const socketConnection = SocketIO("http://localhost:8081");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketConnection,
  })
);

Vue.config.productionTip = false;

import VueGeolocation from "vue-browser-geolocation";
Vue.use(VueGeolocation);

import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    // key: "AIzaSyCjtuhrYRCNX2BISz_gnebCWbGvY5pxrfk",
    key: "AIzaSyCqd1XS0Jt-VUrhm_x1nY9bmQEk5xwf8Sc", //Dung OK
    // key: "AIzaSyB_WhUHEz1vlPiBEC4-9Z2Xf6TvrJ2gZjI",
    libraries: "places", // This is required if you use the Autocomplete plugin
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
