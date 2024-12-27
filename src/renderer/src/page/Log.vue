<template>
  <div ref="logRef" class="log">
    <div v-for="line in log" :key="line">{{ line }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const emits = defineEmits(['running', 'load-error'])
const logRef = ref()
const log = ref([])

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyL' && e.ctrlKey) {
      fullscreen()
    }
  })
})

function onModelLog(s) {
  if (s.includes('Uvicorn running on http://0.0.0.0:12088')) {
    emits('running')
  }
  log.value.push(s)
}
window.api.onModelLog(onModelLog)
function fullscreen() {
  logRef.value.requestFullscreen()
}
</script>

<style scoped>
.log {
  /* width: 100%;
  height: 100px; */
  /* background-color: rgb(58 64 81);
  padding: 5px 10px;
  border: 1px solid rgb(85, 94, 118);
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ccc; */
  width: 0;
  height: 0;
  overflow: hidden;
  user-select: all;
  border-radius: 3px;
}
</style>
