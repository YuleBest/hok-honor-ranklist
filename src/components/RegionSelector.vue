<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Region } from '../types'

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const regionsTree = ref<Region[]>([])
const selectedProvince = ref<string>('')
const selectedCity = ref<string>('')
const selectedDistrict = ref<string>('')

const fetchRegions = async () => {
  const res = await fetch('/database/regions_tree.json')
  regionsTree.value = await res.json()
}

onMounted(() => {
  fetchRegions()
})

const provinces = ref<Region[]>([])
watch(regionsTree, () => {
  provinces.value = [
    { code: '1561', name: '全国榜' },
    { code: '156', name: '国服最强榜' },
    ...regionsTree.value,
  ]
})

const cities = ref<Region[]>([])
watch(selectedProvince, (newVal) => {
  selectedCity.value = ''
  selectedDistrict.value = ''
  if (newVal === '1561' || newVal === '156') {
    cities.value = []
    emit('update:modelValue', newVal)
    return
  }
  const province = regionsTree.value.find((p) => p.code === newVal)
  cities.value = province?.children || []
  emit('update:modelValue', newVal)
})

const districts = ref<Region[]>([])
watch(selectedCity, (newVal) => {
  selectedDistrict.value = ''
  if (!newVal) {
    districts.value = []
    return
  }
  const city = cities.value.find((c) => c.code === newVal)
  districts.value = city?.children || []
  emit('update:modelValue', newVal)
})

watch(selectedDistrict, (newVal) => {
  if (newVal) {
    emit('update:modelValue', newVal)
  } else if (selectedCity.value) {
    emit('update:modelValue', selectedCity.value)
  }
})

// Initialize from prop
const initFromValue = () => {
  if (!props.modelValue) return

  const val = props.modelValue
  if (val === '156' || val === '1561') {
    selectedProvince.value = val
    return
  }

  // Handle nested codes (recursive search is better but let's try shallow first or just set province)
  // For simplicity, we just set province if it matches
  if (regionsTree.value.some((p) => p.code === val)) {
    selectedProvince.value = val
  }
}

watch(
  regionsTree,
  () => {
    initFromValue()
  },
  { immediate: true },
)
</script>

<template>
  <div class="region-selector">
    <div class="selector-group">
      <label>地区</label>
      <div class="selectors">
        <select v-model="selectedProvince">
          <option value="" disabled>省份/类型</option>
          <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
        </select>

        <select v-if="cities.length > 0" v-model="selectedCity">
          <option value="">所有市</option>
          <option v-for="c in cities" :key="c.code" :value="c.code">{{ c.name }}</option>
        </select>

        <select v-if="districts.length > 0" v-model="selectedDistrict">
          <option value="">所有区</option>
          <option v-for="d in districts" :key="d.code" :value="d.code">{{ d.name }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.region-selector {
  width: 100%;
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

.selectors {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

select {
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 1rem) center;
}

select:focus {
  border-color: var(--primary);
}

option {
  background: var(--surface);
  color: var(--text);
}
</style>
