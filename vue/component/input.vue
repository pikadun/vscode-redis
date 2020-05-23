<template>
  <div class="r-input">
    <span v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </span>
    <input v-bind="$attrs" />
  </div>
</template>

<style scoped>
.r-input {
  display: inline-block;
}

</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RInput",
  props: {}
});
</script>