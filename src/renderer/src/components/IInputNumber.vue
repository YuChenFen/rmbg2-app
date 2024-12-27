<template>
  <div class="input-number">
    <input v-model="value" type="number" v-bind="attrs" :disabled="disabled" />
    <div class="btn">
      <div @click="value++"></div>
      <div @click="value--"></div>
    </div>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const value = defineModel('value', {
  type: Number,
  default: 0
})

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const attrs = useAttrs()
</script>

<style scoped>
.input-number {
  background-color: rgb(58 64 81);
  padding: 5px 10px;
  border: 1px solid rgb(85, 94, 118);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  input {
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    outline: none;
    flex: 1;
  }

  &:hover,
  &:active,
  &:focus-within {
    background-color: rgb(64, 75, 99);
    border-color: rgb(116, 128, 160);
  }
}
input[disabled] {
  opacity: 0.5;
  cursor: not-allowed;

  &:hover,
  &:active {
    background-color: rgb(58, 64, 81);
  }
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn {
  & > div {
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-right: 6px solid rgb(116, 128, 99);
    border-bottom: 5px solid transparent;
    display: block;
    cursor: pointer;

    &:hover {
      border-right-color: rgb(180, 180, 180);
    }
  }

  & > div:nth-child(1) {
    transform: rotate(90deg);
  }

  & > div:nth-child(2) {
    transform: rotate(270deg);
  }
}
</style>
