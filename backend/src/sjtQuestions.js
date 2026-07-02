const SJT_QUESTIONS = [
  {
    id: 'sjt_001',
    scenario: '你正在参加一个重要的项目会议，团队讨论陷入僵局。有人提出了一个你认为不太合理的方案，但其他人似乎都表示赞同。此时你会:',
    options: [
      { id: 'A', text: '直接指出方案的问题，并提出自己的改进建议', weight: { H: 0.3, E: -0.2, X: 0.5, A: -0.3, C: 0.2, O: 0.4 } },
      { id: 'B', text: '先表示赞同，会后私下与提出方案的人沟通你的担忧', weight: { H: 0.2, E: 0.1, X: 0.3, A: 0.4, C: 0.3, O: 0.2 } },
      { id: 'C', text: '保持沉默，观察其他人的反应再决定是否发言', weight: { H: 0.1, E: 0.2, X: -0.2, A: 0.3, C: 0.2, O: 0.1 } },
      { id: 'D', text: '跟随大家的意见，表示赞同', weight: { H: -0.2, E: 0.1, X: 0.4, A: 0.5, C: 0.1, O: -0.1 } }
    ],
    dimension: 'A',
    intendedTrait: '宜人性与诚实性平衡'
  },
  {
    id: 'sjt_002',
    scenario: '你发现同事在工作中犯了一个可能导致严重后果的错误，但对方没有意识到。此时你会:',
    options: [
      { id: 'A', text: '立即当面指出错误，并要求对方立即纠正', weight: { H: 0.5, E: -0.3, X: 0.4, A: -0.2, C: 0.4, O: 0.1 } },
      { id: 'B', text: '私下找到同事，委婉地指出问题并提供帮助', weight: { H: 0.4, E: 0.1, X: 0.2, A: 0.5, C: 0.3, O: 0.2 } },
      { id: 'C', text: '先向上级汇报，由上级决定如何处理', weight: { H: 0.2, E: 0.2, X: -0.1, A: 0.2, C: 0.5, O: 0.1 } },
      { id: 'D', text: '假装没看到，避免引起冲突', weight: { H: -0.3, E: 0.3, X: -0.2, A: 0.3, C: -0.2, O: 0.1 } }
    ],
    dimension: 'H',
    intendedTrait: '诚实性'
  },
  {
    id: 'sjt_003',
    scenario: '你手头有多项任务需要完成，其中一项非常重要但很枯燥，另一项相对轻松但截止日期较近。你会:',
    options: [
      { id: 'A', text: '先完成重要的枯燥任务，再处理轻松的任务', weight: { H: 0.1, E: -0.2, X: -0.1, A: 0.1, C: 0.8, O: -0.1 } },
      { id: 'B', text: '交替进行两项任务，保持工作节奏', weight: { H: 0.1, E: 0.1, X: 0.2, A: 0.2, C: 0.5, O: 0.3 } },
      { id: 'C', text: '先完成轻松的任务，再集中精力处理重要任务', weight: { H: 0.1, E: 0.2, X: 0.3, A: 0.1, C: 0.4, O: 0.2 } },
      { id: 'D', text: '先处理自己感兴趣的部分，其他的稍后再说', weight: { H: 0.1, E: 0.3, X: 0.4, A: 0.1, C: -0.2, O: 0.5 } }
    ],
    dimension: 'C',
    intendedTrait: '严谨性'
  },
  {
    id: 'sjt_004',
    scenario: '周末你计划休息，但朋友突然邀请你参加一个社交活动。你会:',
    options: [
      { id: 'A', text: '欣然接受，立刻准备出门', weight: { H: 0.1, E: -0.2, X: 0.8, A: 0.3, C: -0.1, O: 0.4 } },
      { id: 'B', text: '询问活动详情后，决定是否参加', weight: { H: 0.1, E: 0.1, X: 0.5, A: 0.2, C: 0.3, O: 0.3 } },
      { id: 'C', text: '表示感谢但委婉拒绝，继续自己的休息计划', weight: { H: 0.2, E: 0.1, X: -0.3, A: 0.4, C: 0.4, O: 0.2 } },
      { id: 'D', text: '直接拒绝，不想被打扰', weight: { H: 0.1, E: 0.3, X: -0.6, A: -0.2, C: 0.3, O: 0.1 } }
    ],
    dimension: 'X',
    intendedTrait: '外向性'
  },
  {
    id: 'sjt_005',
    scenario: '你在公共场合不小心打翻了一杯饮料，周围很多人都看到了。此时你会:',
    options: [
      { id: 'A', text: '立刻清理干净，并向周围的人道歉', weight: { H: 0.3, E: -0.1, X: 0.4, A: 0.5, C: 0.4, O: 0.2 } },
      { id: 'B', text: '快速清理后假装什么都没发生', weight: { H: 0.2, E: 0.2, X: 0.2, A: 0.3, C: 0.3, O: 0.1 } },
      { id: 'C', text: '感到非常尴尬，不知所措', weight: { H: 0.1, E: 0.6, X: -0.2, A: 0.2, C: 0.1, O: 0.1 } },
      { id: 'D', text: '让服务员来处理，自己离开现场', weight: { H: -0.2, E: 0.3, X: 0.1, A: -0.1, C: -0.1, O: 0.2 } }
    ],
    dimension: 'E',
    intendedTrait: '情绪稳定性'
  },
  {
    id: 'sjt_006',
    scenario: '公司要求你学习一项全新的技术来完成工作，这项技术非常复杂且与你现有技能差距很大。你会:',
    options: [
      { id: 'A', text: '积极主动地学习，查阅资料并尝试实践', weight: { H: 0.2, E: -0.2, X: 0.3, A: 0.2, C: 0.5, O: 0.8 } },
      { id: 'B', text: '参加培训课程，按部就班地学习', weight: { H: 0.1, E: 0.1, X: 0.2, A: 0.3, C: 0.6, O: 0.5 } },
      { id: 'C', text: '向有经验的同事请教，寻求帮助', weight: { H: 0.2, E: 0.1, X: 0.4, A: 0.5, C: 0.4, O: 0.3 } },
      { id: 'D', text: '觉得难度太大，考虑申请调岗', weight: { H: 0.1, E: 0.5, X: -0.1, A: 0.2, C: -0.2, O: -0.1 } }
    ],
    dimension: 'O',
    intendedTrait: '开放性'
  }
];

function evaluateSJTAnswers(answers) {
  const dimensionScores = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };
  let totalWeight = 0;
  
  for (const answer of answers) {
    const question = SJT_QUESTIONS.find(q => q.id === answer.question_id);
    if (!question) continue;
    
    const option = question.options.find(o => o.id === answer.answer_value);
    if (!option) continue;
    
    for (const [dim, weight] of Object.entries(option.weight)) {
      dimensionScores[dim] += weight;
      totalWeight += Math.abs(weight);
    }
  }
  
  for (const dim of Object.keys(dimensionScores)) {
    dimensionScores[dim] = Math.round((dimensionScores[dim] / totalWeight) * 100) / 100;
  }
  
  return dimensionScores;
}

function calculateSJTValidity(sjtAnswers, hexacoScores) {
  const sjtScores = evaluateSJTAnswers(sjtAnswers);
  let correlationSum = 0;
  
  for (const dim of ['H', 'E', 'X', 'A', 'C', 'O']) {
    const hexacoScore = hexacoScores.find(h => h.code === dim)?.zScore || 0;
    const sjtScore = (sjtScores[dim] - 0.5) * 2;
    correlationSum += hexacoScore * sjtScore;
  }
  
  const correlation = correlationSum / 6;
  const isValid = correlation >= 0.3;
  
  return {
    valid: isValid,
    correlation: Math.round(correlation * 100) / 100,
    sjtScores,
    message: isValid 
      ? '情境判断测验与量表作答一致性良好' 
      : '情境判断测验与量表作答存在差异，请确保真实作答'
  };
}

module.exports = {
  SJT_QUESTIONS,
  evaluateSJTAnswers,
  calculateSJTValidity
};
