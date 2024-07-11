import { defineStore } from 'pinia'

interface IState {
  selectedLayout: 'detailed' | 'medium' | 'mosaic',
  feedLayout: 'single' | 'double'
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
        | 'mosaic') || 'medium',
    feedLayout: (localStorage.getItem('feedLayout') as
      | 'single'
      | 'double') || 'single'
  }),
  actions: {
    setPostLayout(mode: 'detailed' | 'medium' | 'mosaic') {
      this.selectedLayout = mode
      localStorage.setItem('selectedLayout', mode)
    },
    setFeedLayout(mode: 'single' | 'double') {
      this.feedLayout = mode
      localStorage.setItem('feedLayout', mode)
    },
    getFeedLayout() {
      return this.feedLayout
    }
  },
  getters: {
    getLayoutClass(): string {
      return layoutDict[this.selectedLayout];
    }
  }
})
