<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import HeroSelector from '../components/HeroSelector.vue'
import RegionSelector from '../components/RegionSelector.vue'
import RankDisplay from '../components/RankDisplay.vue'
import type { RankData } from '../types'
import '../assets/global.css'

const selectedHero = ref<number | null>(166) // Defaults to Arthur
const selectedAreaCode = ref<string | null>('156') // Defaults to National Best
const selectedAreaId = ref<string>('1') // QQ Android as default

const rankData = ref<RankData | null>(null)
const loading = ref(false)
const userScore = ref<number | null>(null)

const areaOptions = [
  { label: 'QQ 安卓', value: '1' },
  { label: 'QQ iOS', value: '2' },
  { label: '微信 安卓', value: '3' },
  { label: '微信 iOS', value: '4' },
]

const userRankInfo = computed(() => {
  if (!userScore.value || !rankData.value || !rankData.value.list) return null
  const list = rankData.value.list
  if (list.length === 0) return null

  const index = list.findIndex((item) => parseInt(item.rankValue) <= userScore.value!)

  if (index === -1) {
    const lastItem = list[list.length - 1]
    return {
      rank: '未入榜',
      gapToRank: lastItem ? parseInt(lastItem.rankValue) - userScore.value! : null,
    }
  }

  const currentItem = list[index]
  const aboveItem = index > 0 ? list[index - 1] : null
  const belowItem = index < list.length - 1 ? list[index + 1] : null

  return {
    rank: index + 1,
    gapAbove: aboveItem ? parseInt(aboveItem.rankValue) - userScore.value! : null,
    gapBelow: belowItem ? userScore.value! - parseInt(belowItem.rankValue) : null,
  }
})

const fetchRanklist = async () => {
  if (!selectedHero.value || !selectedAreaCode.value) return

  loading.value = true
  try {
    const response = await fetch('/api/ranklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        areaId: selectedAreaId.value,
        adcode: selectedAreaCode.value,
        heroId: selectedHero.value,
      }),
    })

    const data = await response.json()
    rankData.value = data.data
  } catch (error) {
    console.error('Failed to fetch ranklist:', error)
  } finally {
    loading.value = false
  }
}

// Initial fetch
fetchRanklist()

// Watch for changes
watch([selectedHero, selectedAreaCode, selectedAreaId], () => {
  fetchRanklist()
})
</script>

<template>
  <div class="app-container">
    <main class="content">
      <section class="sidebar">
        <div class="filter-card card">
          <HeroSelector v-model="selectedHero" />
          <RegionSelector v-model="selectedAreaCode" />

          <div class="selector-group">
            <label>平台/区服</label>
            <select v-model="selectedAreaId">
              <option v-for="opt in areaOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="rank-cal-card card animate-fade-in">
          <label>查询我的排名</label>
          <div class="input-group">
            <input
              v-model.number="userScore"
              type="number"
              placeholder="输入你的英雄战力..."
              @wheel.prevent
            />
            <div v-if="userRankInfo" class="rank-result">
              <div class="main-rank">
                <span>预估排名: </span>
                <strong :class="{ 'not-in': userRankInfo.rank === '未入榜' }">
                  {{ userRankInfo.rank }}
                </strong>
              </div>
              <div class="rank-details">
                <template v-if="userRankInfo.rank === '未入榜'">
                  <p v-if="userRankInfo.gapToRank">
                    距离入榜还差 <span>{{ userRankInfo.gapToRank }}</span> 分
                  </p>
                </template>
                <template v-else>
                  <p v-if="userRankInfo.gapAbove !== null">
                    距离上一名还差 <span>{{ userRankInfo.gapAbove }}</span> 分
                  </p>
                  <p v-if="userRankInfo.gapBelow !== null">
                    领先下一名 <span>{{ userRankInfo.gapBelow }}</span> 分
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="results">
        <RankDisplay
          :list="rankData?.list || []"
          :loading="loading"
          :update-time="rankData?.updateTime"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

select,
.rank-cal-card input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  appearance: none;
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 1rem) center;
}

select:focus,
.rank-cal-card input:focus {
  border-color: var(--primary);
}

.content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-card,
.rank-cal-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rank-cal-card label {
  font-weight: 600;
  text-transform: uppercase;
}

.rank-result {
  margin-top: 0.75rem;
  padding: 1rem;
  background: var(--surface-alt);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.main-rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-result strong {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 0.4rem;
}

.rank-result strong.not-in {
  color: #ef4444;
}

.rank-details {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.rank-details p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.rank-details p span {
  color: var(--primary);
  font-weight: 600;
}

.results {
  min-width: 0;
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }

  .content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}
</style>
