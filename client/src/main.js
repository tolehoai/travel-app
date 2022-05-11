import Vue from "vue";
import App from "./App.vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueSession from "vue-session";
Vue.use(VueSession);
import vuetify from "@/plugins/vuetify"; // path to vuetify export
// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

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
    // key: "AIzaSyCqd1XS0Jt-VUrhm_x1nY9bmQEk5xwf8Sc", //Dung OK
    // key: "AIzaSyB_WhUHEz1vlPiBEC4-9Z2Xf6TvrJ2gZjI",
    // key: "AIzaSyDPicTApjbER2ZKnR2bVELyF_-KhKIbE80",
    // key: "AIzaSyANDj4mJ2i_d0zRiNozVqbUGMgZTnDOeYI", //ok
    // key: "AIzaSyALYcsPh3unwjOuZ1aRDtQAHcz3DXMQVm4", //ok
    key: "AIzaSyBPj2HzzIHYkdssM58lpODmMebR_YFDiKE",
    libraries: "places", // This is required if you use the Autocomplete plugin
  },
});

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
