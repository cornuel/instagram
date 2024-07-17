import { usePostStore, useCommentStore } from '@/stores'
import type { IPaginatedProfiles } from '@/types'
import { instance, axiosAPI } from '@/libs'

export const useLike = () => {
  const { handleApiError } = axiosAPI()

  const getLikedUsers = async (
    page: number = 1,
    findId: string | number,
    type: 'post' | 'comment'
  ) => {

    try {
      const response = await instance.get<IPaginatedProfiles>(`${type}s/${findId}/likes/`, {
        params: { page }
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }


  // Post Likes
  const likePost = async (
    postSlug: string,
    isLiked: boolean
  ) => {
    const { decreaseLikeCount, increaseLikeCount } = usePostStore()

    try {
      isLiked ? decreaseLikeCount() : increaseLikeCount()
      const like_message = 'Post liked successfully'

      const response = await instance.post(`posts/${postSlug}/like/`)
      return response.data.message === like_message
    } catch (error) {
      // Rollback optimistic update
      isLiked ? increaseLikeCount() : decreaseLikeCount()
      handleApiError(error)
      return null;
    }
  }

  const getPostLike = async (postId: string) => {
    // todo
  }

  const likeComment = async (
    commentId: number,
    isLiked: boolean
  ) => {
    const { decreaseLikeCount, increaseLikeCount } = useCommentStore()

    try {
      const response = await instance.post(`comments/${commentId}/like/`)
      return response.data
    } catch (error) {
      // Rollback optimistic update
      isLiked ? increaseLikeCount(commentId) : decreaseLikeCount(commentId)
      handleApiError(error)
      return null;
    }
  }

  const getCommentLike = async (commentId: string) => {
    // todo
  }

  return {
    getLikedUsers,
    likePost,
    getPostLike,
    likeComment,
    getCommentLike,
  }
}
