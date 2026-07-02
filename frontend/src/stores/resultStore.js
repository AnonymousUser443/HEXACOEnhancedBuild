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
      type: 'ENFJ'
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
