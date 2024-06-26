import { defineStore } from 'pinia'
import type { ISize, IMedia, IAdjust, IFilters } from '@/types'
import { getImage, drawInitCanvas } from '@/helpers'
import { DEFAULT_ADJUST, DEFAULT_FILTER } from './../constants/filter'

interface IState {
  tabs: string[]
  currentTab: string
  title: string
  medias: IMedia[]
  currentMedia: Nullable<IMedia>
  currentMediaIndex: number
  currentRatio: string
  containerSize: ISize
  cropperSize: ISize
  filter: IFilters
  name: string
  caption: string
  tags: string[]
}

const defaultMedia = {
  url: null,
  image: null,
  canvas: null,
  size: {
    width: 0,
    height: 0
  },
  translate: {
    x: 0,
    y: 0
  },
  scale: 1,
  filters: {
    background: '',
    filter: ''
  },
  adjust: DEFAULT_ADJUST,
  filterTemplate: {
    name: 'Normal',
    filter: DEFAULT_FILTER
  }
}

export const useCreatePostStore = defineStore('createPost', {
  state: (): IState => ({
    tabs: ['InitPost', 'EditorPost', 'FilterPost', 'CaptionPost', 'UploadPost'],
    currentTab: 'InitPost',
    title: 'Create new post',
    medias: [],
    currentMedia: null,
    currentMediaIndex: 0,
    currentRatio: '1:1',
    containerSize: {
      height: 0,
      width: 0
    },
    cropperSize: {
      height: 0,
      width: 0
    },
    filter: {} as IFilters,
    name: '',
    caption: '',
    tags: []
  }),
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setCurrentTab(tabName: string) {
      this.currentTab = tabName
    },
    setMedias(medias: IMedia[]) {
      this.medias = medias
    },
    addMedia(media: IMedia) {
      this.medias.push(media)
    },
    updateMedia1(payload: { index: number; newMedia: IMedia }) {
      const { index, newMedia } = payload
      if (index != -1) {
        this.medias.splice(index, 1, newMedia)
        this.currentMedia = newMedia
      }
    },
    updateMedia(payload: { index: number; data: IMedia }) {
      const { index, data } = payload
      if (index != -1) {
        Object.assign(this.medias[index], data)
        Object.assign(this.currentMedia!, data)
        // this.medias.splice(index, 1, newMedia)
        // this.currentMedia = newMedia
      }
    },
    deleteMedia(mediaIndex: number) {
      this.medias.splice(mediaIndex, 1)
      this.currentMedia = this.medias[0]
    },
    setCurrentMedia(currentMedia: IMedia) {
      this.currentMedia = currentMedia
      this.currentMediaIndex = this.medias.findIndex((media) => {
        return media.url == this.currentMedia?.url
      })
    },
    setCurrentRatio(currentRatio: string) {
      this.currentRatio = currentRatio
    },
    setContainerSize(containerSize: ISize) {
      this.containerSize = containerSize
    },
    setFilter(filter: IFilters) {
      this.filter = filter
    },
    setName(name: string) {
      this.name = name
    },
    setCaption(caption: string) {
      this.caption = caption
    },
    setTags(tags: string[]) {
      this.tags = tags
    },
    nextTab() {
      const tabs = this.tabs
      const currentTab = this.currentTab
      const currentIndex = tabs.indexOf(currentTab)
      if (currentIndex < tabs.length - 1) {
        this.currentTab = this.tabs[currentIndex + 1]
      }
    },
    prevTab() {
      const tabs = this.tabs
      const currentTab = this.currentTab
      const currentIndex = tabs.indexOf(currentTab)
      if (currentIndex > 0) {
        this.currentTab = this.tabs[currentIndex - 1]
      }
    },
    nextMedia() {
      if (this.currentMediaIndex < this.medias.length - 1) {
        this.currentMediaIndex += 1
        this.currentMedia = this.medias[this.currentMediaIndex]
      }
    },
    prevMedia() {
      if (this.currentMediaIndex > 0) {
        this.currentMediaIndex -= 1
        this.currentMedia = this.medias[this.currentMediaIndex]
      }
    },
    uploadMedias(files: FileList) {
      const medias: IMedia[] = []
      const promises = []

      for (const file of files) {
        const url = URL.createObjectURL(file)

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement('canvas')

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas: drawInitCanvas(canvas, img, this.containerSize, this.currentRatio),
            size: {
              width: img.width,
              height: img.height
            },
            filters: {
              background: '',
              filter: '',
              vignette: ''
            }
          }
          medias.push(media)
        })

        promises.push(promise)
      }

      console.log(medias)

      return Promise.all(promises).then(() => {
        this.medias = medias
        this.currentMedia = medias[0]
        this.nextTab()
      })
    },
    addMedias(files: FileList) {
      const promises = []

      for (const file of files) {
        const url = URL.createObjectURL(file)

        const promise = getImage(url).then((img) => {
          const canvas = document.createElement('canvas')

          const media = {
            ...defaultMedia,
            url,
            image: img,
            canvas: drawInitCanvas(canvas, img, this.containerSize, this.currentRatio),
            size: {
              width: img.width,
              height: img.height
            },
            filters: {
              background: '',
              filter: '',
              vignette: ''
            }

          }
          this.medias.push(media)
        })

        promises.push(promise)
      }

      return Promise.all(promises)
    },
    resetCreatePost() {
      this.currentTab = 'InitPost'
      this.title = 'Create new post'
      this.medias = []
      this.currentMedia = null
      this.currentRatio = '1:1'
      this.name = ''
      this.caption = ''
      this.tags = []
      this.filter = {} as IFilters
    }
  }
})
