<script setup>
import {decode} from 'blurhash'

const containerRef = ref(null)
const hexContainerRef = ref(null)
const canvasRef = ref(null)
const imageRef = ref(null)
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: false,
    default: 0
  },
  height: {
    type: Number,
    required: false,
    default: 0
  }
})

const dimensions = ref([props.width, props.height])

function mediaLoaded() {
  console.log("Media loaded")
  imageRef.value.classList.remove('imagePending')
  imageRef.value.classList.add('image')
  canvasRef.value.classList.add('imagePending');
  hexContainerRef.value.classList.add('imagePending')
}

useAsyncData(() => {
  dimensions.value = [props.width, props.height]
  if (containerRef.value !== null) {
    containerRef.value.style.width = dimensions.value[0] + 'px'
    containerRef.value.style.height = dimensions.value[1] + 'px'
  }
  if (canvasRef.value !== null) {
    canvasRef.value.style.width = dimensions.value[0] + 'px'
    canvasRef.value.style.height = dimensions.value[1] + 'px'
  }
  if (imageRef.value !== null) {
    imageRef.value.style.width = dimensions.value[0] + 'px'
    imageRef.value.style.height = dimensions.value[1] + 'px'
  }
}, {
  watch: [props],
  server: false
})

onMounted(async () => {
  try {
    const cdn = await (await fetcher('cdn/' + props.id)).json()
    const pixels = decode(cdn.blur, ...dimensions.value)
    if (canvasRef.value !== null) {
      const ctx = canvasRef.value.getContext('2d')
      if (ctx) {
        const imageData = ctx.createImageData(...dimensions.value)
        if (imageData) {
          imageData.data.set(pixels)
          ctx.putImageData(imageData, 0, 0, 0, 0, ...dimensions.value)
        }
      }
    }

    if (containerRef.value !== null) {
      containerRef.value.style.width = dimensions.value[0] + 'px'
      containerRef.value.style.height = dimensions.value[1] + 'px'
    }
    if (canvasRef.value !== null) {
      canvasRef.value.style.width = dimensions.value[0] + 'px'
      canvasRef.value.style.height = dimensions.value[1] + 'px'
    }
    if (imageRef.value !== null) {
      imageRef.value.style.width = dimensions.value[0] + 'px'
      imageRef.value.style.objectFit = "cover"
      imageRef.value.style.height = dimensions.value[1] + 'px'
      imageRef.value.onload = mediaLoaded
      imageRef.value.onerror = console.error
      imageRef.value.src = `https://cdn.thewandb.com/media/${props.id}.webp`
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
<template>
  <div ref="containerRef" class="container mx-auto my-1 rounded-md">
    <div ref="hexContainerRef" class="hexcontainer">
      <span class="hex greyhextop" />
      <span class="hex orangehex" />
      <span class="hex greyhexbottom" />
      <span class="hex centerhex" />
    </div>
    <canvas ref="canvasRef" class="canvas rounded-md" />
    <img ref="imageRef" class="imagePending rounded-md" loading="lazy">
  </div>
</template>
<style scoped>
.imagePending {
  opacity: 0;
}

.container {
  overflow: hidden;
  position: relative;
  height: inherit;
  width: inherit;
}

.canvas {
  z-index: 3;
}

.image {
  z-index: 4;
}

.canvas,
.image {
  position: absolute;
  top: 0;
  left: 0;
  animation: fadeIn 500ms ease-in-out;
  height: inherit;
  width: inherit;
}

.hexcontainer {
  width: 75px;
  height: 82px;
  margin: 10% auto;
  position: relative;
}

.hex {
  opacity: 0;
  display: flex;
  position: absolute;
  -webkit-clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
}

.greyhextop {
  background: #4e4c4f;
  top: 0;
  left: 0;
  z-index: 1;
  height: 40px;
  width: 40px;
  animation: loading infinite 3s ease-in-out;
}

.orangehex {
  background: #b92c25;
  top: 42px;
  left: 0;
  z-index: 1;
  height: 40px;
  width: 40px;
  animation: loading infinite 3s ease-in-out;
  animation-delay: 2s;
}

.greyhexbottom {
  background: #868686;
  top: 20.5px;
  left: 35px;
  z-index: 1;
  height: 40px;
  width: 40px;
  animation: loading infinite 3s ease-in-out;
  animation-delay: 1s;
}

.centerhex {
  background: #333333;
  /* background: pink; */
  /* border: 5px solid white; */
  top: 32.5px;
  left: 20.5px;
  z-index: 2;
  height: 20px;
  width: 20px;
  opacity: 1;
  transform: rotateX(20deg)
}

@keyframes loading {
  0% {
    opacity: 0;
  }

  35% {
    opacity: 1;
  }

  85% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    filter: blur(100px);
  }

  100% {
    opacity: 1;
    filter: blur(0px);
  }
}
</style>
