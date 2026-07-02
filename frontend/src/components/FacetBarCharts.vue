<template>
  <div class="facet-bar-charts">
    <div class="dimension-section" v-for="dim in dimensions" :key="dim.code">
      <h4 class="dimension-title">{{ dim.code }} - {{ dim.name }}</h4>
      <div class="facet-grid">
        <div class="facet-item" v-for="facet in getFacetsByDimension(dim.code)" :key="facet.id">
          <div class="facet-header">
            <span class="facet-name">{{ facet.name }}</span>
            <span class="facet-score">{{ facet.score.toFixed(2) }}</span>
          </div>
          <div class="facet-bar-container">
            <div 
              class="facet-bar" 
              :style="{ width: (facet.score / 5 * 100) + '%' }"
              :class="getBarClass(facet.score)"
            ></div>
          </div>
          <div class="facet-percentile">
            {{ getPercentile(facet.score) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const dimensions = computed(() => {
  const dimMap = new Map()
  props.data.forEach(facet => {
    if (!dimMap.has(facet.dimension)) {
      dimMap.set(facet.dimension, {
        code: facet.dimension,
        name: facet.dimensionName
      })
    }
  })
  return Array.from(dimMap.values())
})

function getFacetsByDimension(dimCode) {
  return props.data.filter(f => f.dimension === dimCode)
}

function getBarClass(score) {
  if (score >= 4) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

function getPercentile(score) {
  return Math.round((score - 1) / 4 * 100)
}
</script>

<style scoped>
.facet-bar-charts {
  padding: 16px;
}

.dimension-section {
  margin-bottom: 24px;
}

.dimension-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #6366f1;
}

.facet-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.facet-item {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.facet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.facet-name {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.facet-score {
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
}

.facet-bar-container {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.facet-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.facet-bar.high {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.facet-bar.medium {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
}

.facet-bar.low {
  background: linear-gradient(90deg, #fca5a5, #ef4444);
}

.facet-percentile {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

@media (max-width: 640px) {
  .facet-grid {
    grid-template-columns: 1fr;
  }
}
</style>
