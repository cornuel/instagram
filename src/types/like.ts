export interface ILike {
  id: string
  userId: string
  createdAt: any
}

export interface IPostLike extends ILike {
  postId: number
}

export interface ICommentLike extends ILike {
  commentId: number
}

export interface IReplyLike extends ILike {
  replyId: number
}

export interface IStoryLike extends ILike {
  storyId: string
}
