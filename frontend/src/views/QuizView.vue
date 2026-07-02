<template>
  <div class="quiz-view">
    <header class="quiz-header">
      <div class="header-left">
        <button class="back-btn" @click="confirmExit">←</button>
        <span class="quiz-title">人格测验</span>
      </div>
      <div class="header-center">
        <span class="progress-text">{{ answeredCount }} / {{ questions.length }}</span>
      </div>
      <div class="header-right">
        <div class="timer-badge" :class="timeStatus">
          <span class="timer-icon">⏱️</span>
          <span class="timer-text">{{ formatTime(elapsedTime) }}</span>
        </div>
      </div>
    </header>

    <div class="quiz-progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <div v-if="showSjtQuestions" class="quiz-content sjt-mode">
      <div class="question-card">
        <div class="question-meta">
          <span class="question-id">情境测验</span>
          <span class="question-dimension">第 {{ sjtCurrentIndex + 1 }} / {{ sjtQuestions.length }}</span>
        </div>
        <h2 class="question-text">{{ sjtQuestions[sjtCurrentIndex].scenario }}</h2>
        <div class="options-list">
          <button 
            v-for="(option, idx) in sjtQuestions[sjtCurrentIndex].options" 
            :key="idx"
            class="option-btn sjt-option"
            :class="{ selected: sjtSelectedAnswer === idx }"
            @click="selectSjtAnswer(idx)"
          >
            <span class="option-label">{{ String.fromCharCode(65 + idx) }}</span>
            <span class="option-text">{{ option }}</span>
          </button>
        </div>
        <div class="question-nav">
          <button 
            class="nav-btn prev" 
            :disabled="sjtCurrentIndex === 0"
            @click="prevSjtQuestion"
          >
            ← 上一题
          </button>
          <button 
            class="nav-btn next" 
            :disabled="sjtSelectedAnswer === null"
            @click="nextSjtQuestion"
          >
            {{ sjtCurrentIndex === sjtQuestions.length - 1 ? '完成测验' : '下一题 →' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
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
        
        <div v-if="responseTimeWarning" class="time-warning" :class="responseTimeWarning.type">
          <span class="warning-icon">{{ responseTimeWarning.type === 'fast' ? '⚡' : '⏰' }}</span>
          <span class="warning-text">{{ responseTimeWarning.message }}</span>
        </div>

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
            {{ currentIndex === questions.length - 1 ? '进入情境测验' : '下一题 →' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h2>题目加载失败</h2>
      <p>请稍后重试</p>
    </div>

    <div v-if="showNavPanel" class="nav-panel-overlay" @click="showNavPanel = false">
      <div class="nav-panel" @click.stop>
        <div class="nav-panel-header">
          <span class="nav-panel-title">题目导航</span>
          <button class="nav-panel-close" @click="showNavPanel = false">×</button>
        </div>
        <div class="nav-grid">
          <button 
            v-for="(q, idx) in questions" 
            :key="q.id"
            class="nav-item"
            :class="{ 
              current: idx === currentIndex, 
              answered: savedAnswers[idx] !== undefined 
            }"
            @click="jumpToQuestion(idx)"
          >
            {{ idx + 1 }}
          </button>
        </div>
        <div class="nav-panel-footer">
          <span class="nav-legend">
            <span class="legend-dot answered"></span> 已答
            <span class="legend-dot current"></span> 当前
            <span class="legend-dot"></span> 未答
          </span>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="bottom-btn" @click="showNavPanel = true">
        <span class="bottom-icon">📋</span>
        <span class="bottom-text">导航</span>
      </button>
      <button class="bottom-btn save-btn" @click="manualSave">
        <span class="bottom-icon">💾</span>
        <span class="bottom-text">{{ saveStatus }}</span>
      </button>
    </div>

    <div v-if="showExitModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-icon">⚠️</div>
        <h3 class="modal-title">确定要退出吗？</h3>
        <p class="modal-desc">您的进度已自动保存，退出后可继续作答</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showExitModal = false">继续作答</button>
          <button class="modal-btn confirm" @click="exitQuiz">退出测验</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const loading = ref(true)
const sessionId = ref(null)
const answerStartTime = ref(null)
const elapsedTime = ref(0)
const savedAnswers = ref({})
const showNavPanel = ref(false)
const showExitModal = ref(false)
const saveStatus = ref('已保存')
const responseTimeWarning = ref(null)

const sjtQuestions = ref([])
const sjtCurrentIndex = ref(0)
const sjtSelectedAnswer = ref(null)
const showSjtQuestions = ref(false)

let timerInterval = null
let responseTimerInterval = null

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
  return ((answeredCount.value) / questions.value.length) * 100
})

const answeredCount = computed(() => Object.keys(savedAnswers.value).length)

const timeStatus = computed(() => {
  const minutes = elapsedTime.value / 60000
  if (minutes < 10) return 'fast'
  if (minutes > 30) return 'slow'
  return 'normal'
})

onMounted(async () => {
  timerInterval = setInterval(() => {
    elapsedTime.value += 1000
  }, 1000)
  
  await initQuiz()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (responseTimerInterval) clearInterval(responseTimerInterval)
  autoSave()
})

watch(savedAnswers, () => {
  autoSave()
}, { deep: true })

async function initQuiz() {
  try {
    const sessionResponse = await axios.post('/api/sessions')
    sessionId.value = sessionResponse.data.id
    const questionsResponse = await axios.get('/api/questions')
    questions.value = questionsResponse.data
    const sjtResponse = await axios.get('/api/sjt')
    sjtQuestions.value = sjtResponse.data
  } catch (error) {
    console.warn('Failed to init quiz:', error)
    questions.value = generateMockQuestions()
    sjtQuestions.value = generateMockSjtQuestions()
    sessionId.value = 'mock-session'
  }
  
  loadProgress()
  startResponseTimer()
  answerStartTime.value = Date.now()
  loading.value = false
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

function generateMockSjtQuestions() {
  return [
    {
      scenario: '团队项目中，你发现一位同事经常拖延工作，导致整个团队进度滞后。你会怎么做？',
      options: [
        '直接向领导汇报，让领导来处理',
        '私下与同事沟通，了解原因并提供帮助',
        '自己多做一些工作来弥补进度',
        '组织团队会议，公开讨论这个问题'
      ]
    },
    {
      scenario: '朋友向你借了一笔钱，但过了约定时间很久都没有归还。你会怎么做？',
      options: [
        '直接开口提醒对方还款',
        '等待对方主动归还，不好意思催促',
        '找个理由向对方借钱，以此提醒',
        '从此不再借钱给对方'
      ]
    },
    {
      scenario: '在会议上，你不同意领导提出的方案，但其他同事都表示赞同。你会怎么做？',
      options: [
        '保持沉默，服从多数意见',
        '会后单独向领导表达自己的观点',
        '在会议上直接提出反对意见',
        '假装赞同，但私下不执行'
      ]
    }
  ]
}

function startResponseTimer() {
  if (responseTimerInterval) clearInterval(responseTimerInterval)
  responseTimerInterval = setInterval(() => {
    const time = Date.now() - answerStartTime.value
    if (time < 1500 && !selectedAnswer.value) {
      responseTimeWarning.value = { type: 'fast', message: '请认真思考后再作答' }
    } else if (time > 60000 && !selectedAnswer.value) {
      responseTimeWarning.value = { type: 'slow', message: '这道题已经思考很久了，建议尽快作答' }
    } else {
      responseTimeWarning.value = null
    }
  }, 500)
}

function selectAnswer(value) {
  selectedAnswer.value = value
  savedAnswers.value[currentIndex.value] = {
    questionId: currentQuestion.value.id,
    answer: value,
    responseTime: Date.now() - answerStartTime.value
  }
}

function selectSjtAnswer(value) {
  sjtSelectedAnswer.value = value
}

async function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = savedAnswers.value[currentIndex.value]?.answer || null
    answerStartTime.value = Date.now()
    startResponseTimer()
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
    selectedAnswer.value = savedAnswers.value[currentIndex.value]?.answer || null
    answerStartTime.value = Date.now()
    startResponseTimer()
  } else {
    showSjtQuestions.value = true
  }
}

function prevSjtQuestion() {
  if (sjtCurrentIndex.value > 0) {
    sjtCurrentIndex.value--
    sjtSelectedAnswer.value = null
  }
}

async function nextSjtQuestion() {
  if (sjtSelectedAnswer.value === null) return
  
  try {
    await axios.post(`/api/sessions/${sessionId.value}/sjt`, {
      question_index: sjtCurrentIndex.value,
      answer_index: sjtSelectedAnswer.value
    })
  } catch (error) {
    console.warn('Failed to submit SJT answer:', error)
  }
  
  if (sjtCurrentIndex.value < sjtQuestions.value.length - 1) {
    sjtCurrentIndex.value++
    sjtSelectedAnswer.value = null
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
      localStorage.removeItem('quiz_progress')
      window.location.href = `/report/${sessionId.value}`
    }
  } catch (error) {
    console.error('Failed to complete quiz:', error)
    localStorage.removeItem('quiz_progress')
    window.location.href = '/report'
  }
}

function jumpToQuestion(idx) {
  currentIndex.value = idx
  selectedAnswer.value = savedAnswers.value[idx]?.answer || null
  answerStartTime.value = Date.now()
  startResponseTimer()
  showNavPanel.value = false
}

function autoSave() {
  const progress = {
    sessionId: sessionId.value,
    currentIndex: currentIndex.value,
    savedAnswers: savedAnswers.value,
    elapsedTime: elapsedTime.value,
    savedAt: Date.now()
  }
  localStorage.setItem('quiz_progress', JSON.stringify(progress))
  saveStatus.value = '已保存'
}

function manualSave() {
  autoSave()
  saveStatus.value = '保存中...'
  setTimeout(() => {
    saveStatus.value = '已保存'
  }, 1000)
}

function loadProgress() {
  const saved = localStorage.getItem('quiz_progress')
  if (saved) {
    try {
      const progress = JSON.parse(saved)
      if (progress.sessionId && progress.savedAnswers) {
        sessionId.value = progress.sessionId
        savedAnswers.value = progress.savedAnswers
        currentIndex.value = progress.currentIndex
        elapsedTime.value = progress.elapsedTime || 0
      }
    } catch (e) {
      console.warn('Failed to load progress:', e)
    }
  }
}

function confirmExit() {
  showExitModal.value = true
}

function exitQuiz() {
  autoSave()
  showExitModal.value = false
  window.location.href = '/'
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.quiz-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding-bottom: 80px;
}

.quiz-header {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-center {
  flex: 1;
  text-align: center;
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

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.timer-badge.normal {
  background: #ecfdf5;
  color: #065f46;
}

.timer-badge.fast {
  background: #fef3c7;
  color: #92400e;
}

.timer-badge.slow {
  background: #fee2e2;
  color: #991b1b;
}

.quiz-progress-bar {
  height: 4px;
  background: #e2e8f0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
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
  margin: 0 0 20px 0;
}

.time-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
}

.time-warning.fast {
  background: #fffbeb;
  color: #92400e;
}

.time-warning.slow {
  background: #fef2f2;
  color: #991b1b;
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

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 12px 24px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
}

.bottom-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.bottom-btn:hover {
  background: #e2e8f0;
}

.save-btn {
  background: #ecfdf5;
  color: #065f46;
}

.save-btn:hover {
  background: #dcfce7;
}

.nav-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.nav-panel {
  width: 100%;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.nav-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.nav-panel-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.nav-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #e2e8f0;
}

.nav-item.answered {
  background: #e0e7ff;
  color: #4338ca;
}

.nav-item.current {
  background: #6366f1;
  color: #fff;
}

.nav-panel-footer {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.nav-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 13px;
  color: #64748b;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: #f1f5f9;
  margin-right: 6px;
}

.legend-dot.answered {
  background: #e0e7ff;
}

.legend-dot.current {
  background: #6366f1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  max-width: 360px;
  width: 90%;
  text-align: center;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 8px 0;
}

.modal-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: #f1f5f9;
  color: #64748b;
}

.modal-btn.confirm {
  background: #ef4444;
  color: #fff;
}

.sjt-mode .question-card {
  padding: 32px;
}

.sjt-option {
  padding: 14px 20px;
}

.sjt-option .option-label {
  background: #f1f5f9;
  color: #64748b;
}

.sjt-option.selected .option-label {
  background: #6366f1;
  color: #fff;
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
  .quiz-header {
    padding: 12px 16px;
  }
  
  .header-center {
    display: none;
  }
  
  .header-right {
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  
  .quiz-content {
    padding: 24px 16px;
  }
  
  .question-card {
    padding: 20px;
  }
  
  .question-text {
    font-size: 18px;
  }
  
  .option-btn {
    padding: 14px 16px;
  }
  
  .nav-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .bottom-bar {
    padding: 10px 16px;
    gap: 12px;
  }
  
  .bottom-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .question-nav {
    flex-direction: column;
  }
  
  .nav-btn {
    padding: 12px;
    font-size: 15px;
  }
  
  .nav-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
