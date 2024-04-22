import type { IPost, IPaginatedPosts, IProfile } from '@/types'
import { defineStore } from 'pinia'

interface IState {
  isInitial: boolean
  post: Nullable<IPost>
  userPosts: Nullable<IPaginatedPosts>
  showedPosts: Nullable<IPaginatedPosts>
  favoritedPosts: Nullable<IPaginatedPosts>
  likedListModal: boolean
  isLoadingLikedList: boolean
  likedList: Nullable<IProfile[]>
}

export const usePostStore = defineStore('post', {
  state: (): IState => ({
    isInitial: true,
    post: null,
    userPosts: null,
    showedPosts: null,
    favoritedPosts: null,
    likedListModal: false,
    isLoadingLikedList: false,
    likedList: null
  }),
  actions: {
    setPost(post: Nullable<IPost>) {
      this.post = post
    },
    addPosttoUserPosts(post: IPost) {
      if (this.userPosts?.results) {
        this.userPosts.results.unshift(post)
      }
    },
    removePostfromUserPosts(post: IPost) {
      if (this.userPosts?.results) {
        this.userPosts.results = this.userPosts.results.filter(
          (item: IPost) => item.id !== post.id
        )
      }
    },
    removePostfromShowedPosts(post: IPost) {
      if (this.showedPosts?.results) {
        this.showedPosts.results = this.showedPosts.results.filter(
          (item: IPost) => item.id !== post.id
        )
      }
    },
    increaseCommentCount() {
      this.post!.comment_count += 1
    },
    decreaseCommentCount() {
      this.post!.comment_count -= 1
    },
    increaseLikeCount() {
      this.post!.like_count += 1
      try {
        const index = this.showedPosts!.results!.findIndex(
          (post: IPost) => post.id === this.post!.id
        )
        this.showedPosts!.results![index].like_count += 1
      } catch {
        console.debug('post not found')
      }
    },
    decreaseLikeCount() {
      this.post!.like_count -= 1
      try {
        const index = this.showedPosts!.results!.findIndex(
          (post: IPost) => post.id === this.post!.id
        )
        this.showedPosts!.results![index].like_count -= 1
      } catch {
        console.debug('post not found')
      }
    },
    getPosts(): Nullable<IPaginatedPosts> {
      return this.userPosts
    },
    setPosts(posts: Nullable<IPaginatedPosts>) {
      this.userPosts = posts
    },
    getShowedPosts(): Nullable<IPaginatedPosts> {
      return this.showedPosts
    },
    setShowedPosts(posts: Nullable<IPaginatedPosts>) {
      this.showedPosts = posts
    },
    getFavoritedPosts(): Nullable<IPaginatedPosts> {
      return this.favoritedPosts
    },
    setFavoritedPosts(posts: Nullable<IPaginatedPosts>) {
      this.favoritedPosts = posts
    },
    setLikedListModal(value: boolean) {
      this.likedListModal = value
    },
    setLikedList(value: Nullable<IProfile[]>) {
      this.likedList = value
    },
    setIsLoadingLikedList(value: boolean) {
      this.isLoadingLikedList = value
    }
  }
})
