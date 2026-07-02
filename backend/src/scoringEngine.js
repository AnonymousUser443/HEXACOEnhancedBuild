/**
 * 多维人格交叉量表评分引擎
 * 
 * 核心流程：
 * 1. 原始分计算 → 反向计分转换
 * 2. 子面得分 → 维度得分
 * 3. T分数转换（基于常模）
 * 4. 百分位计算（正态分布查表）
 * 5. HEXACO → MBTI 逻辑斯蒂回归映射
 * 6. HEXACO → 九型人格映射
 * 7. MBTI → 荣格八维功能栈查表
 */

const DIMENSION_NAMES = {
  H: '诚实-谦逊',
  E: '情绪性',
  X: '外向性',
  A: '宜人性',
  C: '严谨性',
  O: '开放性'
};

const MBTI_DIMENSIONS = ['EI', 'SN', 'TF', 'JP'];

/**
 * HEXACO-CN 常模参数（预设，基于文献与中国样本校准）
 * T分数 = 50 + 10 × (原始分 - 均值) / 标准差
 */
const HEXACO_NORMS = {
  H: { mean: 3.5, sd: 0.55 },
  E: { mean: 3.2, sd: 0.60 },
  X: { mean: 3.3, sd: 0.65 },
  A: { mean: 3.6, sd: 0.50 },
  C: { mean: 3.4, sd: 0.55 },
  O: { mean: 3.5, sd: 0.60 }
};

/**
 * HEXACO → MBTI 逻辑斯蒂回归权重
 * P(type) = 1 / (1 + exp(-(β₀ + β₁×H + β₂×E + β₃×X + β₄×A + β₅×C + β₆×O)))
 */
const MBTI_WEIGHTS = {
  EI: {
    intercept: -0.5,
    weights: { H: 0.1, E: -0.3, X: 1.5, A: 0.1, C: -0.2, O: 0.1 }
  },
  SN: {
    intercept: -0.3,
    weights: { H: -0.1, E: 0.2, X: -0.1, A: -0.1, C: -0.3, O: 1.5 }
  },
  TF: {
    intercept: 0.8,
    weights: { H: 0.3, E: 0.4, X: -0.2, A: 0.8, C: 0.2, O: -0.1 }
  },
  JP: {
    intercept: 0.2,
    weights: { H: 0.2, E: -0.3, X: -0.1, A: -0.1, C: 1.0, O: -0.4 }
  }
};

const ENNEAGRAM_WEIGHTS = {
  '1': { H: 0.8, E: -0.3, X: -0.2, A: 0.3, C: 0.9, O: 0.1 },
  '2': { H: 0.6, E: 0.2, X: 0.4, A: 0.9, C: 0.3, O: 0.2 },
  '3': { H: -0.2, E: -0.1, X: 0.8, A: 0.4, C: 0.7, O: 0.5 },
  '4': { H: 0.3, E: 0.7, X: -0.1, A: 0.5, C: -0.2, O: 0.8 },
  '5': { H: 0.5, E: -0.4, X: -0.3, A: 0.2, C: 0.4, O: 0.9 },
  '6': { H: 0.7, E: 0.6, X: -0.1, A: 0.5, C: 0.6, O: -0.2 },
  '7': { H: -0.1, E: -0.3, X: 0.9, A: 0.3, C: -0.3, O: 0.7 },
  '8': { H: -0.3, E: 0.5, X: 0.7, A: -0.2, C: 0.8, O: 0.3 },
  '9': { H: 0.4, E: -0.2, X: 0.2, A: 0.8, C: 0.1, O: 0.4 }
};

const { COGNITIVE_FUNCTIONS, ENNEAGRAM_PROFILES, MBTI_PROFILES } = require('./personalityProfiles');
const { calculateOverallValidity } = require('./anomalyDetection');

function applyReverseScoring(rawValue, reverseScored) {
  return reverseScored ? (6 - rawValue) : rawValue;
}

function calculateFacetScores(answers) {
  const facetScores = {};

  for (const a of answers) {
    const rawScore = applyReverseScoring(a.answer_value, a.reverse_scored);
    const facetKey = a.dimension_code + '_' + a.facet_name;

    if (!facetScores[facetKey]) {
      facetScores[facetKey] = {
        dimension: a.dimension_code,
        facet: a.facet_name,
        total: 0,
        count: 0,
        items: []
      };
    }
    facetScores[facetKey].total += rawScore;
    facetScores[facetKey].count++;
    facetScores[facetKey].items.push({
      questionId: a.question_id,
      rawValue: a.answer_value,
      scoredValue: rawScore,
      reverseScored: a.reverse_scored
    });
  }

  const results = [];
  for (const [key, val] of Object.entries(facetScores)) {
    const avg = val.total / val.count;
    results.push({
      dimension: val.dimension,
      facet: val.facet,
      rawScore: Math.round(avg * 100) / 100,
      rawTotal: val.total,
      count: val.count,
      items: val.items
    });
  }

  return results.sort((a, b) => {
    const dimOrder = ['H', 'E', 'X', 'A', 'C', 'O'];
    const dimDiff = dimOrder.indexOf(a.dimension) - dimOrder.indexOf(b.dimension);
    return dimDiff !== 0 ? dimDiff : a.facet.localeCompare(b.facet);
  });
}

function calculateDimensionScores(facetScores) {
  const dimensionScores = {};

  for (const fs of facetScores) {
    if (!dimensionScores[fs.dimension]) {
      dimensionScores[fs.dimension] = {
        code: fs.dimension,
        name: DIMENSION_NAMES[fs.dimension],
        facets: [],
        total: 0,
        count: 0
      };
    }
    dimensionScores[fs.dimension].facets.push(fs);
    dimensionScores[fs.dimension].total += fs.rawScore;
    dimensionScores[fs.dimension].count++;
  }

  const results = [];
  const dimOrder = ['H', 'E', 'X', 'A', 'C', 'O'];

  for (const dim of dimOrder) {
    const ds = dimensionScores[dim];
    if (ds) {
      const avg = ds.total / ds.count;
      const norm = HEXACO_NORMS[dim];
      const zScore = (avg - norm.mean) / norm.sd;
      const tScore = Math.round((50 + 10 * zScore) * 10) / 10;
      const percentile = calculatePercentile(zScore);

      results.push({
        code: ds.code,
        name: ds.name,
        rawScore: Math.round(avg * 100) / 100,
        tScore,
        zScore: Math.round(zScore * 100) / 100,
        percentile,
        normMean: norm.mean,
        normSD: norm.sd,
        facets: ds.facets
      });
    }
  }

  return results;
}

function calculatePercentile(z) {
  if (z < -3.4) return 0;
  if (z > 3.4) return 100;

  const t = Math.abs(z);
  let y = 1 / (1 + 0.2316419 * t);
  const a1 = 0.319381530, a2 = -0.356563782, a3 = 1.781477937;
  const a4 = -1.821255978, a5 = 1.330274429;

  y = y * (a1 + y * (a2 + y * (a3 + y * (a4 + y * a5))));
  y = 1 - 0.39894228 * Math.exp(-t * t / 2) * y;

  let percentile = z >= 0 ? y : (1 - y);
  return Math.round(percentile * 100);
}

function mapToMBTI(dimensionScores) {
  const dimensionMap = {};
  for (const ds of dimensionScores) {
    dimensionMap[ds.code] = ds.rawScore;
  }

  const result = {};

  for (const mbtiDim of MBTI_DIMENSIONS) {
    const weights = MBTI_WEIGHTS[mbtiDim];
    let linear = weights.intercept;

    for (const [dim, w] of Object.entries(weights.weights)) {
      linear += w * (dimensionMap[dim] || 3.0);
    }

    const probability = 1 / (1 + Math.exp(-linear));
    const percent = Math.round(probability * 100);

    let type, opposite;
    if (mbtiDim === 'EI') {
      type = probability >= 0.5 ? 'E' : 'I';
      opposite = probability >= 0.5 ? 'I' : 'E';
    } else if (mbtiDim === 'SN') {
      type = probability >= 0.5 ? 'N' : 'S';
      opposite = probability >= 0.5 ? 'S' : 'N';
    } else if (mbtiDim === 'TF') {
      type = probability >= 0.5 ? 'F' : 'T';
      opposite = probability >= 0.5 ? 'T' : 'F';
    } else if (mbtiDim === 'JP') {
      type = probability >= 0.5 ? 'J' : 'P';
      opposite = probability >= 0.5 ? 'P' : 'J';
    }

    result[mbtiDim] = {
      type,
      opposite,
      probability: Math.round(probability * 100) / 100,
      percent,
      linearScore: Math.round(linear * 100) / 100
    };
  }

  result.type = result.EI.type + result.SN.type + result.TF.type + result.JP.type;

  return result;
}

function mapToEnneagram(dimensionScores) {
  const dimensionMap = {};
  for (const ds of dimensionScores) {
    dimensionMap[ds.code] = ds.rawScore;
  }

  const scores = {};
  let maxScore = -Infinity;
  let maxType = '9';

  for (const [type, weights] of Object.entries(ENNEAGRAM_WEIGHTS)) {
    let score = 0;
    for (const [dim, w] of Object.entries(weights)) {
      score += w * (dimensionMap[dim] || 3.0);
    }
    scores[type] = score;
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const probabilities = {};
  for (const [type, score] of Object.entries(scores)) {
    probabilities[type] = Math.round((score / total) * 100) / 100;
  }

  const sortedTypes = Object.entries(probabilities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return {
    type: maxType,
    primary: maxType,
    probabilities,
    topThree: sortedTypes.map(([type, prob]) => ({
      type,
      probability: prob,
      percent: Math.round(prob * 100)
    })),
    scores
  };
}

function analyzeResponseTimes(answers) {
  const times = answers.filter(a => a.response_time_ms > 0).map(a => a.response_time_ms);
  
  if (times.length === 0) {
    return {
      valid: true,
      warning: null,
      avgResponseTime: null,
      stdResponseTime: null,
      fastCount: 0,
      slowCount: 0,
      anomalies: [],
      pattern: 'normal'
    };
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length;
  const std = Math.sqrt(variance);

  const fastCount = times.filter(t => t < 1500).length;
  const veryFastCount = times.filter(t => t < 500).length;
  const slowCount = times.filter(t => t > 30000).length;
  const verySlowCount = times.filter(t => t > 60000).length;

  const anomalies = [];
  let valid = true;
  let warning = null;
  let pattern = 'normal';

  if (veryFastCount > 0) {
    anomalies.push({ type: 'very_fast', count: veryFastCount, message: '存在极快速作答（<500ms）' });
    valid = false;
  }

  if (fastCount > times.length * 0.25) {
    anomalies.push({ type: 'fast', count: fastCount, message: `超过25%题目作答过快（<1.5s）` });
    valid = false;
  } else if (fastCount > times.length * 0.1) {
    anomalies.push({ type: 'some_fast', count: fastCount, message: `部分题目作答较快` });
    if (!warning) warning = '部分题目作答较快，请确保认真阅读题干后再选择';
  }

  if (verySlowCount > times.length * 0.1) {
    anomalies.push({ type: 'very_slow', count: verySlowCount, message: `超过10%题目作答过慢（>60s）` });
    if (!warning) warning = '部分题目作答时间过长，可能存在分心';
  }

  if (slowCount > times.length * 0.2) {
    anomalies.push({ type: 'slow', count: slowCount, message: `超过20%题目作答较慢（>30s）` });
    if (!warning) warning = '部分题目作答较慢';
  }

  const cv = std / avg;
  if (cv > 2.0) {
    anomalies.push({ type: 'high_variance', message: '作答时间波动过大，可能存在不认真作答' });
    pattern = 'inconsistent';
  }

  if (avg < 2500) {
    pattern = 'fast';
    if (!warning) warning = '整体作答速度偏快';
  } else if (avg > 15000) {
    pattern = 'slow';
    if (!warning) warning = '整体作答速度偏慢';
  }

  const sequencePattern = detectSequencePattern(times);
  if (sequencePattern) {
    anomalies.push(sequencePattern);
    valid = false;
  }

  return {
    valid,
    warning,
    avgResponseTime: Math.round(avg),
    stdResponseTime: Math.round(std),
    coefficientOfVariation: Math.round(cv * 100) / 100,
    fastCount,
    veryFastCount,
    slowCount,
    verySlowCount,
    totalCount: times.length,
    anomalies,
    pattern
  };
}

function detectSequencePattern(times) {
  let consecutiveFast = 0;
  let maxConsecutiveFast = 0;
  
  for (const t of times) {
    if (t < 1500) {
      consecutiveFast++;
      maxConsecutiveFast = Math.max(maxConsecutiveFast, consecutiveFast);
    } else {
      consecutiveFast = 0;
    }
  }

  if (maxConsecutiveFast >= 5) {
    return { 
      type: 'fast_sequence', 
      count: maxConsecutiveFast,
      message: `连续${maxConsecutiveFast}题快速作答，可能存在随机选择` 
    };
  }

  const equalCount = detectEqualAnswers(times);
  if (equalCount >= 8) {
    return { 
      type: 'equal_sequence', 
      count: equalCount,
      message: `连续${equalCount}题作答时间相近，可能存在规律选择` 
    };
  }

  return null;
}

function detectEqualAnswers(times) {
  let maxEqual = 1;
  let currentEqual = 1;
  
  for (let i = 1; i < times.length; i++) {
    const diff = Math.abs(times[i] - times[i - 1]);
    if (diff < 200) {
      currentEqual++;
      maxEqual = Math.max(maxEqual, currentEqual);
    } else {
      currentEqual = 1;
    }
  }
  
  return maxEqual;
}

function calculateValidityIndex(answers, hexacoScores = null) {
  const rtAnalysis = analyzeResponseTimes(answers);
  
  const reverseCount = answers.filter(a => a.reverse_scored === 1).length;
  const totalCount = answers.length;
  
  const consistencyScore = rtAnalysis.valid ? 1.0 : 0.7;
  
  const validityIndex = Math.round((consistencyScore * 0.7 + (rtAnalysis.avgResponseTime ? Math.min(1, rtAnalysis.avgResponseTime / 5000) : 0.5) * 0.3) * 100) / 100;

  return {
    validityIndex,
    validityLevel: validityIndex >= 0.85 ? 'excellent' : validityIndex >= 0.7 ? 'good' : validityIndex >= 0.55 ? 'fair' : 'poor',
    responseTimeAnalysis: rtAnalysis,
    reverseItemRatio: reverseCount / totalCount,
    answeredCount: totalCount
  };
}

function calculateFullResult(answers, sjtAnswers = []) {
  if (!answers || answers.length === 0) {
    throw new Error('无作答数据');
  }

  const facetScores = calculateFacetScores(answers);
  const dimensionScores = calculateDimensionScores(facetScores);
  const mbtiResult = mapToMBTI(dimensionScores);
  const enneagramResult = mapToEnneagram(dimensionScores);
  
  const validity = calculateOverallValidity(answers, dimensionScores, sjtAnswers);

  const mbtiType = mbtiResult.type;
  const cognitiveFunctions = COGNITIVE_FUNCTIONS[mbtiType] || null;
  const mbtiProfile = MBTI_PROFILES[mbtiType] || null;
  const enneagramProfile = ENNEAGRAM_PROFILES[enneagramResult.type] || null;

  return {
    hexaco: dimensionScores,
    facets: facetScores,
    mbti: {
      ...mbtiResult,
      profile: mbtiProfile
    },
    enneagram: {
      ...enneagramResult,
      profile: enneagramProfile
    },
    cognitiveFunctions,
    validity,
    answeredCount: answers.length,
    calculatedAt: new Date().toISOString()
  };
}

module.exports = {
  applyReverseScoring,
  calculateFacetScores,
  calculateDimensionScores,
  calculatePercentile,
  mapToMBTI,
  mapToEnneagram,
  analyzeResponseTimes,
  calculateValidityIndex,
  calculateFullResult,
  DIMENSION_NAMES,
  HEXACO_NORMS,
  MBTI_WEIGHTS,
  ENNEAGRAM_WEIGHTS,
  COGNITIVE_FUNCTIONS,
  ENNEAGRAM_PROFILES,
  MBTI_PROFILES
};
