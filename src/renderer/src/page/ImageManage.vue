<template>
  <div class="image-manage">
    <div class="manage item">
      <div style="display: flex; gap: 15px; flex-direction: column">
        <IButtom :disabled="!imgUrl" @click="clearFile">清空文件</IButtom>
        <IInputNumber v-if="isRunning == true" v-model:value="imageSize"></IInputNumber>
        <Log @running="isRunning = true"></Log>
      </div>
      <div style="display: flex; gap: 15px; flex-direction: column">
        <IButtom
          :disabled="currentImage >= ImageList.length - 1 || !isRunning || isProcessing"
          :loading="isProcessing || !isRunning"
          @click="runNext"
        >
          {{ isRunning ? (isProcessing ? '处理中' : '开始') : '加载模型中' }}
        </IButtom>
        <IButtom :disabled="!rmbgImgUrl" @click="save">保存</IButtom>
      </div>
    </div>
    <div class="content" style="display: flex; flex-direction: column; gap: 5px">
      <div class="wh item" style="position: relative">
        <input id="file" type="file" style="display: none" multiple @change="onFileChange" />
        <label
          for="file"
          class="wh"
          style="cursor: pointer; z-index: 1; position: relative"
        ></label>
        <div v-if="!imgUrl" class="tips">
          <svg
            style="width: 15%; height: 15%; fill: #aaaaaa"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M866.4576 102.4H157.5424C98.816 102.4 51.2 150.016 51.2 208.7424v567.1424c0 58.7264 47.616 106.3424 106.3424 106.3424h708.9152c58.7264 0 106.3424-47.616 106.3424-106.3424V208.7424C972.8 150.016 925.184 102.4 866.4576 102.4zM157.5424 173.312h708.9152c19.5584 0 35.4304 15.872 35.4304 35.4304v339.5584l-181.4528-181.4528-177.9712 182.8864-108.4416-108.4928-311.9104 320.4608v-552.96c0-19.5584 15.872-35.4304 35.4304-35.4304z m546.56 638.0032H172.4416l262.2976-269.3632 269.3632 269.3632z m197.7856-35.4304c0 19.5584-15.872 35.4304-35.4304 35.4304h-62.3616l-212.6848-212.6848 133.2736-130.4064 180.736 180.736-3.5328 126.9248zM263.8848 385.9456a70.912 70.912 0 1 1 0-141.7728 70.912 70.912 0 0 1 0 141.824z"
            ></path>
          </svg>
          <div>点击上传</div>
          <div>或拖动文件到此处</div>
        </div>
        <ImageComparison
          v-else
          style="position: absolute; top: 0; left: 0"
          :image1="imgUrl"
          :image2="rmbgImgUrl"
        >
        </ImageComparison>
      </div>
      <div class="item image-list-container">
        <div v-for="(item, index) in ImageList" :key="item" class="image-list-item">
          <IImage
            style="height: 100%"
            :src="item.src"
            :is-loading="item.isLoading"
            @click="clickImage(item)"
          ></IImage>
          <svg
            class="delete-icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10882"
            width="15"
            height="15"
            @click="deleteImage(index)"
          >
            <path
              d="M706.368 560h-384c-26.496 0-48-21.504-48-48s21.504-48 48-48h384c26.496 0 48 21.504 48 48s-21.504 48-48 48z"
            ></path>
            <path
              d="M512 1008c-273.472 0-496-222.528-496-496S238.528 16 512 16s496 222.528 496 496-222.528 496-496 496z m0-896c-220.544 0-400 179.456-400 400s179.456 400 400 400 400-179.456 400-400-179.456-400-400-400z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ImageComparison from './ImageComparison.vue'
import IButtom from '../components/IButtom.vue'
import IInputNumber from '../components/IInputNumber.vue'
import IImage from '../components/IImage.vue'
import Log from './Log.vue'

const ImageList = ref([])
let currentImage = ref(-1)

const imgUrl = ref('')
const rmbgImgUrl = ref('')
const imageSize = ref(1024)
const isRunning = ref(false)
const isProcessing = ref(false)
let file = null
let rmbgImgFile = null

watch(
  () => imageSize.value,
  () => {
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
)

function onFileChange(e) {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i]
    if (file) {
      const reader = new FileReader()
      reader.onload = function (e) {
        ImageList.value.push({
          file: file,
          src: e.target.result,
          isLoading: true
        })
      }
      reader.readAsDataURL(file)
    }
  }
}

function clearFile() {
  imgUrl.value = ''
  rmbgImgUrl.value = ''
  document.getElementById('file').value = ''
}

async function start(index) {
  isProcessing.value = true
  try {
    const form = new FormData()
    form.append('image_data', file)
    let res = await fetch('http://localhost:12088/rmbg', {
      method: 'POST',
      body: form
    })
    let blob = await res.blob()
    ImageList.value[index].rmbgImgFile = blob
    ImageList.value[index].rmbgImgUrl = URL.createObjectURL(blob)
    ImageList.value[index].isLoading = false
  } catch (e) {
    console.log('处理失败', e)
  }
  isProcessing.value = false
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

async function runNext() {
  if (currentImage.value < ImageList.value.length - 1) {
    currentImage.value++
    file = ImageList.value[currentImage.value].file
    await start(currentImage.value)
    runNext()
  }
}

function clickImage(item) {
  file = item.file
  rmbgImgFile = item.rmbgImgFile
  imgUrl.value = item.src
  rmbgImgUrl.value = item.rmbgImgUrl
}

function deleteImage(index) {
  ImageList.value.splice(index, 1)
  currentImage.value -= 1
}
</script>

<style scoped>
.image-manage {
  width: 100vw;
  height: 100%;
  display: flex;
  padding: 10px 20px;
  gap: 10px;

  .item {
    border-radius: 5px;
    background-color: #272e3f;
    border: #383f53 solid 1px;
  }

  .manage {
    flex: 0 0 250px;
    width: 250px;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: space-between;
  }

  .content {
    flex: 1;
    height: 100%;
    width: calc(100% - 250px);
  }
}

.wh {
  width: 100%;
  height: 100%;
  display: block;
}

.tips {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.image-list-container {
  height: 80px;
  padding: 5px 10px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .image-list-item {
    position: relative;
    height: 100%;
    border-radius: 5px;
    border: #383f53 solid 1px;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(149, 157, 165, 0.6);
      box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 2px 0px;
    }

    .delete-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      cursor: pointer;
      z-index: 10;
      fill: #c01a1a;
      display: none;
      cursor: pointer;

      &:hover {
        fill: #f62121;
      }
    }

    &:hover .delete-icon {
      display: block;
    }
  }
}
</style>
