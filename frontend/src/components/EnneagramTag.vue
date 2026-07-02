<template>
  <div class="enneagram-tag">
    <div class="enneagram-header">
      <div class="type-circle" :class="enneagramColors[data.type]">
        <span class="type-number">{{ data.type }}</span>
      </div>
      <div class="type-info">
        <h3 class="type-name">{{ data.profile?.name || '类型' }}</h3>
        <span class="type-alias">{{ data.profile?.alias || '' }}</span>
      </div>
    </div>

    <div class="core-motive">
      <div class="motive-item">
        <span class="motive-icon">✨</span>
        <span class="motive-label">核心动机</span>
        <span class="motive-text">{{ data.profile?.coreMotivation || '未知' }}</span>
      </div>
      <div class="motive-item">
        <span class="motive-icon">⚠️</span>
        <span class="motive-label">核心恐惧</span>
        <span class="motive-text">{{ data.profile?.coreFear || '未知' }}</span>
      </div>
    </div>

    <p class="type-description">{{ data.profile?.description || '暂无描述' }}</p>

    <div class="type-sections">
      <div class="section strengths">
        <h4 class="section-title">🌟 优势</h4>
        <div class="section-tags">
          <span v-for="(strength, idx) in data.profile?.strengths" :key="idx" class="tag">
            {{ strength }}
          </span>
        </div>
      </div>
      <div class="section growth">
        <h4 class="section-title">🌱 成长建议</h4>
        <div class="section-tags">
          <span v-for="(tip, idx) in data.profile?.growthTips" :key="idx" class="tag">
            {{ tip }}
          </span>
        </div>
      </div>
    </div>

    <div class="type-level">
      <h4 class="section-title">📊 健康层级</h4>
      <div class="level-list">
        <div class="level-item" v-for="(level, idx) in data.profile?.level" :key="idx">
          <span class="level-dot" :class="['dot-' + (idx + 1)]"></span>
          <span class="level-text">{{ level }}</span>
        </div>
      </div>
    </div>

    <div class="probability-section">
      <h4 class="section-title">📈 类型概率</h4>
      <div class="probability-list">
        <div 
          class="prob-item" 
          v-for="item in data.topThree" 
          :key="item.type"
          :class="{ primary: item.type === data.type }"
        >
          <span class="prob-type">{{ item.type }}号</span>
          <div class="prob-bar">
            <div class="prob-fill" :style="{ width: item.percent + '%' }"></div>
          </div>
          <span class="prob-percent">{{ item.percent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const enneagramColors = {
  '1': 'type-1',
  '2': 'type-2',
  '3': 'type-3',
  '4': 'type-4',
  '5': 'type-5',
  '6': 'type-6',
  '7': 'type-7',
  '8': 'type-8',
  '9': 'type-9'
}

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.enneagram-tag {
  padding: 24px;
}

.enneagram-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.type-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.type-circle.type-1 { background: linear-gradient(135deg, #ef4444, #dc2626); }
.type-circle.type-2 { background: linear-gradient(135deg, #22c55e, #16a34a); }
.type-circle.type-3 { background: linear-gradient(135deg, #eab308, #ca8a04); }
.type-circle.type-4 { background: linear-gradient(135deg, #a855f7, #9333ea); }
.type-circle.type-5 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.type-circle.type-6 { background: linear-gradient(135deg, #f97316, #ea580c); }
.type-circle.type-7 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.type-circle.type-8 { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.type-circle.type-9 { background: linear-gradient(135deg, #ec4899, #db2777); }

.type-number {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.type-alias {
  font-size: 14px;
  color: #64748b;
}

.core-motive {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.motive-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.motive-icon {
  font-size: 16px;
}

.motive-label {
  font-size: 11px;
  color: #94a3b8;
}

.motive-text {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.type-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.type-sections {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.section {
  padding: 14px;
  border-radius: 8px;
}

.section.strengths {
  background: #ecfdf5;
}

.section.growth {
  background: #fffbeb;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
}

.section-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  font-size: 11px;
  color: #475569;
}

.type-level {
  margin-bottom: 20px;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.level-dot.dot-1 { background: #22c55e; }
.level-dot.dot-2 { background: #eab308; }
.level-dot.dot-3 { background: #ef4444; }

.level-text {
  font-size: 13px;
  color: #64748b;
}

.probability-section {
  background: #f8fafc;
  padding: 14px;
  border-radius: 8px;
}

.probability-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prob-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prob-item.primary {
  font-weight: 500;
}

.prob-type {
  width: 40px;
  font-size: 13px;
  color: #64748b;
}

.prob-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.prob-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.prob-percent {
  width: 40px;
  text-align: right;
  font-size: 13px;
  color: #334155;
}

@media (max-width: 640px) {
  .core-motive {
    grid-template-columns: 1fr;
  }
  
  .type-sections {
    grid-template-columns: 1fr;
  }
}
</style>
