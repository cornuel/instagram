import { defineStore } from 'pinia'
import { findIndex } from 'lodash';
import type { IComment, IPaginatedComments, IProfile } from '@/types'

interface IState {
  comment: string
  comments: Nullable<IPaginatedComments>
  commentRef: Nullable<HTMLInputElement>
  replyTo: Nullable<number>
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
      if (this.commentRef) {
        this.commentRef.focus()
      }
    },
    setComments(comments: IPaginatedComments) {
      this.comments = comments
    },
    addComment(comment: IComment) {
      if (this.comments?.results) {
        this.comments.results.push(comment)
      }
    },
    addReply(comment: IComment, parent: number) {
      if (this.comments?.results) {
        const index = findIndex(
          this.comments.results,
          (comment: IComment) => comment.id == parent
        )
        if (index >= 0) {
          this.comments.results[index].replies_count++
        }
      }
    },
    increaseReplyCount(commentId: number) {
      //todo
    },
    decreaseReplyCount(commentId: number) {
      //todo
    },
    increaseLikeCount(commentId: number) {
      if (this.comments && this.comments.results) {
        const index = findIndex(
          this.comments.results,
          (comment: IComment) => comment.id == commentId
        )
        if (index >= 0) {
          this.comments.results[index].like_count += 1
        }
      }
    },
    decreaseLikeCount(commentId: number) {
      if (this.comments && this.comments.results) {
        const index = findIndex(
          this.comments.results,
          (comment: IComment) => comment.id == commentId
        )
        if (index >= 0) {
          this.comments.results[index].like_count -= 1
        }
      }
    },
    deleteComment(commentId: number) {
      if (this.comments && this.comments.results) {
        const index = this.comments.results.findIndex(
          (comment: IComment) => comment.id === commentId
        )
        if (index !== -1) {
          this.comments.results.splice(index, 1)
        }
      }
    },
    setReply(replyTo: number, replyUsername: string) {
      this.replyTo = replyTo
      this.comment = `@${replyUsername} `
      if (this.commentRef) {
        this.commentRef.focus()
      }
    },
    resetReplyTo() {
      this.replyTo = null
    }
  }
})



