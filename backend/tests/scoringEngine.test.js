const {
  applyReverseScoring,
  calculateFacetScores,
  calculateDimensionScores,
  calculatePercentile,
  mapToMBTI,
  analyzeResponseTimes,
  calculateValidityIndex,
  calculateFullResult
} = require('../src/scoringEngine');

console.log('=== 评分引擎单元测试 ===\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    failed++;
  }
}

test('反向计分转换 - 正常题', () => {
  const result = applyReverseScoring(3, 0);
  if (result !== 3) throw new Error(`期望 3，得到 ${result}`);
});

test('反向计分转换 - 反向题 5→1', () => {
  const result = applyReverseScoring(5, 1);
  if (result !== 1) throw new Error(`期望 1，得到 ${result}`);
});

test('反向计分转换 - 反向题 1→5', () => {
  const result = applyReverseScoring(1, 1);
  if (result !== 5) throw new Error(`期望 5，得到 ${result}`);
});

test('反向计分转换 - 反向题 3→3', () => {
  const result = applyReverseScoring(3, 1);
  if (result !== 3) throw new Error(`期望 3，得到 ${result}`);
});

test('子面得分计算 - 单维度单题', () => {
  const answers = [{
    answer_value: 4,
    reverse_scored: 0,
    dimension_code: 'H',
    facet_name: '真诚',
    question_id: 1
  }];
  const result = calculateFacetScores(answers);
  if (result.length !== 1) throw new Error(`期望 1 个子面，得到 ${result.length}`);
  if (result[0].rawScore !== 4) throw new Error(`期望得分 4，得到 ${result[0].rawScore}`);
});

test('子面得分计算 - 单维度多题含反向', () => {
  const answers = [
    { answer_value: 4, reverse_scored: 0, dimension_code: 'H', facet_name: '真诚', question_id: 1 },
    { answer_value: 2, reverse_scored: 1, dimension_code: 'H', facet_name: '真诚', question_id: 2 }
  ];
  const result = calculateFacetScores(answers);
  if (result[0].rawScore !== 4) throw new Error(`期望得分 4，得到 ${result[0].rawScore}`);
});

test('子面得分计算 - 多维度', () => {
  const answers = [
    { answer_value: 3, reverse_scored: 0, dimension_code: 'H', facet_name: '真诚', question_id: 1 },
    { answer_value: 4, reverse_scored: 0, dimension_code: 'X', facet_name: '社交活跃', question_id: 41 }
  ];
  const result = calculateFacetScores(answers);
  if (result.length !== 2) throw new Error(`期望 2 个子面，得到 ${result.length}`);
});

test('维度得分计算', () => {
  const facets = [
    { dimension: 'H', facet: '真诚', rawScore: 3.5 },
    { dimension: 'H', facet: '公平', rawScore: 3.0 },
    { dimension: 'H', facet: '贪婪回避', rawScore: 4.0 },
    { dimension: 'H', facet: '谦逊', rawScore: 3.5 }
  ];
  const result = calculateDimensionScores(facets);
  if (result.length !== 1) throw new Error(`期望 1 个维度，得到 ${result.length}`);
  if (result[0].rawScore !== 3.5) throw new Error(`期望原始分 3.5，得到 ${result[0].rawScore}`);
});

test('T分数计算 - 均值等于常模', () => {
  const facets = [
    { dimension: 'H', facet: '真诚', rawScore: 3.5 },
    { dimension: 'H', facet: '公平', rawScore: 3.5 },
    { dimension: 'H', facet: '贪婪回避', rawScore: 3.5 },
    { dimension: 'H', facet: '谦逊', rawScore: 3.5 }
  ];
  const result = calculateDimensionScores(facets);
  if (result[0].tScore !== 50) throw new Error(`期望 T分数 50，得到 ${result[0].tScore}`);
});

test('百分位计算 - z=0', () => {
  const result = calculatePercentile(0);
  if (result !== 50) throw new Error(`期望百分位 50，得到 ${result}`);
});

test('百分位计算 - z=1', () => {
  const result = calculatePercentile(1);
  if (result !== 84) throw new Error(`期望百分位 84，得到 ${result}`);
});

test('百分位计算 - z=-1', () => {
  const result = calculatePercentile(-1);
  if (result !== 16) throw new Error(`期望百分位 16，得到 ${result}`);
});

test('MBTI映射 - 极端外向', () => {
  const dimensions = [
    { code: 'H', rawScore: 3.5 },
    { code: 'E', rawScore: 2.0 },
    { code: 'X', rawScore: 5.0 },
    { code: 'A', rawScore: 3.5 },
    { code: 'C', rawScore: 3.5 },
    { code: 'O', rawScore: 3.5 }
  ];
  const result = mapToMBTI(dimensions);
  if (result.EI.type !== 'E') throw new Error(`期望 E，得到 ${result.EI.type}`);
});

test('MBTI映射 - 极端内向', () => {
  const dimensions = [
    { code: 'H', rawScore: 3.5 },
    { code: 'E', rawScore: 5.0 },
    { code: 'X', rawScore: 1.0 },
    { code: 'A', rawScore: 3.5 },
    { code: 'C', rawScore: 3.5 },
    { code: 'O', rawScore: 3.5 }
  ];
  const result = mapToMBTI(dimensions);
  if (result.EI.type !== 'I') throw new Error(`期望 I，得到 ${result.EI.type}`);
});

test('MBTI映射 - 极端直觉', () => {
  const dimensions = [
    { code: 'H', rawScore: 3.5 },
    { code: 'E', rawScore: 3.5 },
    { code: 'X', rawScore: 3.5 },
    { code: 'A', rawScore: 3.5 },
    { code: 'C', rawScore: 1.0 },
    { code: 'O', rawScore: 5.0 }
  ];
  const result = mapToMBTI(dimensions);
  if (result.SN.type !== 'N') throw new Error(`期望 N，得到 ${result.SN.type}`);
});

test('MBTI映射 - 极端感性', () => {
  const dimensions = [
    { code: 'H', rawScore: 4.0 },
    { code: 'E', rawScore: 4.0 },
    { code: 'X', rawScore: 2.0 },
    { code: 'A', rawScore: 5.0 },
    { code: 'C', rawScore: 3.5 },
    { code: 'O', rawScore: 3.5 }
  ];
  const result = mapToMBTI(dimensions);
  if (result.TF.type !== 'F') throw new Error(`期望 F，得到 ${result.TF.type}`);
});

test('MBTI映射 - 极端判断', () => {
  const dimensions = [
    { code: 'H', rawScore: 3.5 },
    { code: 'E', rawScore: 2.0 },
    { code: 'X', rawScore: 3.5 },
    { code: 'A', rawScore: 2.5 },
    { code: 'C', rawScore: 5.0 },
    { code: 'O', rawScore: 1.0 }
  ];
  const result = mapToMBTI(dimensions);
  if (result.JP.type !== 'J') throw new Error(`期望 J，得到 ${result.JP.type}`);
});

test('响应时间分析 - 正常速度', () => {
  const answers = [
    { response_time_ms: 3000 },
    { response_time_ms: 5000 },
    { response_time_ms: 4000 }
  ];
  const result = analyzeResponseTimes(answers);
  if (!result.valid) throw new Error('期望有效');
  if (result.warning) throw new Error(`期望无警告，得到 ${result.warning}`);
});

test('响应时间分析 - 过快', () => {
  const answers = [];
  for (let i = 0; i < 10; i++) {
    answers.push({ response_time_ms: i < 5 ? 1000 : 5000 });
  }
  const result = analyzeResponseTimes(answers);
  if (result.valid) throw new Error('期望无效');
});

test('效度指数计算', () => {
  const answers = [
    { response_time_ms: 3000, reverse_scored: 0 },
    { response_time_ms: 5000, reverse_scored: 1 },
    { response_time_ms: 4000, reverse_scored: 0 }
  ];
  const result = calculateValidityIndex(answers);
  if (result.validityIndex <= 0.5) throw new Error(`效度指数过低: ${result.validityIndex}`);
});

test('完整结果计算', () => {
  const answers = [
    { answer_value: 4, response_time_ms: 3000, reverse_scored: 0, question_id: 1, dimension_code: 'H', facet_name: '真诚' },
    { answer_value: 3, response_time_ms: 4000, reverse_scored: 0, question_id: 2, dimension_code: 'H', facet_name: '真诚' },
    { answer_value: 5, response_time_ms: 5000, reverse_scored: 1, question_id: 3, dimension_code: 'H', facet_name: '公平' },
    { answer_value: 2, response_time_ms: 3000, reverse_scored: 1, question_id: 4, dimension_code: 'H', facet_name: '公平' },
    { answer_value: 3, response_time_ms: 4000, reverse_scored: 0, question_id: 41, dimension_code: 'X', facet_name: '社交活跃' },
    { answer_value: 4, response_time_ms: 5000, reverse_scored: 0, question_id: 42, dimension_code: 'X', facet_name: '社交活跃' },
    { answer_value: 3, response_time_ms: 3000, reverse_scored: 0, question_id: 81, dimension_code: 'O', facet_name: '审美欣赏' },
    { answer_value: 4, response_time_ms: 4000, reverse_scored: 0, question_id: 82, dimension_code: 'O', facet_name: '审美欣赏' },
    { answer_value: 3, response_time_ms: 5000, reverse_scored: 0, question_id: 49, dimension_code: 'A', facet_name: '宽容' },
    { answer_value: 4, response_time_ms: 3000, reverse_scored: 0, question_id: 50, dimension_code: 'A', facet_name: '宽容' },
    { answer_value: 3, response_time_ms: 4000, reverse_scored: 0, question_id: 65, dimension_code: 'C', facet_name: '组织性' },
    { answer_value: 4, response_time_ms: 5000, reverse_scored: 0, question_id: 66, dimension_code: 'C', facet_name: '组织性' },
    { answer_value: 3, response_time_ms: 3000, reverse_scored: 0, question_id: 17, dimension_code: 'E', facet_name: '恐惧' },
    { answer_value: 4, response_time_ms: 4000, reverse_scored: 0, question_id: 18, dimension_code: 'E', facet_name: '恐惧' }
  ];
  const result = calculateFullResult(answers);
  if (!result.hexaco) throw new Error('缺少 HEXACO 结果');
  if (!result.mbti) throw new Error('缺少 MBTI 结果');
  if (!result.validity) throw new Error('缺少效度结果');
  if (!result.facets) throw new Error('缺少子面结果');
  if (result.mbti.type.length !== 4) throw new Error(`MBTI 类型长度错误: ${result.mbti.type}`);
});

test('空数据抛出异常', () => {
  try {
    calculateFullResult([]);
    throw new Error('期望抛出异常');
  } catch (err) {
    if (err.message !== '无作答数据') throw new Error(`期望特定错误消息，得到 ${err.message}`);
  }
});

console.log('\n=== 测试结果 ===');
console.log(`通过: ${passed}`);
console.log(`失败: ${failed}`);
console.log(`总计: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
