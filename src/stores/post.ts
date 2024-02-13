import type { IPost, IPaginatedPosts, IProfile } from '@/types'
import { defineStore } from 'pinia'

interface IState {
  post: Nullable<IPost>
  userPosts: Nullable<IPaginatedPosts>
  likedListModal: boolean
  isLoadingLikedList: boolean
  likedList: Nullable<IProfile[]>
}

export const usePostStore = defineStore('post', {
  state: (): IState => ({
    post: null,
    userPosts: null,
    likedListModal: false,
    isLoadingLikedList: false,
    likedList: null
  }),
  actions: {
    setPost(post: Nullable<IPost>) {
      this.post = post
    },
    increaseCommentCount() {
      this.post!.comment_count += 1
    },
    decreaseCommentCount() {
      this.post!.comment_count -= 1
    },
    increaseLikeCount() {
      this.post!.like_count += 1
    },
    decreaseLikeCount() {
      this.post!.like_count -= 1
    },
    getPosts(): Nullable<IPaginatedPosts> {
      return this.userPosts
    },
    setPosts(posts: Nullable<IPaginatedPosts>) {
      this.userPosts = posts
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
