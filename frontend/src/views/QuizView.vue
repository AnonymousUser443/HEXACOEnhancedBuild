<template>
  <div class="quiz-view">
    <header class="quiz-header">
      <div class="header-left">
        <button class="back-btn" @click="$router.push('/')">←</button>
        <span class="quiz-title">人格测验</span>
      </div>
      <div class="header-right">
        <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载题目...</p>
    </div>

    <div v-else-if="questions.length > 0" class="quiz-content">
      <div class="question-card">
        <div class="question-meta">
          <span class="question-id">第 {{ currentIndex + 1 }} 题</span>
          <span class="question-dimension">{{ currentQuestion.dimensionName }}</span>
        </div>
        <h2 class="question-text">{{ currentQuestion.text }}</h2>
        <div class="options-list">
          <button 
            v-for="option in options" 
            :key="option.value"
            class="option-btn"
            :class="{ selected: selectedAnswer === option.value }"
            @click="selectAnswer(option.value)"
          >
            <span class="option-label">{{ option.label }}</span>
            <span class="option-text">{{ option.text }}</span>
          </button>
        </div>
        <div class="question-nav">
          <button 
            class="nav-btn prev" 
            :disabled="currentIndex === 0"
            @click="prevQuestion"
          >
            ← 上一题
          </button>
          <button 
            class="nav-btn next" 
            :disabled="!selectedAnswer"
            @click="nextQuestion"
          >
            {{ currentIndex === questions.length - 1 ? '完成测验' : '下一题 →' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h2>题目加载失败</h2>
      <p>请稍后重试</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const loading = ref(true)
const sessionId = ref(null)
const answerStartTime = ref(null)

const options = [
  { value: 1, label: '1', text: '非常不符合' },
  { value: 2, label: '2', text: '不符合' },
  { value: 3, label: '3', text: '中立' },
  { value: 4, label: '4', text: '符合' },
  { value: 5, label: '5', text: '非常符合' }
]

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})

const progressPercent = computed(() => {
  if (questions.value.length === 0) return 0
  return ((currentIndex.value + 1) / questions.value.length) * 100
})

onMounted(async () => {
  await initQuiz()
})

async function initQuiz() {
  try {
    const sessionResponse = await axios.post('/api/sessions')
    sessionId.value = sessionResponse.data.id
    const questionsResponse = await axios.get('/api/questions')
    questions.value = questionsResponse.data
    answerStartTime.value = Date.now()
  } catch (error) {
    console.error('Failed to init quiz:', error)
    questions.value = generateMockQuestions()
    sessionId.value = 'mock-session'
    answerStartTime.value = Date.now()
  } finally {
    loading.value = false
  }
}

function generateMockQuestions() {
  const dims = ['H', 'E', 'X', 'A', 'C', 'O']
  const names = ['诚实-谦逊', '情绪性', '外向性', '宜人性', '严谨性', '开放性']
  const questions = []
  let id = 1
  for (let d = 0; d < 6; d++) {
    for (let f = 1; f <= 4; f++) {
      for (let q = 1; q <= 4; q++) {
        questions.push({
          id: id++,
          text: `${names[d]}维度第${f}子面的第${q}道题目示例。请根据您的实际情况选择符合程度。`,
          dimension_code: dims[d],
          dimensionName: names[d],
          facet_id: `${dims[d]}${f}`,
          facet_name: `子面${f}`,
          reverse_scored: (q % 2 === 0),
          order: id - 1
        })
      }
    }
  }
  return questions
}

function selectAnswer(value) {
  selectedAnswer.value = value
}

async function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = null
    answerStartTime.value = Date.now()
  }
}

async function nextQuestion() {
  if (!selectedAnswer.value) return
  
  const responseTime = Date.now() - answerStartTime.value
  
  try {
    await axios.post(`/api/sessions/${sessionId.value}/answers`, {
      question_id: currentQuestion.value.id,
      answer_value: selectedAnswer.value,
      response_time_ms: responseTime
    })
  } catch (error) {
    console.warn('Failed to submit answer:', error)
  }
  
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    answerStartTime.value = Date.now()
  } else {
    await completeQuiz()
  }
}

async function completeQuiz() {
  loading.value = true
  try {
    await axios.post(`/api/sessions/${sessionId.value}/complete`)
    const resultResponse = await axios.get(`/api/sessions/${sessionId.value}/result`)
    if (resultResponse.data) {
      window.location.href = `/report/${sessionId.value}`
    }
  } catch (error) {
    console.error('Failed to complete quiz:', error)
    window.location.href = '/report'
  }
}
</script>

<style scoped>
.quiz-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.quiz-header {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e2e8f0;
}

.quiz-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #6366f1;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
  transition: width 0.3s ease;
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

.quiz-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.question-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.question-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.question-id {
  font-size: 12px;
  padding: 4px 12px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 20px;
  font-weight: 500;
}

.question-dimension {
  font-size: 12px;
  padding: 4px 12px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 20px;
}

.question-text {
  font-size: 20px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-btn:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.option-btn.selected {
  background: #eef2ff;
  border-color: #6366f1;
}

.option-label {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
}

.option-btn.selected .option-label {
  background: #6366f1;
  color: #fff;
}

.option-text {
  font-size: 16px;
  color: #334155;
}

.question-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.nav-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn.prev {
  background: #f1f5f9;
  color: #64748b;
}

.nav-btn.prev:hover:not(:disabled) {
  background: #e2e8f0;
}

.nav-btn.next {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
}

.nav-btn.next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .header-right {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .question-card {
    padding: 24px;
  }
  
  .question-text {
    font-size: 18px;
  }
  
  .option-btn {
    padding: 14px 16px;
  }
}
</style>
