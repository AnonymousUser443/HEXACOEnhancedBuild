<template>
  <div class="mbti-type-detail">
    <div class="type-header">
      <div class="type-badge">
        <span class="type-letters">{{ data.type }}</span>
      </div>
      <div class="type-info">
        <h3 class="type-name">{{ data.profile?.name || '类型' }}</h3>
        <p class="type-description">{{ data.profile?.description || '暂无描述' }}</p>
      </div>
    </div>

    <div class="type-stats">
      <div class="stat-item">
        <span class="stat-label">外向度</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: data.EI.percent + '%' }"></div>
        </div>
        <span class="stat-value">{{ data.EI.type }} {{ data.EI.percent }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">直觉度</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: data.SN.percent + '%' }"></div>
        </div>
        <span class="stat-value">{{ data.SN.type }} {{ data.SN.percent }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">情感度</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: data.TF.percent + '%' }"></div>
        </div>
        <span class="stat-value">{{ data.TF.type }} {{ data.TF.percent }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">判断度</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{ width: data.JP.percent + '%' }"></div>
        </div>
        <span class="stat-value">{{ data.JP.type }} {{ data.JP.percent }}%</span>
      </div>
    </div>

    <div class="type-sections">
      <div class="section strengths">
        <h4 class="section-title">🌟 优势</h4>
        <ul class="section-list">
          <li v-for="(strength, idx) in data.profile?.strengths" :key="idx">
            {{ strength }}
          </li>
        </ul>
      </div>
      <div class="section weaknesses">
        <h4 class="section-title">💡 成长点</h4>
        <ul class="section-list">
          <li v-for="(weakness, idx) in data.profile?.weaknesses" :key="idx">
            {{ weakness }}
          </li>
        </ul>
      </div>
    </div>

    <div class="type-career">
      <h4 class="section-title">🎯 适合职业</h4>
      <div class="career-tags">
        <span 
          v-for="(career, idx) in data.profile?.careerPaths" 
          :key="idx"
          class="career-tag"
        >
          {{ career }}
        </span>
      </div>
    </div>

    <div class="type-famous">
      <h4 class="section-title">✨ 著名人物</h4>
      <div class="famous-list">
        <span 
          v-for="(person, idx) in data.profile?.famousExamples" 
          :key="idx"
          class="famous-tag"
        >
          {{ person }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.mbti-type-detail {
  padding: 24px;
}

.type-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.type-badge {
  flex-shrink: 0;
}

.type-letters {
  display: block;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.type-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.type-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.stat-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.stat-value {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.type-sections {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.section {
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

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-list li {
  font-size: 13px;
  color: #64748b;
  padding: 4px 0;
  position: relative;
  padding-left: 16px;
}

.section-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6366f1;
}

.type-career,
.type-famous {
  margin-bottom: 20px;
}

.career-tags,
.famous-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.career-tag,
.famous-tag {
  padding: 6px 12px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.famous-tag {
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 640px) {
  .type-stats {
    grid-template-columns: 1fr;
  }
  
  .type-sections {
    grid-template-columns: 1fr;
  }
}
</style>
