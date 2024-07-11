<script lang="ts" setup>
import { type PropType, computed } from 'vue'

const props = defineProps({
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
    validator: (value: string) => {
      return ['small', 'medium', 'large'].includes(value)
    }
  },
  classProps: {
    type: String as PropType<string[] | string>
  }
})

const classes = computed(() => {
  const sizeClasses = {
    small: 'text-xs px-1 m-0.5',
    medium: 'text-xs font-semibold px-1 m-0.5 border',
    large: 'text-base px-1 m-1 border-[1.5px]'
  }

  return [
    sizeClasses[props.size] || sizeClasses.medium,
    'rounded-full',
    'border border-borderColor',
    'hover:cursor-pointer'
  ]
})
</script>

<template>
  <div
    class="select-none relative flex items-center whitespace-normal px-0.5 py-1 group transition-all duration-75 ease-in-out hover:scale-105 hover:shadow-md"
    :class="[classes, classProps]"
  >
    <span
      class="transition-colors duration-75 ease-in-out group-hover:text-white px-1 z-10"
    >
      <slot />
    </span>
    <span
      class="rounded-full overflow-hidden opacity-0 w-0 h-0 absolute top-1/2 left-1/2 transition-all duration-75 ease-in-out bg-gradient-to-r from-[#c128be] via-[#ea3469] to-[#ee8131] group-hover:top-0 group-hover:left-0 group-hover:w-full group-hover:h-full group-hover:opacity-100 -z-1"
    ></span>
  </div>
</template>
