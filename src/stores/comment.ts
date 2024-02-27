import { defineStore } from 'pinia'
import { findIndex } from 'lodash'
import type { IComment, IPaginatedComments, IProfile } from '@/types'

interface IState {
  comment: string
  comments: Nullable<IPaginatedComments>
  commentRef: Nullable<HTMLInputElement>
  replyTo: Nullable<string>
  commentProfiles: Record<string, IProfile>
}

export const useCommentStore = defineStore('comment', {
  state: (): IState => ({
    comment: '', // Comment show in input
    comments: null,
    commentRef: null,
    replyTo: null,
    commentProfiles: {}
  }),
  actions: {
    setComment(comment: string) {
      this.comment = comment
      this.commentRef?.focus()
    },
    setComments(comments: IPaginatedComments) {
      this.comments = comments
    },
    addComment(comment: IComment) {
      this.comments?.results.push(comment)
    },
    increaseReplyCount(commentId: number) {
      // const index = findIndex(this.comments, (comment) => comment.id == commentId)
      // this.comments![index]. += 1
    },
    decreaseReplyCount(commentId: number) {
      // const index = findIndex(this.comments, (comment) => comment.id == commentId)
      // this.comments![index].replyCount -= 1
    },
    increaseLikeCount(commentId: number) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments!.results[index].like_count += 1
    },
    decreaseLikeCount(commentId: number) {
      const index = findIndex(this.comments, (comment) => comment.id == commentId)
      this.comments!.results[index].like_count -= 1
    },
    deleteComment(commentId: number) {
      const index = this.comments!.results.findIndex((comment) => comment.id === commentId)
      if (index !== -1) {
        this.comments!.results.splice(index, 1)
      }
    },
    setReply(replyTo: string, replyUsername: string) {
      this.replyTo = replyTo
      this.comment = `@${replyUsername} `
      this.commentRef?.focus()
    },
    resetReplyTo() {
      this.replyTo = null
    }
  }
})
