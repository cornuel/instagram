import type { ITag } from '@/types'
import instance from '@/libs/axios/instance'


export const useTag = () => {

  const getTag = async (tag: string): Promise<ITag | null> => {
    try {
      const response = await instance.get(`tags/${tag}/`)
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return {
    getTag
  }
}
