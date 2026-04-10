<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addAdminUser } from '../api/admin-users'
import type { CreateUserDto } from '../api/admin-users'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const loading = ref(false)
const formData = ref<CreateUserDto>({
  username: '',
  nickname: '',
  password: '',
  status: 1,
  roleNames: []
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    formData.value = {
      username: '',
      nickname: '',
      password: '',
      status: 1,
      roleNames: []
    }
  }
})

function handleClose() {
  emit('update:visible', false)
}

async function handleSubmit() {
  if (!formData.value.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }

  if (!formData.value.nickname.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }

  if (!formData.value.password.trim()) {
    ElMessage.warning('请输入密码')
    return
  }

  loading.value = true

  try {
    await addAdminUser(formData.value)
    ElMessage.success('用户新增成功')
    emit('success')
    handleClose()
  } catch (error) {
    const message = error instanceof Error ? error.message : '新增用户失败'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="新增用户"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      :model="formData"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="formData.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>

      <el-form-item label="昵称">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>

      <el-form-item label="角色">
        <el-select
          v-model="formData.roleNames"
          multiple
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option label="管理员" value="管理员" />
          <el-option label="运营" value="运营" />
          <el-option label="财务" value="财务" />
          <el-option label="客服" value="客服" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>