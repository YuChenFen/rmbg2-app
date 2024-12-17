<template>
  <div class="container">
    <div class="one-image" style="user-select: none">
      <div class="item">
        <input id="file" type="file" style="display: none" @change="onFileChange" />
        <label for="file" class="wh" style="cursor: pointer"></label>
        <ImgComponents :src="imgUrl">
          <div>点击上传</div>
          <div>或拖动文件到此处</div>
        </ImgComponents>
      </div>
      <div ref="rmbgRef" class="item">
        <ImgComponents
          :style="`clip-path: polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%);`"
          :src="imgUrl"
        >
          <div>未上传文件</div>
        </ImgComponents>
        <input
          id="slider"
          v-model="sliderValue"
          type="range"
          min="1"
          max="100"
          class="slider"
          name="slider"
        />
        <ImgComponents
          :style="`clip-path: polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0% 100%);`"
          :src="rmbgImgUrl"
          :img-style="{
            backgroundColor: rmbgColor
          }"
        >
          <div>未上传文件</div>
        </ImgComponents>
      </div>
    </div>
    <div class="info">
      <input
        v-model="imageSize"
        type="number"
        placeholder="修改图像尺寸"
        @change="changeImageSize"
      />
      <input v-model="rmbgColor" type="color" name="color" />
      <button style="user-select: none" @click="fullscreen">全屏</button>
      <button style="user-select: none" @click="save">保存</button>
      <div style="user-select: none">状态：{{ state }}</div>
      <Log />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Log from './Log.vue'
import ImgComponents from './ImgComponents.vue'

const rmbgRef = ref(null)
const imgUrl = ref('')
const rmbgImgUrl = ref('')
const sliderValue = ref(50)
const rmbgColor = ref('#ffffff')
const imageSize = ref(1024)
const state = ref('未开始')
let rmbgImgFile = null

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      imgUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
  state.value = '处理中...'
  const form = new FormData()
  form.append('image_data', file)
  fetch('http://localhost:12088/rmbg', {
    method: 'POST',
    body: form
  })
    .then((res) => {
      return res.blob()
    })
    .then((blob) => {
      rmbgImgFile = blob
      const url = URL.createObjectURL(blob)
      rmbgImgUrl.value = url
      state.value = '处理完成'
    })
    .catch(() => {
      state.value = '处理失败'
    })
}

async function save() {
  const fileHandle = await window.showSaveFilePicker({
    types: [
      {
        description: '图片',
        accept: {
          'image/png': ['.png']
        }
      }
    ]
  })
  const writable = await fileHandle.createWritable()
  await writable.write(rmbgImgFile)
  await writable.close()
}

function changeImageSize() {
  fetch('http://localhost:12088/resize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      width: imageSize.value,
      height: imageSize.value
    })
  })
}

function fullscreen() {
  rmbgRef.value.requestFullscreen()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
}
.info {
  flex: 0 0 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  white-space: nowrap;

  input[type='number'] {
    width: 110px;
    padding: 0 5px;
    height: 26px;
  }

  button {
    height: 26px;
    padding: 0 10px;
    cursor: pointer;
  }
}
.one-image {
  flex: 1;
  display: flex;
  gap: 10px;
  height: 100%;
  padding: 10px 0;
}

.wh {
  width: 100%;
  height: 100%;
  display: block;
}
#slider {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: rgba(242, 242, 241, 0);
  outline: none;
  margin: 0;
  transition: all 0.2s;
  overflow: hidden;
}
.slider:hover {
  background: rgba(242, 242, 241, 0.1);
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 8px;
  height: 9999px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  background: #ffffff;
  cursor: e-resize;
}

.item {
  flex: 1;
  height: 100%;
  border: 1px dashed #535353;
  position: relative;
}
</style>
