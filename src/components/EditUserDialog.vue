<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateAdminUser } from '../api/admin-users'
import type { UpdateUserDto } from '../api/admin-users'
import type { AdminUserItem } from '../types/admin-user'

const props = defineProps<{
  visible: boolean
  user: AdminUserItem | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const loading = ref(false)
const formData = ref<UpdateUserDto>({
  id: 0,
  username: '',
  nickname: '',
  status: 1,
  googleBound: false,
  roleNames: [],
  createTime: '',
  updateTime: ''
})

watch(() => props.visible, (newVal) => {
  if (newVal && props.user) {
    formData.value = {
      id: props.user.id,
      username: props.user.username,
      nickname: props.user.nickname,
      status: props.user.status,
      googleBound: props.user.googleBound,
      roleNames: [...props.user.roleNames],
      createTime: props.user.createTime,
      updateTime: props.user.updateTime
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

  loading.value = true

  try {
    await updateAdminUser(formData.value)
    ElMessage.success('用户信息更新成功')
    emit('success')
    handleClose()
  } catch (error) {
    const message = error instanceof Error ? error.message : '更新用户失败'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="编辑用户"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      v-if="user"
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

      <el-form-item label="状态">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>

      <el-form-item label="谷歌验证">
        <el-switch
          v-model="formData.googleBound"
          active-text="已绑定"
          inactive-text="未绑定"
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