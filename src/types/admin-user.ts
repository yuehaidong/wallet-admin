export interface PageResult<T> {
  current: number
  size: number
  total: number
  records: T[]
}

export interface AdminUserItem {
  id: number
  username: string
  nickname: string
  status: 0 | 1
  googleBound: boolean
  roleNames: string[]
  createTime: string
  updateTime: string
}

export interface AdminUserQuery {
  pageNum: number
  pageSize: number
  username?: string
  nickname?: string
  status?: 0 | 1
}
