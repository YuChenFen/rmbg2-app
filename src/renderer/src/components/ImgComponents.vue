<template>
  <div class="img-box wh">
    <img v-if="src" class="wh" :src="src" :style="imgStyle" />
    <div
      v-else
      class="wh"
      style="display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  imgStyle: Object
})
</script>

<style scoped>
.wh {
  width: 100%;
  height: 100%;
  display: block;
}

.img-box {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  z-index: -1;

  img {
    object-fit: contain;
  }
}
</style>
