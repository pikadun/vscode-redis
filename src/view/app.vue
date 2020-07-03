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
      this.$router.push({ name: data.panelName, params: data });
    });
    this.$router.push({
      name: "KEY_INFO",
      params: {
        type: "hash",
        key: "test",
        value: { a: "a", b: "b", c: "c" },
        ttl: -1
      }
    });
  }
});
</script>

<style>
</style>
