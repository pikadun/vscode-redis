<template>
  <div v-show="visible" class="r-dialog-wrapper" @click="hide">
    <div ref="r-dialog" class="r-dialog" :style="style" @click="stop">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.r-dialog-wrapper {
  background-color: transparent;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.r-dialog {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background-color: var(--vscode-editor-background);
  border: 1px solid var(--vscode-editor-foreground);
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RDialog",
  props: {
    width: String,
    height: String,
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      let style = {
        width: "800px",
        height: "400px"
      };
      return style;
    }
  },
  methods: {
    hide() {
      this.$emit("update:visible", false);
    },
    stop(e: Event) {
      e.stopPropagation();
    }
  }
});
</script>