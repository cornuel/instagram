import { type IPaginated } from './common'

export interface IImages {
  id: number
  image: string
  thumbnail: string
}

export interface IPost {
  id: number
  slug: string
  profile: string
  title: string
  images: IImages[]
  body: string
  tags?: string[]
  created?: string
  updated?: string
  is_liked?: boolean
  is_favorited?: boolean
  like_count: number
  view_count: number
  comment_count: number
  is_featured?: boolean
  url: string
  is_private?: boolean
}

export interface IPaginatedPosts extends IPaginated {
  results?: IPost[] | null
}