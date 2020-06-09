<template>
  <div>
    <div class="connection">
      <r-input type="text" id="host" v-model="host">
        <template v-slot:prepend>
          <span class="prepend">Host:</span>
        </template>
      </r-input>
      <r-input type="text" id="port" v-model="port">
        <template v-slot:prepend>
          <span class="prepend">Port:</span>
        </template>
      </r-input>
      <r-input type="password" id="auth" v-model="auth">
        <template v-slot:prepend>
          <span class="prepend">Auth:</span>
        </template>
      </r-input>
    </div>
    <r-button @click="addConnection">Connection</r-button>
  </div>
</template>

<style scoped>
.connection {
  display: flex;
  flex-direction: column;
}

.base .prepend {
  text-align: right;
  display: inline-block;
  width: 80px;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      id: "",
      host: "127.0.0.1",
      port: 6379,
      auth: ""
    };
  },
  methods: {
    init() {
      this.id = this.$route.params.id || "";
      this.host = this.$route.params.host || this.host;
      this.port = parseInt(this.$route.params.port) || this.port;
      this.auth = this.$route.params.auth || "";
    },
    addConnection() {
      this.vscode.postMessage({
        fromWebview: true,
        command: "Connection.Edit",
        args: [this.id, this.host, this.port, this.auth]
      });
    }
  },
  mounted() {
    this.init();
  }
});
</script>