<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";

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
        case "KEY_INFO":
          this.$router.push({ name: "key", params: data });
      }
    });
  }
});
</script>

<style>
</style>
