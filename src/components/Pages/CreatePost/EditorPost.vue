<script lang="ts" setup>
import RatioIcon from '@icons/ratio.svg'
import ImageIcon from '@icons/image.svg'
import Ratio1x1 from '@icons/ratio1-1.svg'
import Ratio4x5 from '@icons/ratio4-5.svg'
import Ratio16x9 from '@icons/ratio16-9.svg'
import GlassPlusIcon from '@icons/glass-plus.svg'
import LayerIcon from '@icons/layer.svg'

import ListPost from './ListPost.vue'
import FilterPost from './FilterPost.vue'
import CaptionPost from './CaptionPost.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore, useResizeStore } from '@/stores'
import { getReviewImageSize, getRatioCrop } from '@/helpers'
import type { IMedia, IPoint, ISize } from '@/types'

const { isDesktop } = storeToRefs(useResizeStore())
const containerRef = ref<Nullable<HTMLDivElement>>(null)
const cropperRef = ref<Nullable<HTMLDivElement>>(null)
const imageRef = ref<Nullable<HTMLDivElement>>(null)
const scaleRef = ref<Nullable<HTMLInputElement>>(null)
const {
  medias,
  currentMedia,
  currentMediaIndex,
  currentRatio,
  currentTab,
  containerSize,
  cropperSize
} = storeToRefs(useCreatePostStore())
const scaleValue = ref(1)
const reviewImageSize = ref<ISize>({ width: 0, height: 0 })
const translatePosition = ref<IPoint>({ x: 0, y: 0 })
const mousePosition = ref<IPoint>({ x: 0, y: 0 })
const mouseDownPosition = ref<IPoint>({ x: 0, y: 0 })
const aspectRatioActive = ref(false)
const scaleImageActive = ref(false)
const listImageActive = ref(false)
const isDragging = ref(false)

const imgStyle = computed(() => {
  let cursorType
  if (currentTab.value == 'EditorPost') {
    cursorType = isDragging.value ? 'grabbing' : 'grab'
  } else if (currentTab.value == 'FilterPost') {
    cursorType = 'pointer'
  } else {
    cursorType = 'crosshair'
  }

  return {
    width: reviewImageSize.value.width + 'px',
    height: reviewImageSize.value.height + 'px',
    backgroundImage: `url(${currentMedia.value?.url})`,
    transform: `translate(calc(-50% + ${translatePosition.value.x}px), calc(-50% + ${translatePosition.value.y}px)) scale(${scaleValue.value})`,
    cursor: cursorType,
    '-webkit-filter': currentMedia.value?.filters?.filter,
    filter: currentMedia.value?.filters?.filter
  }
})

const imgCoverStyle = computed(() => ({
  background:
    currentMedia.value!.filters!.background +
    currentMedia.value!.filters!.vignette
}))

const handleChangeScale = () => {
  const { updateMedia } = useCreatePostStore()

  stick().then(() => {
    drawCanvas()

    const media = {
      ...currentMedia.value,
      scale: scaleValue.value
    }

    updateMedia({ index: currentMediaIndex.value, data: media as IMedia })
  })
}

const mouseDownImage = (event: MouseEvent) => {
  if (currentTab.value == 'EditorPost') {
    document.body.style.cursor = 'grabbing'
    isDragging.value = true
    scaleImageActive.value = false

    mousePosition.value.x = event.clientX
    mousePosition.value.y = event.clientY

    mouseDownPosition.value.x = translatePosition.value.x
    mouseDownPosition.value.y = translatePosition.value.y
  }
}
const mouseMoveImage = (event: MouseEvent) => {
  translatePosition.value.x =
    mouseDownPosition.value.x + (event.clientX - mousePosition.value.x) / 2
  translatePosition.value.y =
    mouseDownPosition.value.y + (event.clientY - mousePosition.value.y) / 2
}
const mouseUpImage = () => {
  const { updateMedia } = useCreatePostStore()
  document.body.style.cursor = 'auto'
  isDragging.value = false

  stick().then(() => {
    drawCanvas()
    const media = {
      ...currentMedia.value,
      translate: { ...translatePosition.value }
    }

    updateMedia({ index: currentMediaIndex.value, data: media as IMedia })
  })
}

const changeRatio = (ratio: string) => {
  currentRatio.value = ratio

  const size = currentMedia.value!.size
  const containerSizeValue = containerSize.value!
  const scaleValueValue = scaleValue.value

  let width = 0
  let height = 0

  switch (ratio) {
    case 'original':
      width = Math.min(
        containerSizeValue.width,
        (containerSizeValue.height * currentMedia.value!.size.width) /
          currentMedia.value!.size.height
      )
      height = Math.min(
        containerSizeValue.height,
        (containerSizeValue.width * currentMedia.value!.size.height) /
          currentMedia.value!.size.width
      )
      break
    case '1:1':
      width = Math.min(containerSizeValue.width, containerSizeValue.height)
      height = width
      break
    case '4:5':
      height = Math.min(
        containerSizeValue.height,
        size.height * scaleValueValue
      )
      width = Math.min(containerSizeValue.width, (height * 4) / 5)
      break
    case '16:9':
      width = Math.min(containerSizeValue.width, size.width * scaleValueValue)
      height = Math.min(containerSizeValue.height, (width * 9) / 16)
      break
  }

  cropperSize.value = { width, height }

  stick().then(() => {
    drawCanvas()
  })
}

const stick = () => {
  return new Promise<void>((resolve) => {
    reviewImageSize.value = {
      ...getReviewImageSize(currentMedia.value!.image, cropperSize.value)
    }

    if (cropperRef.value && imageRef.value) {
      setTimeout(() => {
        const cropper = cropperRef.value!.getBoundingClientRect()
        const image = imageRef.value!.getBoundingClientRect()

        if (cropper.left < image.left) {
          translatePosition.value.x += cropper.left - image.left
        }
        if (cropper.top < image.top) {
          translatePosition.value.y += cropper.top - image.top
        }
        if (cropper.right > image.right) {
          translatePosition.value.x += cropper.right - image.right
        }
        if (cropper.bottom > image.bottom) {
          translatePosition.value.y += cropper.bottom - image.bottom
        }

        resolve()
      }, 0)
    }
  })
}

const drawCanvasforAllMedia = () => {
  medias.value.forEach((media) => {
    drawCanvasforMedia(media)
  })
}

function cssRadialGradientToCanvasGradient(
  ctx: CanvasRenderingContext2D,
  cssString: string
) {
  const match = cssString.match(
    /circle (\d+)px at center, rgba\(\d+,\d+,\d+,\d+\) (\d+)px, rgba\(\d+,\d+,\d+,\d+\) (\d+)px/
  )
  if (!match) {
    throw new Error('Invalid CSS radial gradient string')
  }

  const vignetteSize = parseInt(match[2], 10)
  const vignetteBlur = parseInt(match[3], 10)

  const gradient = ctx.createRadialGradient(
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    vignetteSize,
    ctx.canvas.width / 2,
    ctx.canvas.height / 2,
    vignetteBlur
  )

  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)')

  return gradient
}

const drawCanvasforMedia = (media: IMedia) => {
  if (media) {
    const cropperRect = cropperRef.value!.getBoundingClientRect()
    const imageRect = imageRef.value!.getBoundingClientRect()

    const ratioCrop = getRatioCrop(
      media.image,
      cropperSize.value,
      scaleValue.value,
      currentRatio.value
    )

    media.canvas.width = cropperSize.value.width * ratioCrop
    media.canvas.height = cropperSize.value.height * ratioCrop

    const ctx = media.canvas.getContext('2d')
    if (ctx) {
      if (currentMedia.value) {
        ctx.clearRect(
          0,
          0,
          currentMedia.value.canvas.width,
          currentMedia.value.canvas.height
        )
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      ctx.translate(
        (imageRect.x - cropperRect.x) * ratioCrop,
        (imageRect.y - cropperRect.y) * ratioCrop
      )

      ctx.filter = media.filters!.filter
      ctx.drawImage(media.image, 0, 0)

      if (media.filters!.vignette) {
        const gradient = cssRadialGradientToCanvasGradient(
          ctx,
          media.filters!.vignette
        )
        ctx.fillStyle = gradient
        // ctx.fillStyle = 'radial-gradient(circle 12px at center, rgba(0,0,0,0) 12px, rgba(0,0,0,1) 788px)';
        ctx.fillRect(0, 0, media.canvas.width, media.canvas.height)
      }

      if (media.filters!.background) {
        ctx.fillStyle = media.filters!.background
        ctx.fillRect(0, 0, media.canvas.width, media.canvas.height)
      }
    }
  }
}

const drawCanvas = () => {
  if (currentMedia.value) {
    const cropperRect = cropperRef.value!.getBoundingClientRect()
    const imageRect = imageRef.value!.getBoundingClientRect()

    const ratioCrop = getRatioCrop(
      currentMedia.value.image,
      cropperSize.value,
      scaleValue.value,
      currentRatio.value
    )

    currentMedia.value.canvas.width = cropperSize.value.width * ratioCrop
    currentMedia.value.canvas.height = cropperSize.value.height * ratioCrop

    const ctx = currentMedia.value.canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(
        0,
        0,
        currentMedia.value.canvas.width,
        currentMedia.value.canvas.height
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      ctx.translate(
        (imageRect.x - cropperRect.x) * ratioCrop,
        (imageRect.y - cropperRect.y) * ratioCrop
      )

      ctx.filter = currentMedia.value.filters!.filter
      ctx.drawImage(currentMedia.value.image, 0, 0)

      if (currentMedia.value.filters!.vignette) {
        const gradient = cssRadialGradientToCanvasGradient(
          ctx,
          currentMedia.value.filters!.vignette
        )
        ctx.fillStyle = gradient
        // ctx.fillStyle = 'radial-gradient(circle 12px at center, rgba(0,0,0,0) 12px, rgba(0,0,0,1) 788px)';
        ctx.fillRect(
          0,
          0,
          currentMedia.value.canvas.width,
          currentMedia.value.canvas.height
        )
      }

      if (currentMedia.value.filters!.background) {
        ctx.fillStyle = currentMedia.value.filters!.background
        ctx.fillRect(
          0,
          0,
          currentMedia.value.canvas.width,
          currentMedia.value.canvas.height
        )
      }
    }
  }
}

const handlePrevMedia = () => {
  const { prevMedia } = useCreatePostStore()
  prevMedia()
}
const handleNextMedia = () => {
  const { nextMedia } = useCreatePostStore()
  nextMedia()
}

watch(
  () => currentMedia.value!.url,
  () => {
    scaleValue.value = currentMedia.value!.scale
    translatePosition.value = { ...currentMedia.value!.translate }

    stick()
  }
)

watch(isDragging, () => {
  if (isDragging.value) {
    document.addEventListener('mousemove', mouseMoveImage)
    document.addEventListener('mouseup', mouseUpImage)
  } else {
    document.removeEventListener('mousemove', mouseMoveImage)
    document.removeEventListener('mouseup', mouseUpImage)
  }
})

onMounted(() => {
  const { setContainerSize, setCurrentMedia } = useCreatePostStore()

  setContainerSize({
    width: containerRef.value!.offsetWidth,
    height: containerRef.value!.offsetHeight
  })
  changeRatio(currentRatio.value)

  // drawCanvas even if no filters
  stick()
  drawCanvasforAllMedia()

  setCurrentMedia(medias.value[0])
})
</script>

<template>
  <div
    :class="isDesktop ? 'flex nowrap' : 'flex-wrap'"
    class="min-h-[400px]"
  >
    <div
      class="relative max-w-[400px] max-h-[400px] h-full w-full select-none overflow-y-scoll"
    >
      <div
        ref="containerRef"
        class="w-full h-full flex flex-center bg-[#f5f5f5]"
      >
        <div
          ref="cropperRef"
          class="relative overflow-hidden"
          :style="{
            height: cropperSize.height + 'px',
            width: cropperSize.width + 'px'
          }"
        >
          <div
            ref="imageRef"
            :style="imgStyle"
            class="absolute top-1/2 left-1/2 bg-center bg-no-repeat bg-cover z-[1]"
            @mousedown="mouseDownImage"
          ></div>
          <div
            :style="imgCoverStyle"
            class="absolute top-0 right-0 w-full h-full pointer-events-none z-[1]"
          ></div>
        </div>
        <div>
          <div
            v-if="currentMediaIndex != 0"
            class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] left-2"
            @click="handlePrevMedia"
          >
            <fa
              :icon="['fas', 'chevron-left']"
              class="text-base text-white fill-white"
            />
          </div>
          <div
            v-if="currentMediaIndex != medias.length - 1"
            class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1acc] rounded-full flex flex-center p-2 transition-opacity duration-200 hover:opacity-60 cursor-pointer z-[1] right-2"
            @click="handleNextMedia"
          >
            <fa
              :icon="['fas', 'chevron-right']"
              class="text-base text-white fill-white"
            />
          </div>
        </div>
        <div
          v-if="medias.length > 1"
          class="absolute flex left-1/2 -translate-x-1/2 bottom-[30px] pointer-events-none z-[1]"
        >
          <div
            v-for="media in medias"
            :key="media.url"
            :class="[
              'w-[6px] h-[6px] bg-borderColor-dark has-[active]:bg-bgColor-primary dark:has-[active]:bg-buttonColor-primary rounded-full mx-[2px] transition-colors duration-200 ease-in-out',
              { active: media.url == currentMedia!.url }
            ]"
          ></div>
        </div>
        <div
          v-if="isDragging"
          class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] border border-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
        >
          <div
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] flex flex-wrap flex-col"
          >
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="w-[1px] h-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
          </div>
          <div
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-[1] flex flex-wrap flex-row"
          >
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
            <div
              class="h-[1px] w-full bg-[rgba(255,255,255,0.3)] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="currentTab == 'EditorPost'"
        class="absolute left-0 bottom-0 w-full select-none"
      >
        <div class="left">
          <div
            class="absolute left-0 bottom-0 flex flex-col"
            :class="{ active: aspectRatioActive }"
            v-click-outside.short="() => (aspectRatioActive = false)"
          >
            <transition name="fadeUp">
              <div
                class="ml-4 rounded-lg bg-overlay z-[1]"
                v-if="aspectRatioActive"
              >
                <div
                  class="original flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == 'original' }"
                  @click="changeRatio('original')"
                >
                  <span class="text-white font-semibold">Original</span>
                  <div class="p-3">
                    <ImageIcon class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-1-1 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '1:1' }"
                  @click="changeRatio('1:1')"
                >
                  <span class="text-white font-semibold">1:1</span>
                  <div class="p-3">
                    <Ratio1x1 class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-4-5 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '4:5' }"
                  @click="changeRatio('4:5')"
                >
                  <span class="text-white font-semibold">4:5</span>
                  <div class="p-3">
                    <Ratio4x5 class="text-white fill-white align-middle" />
                  </div>
                </div>
                <div class="w-full h-[1px] bg-separator" />
                <div
                  class="ratio-16-9 flex items-center pl-4 cursor-pointer opacity-60 has-[active]:opacity-100"
                  :class="{ active: currentRatio == '16:9' }"
                  @click="changeRatio('16:9')"
                >
                  <span class="text-white font-semibold">16:9</span>
                  <div class="p-3">
                    <Ratio16x9 class="text-white fill-white align-middle" />
                  </div>
                </div>
              </div>
            </transition>
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="aspectRatioActive = !aspectRatioActive"
            >
              <RatioIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
          <div
            class="scale flex flex-col absolute left-11 bottom-0"
            :class="{ active: scaleImageActive }"
            v-click-outside.short="() => (scaleImageActive = false)"
          >
            <transition name="fadeUp">
              <div
                class="flex items-center h-8 rounded-lg bg-overlay z-[1]"
                v-if="scaleImageActive"
              >
                <div class="flex h-full px-3 py-2 items-center">
                  <input
                    ref="scaleRef"
                    class="scale-input"
                    type="range"
                    min="1"
                    max="2"
                    step="0.01"
                    v-model="scaleValue"
                    @change="handleChangeScale"
                  />
                </div>
              </div>
            </transition>
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="scaleImageActive = !scaleImageActive"
            >
              <GlassPlusIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
        </div>
        <div class="right">
          <div
            class="flex flex-col absolute right-0 bottom-0 items-end"
            :class="{ active: listImageActive }"
            v-click-outside.short="
              () => {
                listImageActive = false
              }
            "
          >
            <!-- <transition name="fadeUp"> -->
            <div
              class="flex"
              v-if="listImageActive"
            >
              <ListPost />
            </div>
            <!-- </transition> -->
            <div
              class="w-8 h-8 p-2 m-4 bg-[#1a1a1acc] rounded-full transition-opacity duration-200 cursor-pointer hover:opacity-60 parent-[.active]:bg-white z-[1]"
              @click="listImageActive = !listImageActive"
            >
              <LayerIcon
                class="text-white fill-white parent-[.active]:text-black parent-[.active]:fill-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition :name="isDesktop ? 'slideRight' : 'slideDown'">
      <div
        v-if="['FilterPost', 'CaptionPost'].includes(currentTab)"
        class="border-l border-borderColor"
      >
        <FilterPost
          v-if="currentTab == 'FilterPost'"
          @drawCanvas="drawCanvas"
        />
        <CaptionPost v-if="currentTab == 'CaptionPost'" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scale-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
}

.scale-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}
.scale-input::-moz-range-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}
.scale-input::-ms-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  background: #fff !important;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
}

.scale-input::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
.scale-input::-moz-range-trackk {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
.scale-input::-ms-track {
  width: 100%;
  height: 1px;
  margin: 5px 0;
  cursor: pointer;
  color: transparent;
  background: #000;
}
</style>
