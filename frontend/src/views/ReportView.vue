<template>
  <div class="report-view">
    <header class="report-header">
      <div class="header-content">
        <h1 class="report-title">人格分析报告</h1>
        <p class="report-subtitle">基于 HEXACO 六因素模型</p>
      </div>
      <button class="back-btn" @click="$router.push('/')">
        ← 返回首页
      </button>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在生成报告...</p>
    </div>

    <div v-else-if="result" class="report-content">
      <section class="section mbti-section">
        <div class="section-header">
          <h2 class="section-title">MBTI 类型</h2>
          <span class="section-badge">十六型人格</span>
        </div>
        <MbtiSpectrum :data="result.mbti" />
      </section>

      <section class="section radar-section">
        <div class="section-header">
          <h2 class="section-title">HEXACO 六维度雷达图</h2>
          <span class="section-badge">人格特征</span>
        </div>
        <HexacoRadarChart :data="result.hexaco" />
        <div class="dimension-summary">
          <div class="summary-item" v-for="dim in result.hexaco" :key="dim.code">
            <span class="summary-code">{{ dim.code }}</span>
            <span class="summary-name">{{ dim.name }}</span>
            <span class="summary-t">{{ dim.tScore.toFixed(1) }}</span>
            <span class="summary-p">{{ dim.percentile.toFixed(0) }}%</span>
          </div>
        </div>
      </section>

      <section class="section facets-section">
        <div class="section-header">
          <h2 class="section-title">24 子面详细得分</h2>
          <span class="section-badge">子维度分析</span>
        </div>
        <FacetBarCharts :data="result.facets" />
      </section>

      <section class="section validity-section">
        <ValidityIndicator :data="result.validity" />
      </section>

      <section class="section meta-section">
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">已答题数</span>
            <span class="meta-value">{{ result.answeredCount }} / 96</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">生成时间</span>
            <span class="meta-value">{{ formatDate(result.calculatedAt) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">会话 ID</span>
            <span class="meta-value">{{ sessionId }}</span>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📊</div>
      <h2>暂无报告数据</h2>
      <p>请先完成测验以生成人格分析报告</p>
      <button class="start-btn" @click="$router.push('/quiz')">开始测验</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useResultStore } from '../stores/resultStore'
import HexacoRadarChart from '../components/HexacoRadarChart.vue'
import FacetBarCharts from '../components/FacetBarCharts.vue'
import MbtiSpectrum from '../components/MbtiSpectrum.vue'
import ValidityIndicator from '../components/ValidityIndicator.vue'

const route = useRoute()
const store = useResultStore()
const { sessionId, result, loading } = store

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await store.fetchResult(id)
  } else {
    store.useMock()
  }
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.report-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding-bottom: 40px;
}

.report-header {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  padding: 24px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.report-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.report-subtitle {
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.report-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 20px;
}

.section {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.section-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 20px;
  font-weight: 500;
}

.dimension-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 20px 24px;
  background: #f8fafc;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-code {
  font-size: 16px;
  font-weight: 700;
  color: #6366f1;
  min-width: 24px;
}

.summary-name {
  font-size: 13px;
  color: #64748b;
  min-width: 60px;
}

.summary-t {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.summary-p {
  font-size: 12px;
  color: #94a3b8;
}

.meta-section {
  padding: 20px 24px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #94a3b8;
}

.meta-value {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 16px;
}

.empty-icon {
  font-size: 64px;
}

.empty-state h2 {
  font-size: 24px;
  color: #334155;
  margin: 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.start-btn {
  margin-top: 24px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .report-header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .report-title {
    font-size: 22px;
  }

  .section-header {
    padding: 16px 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
