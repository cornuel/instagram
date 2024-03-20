import { usePostStore, useCommentStore } from '@/stores'
import type { IPaginatedProfiles } from '@/types'
import instance from '@/libs/axios/instance'


export const useLike = () => {
  const getLikedUsers = async (findId: string | number, type: 'post' | 'comment') => {

    try {
      const response = await instance.get<IPaginatedProfiles>(`${type}s/${findId}/likes/`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  // try {
  //   const { currentUser } = useUserStore()
  //   const users: IUser[] = []

  //   // Get all user liked
  //   const querySnap = await getDocs(
  //     query(collection(db, `${type}Likes`), where(`${type}Id`, '==', findId))
  //   )

  //   // Check currentUserFollowings commentLikes user
  //   const { getUser } = useUser()
  //   let hasCurrentUser = false
  //   const promises = querySnap.docs.map(async (commentLikesDoc) => {
  //     const userId = commentLikesDoc.data().userId
  //     const user = await getUser(userId)

  //     if (userId != currentUser?.id) {
  //       const docSnap = await getDoc(doc(db, 'followers', `${currentUser?.id}-${userId}`))

  //       if (docSnap.exists()) {
  //         users.unshift({
  //           ...user,
  //           isCurrentUserFollowing: true
  //         } as IUser)
  //       } else {
  //         users.push({
  //           ...user,
  //           isCurrentUserFollowing: false
  //         } as IUser)
  //       }
  //     } else {
  //       hasCurrentUser = true
  //     }
  //   })

  //   await Promise.all(promises)

  //   if (hasCurrentUser) {
  //     users.unshift(currentUser!)
  //   }

  //   return users
  // } catch (error) {
  //   console.log(error)
  //   return null
  // }

  // Post Likes
  const likePost = async (postSlug: string, isLiked: boolean) => {
    isLiked ? usePostStore().decreaseLikeCount() : usePostStore().increaseLikeCount()

    const like_message = 'Post liked successfully'

    try {
      const response = await instance.post(`posts/${postSlug}/like/`)
      return response.data.message === like_message
    } catch (error) {
      isLiked ? usePostStore().increaseLikeCount() : usePostStore().decreaseLikeCount()
      console.log(error)
      return null
    }
  }


  const getPostLike = async (postId: string) => {
    // todo
  }

  const likeComment = async (commentId: number, isLiked: boolean) => {
    try {
      const response = await instance.post(`comments/${commentId}/like/`)
      return response.data
    } catch (error) {
      isLiked ? useCommentStore().increaseLikeCount(commentId) : useCommentStore().decreaseLikeCount(commentId)
      console.log(error)
      return null
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
