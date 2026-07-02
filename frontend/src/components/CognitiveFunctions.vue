<template>
  <div class="cognitive-functions">
    <div class="functions-radar">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
    <div class="functions-grid">
      <div class="function-card dominant">
        <span class="function-role">主导功能</span>
        <span class="function-name">{{ data.dominant.name }}</span>
        <span class="function-label">{{ data.dominant.label }}</span>
        <span class="function-desc">{{ data.dominant.description }}</span>
      </div>
      <div class="function-card auxiliary">
        <span class="function-role">辅助功能</span>
        <span class="function-name">{{ data.auxiliary.name }}</span>
        <span class="function-label">{{ data.auxiliary.label }}</span>
        <span class="function-desc">{{ data.auxiliary.description }}</span>
      </div>
      <div class="function-card tertiary">
        <span class="function-role">第三功能</span>
        <span class="function-name">{{ data.tertiary.name }}</span>
        <span class="function-label">{{ data.tertiary.label }}</span>
        <span class="function-desc">{{ data.tertiary.description }}</span>
      </div>
      <div class="function-card inferior">
        <span class="function-role">劣势功能</span>
        <span class="function-name">{{ data.inferior.name }}</span>
        <span class="function-label">{{ data.inferior.label }}</span>
        <span class="function-desc">{{ data.inferior.description }}</span>
      </div>
    </div>
    <div class="shadow-section">
      <h4 class="section-title">🌙 阴影功能</h4>
      <div class="shadow-grid">
        <div class="shadow-item" v-for="(item, idx) in data.shadow" :key="idx">
          <span class="shadow-role">{{ item.position }}</span>
          <span class="shadow-name">{{ item.name }}</span>
          <span class="shadow-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { RadarComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartOption = computed(() => {
  const functions = [
    { name: props.data.dominant.name, score: 95 },
    { name: props.data.auxiliary.name, score: 75 },
    { name: props.data.tertiary.name, score: 50 },
    { name: props.data.inferior.name, score: 30 },
    ...props.data.shadow.map((s, idx) => ({ name: s.name, score: 15 + idx * 5 }))
  ]

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const func = functions.find(f => f.name === params.name)
        return `<div style="padding: 8px;">
          <strong>${params.name}</strong><br/>
          功能强度: ${func?.score || 0}%
        </div>`
      }
    },
    radar: {
      indicator: functions.map(f => ({ name: f.name, max: 100 })),
      center: ['50%', '50%'],
      radius: '70%',
      axisName: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold'
      },
      splitLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      splitArea: {
        show: true,
        areaStyle: { color: ['#fafafa', '#f5f5f5', '#f0f0f0'] }
      },
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    series: [{
      name: '八维功能',
      type: 'radar',
      data: [{
        value: functions.map(f => f.score),
        name: '功能强度',
        lineStyle: { color: '#8b5cf6', width: 2 },
        areaStyle: { color: 'rgba(139, 92, 246, 0.15)' },
        itemStyle: { color: '#8b5cf6', borderColor: '#fff', borderWidth: 2 }
      }]
    }]
  }
})
</script>

<style scoped>
.cognitive-functions {
  padding: 24px;
}

.functions-radar {
  height: 300px;
  margin-bottom: 24px;
}

.chart {
  width: 100%;
  height: 100%;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.function-card {
  padding: 16px;
  border-radius: 10px;
  text-align: center;
}

.function-card.dominant {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
}

.function-card.auxiliary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: #fff;
}

.function-card.tertiary {
  background: linear-gradient(135deg, #a855f7, #9333ea);
  color: #fff;
}

.function-card.inferior {
  background: linear-gradient(135deg, #c084fc, #a855f7);
  color: #fff;
}

.function-role {
  display: block;
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.function-name {
  display: block;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.function-label {
  display: block;
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.function-desc {
  display: block;
  font-size: 12px;
  opacity: 0.85;
  line-height: 1.4;
}

.shadow-section {
  background: #f8fafc;
  padding: 16px;
  border-radius: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 12px 0;
}

.shadow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.shadow-item {
  text-align: center;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
}

.shadow-role {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.shadow-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;
}

.shadow-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .functions-grid {
    grid-template-columns: 1fr;
  }
  
  .shadow-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
