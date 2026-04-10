<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { fetchAdminUsers, removeAdminUser } from '../../api/admin-users'
import type { AdminUserItem } from '../../types/admin-user'
import EditUserDialog from '../../components/EditUserDialog.vue'
import AddUserDialog from '../../components/AddUserDialog.vue'

const loading = ref(false)
const records = ref<AdminUserItem[]>([])
const total = ref(0)
const editDialogVisible = ref(false)
const currentUser = ref<AdminUserItem | null>(null)
const addDialogVisible = ref(false)

const filters = reactive({
  username: '',
  nickname: '',
  status: undefined as 0 | 1 | undefined,
})

const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
})

async function loadAdminUsers() {
  loading.value = true

  try {
    const pageData = await fetchAdminUsers({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      username: filters.username.trim() || undefined,
      nickname: filters.nickname.trim() || undefined,
      status: filters.status,
    })

    records.value = pageData.records
    total.value = pageData.total
    pagination.pageNum = pageData.current
    pagination.pageSize = pageData.size
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取管理员列表失败'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.pageNum = 1
  loadAdminUsers()
}

function handleReset() {
  filters.username = ''
  filters.nickname = ''
  filters.status = undefined
  pagination.pageNum = 1
  loadAdminUsers()
}

function handlePageChange(page: number) {
  pagination.pageNum = page
  loadAdminUsers()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.pageNum = 1
  loadAdminUsers()
}

function formatDateTime(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function handleEdit(row: AdminUserItem) {
  currentUser.value = row
  editDialogVisible.value = true
}

function handleEditSuccess() {
  loadAdminUsers()
}

function handleAdd() {
  addDialogVisible.value = true
}

function handleAddSuccess() {
  loadAdminUsers()
}

async function handleDelete(row: AdminUserItem) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await removeAdminUser(row.id)
    ElMessage.success(`用户 ${row.username} 已删除`)
    loadAdminUsers()
  } catch (error) {
    if (error !== 'cancel') {
      const message = error instanceof Error ? error.message : '删除用户失败'
      ElMessage.error(message)
    }
  }
}

onMounted(() => {
  loadAdminUsers()
})
</script>

<template>
  <div class="admin-users-page">
    <section class="dashboard-card page-panel">
      <div class="section-heading section-heading--tight">
        <div>
          <p class="card-kicker">Admin Users</p>
          <h3>管理员列表</h3>
        </div>
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </div>

      <el-form class="filter-form" :inline="true" @submit.prevent="handleSearch">
        <el-form-item label="用户名">
          <el-input v-model="filters.username" clearable placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="filters.nickname" clearable placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="filters.status" clearable placeholder="全部状态" style="width: 140px">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="dashboard-card page-panel">
      <el-table v-loading="loading" :data="records" stripe>
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="nickname" label="昵称" min-width="140" />
        <el-table-column label="状态" min-width="110">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="谷歌验证" min-width="120">
          <template #default="scope">
            <el-tag :type="scope.row.googleBound ? 'success' : 'warning'" effect="plain">
              {{ scope.row.googleBound ? '已绑定' : '未绑定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="220">
          <template #default="scope">
            <div class="role-tags">
              <el-tag
                v-for="role in scope.row.roleNames"
                :key="role"
                effect="plain"
                class="role-tag"
              >
                {{ role }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </section>

    <EditUserDialog
      v-model:visible="editDialogVisible"
      :user="currentUser"
      @success="handleEditSuccess"
    />

    <AddUserDialog
      v-model:visible="addDialogVisible"
      @success="handleAddSuccess"
    />
  </div>
</template>
