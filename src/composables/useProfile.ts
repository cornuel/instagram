import type { IProfile } from '@/types'
import { useProfileStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { instance, axiosAPI } from '@/libs'


export const useProfile = () => {
  const profileStore = useProfileStore()
  const { handleApiError } = axiosAPI()

  const getProfile = async (
    userSlug: string
  ): Promise<IProfile | null> => {
    try {
      const response = await instance.get(
        `profiles/${userSlug}/`
      )
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  const updateProfile = async (
    userSlug: string,
    bio: string,
    fullName: string,
    profilePic?: File
  ): Promise<IProfile | null> => {
    const formData = new FormData()
    formData.append('bio', bio)
    formData.append('full_name', fullName)
    if (profilePic) {
      formData.append('profile_pic', profilePic)
    }

    try {
      const response = await instance.put(
        `profiles/${userSlug}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }


  const deleteProfilePic = async (
    userSlug: string
  ): Promise<boolean | null> => {
    try {
      const response = await instance.delete(
        `profiles/${userSlug}/delete_profile_pic/`
      )
      return response.status === 200
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  const getViewedProfile = async (
    userSlug: string
  ): Promise<IProfile | null> => {
    const profile = await getProfile(userSlug)
    const { authenticatedProfile } = storeToRefs(profileStore)

    if (profile) {
      profileStore.setViewedProfile(profile)
    }
    if (profile?.full_name === authenticatedProfile.value?.full_name) {
      profileStore.setAuthenticatedProfile(profile)
    }
    return profile
  }

  const getAuthenticatedProfile = async (): Promise<IProfile | null> => {
    const username =
      profileStore.getAuthenticatedUsername()
    try {
      const response = await instance.get(
        `profiles/${username}/`
      )

      profileStore.setAuthenticatedProfile(response.data)

      return response.data as IProfile
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  return {
    getProfile,
    updateProfile,
    deleteProfilePic,
    getViewedProfile,
    getAuthenticatedProfile
  }
}
