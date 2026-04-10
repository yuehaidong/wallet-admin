<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DataBoard, Document, Fold, Lock, Monitor, Wallet } from '@element-plus/icons-vue'

import { useAuthStore } from '../stores/auth'
import type { PermissionNode } from '../types/auth'

interface SidebarMenuItem {
  id: number
  index: string
  label: string
  icon: typeof DataBoard
  children: SidebarMenuItem[]
}

const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const iconMap: Record<string, typeof DataBoard> = {
  dashboard: DataBoard,
  wallet: Wallet,
  lock: Lock,
  monitor: Monitor,
}

const activeMenu = computed(() => router.currentRoute.value.path)
const displayName = computed(() => authStore.username || 'Admin')
const currentTenant = computed(() => authStore.tenantName || '未选择租户')
const currentRole = computed(() => authStore.primaryRole)
const menuItems = computed(() => buildMenuTree(authStore.permissions))

function handleSelect(index: string) {
  router.push(index)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

function resolveMenuIcon(iconName: string | null) {
  if (!iconName) {
    return Document
  }

  return iconMap[iconName] || Document
}

function buildMenuTree(nodes: PermissionNode[]): SidebarMenuItem[] {
  return [...nodes]
    .filter((node) => node.type === 0)
    .sort((left, right) => left.sort - right.sort)
    .map((node) => ({
      id: node.id,
      index: node.url || `/permission/${node.id}`,
      label: node.name,
      icon: resolveMenuIcon(node.icon),
      children: buildMenuTree(node.children || []),
    }))
}
</script>

<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': isCollapsed }">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="brand-section">
          <div class="brand-mark">W</div>
          <div v-if="!isCollapsed" class="brand-copy">
            <strong>Wallet Console</strong>
            <span>Crypto Operations Center</span>
          </div>
        </div>
        <el-button
          class="collapse-btn"
          :icon="Fold"
          text
          @click="toggleSidebar"
        />
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        class="sidebar-menu"
        background-color="transparent"
        text-color="#9ea8bc"
        active-text-color="#ffffff"
        @select="handleSelect"
      >
        <template v-for="item in menuItems" :key="item.id">
          <el-sub-menu v-if="item.children.length > 0" :index="item.index">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </template>

            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="child.index"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="item.index">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>

    <div class="admin-right">
      <header class="admin-header">
        <div class="header-left">
          <p class="header-kicker">Secure admin session</p>
          <h1>运营后台</h1>
          <p class="tenant-chip">当前租户: {{ currentTenant }}</p>
        </div>

        <div class="header-actions">
          <div class="header-user">
            <span class="status-dot"></span>
            <div>
              <strong>{{ displayName }}</strong>
              <p>{{ authStore.tenantCode || 'tenant' }} / {{ currentRole }}</p>
            </div>
          </div>
          <el-button type="primary" plain @click="handleLogout">退出登录</el-button>
        </div>
      </header>

      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>