<template>
  <div class="r-input">
    <span v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </span>
    <input :type="type" v-bind="$attrs"/>
  </div>
</template>

<style scoped>
.r-input {
  display: inline-block;
  margin: 10px 0;
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RInput",
  props: {
    type: {
      type: String,
      default: "text"
    }
  }
});
</script>