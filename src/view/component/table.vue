<template>
  <div class="r-table">
    <table border="1">
      <tr>
        <th width="10"></th>
        <th width="200">Key</th>
        <th width="1000">Value</th>
      </tr>
      <tr :key="k" v-for="(v,k) in datas" @click="select(k)">
        <td>
          <input type="radio" name="row" :checked="k===selected" />
        </td>
        <td v-text="k"></td>
        <td v-text="v"></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.r-table table {
  border: 1px solid var(--vscode-editor-foreground);
  width: 100%;
  border-collapse: collapse;
  word-break: break-all;
  table-layout: fixed;
}
.r-table table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RTable",
  props: {
    datas: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      selected: ""
    };
  },
  methods: {
    select(k: string) {
      this.selected = k;
      this.$emit("selectRow", k);
    }
  }
});
</script>