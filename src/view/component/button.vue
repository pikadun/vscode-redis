<template>
  <button class="r-button" @click="handleClick" :style="style">
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.r-button {
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RButton",
  props: {
    type: {
      type: String,
      default: "default"
    },
    border: String
  },
  methods: {
    handleClick(evt: Event) {
      this.$emit("click", evt);
    }
  },
  computed: {
    style() {
      const s: { [x: string]: string } = {};
      if (this.border === "false") {
        s.border = "none";
      }
      return s;
    }
  }
});
</script>