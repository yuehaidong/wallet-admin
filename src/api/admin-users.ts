import type { ApiResponse } from '../types/auth'
import type { AdminUserItem, AdminUserQuery, PageResult } from '../types/admin-user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function fetchAdminUsers(query: AdminUserQuery): Promise<PageResult<AdminUserItem>> {
  const searchParams = new URLSearchParams()

  searchParams.set('pageNum', String(query.pageNum))
  searchParams.set('pageSize', String(query.pageSize))

  if (query.username) {
    searchParams.set('username', query.username)
  }

  if (query.nickname) {
    searchParams.set('nickname', query.nickname)
  }

  if (query.status !== undefined) {
    searchParams.set('status', String(query.status))
  }

  const response = await fetch(`${API_BASE_URL}/admins/v1/users?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
  })

  let result: ApiResponse<PageResult<AdminUserItem> | null> | null = null

  try {
    result = (await response.json()) as ApiResponse<PageResult<AdminUserItem> | null>
  } catch {
    throw new Error('管理员列表接口返回了无法解析的数据')
  }

  if (!response.ok || !result || result.code !== 200 || !result.data) {
    throw new Error(result?.message || '获取管理员列表失败')
  }

  return result.data
}

export async function removeAdminUser(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admins/v1/removeUser?userId=${userId}`, {
    method: 'GET',
    credentials: 'include',
  })

  let result: ApiResponse<null> | null = null

  try {
    result = (await response.json()) as ApiResponse<null>
  } catch {
    throw new Error('删除用户接口返回了无法解析的数据')
  }

  if (!response.ok || !result || result.code !== 200) {
    throw new Error(result?.message || '删除用户失败')
  }
}

export interface UpdateUserDto {
  id: number
  username: string
  nickname: string
  status: 0 | 1
  googleBound: boolean
  roleNames: string[]
  createTime: string
  updateTime: string
}

export async function updateAdminUser(userData: UpdateUserDto): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admins/v1/updateUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  let result: ApiResponse<null> | null = null

  try {
    result = (await response.json()) as ApiResponse<null>
  } catch {
    throw new Error('更新用户接口返回了无法解析的数据')
  }

  if (!response.ok || !result || result.code !== 200) {
    throw new Error(result?.message || '更新用户失败')
  }
}

export interface CreateUserDto {
  username: string
  password: string
  nickname: string
  status: 0 | 1
  roleNames: string[]
}

export async function addAdminUser(userData: CreateUserDto): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admins/v1/createUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  })

  let result: ApiResponse<null> | null = null

  try {
    result = (await response.json()) as ApiResponse<null>
  } catch {
    throw new Error('新增用户接口返回了无法解析的数据')
  }

  if (!response.ok || !result || result.code !== 200) {
    throw new Error(result?.message || '新增用户失败')
  }
}
