<template>
  <div
    ref="logRef"
    style="
      height: 30px;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid #ccc;
      flex: 1;
      user-select: all;
    "
    @dblclick="fullscreen"
  >
    <div v-for="line in log" :key="line">{{ line }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logRef = ref()
const log = ref([])
function onModelLog(s) {
  log.value.push(s)
}
window.api.onModelLog(onModelLog)
function fullscreen() {
  logRef.value.requestFullscreen()
}
</script>

<style scoped></style>
