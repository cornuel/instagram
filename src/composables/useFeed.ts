import type { IPaginatedPosts } from '@/types'
import { instance, axiosAPI } from '@/libs'


export const useFeed = () => {
  const { handleApiError } = axiosAPI()

  const fetchFeed = async (
    page: number = 1
  ): Promise<IPaginatedPosts | null> => {
    try {
      const response = await instance.get<IPaginatedPosts>(
        `feed/`, {
        params: { page }
      }
      )
      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results,

      } as IPaginatedPosts
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  return {
    fetchFeed,
  }
}
