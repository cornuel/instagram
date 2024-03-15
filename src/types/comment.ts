import { type IPaginated } from './common'

export interface IComment {
	id: number
	profile: string
	post: number
	body: string
	created: string
	updated: string
	parent: number
	like_count: number
	replies_count: number
	is_liked: boolean
	url: string
}

export interface IPaginatedComments extends IPaginated {
	results: IComment[]
}