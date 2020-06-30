<template>
  <div>
    <div class="connection">
      <r-input type="text" id="host" v-model="config.host" placeholder="host">
        <template v-slot:prepend>
          <div class="prepend">IP address of the Redis server:</div>
        </template>
      </r-input>
      <r-input type="text" id="port" v-model="config.port" placeholder="port">
        <template v-slot:prepend>
          <div class="prepend">Port of the Redis server:</div>
        </template>
      </r-input>
      <r-input type="password" id="auth" v-model="config.auth" placeholder="auth (optional)">
        <template v-slot:prepend>
          <div class="prepend">Authentication password:</div>
        </template>
      </r-input>
      <r-input type="text" id="name" v-model="config.name" placeholder="name (optional)">
        <template v-slot:prepend>
          <div class="prepend">Connection name:</div>
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
      config: {
        host: "127.0.0.1",
        port: 6379,
        auth: "",
        name: ""
      }
    };
  },
  methods: {
    init() {
      const {
        id = "",
        host = this.config.host,
        port = this.config.port,
        auth = "",
        name = ""
      } = this.$route.params;
      this.id = id;
      this.config.host = host;
      this.config.port = parseInt(port as string);
      this.config.auth = auth;
      this.config.name = name === `${host}:${port}` ? "" : name;
    },

    addConnection() {
      this.config.name =
        this.config.name || `${this.config.host}:${this.config.port}`;
        
      this.vscode.postMessage({
        fromWebview: true,
        command: "Connection.Edit",
        args: [this.id, this.config]
      });
    }
  },
  mounted() {
    this.init();
  }
});
</script>