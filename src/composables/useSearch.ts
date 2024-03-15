import type { IPaginatedSearchResults, IPaginatedProfiles } from '@/types'
import instance from '@/libs/axios/instance'


export const useSearch = () => {

  const fetchPostsByQuery = async (query: string, page: number): Promise<IPaginatedSearchResults | null> => {
    try {
      const response = await instance.get(`search/`,
        {
          params: { query: query, type: 'posts', page: page }
        })
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const fetchPostsByTagQuery = async (query: string, page: number): Promise<IPaginatedSearchResults | null> => {
    try {
      const response = await instance.get(`search/`,
        {
          params: { query: query, type: 'tag', page: page }
        })
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const fetchProfilesByQuery = async (query: string, page: number): Promise<IPaginatedSearchResults | null> => {
    try {
      const response = await instance.get(`search/`,
        {
          params: { query: query, type: 'profile', page: page }
        })
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }


  return {
    fetchPostsByQuery,
    fetchPostsByTagQuery,
    fetchProfilesByQuery
  }
}
