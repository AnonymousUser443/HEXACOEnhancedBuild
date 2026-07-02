const ANOMALY_RULES = [
  {
    id: 'rt_very_fast',
    name: '极快速作答',
    description: '作答时间小于500ms，无法正常阅读题干',
    severity: 'high',
    check: (answers) => {
      const times = answers.filter(a => a.response_time_ms > 0).map(a => a.response_time_ms);
      const veryFastCount = times.filter(t => t < 500).length;
      return veryFastCount > 0 ? { detected: true, count: veryFastCount } : { detected: false };
    }
  },
  {
    id: 'rt_fast_rate',
    name: '快速作答比例',
    description: '超过25%的题目作答时间小于1.5秒',
    severity: 'high',
    check: (answers) => {
      const times = answers.filter(a => a.response_time_ms > 0).map(a => a.response_time_ms);
      if (times.length === 0) return { detected: false };
      const fastCount = times.filter(t => t < 1500).length;
      const rate = fastCount / times.length;
      return rate > 0.25 ? { detected: true, rate: Math.round(rate * 100) / 100, count: fastCount } : { detected: false };
    }
  },
  {
    id: 'rt_consecutive_fast',
    name: '连续快速作答',
    description: '连续5题以上快速作答（<1.5秒）',
    severity: 'high',
    check: (answers) => {
      const times = answers.filter(a => a.response_time_ms > 0).map(a => a.response_time_ms);
      let maxConsecutive = 0;
      let current = 0;
      for (const t of times) {
        if (t < 1500) {
          current++;
          maxConsecutive = Math.max(maxConsecutive, current);
        } else {
          current = 0;
        }
      }
      return maxConsecutive >= 5 ? { detected: true, maxConsecutive } : { detected: false };
    }
  },
  {
    id: 'rt_equal_sequence',
    name: '规律作答模式',
    description: '连续8题以上作答时间相近（差异<200ms）',
    severity: 'high',
    check: (answers) => {
      const times = answers.filter(a => a.response_time_ms > 0).map(a => a.response_time_ms);
      let maxEqual = 1;
      let current = 1;
      for (let i = 1; i < times.length; i++) {
        if (Math.abs(times[i] - times[i - 1]) < 200) {
          current++;
          maxEqual = Math.max(maxEqual, current);
        } else {
          current = 1;
        }
      }
      return maxEqual >= 8 ? { detected: true, maxEqual } : { detected: false };
    }
  },
  {
    id: 'answer_all_same',
    name: '答案单一模式',
    description: '超过80%的题目选择相同选项',
    severity: 'high',
    check: (answers) => {
      if (answers.length === 0) return { detected: false };
      const counts = {};
      for (const a of answers) {
        counts[a.answer_value] = (counts[a.answer_value] || 0) + 1;
      }
      const maxCount = Math.max(...Object.values(counts));
      const rate = maxCount / answers.length;
      return rate > 0.8 ? { detected: true, rate: Math.round(rate * 100) / 100, value: Object.keys(counts).find(k => counts[k] === maxCount) } : { detected: false };
    }
  },
  {
    id: 'answer_middle_bias',
    name: '中间选项偏好',
    description: '超过50%的题目选择中间选项（3）',
    severity: 'medium',
    check: (answers) => {
      if (answers.length === 0) return { detected: false };
      const middleCount = answers.filter(a => a.answer_value === 3).length;
      const rate = middleCount / answers.length;
      return rate > 0.5 ? { detected: true, rate: Math.round(rate * 100) / 100 } : { detected: false };
    }
  },
  {
    id: 'answer_pattern_abcd',
    name: 'ABCD规律作答',
    description: '检测到明显的选项循环模式',
    severity: 'high',
    check: (answers) => {
      if (answers.length < 8) return { detected: false };
      const values = answers.map(a => a.answer_value);
      const patterns = ['1234', '4321', '1324', '2143'];
      for (const pattern of patterns) {
        let matches = 0;
        for (let i = 0; i < values.length - 3; i++) {
          const seq = values.slice(i, i + 4).join('');
          if (seq === pattern) matches++;
        }
        if (matches >= 3) return { detected: true, pattern, count: matches };
      }
      return { detected: false };
    }
  },
  {
    id: 'reverse_inconsistency',
    name: '反向计分不一致',
    description: '反向计分题目与正向题目答案模式差异过大',
    severity: 'medium',
    check: (answers) => {
      const reverseAnswers = answers.filter(a => a.reverse_scored === 1);
      const normalAnswers = answers.filter(a => a.reverse_scored !== 1);
      if (reverseAnswers.length === 0 || normalAnswers.length === 0) return { detected: false };
      
      const reverseAvg = reverseAnswers.reduce((sum, a) => sum + a.answer_value, 0) / reverseAnswers.length;
      const normalAvg = normalAnswers.reduce((sum, a) => sum + a.answer_value, 0) / normalAnswers.length;
      const diff = Math.abs(reverseAvg - normalAvg);
      return diff > 2.5 ? { detected: true, diff: Math.round(diff * 100) / 100 } : { detected: false };
    }
  },
  {
    id: 'dimension_extreme',
    name: '维度极端值',
    description: '多个维度同时出现极端高分或低分',
    severity: 'medium',
    check: (answers) => {
      if (answers.length < 20) return { detected: false };
      const counts = { extremeHigh: 0, extremeLow: 0 };
      for (const a of answers) {
        if (a.answer_value === 1) counts.extremeLow++;
        if (a.answer_value === 5) counts.extremeHigh++;
      }
      const rateHigh = counts.extremeHigh / answers.length;
      const rateLow = counts.extremeLow / answers.length;
      if (rateHigh > 0.4 || rateLow > 0.4) {
        return { detected: true, extremeHighRate: Math.round(rateHigh * 100) / 100, extremeLowRate: Math.round(rateLow * 100) / 100 };
      }
      return { detected: false };
    }
  },
  {
    id: 'facet_inconsistency',
    name: '子面内部不一致',
    description: '同一子面内题目答案波动过大',
    severity: 'medium',
    check: (answers) => {
      const facetGroups = {};
      for (const a of answers) {
        const key = `${a.dimension_code}_${a.facet_name}`;
        if (!facetGroups[key]) facetGroups[key] = [];
        facetGroups[key].push(a.answer_value);
      }
      let highVarianceCount = 0;
      for (const [key, values] of Object.entries(facetGroups)) {
        if (values.length < 3) continue;
        const avg = values.reduce((s, v) => s + v, 0) / values.length;
        const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / values.length;
        if (variance > 2.0) highVarianceCount++;
      }
      const rate = highVarianceCount / Object.keys(facetGroups).length;
      return rate > 0.5 ? { detected: true, rate: Math.round(rate * 100) / 100, count: highVarianceCount } : { detected: false };
    }
  }
];

function runAnomalyDetection(answers) {
  const results = [];
  let highSeverityCount = 0;
  let mediumSeverityCount = 0;
  
  for (const rule of ANOMALY_RULES) {
    const result = rule.check(answers);
    if (result.detected) {
      results.push({
        ...rule,
        ...result
      });
      if (rule.severity === 'high') highSeverityCount++;
      if (rule.severity === 'medium') mediumSeverityCount++;
    }
  }
  
  const isAnomalous = highSeverityCount >= 1 || (highSeverityCount === 0 && mediumSeverityCount >= 3);
  const riskLevel = highSeverityCount >= 2 ? 'high' : highSeverityCount === 1 ? 'medium' : 'low';
  
  return {
    isAnomalous,
    riskLevel,
    highSeverityCount,
    mediumSeverityCount,
    totalAnomalies: results.length,
    anomalies: results,
    message: isAnomalous 
      ? `检测到${results.length}项异常，建议重新作答以确保结果准确性` 
      : '未检测到异常作答模式'
  };
}

function calculateOverallValidity(answers, hexacoScores, sjtAnswers = []) {
  const rtAnalysis = require('./scoringEngine').analyzeResponseTimes(answers);
  const anomalyResult = runAnomalyDetection(answers);
  
  let sjtValidity = null;
  if (sjtAnswers && sjtAnswers.length > 0) {
    sjtValidity = require('./sjtQuestions').calculateSJTValidity(sjtAnswers, hexacoScores);
  }
  
  let validityScore = 0;
  let weightSum = 0;
  
  validityScore += (rtAnalysis.valid ? 1.0 : 0.6) * 0.4;
  weightSum += 0.4;
  
  validityScore += (anomalyResult.isAnomalous ? 0.5 : 1.0) * 0.3;
  weightSum += 0.3;
  
  if (sjtValidity) {
    validityScore += (sjtValidity.valid ? 1.0 : 0.6) * 0.3;
    weightSum += 0.3;
  } else {
    validityScore += 0.85 * 0.3;
    weightSum += 0.3;
  }
  
  validityScore = Math.round((validityScore / weightSum) * 100) / 100;
  
  const validityLevel = validityScore >= 0.85 ? 'excellent' : validityScore >= 0.7 ? 'good' : validityScore >= 0.55 ? 'fair' : 'poor';
  
  return {
    validityIndex: validityScore,
    validityLevel,
    responseTimeAnalysis: rtAnalysis,
    anomalyDetection: anomalyResult,
    sjtValidity,
    summary: {
      overall: validityLevel,
      details: [
        { name: '响应时间', value: rtAnalysis.valid ? '正常' : '异常', score: rtAnalysis.valid ? 1.0 : 0.6 },
        { name: '作答模式', value: anomalyResult.isAnomalous ? '异常' : '正常', score: anomalyResult.isAnomalous ? 0.5 : 1.0 },
        { name: '情境测验', value: sjtValidity ? (sjtValidity.valid ? '一致' : '不一致') : '未完成', score: sjtValidity ? (sjtValidity.valid ? 1.0 : 0.6) : 0.85 }
      ]
    }
  };
}

module.exports = {
  ANOMALY_RULES,
  runAnomalyDetection,
  calculateOverallValidity
};
