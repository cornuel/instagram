import { usePostStore, useCreatePostStore } from '@/stores'
import type { IPost, IPaginatedPosts } from '@/types'
import instance from '@/libs/axios/instance'

export const usePost = () => {
  const setPost = async () => {
    try {
      const { medias, name, caption, tags, cropperSize } = useCreatePostStore();

      const formData = new FormData();
      formData.append('title', name);
      formData.append('body', caption);
      for (const tag of tags) {
        formData.append('tags', tag);
      }

      console.log(medias)
      // console.log(medias[0])
      // console.log(medias[0].canvas)
      // Convert the canvas to a Blob and append it to the FormData
      for (let i = 0; i < medias.length; i++) {
        const blob = await new Promise<Blob>((resolve) => {
          medias[i].canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png'); // You can choose the format and quality (e.g., 'image/png')
        });
        formData.append('uploaded_images', blob, 'image.png');
      }

      const response = await instance.post<IPost>('posts/', formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data' // This header is set automatically by axios when you use FormData
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getPost = async (postSlug: string) => {
    try {
      const response = await instance.get<IPost>(`posts/${postSlug}/`)
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const deletePost = async (postSlug: string) => {
    try {
      const response = await instance.delete<IPost>(`posts/${postSlug}/`)
      return response.status === 204
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getUserPosts = async (userId: string, page: number = 1) => {
    try {
      const response = await instance.get<IPaginatedPosts>(`profiles/${userId}/posts/`, {
        params: { page }
      });
      return response.data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // const getOtherUserPosts = async (userId: string, postId: string) => {
  // todo
  // }

  return {
    setPost,
    getPost,
    deletePost,
    getUserPosts,
    // getOtherUserPosts,
  }
}
