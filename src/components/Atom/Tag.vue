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
    medium: 'text-sm px-1 m-0.5',
    large: 'text-base px-1 m-1 border-[1.5px]'
  }

  return [
    sizeClasses[props.size] || sizeClasses.medium,
    'rounded-full transition ease-in-out delay-80 duration-300',
    'border border-borderColor bg-bgColor-primary ',
    'hover:cursor-pointer',
    'hover:border-buttonColor-primary',
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
