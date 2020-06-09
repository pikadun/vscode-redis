<template>
  <div class="r-input">
    <span v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </span>
    <input :type="type" v-bind="$attrs" v-model="currValue" />
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
    // TODO: v-model 参考elementui
    value: [String, Number],
    type: {
      type: String,
      default: "text"
    }
  },
  data() {
    return {
      currValue: this.value
    };
  },
  watch: {
    currValue(val) {
      this.$emit("input", val);
    }
  }
});
</script>