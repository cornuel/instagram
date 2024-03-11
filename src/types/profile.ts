export interface IProfile {
  id: number
  username: string
  full_name?: string
  bio?: string
  profile_pic?: string
  posts_count: number
  favorite_posts?: string[]
  is_following: boolean
  following_count: number
  followers_count: number
  created_at?: string
  updated_at?: string
}

export interface IPaginatedProfiles {
  count: number
  next: string
  previous: string
  results: IProfile[]
}
