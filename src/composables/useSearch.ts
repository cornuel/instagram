import type { IPaginatedSearchResults, IPaginatedProfiles, IPaginatedPosts } from '@/types'
import { instance, axiosAPI } from '@/libs'


export const useSearch = () => {
  const { handleApiError } = axiosAPI()

  const fetchPostsByQuery = async (
    page: number,
    query: string,
  ): Promise<IPaginatedPosts | null> => {
    try {
      const response = await instance.get<IPaginatedSearchResults>(`search/`,
        {
          params: { query: query, type: 'posts', page: page }
        })
      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results.posts,
      } as IPaginatedPosts
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const fetchPostsByTagQuery = async (
    page: number,
    query: string
  ): Promise<IPaginatedPosts | null> => {
    try {
      const response = await instance.get<IPaginatedSearchResults>(`search/`,
        {
          params: { query: query, type: 'tag', page: page }
        })
      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results.posts,
      } as IPaginatedPosts
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const fetchProfilesByQuery = async (
    page: number,
    query: string
  ): Promise<IPaginatedProfiles | null> => {
    try {
      const response = await instance.get<IPaginatedSearchResults>(`search/`,
        {
          params: { query: query, type: 'profile', page: page }
        })
      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results.profiles,
      } as IPaginatedProfiles
    } catch (error) {
      handleApiError(error)
      return null
    }
  }


  return {
    fetchPostsByQuery,
    fetchPostsByTagQuery,
    fetchProfilesByQuery
  }
}
