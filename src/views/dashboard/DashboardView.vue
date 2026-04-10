<script setup lang="ts">
import { computed } from 'vue'
import { BottomRight, TopLeft } from '@element-plus/icons-vue'

import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const currentTenant = computed(() => authStore.tenantName || '未选择租户')

const todayStats = [
  {
    title: '当日充值',
    amount: '12,845,320.55 USDT',
    count: '1,286 笔',
    compare: '较昨日 +18.6%',
    icon: BottomRight,
    tone: 'deposit',
  },
  {
    title: '当日提现',
    amount: '8,423,910.20 USDT',
    count: '742 笔',
    compare: '较昨日 +6.2%',
    icon: TopLeft,
    tone: 'withdraw',
  },
]

const detailRows = [
  { label: '净流入', value: '4,421,410.35 USDT' },
  { label: '充值成功率', value: '99.94%' },
  { label: '提现成功率', value: '99.71%' },
  { label: '最后更新时间', value: '今天 10:24' },
]
</script>

<template>
  <div class="dashboard-shell dashboard-shell--compact">
    <section class="dashboard-focus dashboard-card">
      <p class="card-kicker">Today Flow</p>
      <h2>{{ currentTenant }} 当日充提概览</h2>
      <p class="dashboard-focus__description">
        首页仅展示当前租户当天的充值和提现情况，方便快速查看资金流入流出。
      </p>
    </section>

    <section class="today-flow-grid">
      <article
        v-for="item in todayStats"
        :key="item.title"
        :class="['flow-card', 'dashboard-card', item.tone === 'deposit' ? 'flow-card--deposit' : 'flow-card--withdraw']"
      >
        <div class="flow-card__header">
          <div>
            <span>{{ item.title }}</span>
            <strong>{{ item.amount }}</strong>
          </div>
          <div class="flow-card__icon">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
        </div>
        <div class="flow-card__footer">
          <p>{{ item.count }}</p>
          <em>{{ item.compare }}</em>
        </div>
      </article>
    </section>

    <section class="dashboard-card detail-card">
      <div class="section-heading">
        <div>
          <p class="card-kicker">Daily Summary</p>
          <h3>今日汇总</h3>
        </div>
      </div>

      <div class="detail-grid">
        <div v-for="row in detailRows" :key="row.label" class="detail-item">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </section>
  </div>
</template>
