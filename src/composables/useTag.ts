import type { ITag } from '@/types'
import { instance, axiosAPI } from '@/libs'


export const useTag = () => {
  const { handleApiError } = axiosAPI()

  const getTag = async (tag: string): Promise<ITag | null> => {
    try {
      const response = await instance.get(`tags/${tag}/`)
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  return {
    getTag
  }
}
