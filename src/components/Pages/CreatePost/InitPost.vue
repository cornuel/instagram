<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import MediafileIcon from '@icons/mediafile.svg'
import ExclamationIcon from '@icons/exclamation.svg'

import { ref } from 'vue'
import { useCreatePostStore } from '@/stores'

const isError = ref(false)
const fileErrorName = ref('')

const getInputFiles = (event: Event) => {
  const { uploadMedias, setTitle } = useCreatePostStore()

  isError.value = false
  const files = (event.target as HTMLInputElement).files

  if (files) {
    const fileArr = Array.from(files!)
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File should be more than 5 KB')
        break
      } else if (fileArr[index].size > 1024 * 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File should be less than 5 MB')
        break
      }
    }
    if (!isError.value) uploadMedias(files)
  }
}

const handleDragOver = (event: Event) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  const { uploadMedias, setTitle } = useCreatePostStore()

  event.preventDefault()
  isError.value = false
  const files = event.dataTransfer?.files

  if (files) {
    const fileArr = Array.from(files!)
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File should be more than 5 KB')
        break
      } else if (fileArr[index].size > 1024 * 1024 * 5) {
        isError.value = true
        fileErrorName.value = fileArr[index].name
        setTitle('File should be less than 5 MB')
        break
      }
    }
    if (!isError.value) uploadMedias(files)
  }
}
</script>

<template>
  <div
    class="w-[400px] h-[400px] items-center"
    @dragover="handleDragOver($event)"
    @drop="handleDrop($event)"
  >
    <form
      method="post"
      class="w-full h-full flex flex-col flex-center"
      enctype="multipart/form-data"
    >
      <MediafileIcon
        v-if="!isError"
        class="text-textColor-primary fill-textColor-primary"
      />
      <ExclamationIcon
        v-else
        class="text-textColor-primary fill-textColor-primary"
      />
      <span class="text-xl mt-[10px]">Drag photos and videos here</span>
      <span
        v-if="isError"
        class="text-sm text-textColor-secondary text-center mt-1"
      >
        <span class="font-semibold">{{ fileErrorName }}</span>
        Should be more than 5 KB.
      </span>
      <UiButton
        primary
        class="mt-5"
      >
        <span>Select from computer</span>
        <input
          ref="inputFiles"
          accept="image/*, video/*"
          type="file"
          class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          multiple
          @change="getInputFiles($event)"
        />
      </UiButton>
    </form>
  </div>
</template>
