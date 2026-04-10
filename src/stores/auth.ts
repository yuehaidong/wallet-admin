import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { LoginData, PermissionNode } from '../types/auth'

interface StoredAuthState {
  tenantId: number | null
  tenantCode: string
  username: string
  roleNames: string[]
  permissions: PermissionNode[]
  sessionActive: boolean
}

const STORAGE_KEY = 'wallet-admin-auth'

function readStoredState(): StoredAuthState {
  const fallback: StoredAuthState = {
    tenantId: null,
    tenantCode: '',
    username: '',
    roleNames: [],
    permissions: [],
    sessionActive: false,
  }

  const rawValue = sessionStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return fallback
  }

  try {
    return { ...fallback, ...(JSON.parse(rawValue) as Partial<StoredAuthState>) }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return fallback
  }
}

export const useAuthStore = defineStore('auth', () => {
  const initialState = readStoredState()

  const sessionActive = ref(initialState.sessionActive)
  const tenantId = ref<number | null>(initialState.tenantId)
  const tenantCode = ref(initialState.tenantCode)
  const username = ref(initialState.username)
  const roleNames = ref<string[]>(initialState.roleNames)
  const permissions = ref<PermissionNode[]>(initialState.permissions)

  const isAuthenticated = computed(() => sessionActive.value)
  const tenantName = computed(() => tenantCode.value || '未选择租户')
  const primaryRole = computed(() => roleNames.value[0] || '未分配角色')

  function persistState() {
    const state: StoredAuthState = {
      tenantId: tenantId.value,
      tenantCode: tenantCode.value,
      username: username.value,
      roleNames: roleNames.value,
      permissions: permissions.value,
      sessionActive: sessionActive.value,
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function login(payload: LoginData) {
    tenantId.value = payload.tenantId
    tenantCode.value = payload.tenantCode
    username.value = payload.username
    roleNames.value = payload.roleNames
    permissions.value = payload.permissions
    sessionActive.value = true
    persistState()
  }

  function logout() {
    tenantId.value = null
    tenantCode.value = ''
    username.value = ''
    roleNames.value = []
    permissions.value = []
    sessionActive.value = false
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return {
    tenantId,
    tenantCode,
    tenantName,
    username,
    roleNames,
    primaryRole,
    permissions,
    isAuthenticated,
    login,
    logout,
  }
})
