import { usePostStore, useCommentStore } from '@/stores'
import type { IComment, IPaginatedComments } from '@/types'
import axios from 'axios'

export const useComment = () => {
  const addCommentPost = async (postId: number, parent: number | null, body: string) => {
    // Optimistically update comment count on post
    usePostStore().increaseCommentCount()
    try {
      const response = await axios.post<IComment>('comments/', {
        post: postId,
        parent: parent,
        body: body
      })
      console.log(response.data)
      useCommentStore().addComment(response.data)
      // return response.data
    } catch (error) {
      console.log(error)
      // Rollback optimistic update
      usePostStore().decreaseCommentCount()
      return null
    }
  }

  const getCommentsPost = async (postSlug: string, page: number = 1) => {
    try {
      const response = await axios.get<IPaginatedComments>(`posts/${postSlug}/comments/`, { params: { page } });
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getReplies = async (postSlug: string, commentId: number, page: number = 1) => {
    try {
      const response = await axios.get<IPaginatedComments>(`posts/${postSlug}/comment/${commentId}/`, { params: { page } });
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const deleteCommentPost = async (commentId: number) => {
    try {
      await axios.delete<IComment>(`comments/${commentId}/`)
      useCommentStore().deleteComment(commentId)
      // should return 204 no content
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const addReply = async (reply: IComment) => {
    // same as addComment

    // try {
    //   const { increaseReplyCount, resetReplyTo } = useCommentStore()

    //   await Promise.all([
    //     addDoc(collection(db, 'replies'), {
    //       ...reply,
    //       createdAt: serverTimestamp()
    //     }),
    //     updateDoc(doc(db, 'comments', reply.commentId), {
    //       replyCount: increment(1)
    //     }),
    //     updateDoc(doc(db, 'posts', reply.postId), {
    //       commentCount: increment(1)
    //     })
    //   ])
    //   increaseReplyCount(reply.commentId)
    //   resetReplyTo()
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const deleteReply = async (commentId: string, replyId: string) => {
    // same as deleteComment

    // try {
    //   const { post } = usePostStore()
    //   const { decreaseReplyCount } = useCommentStore()

    //   decreaseReplyCount(commentId)
    //   await Promise.all([
    //     deleteDoc(doc(db, 'replies', replyId)),
    //     updateDoc(doc(db, 'comments', commentId), {
    //       replyCount: increment(-1)
    //     }),
    //     updateDoc(doc(db, 'posts', post!.id), {
    //       commentCount: increment(-1)
    //     })
    //   ])
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return {
    addCommentPost,
    getCommentsPost,
    deleteCommentPost,
    addReply,
    getReplies,
    deleteReply
  }
}
