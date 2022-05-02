<template>
  <div id="app">
    <GoogleMap />
  </div>
</template>

<script>
import GoogleMap from "./components/GoogleMap.vue";

export default {
  name: "App",
  components: {
    GoogleMap,
  },
  mounted() {
    console.log("app mounted");
  },
};
</script>

<style>
html,
body {
  max-width: 100%;
  overflow-x: hidden;
}
body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
body::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}
body::-webkit-scrollbar-thumb {
  background-color: #dfdfdf;
  border-radius: 10px;
}
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
