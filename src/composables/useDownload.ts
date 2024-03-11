import type { IPost } from '@/types'
import instance from '@/libs/axios/instance'


export const useDownload = () => {
  const downloadImages = async (post: IPost) => {
    try {
      const response = await instance.get(`posts/${post.slug}/download/`, {
        responseType: 'blob'
      })

      const fileName = response.headers['content-disposition']?.match(/filename="(.*)"/)?.[1]

      if (response.headers['content-type'] === 'application/zip') {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName || `${post.slug}.zip`)
        document.body.appendChild(link)
        link.click()
      } else {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName || `${post.slug}.png`)
        document.body.appendChild(link)
        link.click()
      }

      return true
    } catch (error) {
      console.log(error)
      return null
    }
  }


  return {
    downloadImages
  }
}
