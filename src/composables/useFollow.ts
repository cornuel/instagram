import type { IPaginatedProfiles } from '@/types'
import { instance, axiosAPI } from '@/libs'

export const useFollow = () => {
  const { handleApiError } = axiosAPI()

  const isFollowing = async (userSlug: string) => {
    try {
      const response = await instance.get(`
        profiles/${userSlug}/isFollowing/`
      )

      return response.data.is_following
    }
    catch (error) {
      handleApiError(error)
      return null;
    }
  }

  const setFollow = async (userSlug: string) => {
    try {
      const response = await instance.post(
        `profiles/${userSlug}/follow/`
      )

      return response.data.message
    }
    catch (error) {
      handleApiError(error)
      return null;
    }
  }

  const getFollows = async (
    userSlug: string,
    followType: 'followers' | 'following',
    page: number = 1
  ) => {
    try {
      const response = await instance.get<IPaginatedProfiles>(`profiles/${userSlug}/${followType}/`, {
        params: { page }
      });
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  // const getMutualFollowers = async (userId: string) => {
  //   const { currentUser } = useUserStore()
  //   const users: IUser[] = []

  //   if (currentUser) {
  //     // Get currentUserFollowings
  //     const querySnap = await getDocs(
  //       query(collection(db, 'followers'), where('followerId', '==', currentUser.id))
  //     )

  //     // Check currentUserFollowings followings user
  //     const { getUser } = useUser()
  //     const promises = querySnap.docs.map(async (followDoc) => {
  //       const docSnap = await getDoc(
  //         doc(db, 'followers', `${followDoc.data().followingId}-${userId}`)
  //       )

  //       if (docSnap.exists()) {
  //         const user = await getUser(docSnap.data().followerId)
  //         users.push(user!)
  //       }
  //     })

  //     await Promise.all(promises)
  //   }
  //   return users
  // }

  return {
    isFollowing,
    setFollow,
    getFollows,
  }
}
