<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Key, OfficeBuilding, User } from '@element-plus/icons-vue'

import { loginRequest } from '../../api/auth'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = reactive({
  tenantCode: 'DEFAULT',
  username: 'admin',
  password: '',
  googleCode: '',
})

async function handleLogin() {
  if (!form.tenantCode || !form.username || !form.password) {
    ElMessage.warning('请填写租户编码、用户名和密码')
    return
  }

  loading.value = true

  try {
    const data = await loginRequest({
      tenantCode: form.tenantCode.trim(),
      username: form.username.trim(),
      password: form.password,
      googleCode: form.googleCode.trim() || undefined,
    })

    authStore.login(data)
    ElMessage.success(`登录成功，欢迎回来 ${data.username}`)
    router.push('/admin/dashboard')
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <section class="login-hero">
      <p class="login-kicker">Institutional Wallet Admin</p>
      <h1>管理多链钱包资产、风控与运营权限</h1>
      <p class="login-description">
        统一管理热钱包、提现审核、归集任务和告警事件，帮助运营团队在高并发资产场景下保持可观测与可追踪。
      </p>

      <div class="hero-metrics">
        <article>
          <strong>24/7</strong>
          <span>链上监控</span>
        </article>
        <article>
          <strong>Multi-chain</strong>
          <span>BTC / ETH / TRON</span>
        </article>
        <article>
          <strong>RBAC</strong>
          <span>细粒度权限</span>
        </article>
      </div>
    </section>

    <section class="login-panel">
      <div class="login-card">
        <div class="login-card__header">
          <div class="brand-badge">W</div>
          <div>
            <p>Wallet Admin</p>
            <h2>安全登录</h2>
          </div>
        </div>

        <el-form label-position="top" @submit.prevent="handleLogin">
          <el-form-item label="租户编码">
            <el-input
              v-model="form.tenantCode"
              size="large"
              placeholder="请输入租户编码，例如 DEFAULT"
              :prefix-icon="OfficeBuilding"
            />
          </el-form-item>

          <el-form-item label="用户名">
            <el-input
              v-model="form.username"
              size="large"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="登录密码">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              show-password
              placeholder="请输入密码"
              :prefix-icon="Key"
            />
          </el-form-item>

          <el-form-item label="谷歌验证码">
            <el-input
              v-model="form.googleCode"
              size="large"
              placeholder="未开启可留空，开启后必填"
            />
          </el-form-item>

          <div class="login-options">
            <span>登录方式: Session Cookie / withCredentials</span>
            <span>当前接口: /auth/v1/login</span>
          </div>

          <el-button class="login-submit" type="primary" size="large" :loading="loading" @click="handleLogin">
            登录后台
          </el-button>
        </el-form>
      </div>
    </section>
  </div>
</template>
