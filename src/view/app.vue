<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import { RedisPanel } from "../abstraction/enum";

export default Vue.extend({
  name: "app",
  methods: {},
  mounted() {
    window.addEventListener("message", event => {
      const data = event.data;
      // ignore other message
      if (!data.fromVscode) {
        return;
      }
      switch (data.name) {
        case RedisPanel.KEY_INFO:
          this.$router.push({ name: data.name, params: data });
          break;
        case RedisPanel.ADD_CONNECTION:
          this.$router.push({ name: data.name });
      }
    });
  }
});
</script>

<style>
</style>
