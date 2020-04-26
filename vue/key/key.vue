<template>
  <div id="Key">
    <div>
      <r-input type="text" id="key" v-model="key" :readonly="!editing">
        <template slot="prepend" v-text="type"></template>
      </r-input>
      <r-input type="text" id="ttl" v-model="ttl" :readonly="!editing">
        <template slot="prepend">TTL:</template>
      </r-input>
    </div>
    <div class='editor'>{{value}}</div>
  </div>
</template>

<style scoped>
.editor {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid;
  min-height: 80vh;
  margin-top: 2vh;
}
</style>

<script lang="ts">
import Vue from "vue";
import RInput from "../component/input.vue";

export default Vue.extend({
  components: {
    RInput
  },
  data() {
    return {
      editing: false,
      type: "string",
      key: "",
      value: "",
      ttl: -1
    };
  },
  methods: {
    edit() {
      this.editing = true;
    }
  },
  mounted() {
    window.addEventListener("message", (event: any) => {
      const data = event.data;
      this.key = data.key;
      this.type = data.type;
      this.value = data.value;
    });
  }
});
</script>