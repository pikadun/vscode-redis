<template>
  <button class="r-button" @click="handleClick">
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
    }
  },
  methods: {
    handleClick(evt: Event) {
      this.$emit("click", evt);
    }
  }
});
</script>