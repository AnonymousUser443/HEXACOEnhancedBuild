<template>
  <div class="validity-indicator">
    <div class="validity-header">
      <span class="validity-icon">{{ validityIcon }}</span>
      <div class="header-info">
        <span class="validity-title">测验有效性评估</span>
        <span class="validity-level" :class="data.validityLevel">{{ validityLevelText }}</span>
      </div>
    </div>
    
    <div class="validity-score">
      <div class="score-ring" :class="scoreLevel">
        <span class="score-value">{{ (data.validityIndex * 100).toFixed(0) }}</span>
        <span class="score-label">分</span>
      </div>
      <div class="score-description">{{ validityDescription }}</div>
    </div>
    
    <div class="validity-summary">
      <div class="summary-item" v-for="(item, idx) in data.summary?.details || summaryDetails" :key="idx">
        <span class="summary-icon">{{ getSummaryIcon(item.value) }}</span>
        <span class="summary-name">{{ item.name }}</span>
        <span class="summary-value" :class="item.value === '正常' || item.value === '一致' ? 'good' : item.value === '未完成' ? 'neutral' : 'warning'">{{ item.value }}</span>
      </div>
    </div>
    
    <div class="validity-sections">
      <div class="section">
        <h4 class="section-title">⏱️ 响应时间分析</h4>
        <div class="rt-details">
          <div class="rt-item">
            <span class="rt-label">平均作答时间</span>
            <span class="rt-value">{{ formatTime(data.responseTimeAnalysis?.avgResponseTime) }}</span>
          </div>
          <div class="rt-item">
            <span class="rt-label">过快作答（<1.5s）</span>
            <span class="rt-value" :class="data.responseTimeAnalysis?.fastCount > data.responseTimeAnalysis?.totalCount * 0.1 ? 'warning' : ''">
              {{ data.responseTimeAnalysis?.fastCount || 0 }} 题
            </span>
          </div>
          <div class="rt-item" v-if="data.responseTimeAnalysis?.veryFastCount">
            <span class="rt-label">极快作答（<0.5s）</span>
            <span class="rt-value" :class="data.responseTimeAnalysis?.veryFastCount > 0 ? 'error' : ''">
              {{ data.responseTimeAnalysis?.veryFastCount || 0 }} 题
            </span>
          </div>
          <div class="rt-item">
            <span class="rt-label">作答时间波动</span>
            <span class="rt-value" :class="data.responseTimeAnalysis?.coefficientOfVariation > 2.0 ? 'warning' : ''">
              {{ data.responseTimeAnalysis?.coefficientOfVariation?.toFixed(2) || 'N/A' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="section" v-if="data.anomalyDetection">
        <h4 class="section-title">🔍 异常检测</h4>
        <div class="anomaly-content">
          <div class="anomaly-summary">
            <span class="anomaly-count" :class="data.anomalyDetection?.riskLevel">
              {{ data.anomalyDetection?.totalAnomalies || 0 }} 项异常
            </span>
            <span class="anomaly-risk">风险等级: {{ riskLevelText }}</span>
          </div>
          <div class="anomaly-list" v-if="data.anomalyDetection?.anomalies?.length">
            <div 
              class="anomaly-item" 
              v-for="(anomaly, idx) in data.anomalyDetection.anomalies.slice(0, 5)" 
              :key="idx"
              :class="anomaly.severity"
            >
              <span class="anomaly-badge">{{ anomaly.severity === 'high' ? '⚠️' : 'ℹ️' }}</span>
              <span class="anomaly-name">{{ anomaly.name }}</span>
            </div>
          </div>
          <div class="anomaly-message" v-else>
            ✅ 未检测到异常作答模式
          </div>
        </div>
      </div>
      
      <div class="section" v-if="data.sjtValidity">
        <h4 class="section-title">🎭 情境测验验证</h4>
        <div class="sjt-content">
          <div class="sjt-status" :class="data.sjtValidity.valid ? 'valid' : 'invalid'">
            {{ data.sjtValidity.valid ? '✓ 一致性良好' : '⚠️ 一致性较差' }}
          </div>
          <div class="sjt-correlation">
            相关系数: {{ data.sjtValidity.correlation?.toFixed(2) || 'N/A' }}
          </div>
          <div class="sjt-message">{{ data.sjtValidity.message }}</div>
        </div>
      </div>
    </div>
    
    <div class="validity-footer">
      <span class="footer-icon">💡</span>
      <span class="footer-text">效度指数综合评估了您的作答质量，高分表示结果更可靠。如果检测到异常，建议重新作答以获得更准确的结果。</span>
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
  if (score >= 0.85) return 'excellent'
  if (score >= 0.7) return 'good'
  if (score >= 0.55) return 'fair'
  return 'poor'
})

const validityIcon = computed(() => {
  const level = scoreLevel.value
  if (level === 'excellent') return '🌟'
  if (level === 'good') return '✓'
  if (level === 'fair') return '~'
  return '⚠️'
})

const validityLevelText = computed(() => {
  const level = props.data.validityLevel || scoreLevel.value
  const texts = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return texts[level] || '未知'
})

const validityDescription = computed(() => {
  const level = scoreLevel.value
  if (level === 'excellent') return '您的作答非常认真，结果高度可靠'
  if (level === 'good') return '作答有效，结果具有参考价值'
  if (level === 'fair') return '作答基本有效，建议谨慎解读结果'
  return '作答可能存在偏差，结果仅供参考'
})

const riskLevelText = computed(() => {
  const level = props.data.anomalyDetection?.riskLevel || 'low'
  const texts = { high: '高', medium: '中', low: '低' }
  return texts[level] || '低'
})

const summaryDetails = computed(() => {
  return [
    { name: '响应时间', value: props.data.responseTimeAnalysis?.valid ? '正常' : '异常', score: props.data.responseTimeAnalysis?.valid ? 1.0 : 0.6 },
    { name: '作答模式', value: props.data.anomalyDetection?.isAnomalous ? '异常' : '正常', score: props.data.anomalyDetection?.isAnomalous ? 0.5 : 1.0 },
    { name: '情境测验', value: props.data.sjtValidity ? (props.data.sjtValidity.valid ? '一致' : '不一致') : '未完成', score: props.data.sjtValidity ? (props.data.sjtValidity.valid ? 1.0 : 0.6) : 0.85 }
  ]
})

function getSummaryIcon(value) {
  if (value === '正常' || value === '一致') return '✓'
  if (value === '未完成') return '○'
  return '!'
}

function formatTime(ms) {
  if (!ms) return 'N/A'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}分${secs}秒`
}
</script>

<style scoped>
.validity-indicator {
  padding: 24px;
}

.validity-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.validity-icon {
  font-size: 32px;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.validity-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.validity-level {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  width: fit-content;
}

.validity-level.excellent { background: #dcfce7; color: #166534; }
.validity-level.good { background: #d1fae5; color: #047857; }
.validity-level.fair { background: #fef3c7; color: #92400e; }
.validity-level.poor { background: #fee2e2; color: #991b1b; }

.validity-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.score-ring {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.score-ring.excellent { background: linear-gradient(135deg, #22c55e, #16a34a); }
.score-ring.good { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.score-ring.fair { background: linear-gradient(135deg, #f59e0b, #d97706); }
.score-ring.poor { background: linear-gradient(135deg, #ef4444, #dc2626); }

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.score-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.score-description {
  font-size: 14px;
  color: #64748b;
  text-align: center;
}

.validity-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  gap: 4px;
}

.summary-icon {
  font-size: 16px;
}

.summary-name {
  font-size: 11px;
  color: #94a3b8;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.summary-value.good { color: #22c55e; }
.summary-value.neutral { color: #64748b; }
.summary-value.warning { color: #f59e0b; }

.validity-sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.section {
  background: #f8fafc;
  padding: 14px;
  border-radius: 10px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
}

.rt-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rt-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.rt-label { color: #94a3b8; }
.rt-value { color: #334155; font-weight: 500; }
.rt-value.warning { color: #f59e0b; }
.rt-value.error { color: #ef4444; }

.anomaly-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.anomaly-summary {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.anomaly-count {
  font-weight: 600;
}

.anomaly-count.low { color: #22c55e; }
.anomaly-count.medium { color: #f59e0b; }
.anomaly-count.high { color: #ef4444; }

.anomaly-risk { color: #64748b; }

.anomaly-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.anomaly-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #fff;
  border-radius: 6px;
  font-size: 11px;
}

.anomaly-item.high { border-left: 3px solid #ef4444; }
.anomaly-item.medium { border-left: 3px solid #f59e0b; }

.anomaly-badge { font-size: 12px; }
.anomaly-name { color: #334155; }

.anomaly-message {
  font-size: 12px;
  color: #22c55e;
}

.sjt-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sjt-status {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.sjt-status.valid { background: #dcfce7; color: #166534; }
.sjt-status.invalid { background: #fef3c7; color: #92400e; }

.sjt-correlation {
  font-size: 12px;
  color: #64748b;
}

.sjt-message {
  font-size: 11px;
  color: #64748b;
}

.validity-footer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
}

.footer-icon {
  font-size: 14px;
}

.footer-text {
  font-size: 12px;
  color: #0369a1;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .validity-summary {
    grid-template-columns: 1fr;
  }
  
  .validity-sections {
    grid-template-columns: 1fr;
  }
}
</style>
