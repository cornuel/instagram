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
    'rounded-full transition ease-in-out delay-50 duration-100',
    'border border-borderColor hover:bg-gradient-to-r from-[#c128be] via-[#ea3469] to-[#ee8131]',
    'hover:cursor-pointer hover:text-white hover:border-[#c128be]',
    'hover:shadow-sm'
  ]
})
</script>

<template>
  <div
    class="select-none flex items-center whitespace-normal"
    :class="[classes, classProps]"
  >
    <slot />
  </div>
</template>
