<template>
  <button v-bind="attrs">
    <span v-if="loading" class="loader"></span>
    <slot></slot>
  </button>
</template>

<script setup>
import { useAttrs } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const attrs = useAttrs()
</script>

<style scoped>
button {
  background-color: rgb(58 64 81);
  padding: 5px 10px;
  border: 1px solid rgb(85, 94, 118);
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background-color: rgb(64, 75, 99);
  }

  &:active {
    background-color: rgb(58, 64, 81);
  }
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;

  &:hover,
  &:active {
    background-color: rgb(58, 64, 81);
  }
}

.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  border-top: 2px solid #fff;
  border-right: 2px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border-bottom: 2px solid #006aff;
  border-left: 2px solid transparent;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
