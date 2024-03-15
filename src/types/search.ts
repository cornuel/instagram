import { type IPaginated } from './common'
import { type IPost } from './post'
import { type IProfile } from './profile'

export interface IPaginatedSearchResults extends IPaginated {
  results: {
    posts?: IPost[]
    profiles?: IProfile[]
  }
}

