<script setup>
import { decode } from 'blurhash'
const containerRef = ref(null)
const canvasRef = ref(null)
const imageRef = ref(null)
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  variant: {
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
      imageRef.value.style.height = dimensions.value[1] + 'px'
      imageRef.value.onload = mediaLoaded
      imageRef.value.onerror = console.error
      console.log(props)
      imageRef.value.src = cdn.uri + props.variant
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
<template>
  <div ref="containerRef" class="container mx-auto my-1 rounded-md">
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
  z-index: 1;
}

.image {
  z-index: 2;
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
