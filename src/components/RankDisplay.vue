<script setup lang="ts">
import { computed } from 'vue'
import type { RankItem } from '../types'

const props = defineProps<{
  list: RankItem[]
  loading: boolean
  updateTime?: string
}>()

const thresholdPower = computed(() => {
  return props.list[props.list.length - 1]?.rankValue || null
})

const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return '未知'
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="rank-display card animate-fade-in">
    <div class="header">
      <div class="title-group">
        <h2>排行详情</h2>
        <span v-if="thresholdPower" class="threshold-badge">上榜分数: {{ thresholdPower }}</span>
      </div>
      <span v-if="updateTime" class="update-time">更新: {{ formatDate(updateTime) }}</span>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>数据加载中...</span>
    </div>

    <div v-else-if="list.length > 0" class="list-container">
      <table class="rank-table">
        <thead>
          <tr>
            <th class="rank-col">排名</th>
            <th class="player-col">玩家</th>
            <th class="power-col">战力</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.roleId" class="rank-row">
            <td>
              <span class="rank-badge" :class="`top-${item.rankNo}`">{{ item.rankNo }}</span>
            </td>
            <td>
              <div class="player-cell">
                <div class="info">
                  <div class="name">{{ item.roleName }}</div>
                  <div class="server">{{ item.roleJobName }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="power-value">{{ item.rankValue }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <p>暂无数据记录</p>
    </div>
  </div>
</template>

<style scoped>
.rank-display {
  background: var(--surface);
  min-height: 400px;
}

.header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
}

.threshold-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: rgba(74, 144, 226, 0.1);
  color: var(--primary);
  border-radius: 4px;
  font-weight: 600;
}

.update-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.list-container {
  overflow-x: auto;
}

.rank-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  background: var(--surface-alt);
}

td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.rank-badge {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-muted);
  background: var(--surface-alt);
}

.top-1 {
  background: #fee2e2;
  color: #ef4444;
}
.top-2 {
  background: #ffedd5;
  color: #f97316;
}
.top-3 {
  background: #fef9c3;
  color: #eab308;
}

.player-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info .name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
}

.info .server {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.power-value {
  font-weight: 700;
  color: var(--primary);
  font-size: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1rem;
  color: var(--text-muted);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 5rem 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  th,
  td {
    padding: 0.75rem 1rem;
  }

  .player-cell {
    gap: 0.5rem;
  }
}
</style>
