<template>
  <div
    ref="imageComparisonRef"
    class="image-comparison"
    style="width: 100%; height: 100%; z-index: 1"
    v-bind="attrs"
    @mousemove="changeValue"
    @fullscreenchange="fullscreenChange"
  >
    <IButtom style="padding: 5px" class="fullscreen" @click="fullscreen">
      <svg
        v-if="!isFullscreen"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M885.12 901.162667a21.333333 21.333333 0 0 1-21.333333-21.333334V651.370667a21.333333 21.333333 0 1 1 42.666666 0v228.458666a21.333333 21.333333 0 0 1-21.333333 21.333334z"
        ></path>
        <path
          d="M885.12 901.162667H656.682667a21.333333 21.333333 0 1 1 0-42.666667H885.12a21.333333 21.333333 0 1 1 0 42.666667z"
        ></path>
        <path
          d="M871.381333 887.424a21.269333 21.269333 0 0 1-15.082666-6.250667L578.730667 603.541333a21.312 21.312 0 1 1 30.165333-30.165333l277.568 277.632a21.312 21.312 0 0 1-15.082667 36.416z"
        ></path>
        <path
          d="M367.338667 165.504H138.88a21.333333 21.333333 0 1 1 0-42.666667h228.458667a21.333333 21.333333 0 1 1 0 42.666667z"
        ></path>
        <path
          d="M138.88 393.92a21.333333 21.333333 0 0 1-21.333333-21.333333V144.170667a21.333333 21.333333 0 1 1 42.666666 0v228.416a21.333333 21.333333 0 0 1-21.333333 21.333333z"
        ></path>
        <path
          d="M430.250667 456.789333a21.269333 21.269333 0 0 1-15.082667-6.250666L137.536 172.949333a21.312 21.312 0 1 1 30.165333-30.165333l277.632 277.589333a21.312 21.312 0 0 1-15.082666 36.416z"
        ></path>
      </svg>
      <svg v-else viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M597.333333 395.861333V192a21.333333 21.333333 0 0 0-42.666666 0v256a21.333333 21.333333 0 0 0 21.333333 21.333333h256a21.333333 21.333333 0 0 0 0-42.666666h-205.12L890.24 163.306667a21.333333 21.333333 0 0 0-30.165333-30.165334L597.333333 395.861333z m-170.666666 232.277334V832a21.333333 21.333333 0 0 0 42.666666 0V576a21.333333 21.333333 0 0 0-21.333333-21.333333H192a21.333333 21.333333 0 0 0 0 42.666666h205.12L133.76 860.693333a21.333333 21.333333 0 0 0 30.165333 30.165334L426.666667 628.138667z"
        ></path>
      </svg>
    </IButtom>
    <div class="wh user-select" style="position: relative">
      <img
        :src="image1"
        :style="`clip-path: polygon(${value}% 0, 100% 0, 100% 100%, ${value}% 100%);`"
      />
      <img
        :src="image2"
        :style="`clip-path: polygon(0 0, ${value}% 0, ${value}% 100%, 0% 100%);`"
      />
      <div
        class="line-wrap"
        :style="{ left: `${value}%` }"
        @mousedown="isChangeValue = true"
        @mouseup="isChangeValue = false"
      >
        <div class="line"></div>
        <div class="slider"></div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useAttrs } from 'vue'
import IButtom from '../components/IButtom.vue'

defineProps({
  image1: {
    type: String,
    required: true
  },
  image2: {
    type: String,
    required: true
  }
})

const attrs = useAttrs()
const value = ref(50)
const imageComparisonRef = ref()
const isFullscreen = ref(false)
let isChangeValue = false

function fullscreenChange() {
  isFullscreen.value = document.fullscreenElement !== null
}
function changeValue(e) {
  if (isChangeValue) {
    value.value =
      (Math.min(
        Math.max(0, e.clientX - imageComparisonRef.value.getBoundingClientRect().left),
        imageComparisonRef.value.getBoundingClientRect().width
      ) /
        imageComparisonRef.value.getBoundingClientRect().width) *
      100
  }
}

function fullscreen() {
  if (document.fullscreenElement === null) {
    imageComparisonRef.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.line-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: ew-resize;

  .slider {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: #fff 2px solid;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: ew-resize;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);

    &::before,
    &::after {
      content: '';
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-right: 10px solid;
      border-bottom: 8px solid transparent;
      display: block;
    }

    &::after {
      transform: rotate(180deg);
    }
  }

  .line {
    width: 2px;
    height: calc(50% - 20px);
    background: #fff;
    cursor: ew-resize;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  }
}

.fullscreen {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
  display: none;

  svg {
    width: 15px;
    height: 15px;
    fill: #fff;
  }
}

.image-comparison:hover > .fullscreen {
  display: flex;
}
</style>
