<template>
  <div class="r-table" :style="style">
    <!-- head -->
    <span v-if="serial" v-text="serial"></span>
    <span :key="'head'+ i" v-for="(c,i) in cols" v-text="c" :style="itemStyle(i+1)"></span>

    <!-- body -->
    <span
      class="r-table-body"
      :key="'body' + i"
      v-for="(item,i) in cells"
      :style="itemStyle(i%count)"
    >
      <slot
        :name="item.name"
        :index="parseInt(i/count)"
        :row="datas[parseInt(i/count)]"
      >{{item.value}}</slot>
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    widths: String,
    aligns: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    itemStyle(index: number) {
      return {
        "text-align": this.aligns.split(",")[index - 1] || "start"
      };
    }
  },
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
    count(): number {
      return this.serial ? this.cols.length + 1 : this.cols.length;
    },

    cols(): string[] {
      const cols = Object.keys(this.$scopedSlots);
      return cols;
    },

    cells() {
      const cols = this.cols;
      const cells: any[] = [];
      for (let i = 0; i < this.datas.length; i++) {
        const item: any = this.datas[i];
        if (this.serial) cells.push({ name: "s", value: i });

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