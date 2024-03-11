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

  const unlikePost = async (like: IPostLike) => {
    // likePost does both like/unlike

    // try {
    //   const { decreaseLikeCount } = usePostStore()

    //   decreaseLikeCount()
    //   await Promise.all([
    //     deleteDoc(doc(db, 'postLikes', like.id)),
    //     updateDoc(doc(db, 'posts', like.postId), {
    //       likeCount: increment(-1)
    //     })
    //   ])
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const getPostLike = async (postId: string) => {
    // already comes with the post data

    // try {
    //   const { currentUser } = storeToRefs(useUserStore())

    //   const querySnapshot = await getDocs(
    //     query(
    //       collection(db, 'postLikes'),
    //       where('postId', '==', postId),
    //       where('userId', '==', currentUser.value?.id)
    //     )
    //   )

    //   if (querySnapshot.empty) {
    //     return null
    //   } else {
    //     return {
    //       id: querySnapshot.docs[0].id,
    //       ...querySnapshot.docs[0].data()
    //     } as IPostLike
    //   }
    // } catch (error) {
    //   console.log(error)
    //   return null
    // }
  }

  const likeComment = async (commentId: number, isLiked: boolean) => {
    // isLiked ? useCommentStore().decreaseLikeCount(commentId) : useCommentStore().increaseLikeCount(commentId)
    // console.log(isLiked)

    const like_message = 'Comment liked successfully'
    try {
      const response = await instance.post(`comments/${commentId}/like/`)
      return response.data
    } catch (error) {
      isLiked ? useCommentStore().increaseLikeCount(commentId) : useCommentStore().decreaseLikeCount(commentId)
      console.log(error)
      return null
    }
  }

  const unlikeComment = async (like: ICommentLike) => {
    // same as likeComment

    // try {
    //   const { decreaseLikeCount } = useCommentStore()

    //   decreaseLikeCount(like.commentId)
    //   await Promise.all([
    //     deleteDoc(doc(db, 'commentLikes', like.id)),
    //     updateDoc(doc(db, 'comments', like.commentId), {
    //       likeCount: increment(-1)
    //     })
    //   ])
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const getCommentLike = async (commentId: string) => {
    // comes in with the comment data
  }

  // Reply Likes
  const likeReply = async (replyId: string) => {
    // same as likeComment

    // try {
    //   const { currentUser } = storeToRefs(useUserStore())

    //   const likeData = {
    //     replyId,
    //     userId: currentUser.value?.id,
    //     createdAt: Timestamp.fromDate(new Date())
    //   }

    //   let likeDoc
    //   await Promise.all([
    //     (likeDoc = addDoc(collection(db, 'replyLikes'), likeData)),
    //     updateDoc(doc(db, 'replies', replyId), {
    //       likeCount: increment(1)
    //     })
    //   ])

    //   likeDoc = await likeDoc
    //   return {
    //     ...likeData,
    //     id: likeDoc.id
    //   } as IReplyLike
    // } catch (error) {
    //   console.log(error)
    //   return null
    // }
  }

  const unlikeReply = async (like: IReplyLike) => {
    // same as likeComment

    // try {
    //   await Promise.all([
    //     deleteDoc(doc(db, 'replyLikes', like.id)),
    //     updateDoc(doc(db, 'replies', like.replyId), {
    //       likeCount: increment(-1)
    //     })
    //   ])
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const getReplyLike = async (replyId: string) => {
    // like count comes with comment data 

    // try {
    //   const { currentUser } = storeToRefs(useUserStore())

    //   const querySnapshot = await getDocs(
    //     query(
    //       collection(db, 'replyLikes'),
    //       where('replyId', '==', replyId),
    //       where('userId', '==', currentUser.value?.id)
    //     )
    //   )

    //   if (querySnapshot.empty) {
    //     return null
    //   } else {
    //     return {
    //       id: querySnapshot.docs[0].id,
    //       ...querySnapshot.docs[0].data()
    //     } as IReplyLike
    //   }
    // } catch (error) {
    //   console.log(error)
    //   return null
    // }
  }

  return {
    getLikedUsers,
    likePost,
    unlikePost,
    getPostLike,
    likeComment,
    unlikeComment,
    getCommentLike,
    likeReply,
    unlikeReply,
    getReplyLike,
  }
}
