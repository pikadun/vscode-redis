<template>
  <button class="r-button" @click="handleClick" :style="style">
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.r-button {
  cursor: pointer;
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
    rimless: Boolean
  },
  methods: {
    handleClick(evt: Event) {
      this.$emit("click", evt);
    }
  },
  computed: {
    style() {
      const s: { [x: string]: string } = {};
      if (this.rimless) {
        s.border = "none";
      }
      return s;
    }
  }
});
</script>