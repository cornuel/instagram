import { defineStore } from 'pinia'

interface IState {
  selectedLayout: 'detailed' | 'medium' | 'mosaic'
}

const layoutDict: Record<'detailed' | 'medium' | 'mosaic', string> = {
  detailed: 'w-1/2',
  medium: 'w-1/3',
  mosaic: 'w-1/6'
}

export const useLayoutStore = defineStore('layout', {
  state: (): IState => ({
    selectedLayout:
      (localStorage.getItem('selectedLayout') as
        | 'detailed'
        | 'medium'
        | 'mosaic') || 'medium'
  }),
  actions: {
    setPostLayout(mode: 'detailed' | 'medium' | 'mosaic') {
      this.selectedLayout = mode
      localStorage.setItem('selectedLayout', mode)
    },
  },
  getters: {
    getLayoutClass(): string {
      return layoutDict[this.selectedLayout];
    }
  }
})
