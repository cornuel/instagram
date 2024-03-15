import type { IProfile } from '@/types'
import { useProfileStore } from '@/stores'
import instance from '@/libs/axios/instance'


export const useProfile = () => {
  const profileStore = useProfileStore()

  const getProfile = async (userSlug: string): Promise<IProfile | null> => {
    try {
      const response = await instance.get(`profiles/${userSlug}/`)
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const updateProfile = async (userSlug: string, bio: string, fullName: string): Promise<IProfile | null> => {
    try {
      const response = await instance.put(`profiles/${userSlug}/`, { bio: bio, full_name: fullName })
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getViewedProfile = async (userSlug: string): Promise<IProfile | null> => {
    const profile = await getProfile(userSlug)

    if (profile) {
      profileStore.setViewedProfile(profile)
    }

    return profile
  }


  const getAuthenticatedProfile = async (): Promise<IProfile | null> => {
    const username = profileStore.getAuthenticatedUsername()

    try {
      const response = await instance.get(
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
    getProfile,
    updateProfile,
    getViewedProfile,
    getAuthenticatedProfile,
  }
}
