<template>
  <div>
    <div class="header">
      <r-input type="text" id="key" v-model="redisData.key" :readonly="!editing">
        <template v-slot:prepend>{{redisData.type.toUpperCase()+':'}}</template>
      </r-input>
      <r-input type="text" id="ttl" v-model="redisData.ttl" :readonly="!editing">
        <template v-slot:prepend>TTL:</template>
      </r-input>
    </div>

    <div class="hash" v-if="redisData.type==='hash'">
      <r-table :datas="redisData.value" serial="S" widths="1fr 2fr auto">
        <template #field></template>
        <template #value></template>
        <template #operation>
          <r-button border="false">View</r-button>
        </template>
      </r-table>
    </div>

    <div class="string" v-else-if="redisData.type==='string'" v-text="redisData.value"></div>

    <r-dialog :visible.sync="hashDialog" class="hashDialog">
      <div style="border-bottom:1px" v-text="hashSelected"></div>
      <div v-text="redisData.value[hashSelected]"></div>
    </r-dialog>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  background-color: var(--vscode-editor-background);
  width: 100%;
  padding-bottom: 1vh;
}
.string {
  padding: 1vw;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid;
}
.hashDialog div {
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  word-wrap: break-word;
  word-break: break-all;
  border: 1px solid;
  overflow-y: scroll;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      redisData: {
        type: "string",
        key: "",
        value: "",
        ttl: -1
      },
      editing: false,
      hashSelected: "",
      hashDialog: false
    };
  },
  methods: {
    init() {
      this.editing = false;
      this.hashSelected = "";
      this.hashDialog = false;
      this.redisData.type = this.$route.params.type;
      this.redisData.key = this.$route.params.key;
      this.redisData.ttl = parseInt(this.$route.params.ttl);

      if (this.redisData.type === "hash") {
        const values: any = this.$route.params.value;
        this.redisData.value = Object.keys(values).map(e => {
          return {
            field: e,
            value: values[e]
          };
        }) as any;
      } else {
        this.redisData.value = this.$route.params.value;
      }
    },
    edit() {
      this.editing = true;
    },
    selectRow(k: string) {
      this.hashSelected = k;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      if (to.name === from.name) {
        this.init();
      }
    }
  }
});
</script>