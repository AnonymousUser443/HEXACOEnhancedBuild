<template>
  <div class="hexaco-radar">
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  CanvasRenderer
])

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const item = props.data.find(d => d.name === params.name)
      if (item) {
        return `<div style="padding: 8px;">
          <strong>${item.name}</strong><br/>
          原始分: ${item.rawScore.toFixed(2)}<br/>
          T分数: ${item.tScore.toFixed(1)}<br/>
          百分位: ${item.percentile.toFixed(1)}%
        </div>`
      }
      return ''
    }
  },
  legend: {
    data: ['你的人格特征'],
    top: 10,
    textStyle: {
      color: '#666'
    }
  },
  radar: {
    indicator: props.data.map(d => ({
      name: d.name,
      max: 5
    })),
    center: ['50%', '55%'],
    radius: '65%',
    axisName: {
      color: '#333',
      fontSize: 13,
      fontWeight: 'bold'
    },
    splitLine: {
      lineStyle: {
        color: ['#e0e0e0', '#d0d0d0', '#c0c0c0', '#b0b0b0', '#a0a0a0']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#fafafa', '#f5f5f5', '#f0f0f0', '#ebebeb', '#e6e6e6']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    }
  },
  series: [{
    name: 'HEXACO 人格维度',
    type: 'radar',
    data: [{
      value: props.data.map(d => d.rawScore),
      name: '你的人格特征',
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: '#6366f1',
        width: 2
      },
      areaStyle: {
        color: 'rgba(99, 102, 241, 0.2)',
        opacity: 0.3
      },
      itemStyle: {
        color: '#6366f1',
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  }]
}))
</script>

<style scoped>
.hexaco-radar {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
