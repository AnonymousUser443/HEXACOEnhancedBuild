<template>
  <div class="validity-indicator">
    <div class="validity-header">
      <span class="validity-icon">{{ validityIcon }}</span>
      <span class="validity-title">测验有效性评估</span>
    </div>
    <div class="validity-score">
      <div 
        class="score-ring"
        :class="scoreLevel"
      >
        <span class="score-value">{{ (data.validityIndex * 100).toFixed(0) }}</span>
        <span class="score-label">分</span>
      </div>
      <div class="score-description">{{ validityDescription }}</div>
    </div>
    <div class="validity-details">
      <div class="detail-item">
        <span class="detail-label">作答一致性</span>
        <div class="detail-bar-container">
          <div 
            class="detail-bar" 
            :style="{ width: (data.consistency * 100) + '%' }"
          ></div>
        </div>
        <span class="detail-value">{{ (data.consistency * 100).toFixed(0) }}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">反向题比例</span>
        <div class="detail-bar-container">
          <div 
            class="detail-bar" 
            :style="{ width: (data.reverseItemRatio * 100) + '%' }"
          ></div>
        </div>
        <span class="detail-value">{{ (data.reverseItemRatio * 100).toFixed(0) }}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">平均作答时间</span>
        <span class="detail-value">{{ formatTime(data.responseTimeAnalysis.avgResponseTime) }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">过快作答</span>
        <span class="detail-value">{{ data.responseTimeAnalysis.fastCount }} 题</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">过慢作答</span>
        <span class="detail-value">{{ data.responseTimeAnalysis.slowCount }} 题</span>
      </div>
    </div>
    <div class="validity-pattern" :class="data.responseTimeAnalysis.pattern">
      <span class="pattern-icon">ⓘ</span>
      <span class="pattern-text">{{ patternText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const scoreLevel = computed(() => {
  const score = props.data.validityIndex
  if (score >= 0.8) return 'high'
  if (score >= 0.6) return 'medium'
  return 'low'
})

const validityIcon = computed(() => {
  const level = scoreLevel.value
  if (level === 'high') return '✓'
  if (level === 'medium') return '~'
  return '!'
})

const validityDescription = computed(() => {
  const level = scoreLevel.value
  if (level === 'high') return '您的作答有效，结果可靠'
  if (level === 'medium') return '作答基本有效，但建议参考'
  return '作答可能存在偏差，请谨慎解读'
})

const patternText = computed(() => {
  const pattern = props.data.responseTimeAnalysis.pattern
  if (pattern === 'fast') return '检测到过快作答模式，可能影响结果准确性'
  if (pattern === 'slow') return '作答时间较长，可能存在犹豫或疲劳'
  if (pattern === 'inconsistent') return '作答速度波动较大，请关注作答质量'
  return '作答速度正常，无异常模式'
})

function formatTime(ms) {
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}分${secs}秒`
}
</script>

<style scoped>
.validity-indicator {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.validity-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.validity-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
}

.validity-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.validity-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.score-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.score-ring.high {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
}

.score-ring.medium {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
}

.score-ring.low {
  background: linear-gradient(135deg, #f87171, #ef4444);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
}

.score-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.score-description {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.validity-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #888;
}

.detail-bar-container {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.detail-bar {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.detail-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.validity-pattern {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.validity-pattern.normal {
  background: #ecfdf5;
  color: #065f46;
}

.validity-pattern.fast,
.validity-pattern.slow,
.validity-pattern.inconsistent {
  background: #fffbeb;
  color: #92400e;
}

.pattern-icon {
  font-size: 14px;
  font-weight: bold;
}

@media (max-width: 640px) {
  .validity-details {
    grid-template-columns: 1fr;
  }
}
</style>
