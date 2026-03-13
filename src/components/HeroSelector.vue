<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Hero } from '../types'

const props = defineProps<{
  modelValue: number | null
}>()

const emit = defineEmits(['update:modelValue'])

const heroes = ref<Hero[]>([])
const searchQuery = ref('')
const activeType = ref<number>(0) // 0 for all
const isPanelOpen = ref(false)

const heroTypes = [
  { id: 0, name: '全部' },
  { id: 1, name: '战士' },
  { id: 2, name: '法师' },
  { id: 3, name: '坦克' },
  { id: 4, name: '刺客' },
  { id: 5, name: '射手' },
  { id: 6, name: '辅助' },
]

const fetchHeroes = async () => {
  const res = await fetch('/database/herolist.json')
  const data = await res.json()
  heroes.value = data
}

const filteredHeroes = computed(() => {
  return heroes.value.filter((h: Hero) => {
    const matchesSearch =
      !searchQuery.value ||
      h.cname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      h.title?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesType =
      activeType.value === 0 ||
      h.hero_type === activeType.value ||
      h.hero_type2 === activeType.value

    return matchesSearch && matchesType
  })
})

const selectedHero = computed(() => {
  return heroes.value.find((h) => h.ename === props.modelValue)
})

const selectHero = (hero: Hero) => {
  emit('update:modelValue', hero.ename)
  isPanelOpen.value = false
}

onMounted(() => {
  fetchHeroes()
})
</script>

<template>
  <div class="hero-selector-wrapper">
    <label>英雄</label>
    <div class="selector-trigger card" @click="isPanelOpen = true">
      <template v-if="selectedHero">
        <div class="selected-info">
          <span class="name">{{ selectedHero.cname }}</span>
          <span class="title">{{ selectedHero.title }}</span>
        </div>
      </template>
      <span v-else class="placeholder">点击选择英雄</span>
      <span class="arrow">→</span>
    </div>

    <!-- Modal Panel -->
    <Teleport to="body">
      <div
        v-if="isPanelOpen"
        class="modal-overlay animate-fade-in"
        @click.self="isPanelOpen = false"
      >
        <div class="hero-modal card animate-scale-up">
          <div class="modal-header">
            <h3>选择英雄</h3>
            <button class="close-btn" @click="isPanelOpen = false">&times;</button>
          </div>

          <div class="controls">
            <div class="search-box">
              <input v-model="searchQuery" placeholder="搜索名称/称号..." autofocus />
            </div>

            <div class="type-tabs">
              <button
                v-for="type in heroTypes"
                :key="type.id"
                class="type-tab"
                :class="{ active: activeType === type.id }"
                @click="activeType = type.id"
              >
                {{ type.name }}
              </button>
            </div>
          </div>

          <div class="hero-grid">
            <button
              v-for="hero in filteredHeroes"
              :key="hero.ename"
              class="hero-card"
              :class="{ active: hero.ename === modelValue }"
              @click="selectHero(hero)"
            >
              <img
                :src="`/database/heros-avatar/${hero.ename}.jpg`"
                class="hero-avatar"
                loading="lazy"
              />
              <div class="name">{{ hero.cname }}</div>
            </button>
            <div v-if="filteredHeroes.length === 0" class="no-results">未找到匹配英雄</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hero-selector-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
}

.selector-trigger {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background: var(--surface);
  transition: all 0.2s;
  gap: 1rem;
}

.selector-trigger:hover {
  border-color: var(--primary);
  background: var(--surface-alt);
}

.selected-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.selected-info .name {
  font-weight: 600;
  font-size: 0.95rem;
}

.selected-info .title {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.placeholder {
  flex: 1;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.arrow {
  color: var(--text-muted);
  font-size: 1.2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.hero-modal {
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text);
}

.controls {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--surface-alt);
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
  outline: none;
}

.search-box input:focus {
  border-color: var(--primary);
}

.type-tabs {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 4px;
}

.type-tab {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  background: var(--surface);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.type-tab.active {
  background: var(--primary);
  color: white;
}

.hero-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
  padding: 1.5rem;
  overflow-y: auto;
}

.hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.hero-card:hover {
  background: var(--surface-alt);
}

.hero-card.active {
  border-color: var(--primary);
  background: rgba(74, 144, 226, 0.05);
}

.hero-avatar {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  background: var(--surface-alt);
}

.hero-card .name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text);
}

.no-results {
  grid-column: 1 / -1;
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.2s ease-out forwards;
}

/* Custom Scrollbar */
.hero-grid::-webkit-scrollbar {
  width: 6px;
}

.hero-grid::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
</style>
