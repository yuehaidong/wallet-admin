import type { ApiResponse, LoginData, LoginRequest } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function loginRequest(payload: LoginRequest): Promise<LoginData> {
  const response = await fetch(`${API_BASE_URL}/auth/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  let result: ApiResponse<LoginData | null> | null = null

  try {
    result = (await response.json()) as ApiResponse<LoginData | null>
  } catch {
    throw new Error('登录接口返回了无法解析的数据')
  }

  if (!response.ok || !result || result.code !== 200 || !result.data) {
    throw new Error(result?.message || '登录失败，请稍后重试')
  }

  return result.data
}
