<template>
  <div style="position: relative; user-select: none">
    <img :src="src" class="image" />
    <div v-if="isLoading" class="loading">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.image {
  width: auto;
  height: 100%;
  border-radius: 5px;
  object-fit: contain;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.loader {
  width: 64px;
  height: 64px;
  aspect-ratio: 1;
  position: relative;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transform: scale(0.6);
  opacity: 0.7;
}
.loader:before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  transform: rotate(45deg) translate(30%, 40%);
  background: #719eff;
  box-shadow: 32px -34px 0 5px #0055ff;
  animation: slide 2s infinite ease-in-out alternate;
}
.loader:after {
  content: '';
  position: absolute;
  left: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0051ff;
  transform: rotate(0deg);
  transform-origin: 35px 145px;
  animation: rotate 2s infinite ease-in-out;
}

@keyframes slide {
  0%,
  100% {
    bottom: -35px;
  }
  25%,
  75% {
    bottom: -2px;
  }
  20%,
  80% {
    bottom: 2px;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(-15deg);
  }
  25%,
  75% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(25deg);
  }
}
</style>
