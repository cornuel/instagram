import { defineStore } from 'pinia'
import type { ITag } from '@/types'

interface IState {
  currentTag: Nullable<ITag>
}

export const useTagStore = defineStore('tag', {
  state: (): IState => ({
    currentTag: null
  }),
  actions: {
    getCurrentTag() {
      return this.currentTag
    },
    setCurrentTag(tag: Nullable<ITag>) {
      this.currentTag = tag
    }
  }
})
