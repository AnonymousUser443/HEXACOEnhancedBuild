import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useResultStore = defineStore('result', () => {
  const sessionId = ref(null)
  const result = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const mockResult = {
    hexaco: [
      { code: 'H', name: '诚实-谦逊', rawScore: 3.65, tScore: 52.7, zScore: 0.27, percentile: 60.7, facets: [{ id: 'H1', name: '真诚', score: 3.75 }, { id: 'H2', name: '公平', score: 3.5 }, { id: 'H3', name: '避免贪婪', score: 3.75 }, { id: 'H4', name: '谦逊', score: 3.6 }] },
      { code: 'E', name: '情绪性', rawScore: 2.9, tScore: 45.0, zScore: -0.5, percentile: 30.9, facets: [{ id: 'E1', name: '焦虑', score: 2.75 }, { id: 'E2', name: '抑郁', score: 2.75 }, { id: 'E3', name: '脆弱', score: 3.25 }, { id: 'E4', name: '情绪波动', score: 2.9 }] },
      { code: 'X', name: '外向性', rawScore: 3.7, tScore: 56.2, zScore: 0.62, percentile: 73.2, facets: [{ id: 'X1', name: '社交', score: 3.75 }, { id: 'X2', name: '活跃', score: 3.5 }, { id: 'X3', name: '寻求刺激', score: 4.0 }, { id: 'X4', name: '乐观', score: 3.55 }] },
      { code: 'A', name: '宜人性', rawScore: 3.85, tScore: 57.0, zScore: 0.7, percentile: 75.8, facets: [{ id: 'A1', name: '宽容', score: 4.0 }, { id: 'A2', name: '温和', score: 3.75 }, { id: 'A3', name: '耐心', score: 3.75 }, { id: 'A4', name: '谦虚', score: 3.9 }] },
      { code: 'C', name: '严谨性', rawScore: 3.55, tScore: 52.7, zScore: 0.27, percentile: 60.7, facets: [{ id: 'C1', name: '组织', score: 3.75 }, { id: 'C2', name: '尽责', score: 3.5 }, { id: 'C3', name: '自律', score: 3.5 }, { id: 'C4', name: '审慎', score: 3.4 }] },
      { code: 'O', name: '开放性', rawScore: 3.8, tScore: 55.0, zScore: 0.5, percentile: 69.1, facets: [{ id: 'O1', name: '审美', score: 4.0 }, { id: 'O2', name: '好奇心', score: 3.75 }, { id: 'O3', name: '创造力', score: 3.75 }, { id: 'O4', name: '非常规', score: 3.7 }] }
    ],
    facets: [
      { id: 'H1', name: '真诚', dimension: 'H', dimensionName: '诚实-谦逊', score: 3.75, items: [] },
      { id: 'H2', name: '公平', dimension: 'H', dimensionName: '诚实-谦逊', score: 3.5, items: [] },
      { id: 'H3', name: '避免贪婪', dimension: 'H', dimensionName: '诚实-谦逊', score: 3.75, items: [] },
      { id: 'H4', name: '谦逊', dimension: 'H', dimensionName: '诚实-谦逊', score: 3.6, items: [] },
      { id: 'E1', name: '焦虑', dimension: 'E', dimensionName: '情绪性', score: 2.75, items: [] },
      { id: 'E2', name: '抑郁', dimension: 'E', dimensionName: '情绪性', score: 2.75, items: [] },
      { id: 'E3', name: '脆弱', dimension: 'E', dimensionName: '情绪性', score: 3.25, items: [] },
      { id: 'E4', name: '情绪波动', dimension: 'E', dimensionName: '情绪性', score: 2.9, items: [] },
      { id: 'X1', name: '社交', dimension: 'X', dimensionName: '外向性', score: 3.75, items: [] },
      { id: 'X2', name: '活跃', dimension: 'X', dimensionName: '外向性', score: 3.5, items: [] },
      { id: 'X3', name: '寻求刺激', dimension: 'X', dimensionName: '外向性', score: 4.0, items: [] },
      { id: 'X4', name: '乐观', dimension: 'X', dimensionName: '外向性', score: 3.55, items: [] },
      { id: 'A1', name: '宽容', dimension: 'A', dimensionName: '宜人性', score: 4.0, items: [] },
      { id: 'A2', name: '温和', dimension: 'A', dimensionName: '宜人性', score: 3.75, items: [] },
      { id: 'A3', name: '耐心', dimension: 'A', dimensionName: '宜人性', score: 3.75, items: [] },
      { id: 'A4', name: '谦虚', dimension: 'A', dimensionName: '宜人性', score: 3.9, items: [] },
      { id: 'C1', name: '组织', dimension: 'C', dimensionName: '严谨性', score: 3.75, items: [] },
      { id: 'C2', name: '尽责', dimension: 'C', dimensionName: '严谨性', score: 3.5, items: [] },
      { id: 'C3', name: '自律', dimension: 'C', dimensionName: '严谨性', score: 3.5, items: [] },
      { id: 'C4', name: '审慎', dimension: 'C', dimensionName: '严谨性', score: 3.4, items: [] },
      { id: 'O1', name: '审美', dimension: 'O', dimensionName: '开放性', score: 4.0, items: [] },
      { id: 'O2', name: '好奇心', dimension: 'O', dimensionName: '开放性', score: 3.75, items: [] },
      { id: 'O3', name: '创造力', dimension: 'O', dimensionName: '开放性', score: 3.75, items: [] },
      { id: 'O4', name: '非常规', dimension: 'O', dimensionName: '开放性', score: 3.7, items: [] }
    ],
    mbti: {
      EI: { type: 'E', probability: 0.73, percent: 73 },
      SN: { type: 'N', probability: 0.69, percent: 69 },
      TF: { type: 'F', probability: 0.76, percent: 76 },
      JP: { type: 'J', probability: 0.61, percent: 61 },
      type: 'ENFJ',
      profile: {
        name: '主人公型',
        description: '主人公型人格是天生的领导者，充满热情和魅力，善于激励他人。他们具有强烈的责任感和理想主义，渴望让世界变得更美好。',
        strengths: ['善于沟通', '富有感染力', '责任心强', '有远见'],
        growthPoints: ['学会拒绝', '保持理性', '关注自我需求'],
        careers: ['教师', '咨询师', '管理者', '社工'],
        famousPeople: ['马丁·路德·金', '奥普拉·温弗瑞', '约翰·肯尼迪']
      }
    },
    cognitiveFunctions: {
      dominant: { name: 'Fe', label: '外倾情感', description: '通过情感连接与他人建立关系' },
      auxiliary: { name: 'Ni', label: '内倾直觉', description: '洞察深层意义和未来可能性' },
      tertiary: { name: 'Se', label: '外倾感觉', description: '关注当下的具体体验' },
      inferior: { name: 'Ti', label: '内倾思考', description: '逻辑分析和客观推理' },
      shadow: [
        { position: '第五功能', name: 'Ti', label: '内倾思考' },
        { position: '第六功能', name: 'Se', label: '外倾感觉' },
        { position: '第七功能', name: 'Ni', label: '内倾直觉' },
        { position: '第八功能', name: 'Fe', label: '外倾情感' }
      ]
    },
    enneagram: {
      type: '2',
      probability: 0.35,
      topThree: [
        { type: '2', name: '助人型', percent: 35 },
        { type: '3', name: '成就型', percent: 28 },
        { type: '7', name: '活跃型', percent: 22 }
      ],
      profile: {
        name: '助人型',
        alias: '给予者',
        coreMotivation: '被爱和被需要',
        coreFear: '不被爱、被拒绝',
        description: '助人型人格的核心动机是通过帮助他人来获得爱和认可。他们善于察觉他人的需求，乐于奉献，但有时会忽视自己的感受。',
        strengths: ['富有同情心', '乐于助人', '善于倾听', '团队协作'],
        growthTips: ['学会关爱自己', '建立健康边界', '练习说不'],
        level: ['健康状态：无私奉献，充满爱心', '一般状态：寻求认可，过度付出', '不健康状态：操纵他人，自我牺牲']
      }
    },
    validity: {
      validityIndex: 0.85,
      responseTimeAnalysis: {
        avgResponseTime: 5200,
        fastCount: 3,
        slowCount: 5,
        pattern: 'normal'
      },
      reverseItemRatio: 0.48,
      consistency: 0.88
    },
    answeredCount: 96,
    calculatedAt: '2026-07-02T09:00:00Z'
  }

  async function fetchResult(sessionIdValue) {
    loading.value = true
    error.value = null
    sessionId.value = sessionIdValue

    try {
      const response = await axios.get(`/api/sessions/${sessionIdValue}/result`)
      result.value = response.data
    } catch (err) {
      console.warn('API request failed, falling back to mock data:', err)
      result.value = mockResult
    } finally {
      loading.value = false
    }
  }

  function useMock() {
    result.value = mockResult
    sessionId.value = 'mock-session'
  }

  function clear() {
    sessionId.value = null
    result.value = null
    error.value = null
  }

  return {
    sessionId,
    result,
    loading,
    error,
    mockResult,
    fetchResult,
    useMock,
    clear
  }
})
