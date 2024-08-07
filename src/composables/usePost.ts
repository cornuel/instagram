import { useCreatePostStore, usePostStore } from '@/stores'
import type { IPost, IPaginatedPosts } from '@/types'
import { instance, axiosAPI } from '@/libs'

export const usePost = () => {
  const { handleApiError } = axiosAPI()

  const setPost = async () => {
    try {
      const { medias, name, caption, tags } =
        useCreatePostStore()

      const formData = new FormData()
      formData.append('title', name)
      formData.append('body', caption)
      for (const tag of tags) {
        formData.append('tags', tag)
      }

      // Convert the canvas to a Blob and append it to the FormData
      for (let i = 0; i < medias.length; i++) {
        const blob = await new Promise<Blob | null>(
          (resolve) => {
            medias[i].canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob)
              } else {
                resolve(null)
              }
            }, 'image/png')
          }
        )
        if (blob) {
          formData.append(
            'uploaded_images',
            blob,
            'image.png'
          )
        }
      }

      const response = await instance.post<IPost>(
        'posts/',
        formData,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data' // This header is set automatically by axios when you use FormData
          }
        }
      )
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;;
    }
  }

  const getPost = async (postSlug: string) => {
    try {
      const response = await instance.get<IPost>(`posts/${postSlug}/`)
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;;
    }
  }

  const makePostFavorite = async (postSlug: string, isFavorited: boolean) => {
    const { removePostfromFavoritedPosts, addPosttoFavoritedPosts } = usePostStore()
    try {
      isFavorited ? removePostfromFavoritedPosts() : addPosttoFavoritedPosts()
      const response = await instance.post(`posts/${postSlug}/favorite/`)
      return response.data.message === 'Post added to favorites successfully'
    } catch (error) {
      // Rollback optimistic update
      isFavorited ? addPosttoFavoritedPosts() : removePostfromFavoritedPosts()
      handleApiError(error)
      return null;;
    }
  }

  const deletePost = async (postSlug: string) => {
    try {
      const response = await instance.delete<IPost>(`posts/${postSlug}/`)
      return response.status === 204
    } catch (error) {
      handleApiError(error)
      return null;;
    }
  }

  const getUserPosts = async (
    page: number = 1,
    userId: string,
  ): Promise<IPaginatedPosts | null> => {
    try {
      const response = await instance.get<IPaginatedPosts>(`profiles/${userId}/posts/`, {
        params: { page }
      });
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;;
    }
  }

  const getFavoritedPosts = async (page: number = 1) => {
    try {
      const response = await instance.get<IPaginatedPosts>(`posts/favorited/`, {
        params: { page }
      });
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;;
    }
  }

  // const getOtherUserPosts = async (userId: string, postId: string) => {
  // todo
  // }

  return {
    setPost,
    getPost,
    makePostFavorite,
    deletePost,
    getUserPosts,
    getFavoritedPosts,
  }
}
