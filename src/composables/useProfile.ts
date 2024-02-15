import type { IProfile } from '@/types'
import { useProfileStore } from '@/stores'
import axios from 'axios'


export const useProfile = () => {
  const profileStore = useProfileStore()

  const getViewedProfile = async (userSlug: string) => {
    try {
      const response = await axios.get(
        `profiles/${userSlug}/`
      )

      profileStore.setViewedProfile(response.data)

      return response.data as IProfile
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getAuthenticatedProfile = async () => {
    const username = profileStore.getAuthenticatedUsername()

    try {
      const response = await axios.get(
        `profiles/${username}/`
      )

      profileStore.setAuthenticatedProfile(response.data)

      return response.data as IProfile
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return {
    getViewedProfile,
    getAuthenticatedProfile,
  }
}
