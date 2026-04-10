export interface PermissionNode {
  id: number
  pid: number | null
  name: string
  url: string | null
  authority: string | null
  type: 0 | 1 | 2
  icon: string | null
  sort: number
  openStyle: 0 | 1
  children: PermissionNode[]
}

export interface LoginRequest {
  tenantCode: string
  username: string
  password: string
  googleCode?: string
}

export interface LoginData {
  tenantId: number
  tenantCode: string
  username: string
  roleNames: string[]
  permissions: PermissionNode[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
