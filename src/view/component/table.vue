<template>
  <div class="r-table" :style="style">
    <!-- head -->
    <span v-if="serial" v-text="serial"></span>
    <span :key="c" v-for="c in cols" v-text="c"></span>

    <!-- body -->
    <span :key="i" v-for="(item,i) in cells">
      <slot :name="item.name">{{item.value}}</slot>
    </span>
  </div>
</template>

<style scoped>
.r-table {
  display: grid;
}

.r-table span {
  border: 1px solid var(--vscode-editor-foreground);
  box-sizing: border-box;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RTable",
  props: {
    datas: {
      type: Array,
      default: []
    },
    serial: String,
    widths: String
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    style(): { [x: string]: string } {
      const widths = [];
      if (this.serial) {
        widths.push("minmax(2em, auto)");
      }

      if (this.widths) {
        widths.push(this.widths);
      } else {
        widths.push(`repeat(${this.cols.length},1fr)`);
      }

      return { "grid-template-columns": widths.join(" ") };
    },

    cols(): string[] {
      const cols = Object.keys(this.$slots);
      return cols;
    },

    cells() {
      const cols = this.cols;
      const cells: any[] = [];
      for (let i = 0; i < this.datas.length; i++) {
        const item: any = this.datas[i];
        if (this.serial) cells.push({ name: "s", value: i + 1 });

        cols.forEach(e => {
          cells.push({ name: e, value: item[e] });
        });
      }
      return cells;
    }
  },
  mounted() {}
});
</script>