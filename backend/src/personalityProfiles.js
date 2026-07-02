const MBTI_PROFILES = {
  INTJ: {
    name: '建筑师',
    description: '富有想象力和战略性的思想家，一切皆有可能。',
    strengths: ['战略思维', '自主独立', '创新能力', '逻辑分析'],
    weaknesses: ['固执己见', '过于批判', '忽视情感', '社交挑战'],
    careerPaths: ['工程师', '科学家', '管理者', '系统架构师'],
    famousExamples: ['爱因斯坦', '牛顿', '马斯克']
  },
  INTP: {
    name: '逻辑学家',
    description: '充满创造力的发明家，对知识有着永无止境的好奇心。',
    strengths: ['创造力', '分析能力', '开放性', '客观公正'],
    weaknesses: ['心不在焉', '拖延倾向', '社交笨拙', '完美主义'],
    careerPaths: ['程序员', '研究员', '设计师', '学者'],
    famousExamples: ['苏格拉底', '达芬奇', '图灵']
  },
  ENTJ: {
    name: '指挥官',
    description: '天生的领导者，善于制定计划并激励他人实现共同目标。',
    strengths: ['领导力', '决断力', '战略眼光', '自信果敢'],
    weaknesses: ['专横跋扈', '缺乏耐心', '忽视细节', '情感迟钝'],
    careerPaths: ['CEO', '政治家', '军事领袖', '企业家'],
    famousExamples: ['拿破仑', '丘吉尔', '乔布斯']
  },
  ENTP: {
    name: '辩论家',
    description: '聪明好奇的思想者，热爱挑战传统观念。',
    strengths: ['机智幽默', '创新思维', '适应能力', '辩论技巧'],
    weaknesses: ['善变无常', '爱抬杠', '执行力弱', '忽视后果'],
    careerPaths: ['律师', '营销专家', '创业者', '记者'],
    famousExamples: ['本杰明·富兰克林', '马克·吐温', '马斯克']
  },
  INFJ: {
    name: '提倡者',
    description: '富有洞察力的理想主义者，致力于实现美好愿景。',
    strengths: ['洞察力', '同理心', '创造力', '坚定信念'],
    weaknesses: ['过于理想化', '敏感脆弱', '难以放手', '自我牺牲'],
    careerPaths: ['心理咨询师', '作家', '教育家', '公益领袖'],
    famousExamples: ['马丁·路德·金', '甘地', '特蕾莎修女']
  },
  INFP: {
    name: '调停者',
    description: '善良温和的理想主义者，总是为他人着想。',
    strengths: ['同理心', '创造力', '正直诚实', '适应性'],
    weaknesses: ['优柔寡断', '逃避冲突', '过于敏感', '不切实际'],
    careerPaths: ['作家', '艺术家', '社工', '咨询师'],
    famousExamples: ['莎士比亚', '安徒生', '托尔金']
  },
  ENFJ: {
    name: '主人公',
    description: '热情 charismatic 的领导者，善于激励和鼓舞他人。',
    strengths: ['领导力', '同理心', '说服力', '社交能力'],
    weaknesses: ['过度投入', '寻求认可', '忽视自我', '难以拒绝'],
    careerPaths: ['教师', '政治家', '演员', '人力资源'],
    famousExamples: ['奥普拉', '曼德拉', '肯尼迪']
  },
  ENFP: {
    name: '竞选者',
    description: '充满热情和想象力的自由灵魂，热爱生活和冒险。',
    strengths: ['热情洋溢', '创造力', '社交能力', '乐观积极'],
    weaknesses: ['注意力不集中', '缺乏耐心', '逃避责任', '情绪波动'],
    careerPaths: ['营销', '公关', '创业', '演艺'],
    famousExamples: ['沃尔特·迪士尼', '乔布斯', '马克·扎克伯格']
  },
  ISTJ: {
    name: '物流师',
    description: '可靠务实的组织者，确保一切按计划进行。',
    strengths: ['可靠负责', '组织能力', '务实高效', '注重细节'],
    weaknesses: ['固执保守', '抗拒变化', '不善表达', '过于严肃'],
    careerPaths: ['会计师', '项目经理', '军人', '行政人员'],
    famousExamples: ['乔治·华盛顿', '女王伊丽莎白二世', '巴菲特']
  },
  ISFJ: {
    name: '守卫者',
    description: '温暖可靠的保护者，总是关心他人的福祉。',
    strengths: ['责任心', '同情心', '耐心细致', '忠诚可靠'],
    weaknesses: ['过度付出', '害怕冲突', '难以拒绝', '自我忽视'],
    careerPaths: ['护士', '教师', '社工', '秘书'],
    famousExamples: ['特蕾莎修女', '戴安娜王妃', '罗杰斯先生']
  },
  ESTJ: {
    name: '总经理',
    description: '务实高效的组织者，善于管理和执行。',
    strengths: ['组织能力', '决断力', '责任心', '务实精神'],
    weaknesses: ['过于严格', '控制欲强', '缺乏变通', '忽视感受'],
    careerPaths: ['经理', '军官', '公务员', '企业家'],
    famousExamples: ['艾森豪威尔', '撒切尔夫人', '比尔·盖茨']
  },
  ESFJ: {
    name: '执政官',
    description: '热心周到的东道主，善于营造和谐的氛围。',
    strengths: ['热情好客', '社交能力', '责任心', '同情心'],
    weaknesses: ['过度在意他人看法', '寻求认可', '难以说不', '抗拒变化'],
    careerPaths: ['教师', '护士', '公关', '人力资源'],
    famousExamples: ['奥普拉', '黛安娜王妃', '罗杰斯先生']
  },
  ISTP: {
    name: '鉴赏家',
    description: '灵活务实的实践者，擅长解决实际问题。',
    strengths: ['动手能力', '适应性', '冷静理性', '问题解决'],
    weaknesses: ['冒险倾向', '不善表达', '缺乏耐心', '逃避承诺'],
    careerPaths: ['工程师', '机械师', '运动员', '侦探'],
    famousExamples: ['爱因斯坦', '史蒂夫·乔布斯', '李小龙']
  },
  ISFP: {
    name: '探险家',
    description: '温柔敏感的艺术家，热爱美丽和自由。',
    strengths: ['创造力', '艺术天赋', '同情心', '真实性'],
    weaknesses: ['敏感脆弱', '逃避冲突', '难以做决定', '不善规划'],
    careerPaths: ['艺术家', '设计师', '音乐家', '兽医'],
    famousExamples: ['莫扎特', '毕加索', '猫王']
  },
  ESTP: {
    name: '企业家',
    description: '精力充沛的行动派，善于抓住机会。',
    strengths: ['行动力', '适应性', '乐观自信', '社交能力'],
    weaknesses: ['冲动鲁莽', '缺乏耐心', '忽视风险', '注意力不集中'],
    careerPaths: ['销售', '创业', '运动员', '表演者'],
    famousExamples: ['特朗普', '麦当娜', '理查德·布兰森']
  },
  ESFP: {
    name: '表演者',
    description: '热情活泼的娱乐家，善于给他人带来快乐。',
    strengths: ['热情开朗', '表演天赋', '社交能力', '生活情趣'],
    weaknesses: ['注意力不集中', '寻求关注', '缺乏规划', '情绪波动'],
    careerPaths: ['演员', '歌手', '主持人', '销售'],
    famousExamples: ['玛丽莲·梦露', '罗宾·威廉姆斯', '小甜甜布兰妮']
  }
};

const COGNITIVE_FUNCTIONS = {
  INTJ: {
    dominant: { name: 'Ni', label: '内倾直觉', description: '洞察深层模式与可能性' },
    auxiliary: { name: 'Te', label: '外倾思考', description: '系统规划与高效执行' },
    tertiary: { name: 'Fi', label: '内倾情感', description: '个人价值观与信念' },
    inferior: { name: 'Se', label: '外倾感觉', description: '当下感官体验' },
    shadow: [
      { name: 'Ne', label: '外倾直觉', position: '敌对' },
      { name: 'Ti', label: '内倾思考', position: '批评' },
      { name: 'Fe', label: '外倾情感', position: '盲点' },
      { name: 'Si', label: '内倾感觉', position: '恶魔' }
    ]
  },
  INTP: {
    dominant: { name: 'Ti', label: '内倾思考', description: '逻辑分析与原理构建' },
    auxiliary: { name: 'Ne', label: '外倾直觉', description: '探索多种可能性' },
    tertiary: { name: 'Si', label: '内倾感觉', description: '经验回顾与细节记忆' },
    inferior: { name: 'Fe', label: '外倾情感', description: '人际和谐与共情' },
    shadow: [
      { name: 'Te', label: '外倾思考', position: '敌对' },
      { name: 'Ni', label: '内倾直觉', position: '批评' },
      { name: 'Se', label: '外倾感觉', position: '盲点' },
      { name: 'Fi', label: '内倾情感', position: '恶魔' }
    ]
  },
  ENTJ: {
    dominant: { name: 'Te', label: '外倾思考', description: '系统规划与领导指挥' },
    auxiliary: { name: 'Ni', label: '内倾直觉', description: '战略远见与洞察' },
    tertiary: { name: 'Se', label: '外倾感觉', description: '行动力与现实感知' },
    inferior: { name: 'Fi', label: '内倾情感', description: '个人价值观' },
    shadow: [
      { name: 'Ti', label: '内倾思考', position: '敌对' },
      { name: 'Ne', label: '外倾直觉', position: '批评' },
      { name: 'Si', label: '内倾感觉', position: '盲点' },
      { name: 'Fe', label: '外倾情感', position: '恶魔' }
    ]
  },
  ENTP: {
    dominant: { name: 'Ne', label: '外倾直觉', description: '创新思维与辩论' },
    auxiliary: { name: 'Ti', label: '内倾思考', description: '逻辑拆解与分析' },
    tertiary: { name: 'Fe', label: '外倾情感', description: '社交技巧与影响力' },
    inferior: { name: 'Si', label: '内倾感觉', description: '细节与稳定性' },
    shadow: [
      { name: 'Ni', label: '内倾直觉', position: '敌对' },
      { name: 'Te', label: '外倾思考', position: '批评' },
      { name: 'Fi', label: '内倾情感', position: '盲点' },
      { name: 'Se', label: '外倾感觉', position: '恶魔' }
    ]
  },
  INFJ: {
    dominant: { name: 'Ni', label: '内倾直觉', description: '深层洞察与愿景' },
    auxiliary: { name: 'Fe', label: '外倾情感', description: '共情与人际和谐' },
    tertiary: { name: 'Ti', label: '内倾思考', description: '逻辑分析' },
    inferior: { name: 'Se', label: '外倾感觉', description: '现实体验' },
    shadow: [
      { name: 'Ne', label: '外倾直觉', position: '敌对' },
      { name: 'Fi', label: '内倾情感', position: '批评' },
      { name: 'Te', label: '外倾思考', position: '盲点' },
      { name: 'Si', label: '内倾感觉', position: '恶魔' }
    ]
  },
  INFP: {
    dominant: { name: 'Fi', label: '内倾情感', description: '个人价值观与真实性' },
    auxiliary: { name: 'Ne', label: '外倾直觉', description: '探索与可能性' },
    tertiary: { name: 'Si', label: '内倾感觉', description: '经验与回忆' },
    inferior: { name: 'Te', label: '外倾思考', description: '组织与执行' },
    shadow: [
      { name: 'Fe', label: '外倾情感', position: '敌对' },
      { name: 'Ni', label: '内倾直觉', position: '批评' },
      { name: 'Se', label: '外倾感觉', position: '盲点' },
      { name: 'Ti', label: '内倾思考', position: '恶魔' }
    ]
  },
  ENFJ: {
    dominant: { name: 'Fe', label: '外倾情感', description: '共情与领导力' },
    auxiliary: { name: 'Ni', label: '内倾直觉', description: '洞察与愿景' },
    tertiary: { name: 'Se', label: '外倾感觉', description: '行动力与现实' },
    inferior: { name: 'Ti', label: '内倾思考', description: '逻辑分析' },
    shadow: [
      { name: 'Fi', label: '内倾情感', position: '敌对' },
      { name: 'Ne', label: '外倾直觉', position: '批评' },
      { name: 'Si', label: '内倾感觉', position: '盲点' },
      { name: 'Te', label: '外倾思考', position: '恶魔' }
    ]
  },
  ENFP: {
    dominant: { name: 'Ne', label: '外倾直觉', description: '创意与可能性' },
    auxiliary: { name: 'Fi', label: '内倾情感', description: '价值观与热情' },
    tertiary: { name: 'Te', label: '外倾思考', description: '组织与执行' },
    inferior: { name: 'Si', label: '内倾感觉', description: '细节与稳定' },
    shadow: [
      { name: 'Ni', label: '内倾直觉', position: '敌对' },
      { name: 'Fe', label: '外倾情感', position: '批评' },
      { name: 'Ti', label: '内倾思考', position: '盲点' },
      { name: 'Se', label: '外倾感觉', position: '恶魔' }
    ]
  },
  ISTJ: {
    dominant: { name: 'Si', label: '内倾感觉', description: '经验与传统' },
    auxiliary: { name: 'Te', label: '外倾思考', description: '组织与效率' },
    tertiary: { name: 'Fi', label: '内倾情感', description: '个人价值观' },
    inferior: { name: 'Ne', label: '外倾直觉', description: '创新与变化' },
    shadow: [
      { name: 'Se', label: '外倾感觉', position: '敌对' },
      { name: 'Ti', label: '内倾思考', position: '批评' },
      { name: 'Fe', label: '外倾情感', position: '盲点' },
      { name: 'Ni', label: '内倾直觉', position: '恶魔' }
    ]
  },
  ISFJ: {
    dominant: { name: 'Si', label: '内倾感觉', description: '细节与关怀' },
    auxiliary: { name: 'Fe', label: '外倾情感', description: '温暖与服务' },
    tertiary: { name: 'Ti', label: '内倾思考', description: '逻辑分析' },
    inferior: { name: 'Ne', label: '外倾直觉', description: '创新与可能性' },
    shadow: [
      { name: 'Se', label: '外倾感觉', position: '敌对' },
      { name: 'Fi', label: '内倾情感', position: '批评' },
      { name: 'Te', label: '外倾思考', position: '盲点' },
      { name: 'Ni', label: '内倾直觉', position: '恶魔' }
    ]
  },
  ESTJ: {
    dominant: { name: 'Te', label: '外倾思考', description: '管理与执行' },
    auxiliary: { name: 'Si', label: '内倾感觉', description: '经验与秩序' },
    tertiary: { name: 'Ne', label: '外倾直觉', description: '创新与变化' },
    inferior: { name: 'Fi', label: '内倾情感', description: '个人价值观' },
    shadow: [
      { name: 'Ti', label: '内倾思考', position: '敌对' },
      { name: 'Se', label: '外倾感觉', position: '批评' },
      { name: 'Ni', label: '内倾直觉', position: '盲点' },
      { name: 'Fe', label: '外倾情感', position: '恶魔' }
    ]
  },
  ESFJ: {
    dominant: { name: 'Fe', label: '外倾情感', description: '和谐与服务' },
    auxiliary: { name: 'Si', label: '内倾感觉', description: '传统与细节' },
    tertiary: { name: 'Ne', label: '外倾直觉', description: '创新与可能性' },
    inferior: { name: 'Ti', label: '内倾思考', description: '逻辑分析' },
    shadow: [
      { name: 'Fi', label: '内倾情感', position: '敌对' },
      { name: 'Se', label: '外倾感觉', position: '批评' },
      { name: 'Ni', label: '内倾直觉', position: '盲点' },
      { name: 'Te', label: '外倾思考', position: '恶魔' }
    ]
  },
  ISTP: {
    dominant: { name: 'Ti', label: '内倾思考', description: '逻辑与效率' },
    auxiliary: { name: 'Se', label: '外倾感觉', description: '行动与体验' },
    tertiary: { name: 'Ni', label: '内倾直觉', description: '洞察与远见' },
    inferior: { name: 'Fe', label: '外倾情感', description: '人际和谐' },
    shadow: [
      { name: 'Te', label: '外倾思考', position: '敌对' },
      { name: 'Si', label: '内倾感觉', position: '批评' },
      { name: 'Ne', label: '外倾直觉', position: '盲点' },
      { name: 'Fi', label: '内倾情感', position: '恶魔' }
    ]
  },
  ISFP: {
    dominant: { name: 'Fi', label: '内倾情感', description: '个人价值观与艺术' },
    auxiliary: { name: 'Se', label: '外倾感觉', description: '感官体验与美' },
    tertiary: { name: 'Ni', label: '内倾直觉', description: '洞察与意义' },
    inferior: { name: 'Te', label: '外倾思考', position: '组织与执行' },
    shadow: [
      { name: 'Fe', label: '外倾情感', position: '敌对' },
      { name: 'Si', label: '内倾感觉', position: '批评' },
      { name: 'Ne', label: '外倾直觉', position: '盲点' },
      { name: 'Ti', label: '内倾思考', position: '恶魔' }
    ]
  },
  ESTP: {
    dominant: { name: 'Se', label: '外倾感觉', description: '行动与现实' },
    auxiliary: { name: 'Ti', label: '内倾思考', description: '逻辑与分析' },
    tertiary: { name: 'Fe', label: '外倾情感', description: '社交与影响' },
    inferior: { name: 'Ni', label: '内倾直觉', description: '远见与洞察' },
    shadow: [
      { name: 'Si', label: '内倾感觉', position: '敌对' },
      { name: 'Te', label: '外倾思考', position: '批评' },
      { name: 'Fi', label: '内倾情感', position: '盲点' },
      { name: 'Ne', label: '外倾直觉', position: '恶魔' }
    ]
  },
  ESFP: {
    dominant: { name: 'Se', label: '外倾感觉', description: '体验与娱乐' },
    auxiliary: { name: 'Fe', label: '外倾情感', description: '热情与社交' },
    tertiary: { name: 'Ti', label: '内倾思考', description: '逻辑分析' },
    inferior: { name: 'Ni', label: '内倾直觉', description: '远见与洞察' },
    shadow: [
      { name: 'Si', label: '内倾感觉', position: '敌对' },
      { name: 'Fi', label: '内倾情感', position: '批评' },
      { name: 'Te', label: '外倾思考', position: '盲点' },
      { name: 'Ne', label: '外倾直觉', position: '恶魔' }
    ]
  }
};

const ENNEAGRAM_PROFILES = {
  '1': {
    name: '完美主义者',
    alias: '改革者',
    coreMotivation: '追求完美与公正',
    coreFear: '犯错与不公正',
    description: '自律、原则性强，致力于改进自己和周围的世界。',
    strengths: ['正直', '自律', '责任感', '理想主义'],
    growthTips: ['学会接受不完美', '放松对自己的要求', '享受过程'],
    level: ['健康：公正、明智', '一般：批评、固执', '不健康：苛刻、僵化']
  },
  '2': {
    name: '助人者',
    alias: '给予者',
    coreMotivation: '被爱与被需要',
    coreFear: '不被爱与被抛弃',
    description: '温暖、善良，总是优先考虑他人的需求。',
    strengths: ['同情心', '慷慨', '亲和力', '无私'],
    growthTips: ['学会关爱自己', '设立边界', '接受拒绝'],
    level: ['健康：无私、温暖', '一般：依赖、讨好', '不健康：操控、自我牺牲']
  },
  '3': {
    name: '成就者',
    alias: '实干家',
    coreMotivation: '被认可与成功',
    coreFear: '失败与不被认可',
    description: '雄心勃勃、高效，追求卓越与成就。',
    strengths: ['目标导向', '自信', '行动力', '魅力'],
    growthTips: ['学会放慢脚步', '关注内在价值', '接受失败'],
    level: ['健康：自信、成功', '一般：虚荣、竞争', '不健康：欺骗、自恋']
  },
  '4': {
    name: '浪漫主义者',
    alias: '个人主义者',
    coreMotivation: '寻找独特性与意义',
    coreFear: '平凡与无意义',
    description: '富有创造力、敏感，追求独特的生活体验。',
    strengths: ['创造力', '直觉', '深度', '真诚'],
    growthTips: ['活在当下', '接受平凡', '减少比较'],
    level: ['健康：创意、深刻', '一般：忧郁、自我沉溺', '不健康：嫉妒、自毁']
  },
  '5': {
    name: '观察者',
    alias: '思考者',
    coreMotivation: '获取知识与保护隐私',
    coreFear: '被侵犯与无知',
    description: '博学、独立，倾向于从观察者的角度理解世界。',
    strengths: ['智慧', '独立', '分析能力', '专注力'],
    growthTips: ['学会与人连接', '分享知识', '参与生活'],
    level: ['健康：智慧、客观', '一般：孤僻、贪婪', '不健康：偏执、退缩']
  },
  '6': {
    name: '忠诚者',
    alias: '怀疑论者',
    coreMotivation: '寻求安全与信任',
    coreFear: '危险与背叛',
    description: '忠诚、谨慎，致力于建立安全可靠的环境。',
    strengths: ['忠诚', '责任感', '审慎', '团队精神'],
    growthTips: ['学会信任自己', '减少焦虑', '勇敢行动'],
    level: ['健康：忠诚、勇敢', '一般：焦虑、怀疑', '不健康：偏执、攻击']
  },
  '7': {
    name: '活跃者',
    alias: '享乐主义者',
    coreMotivation: '体验快乐与避免痛苦',
    coreFear: '痛苦与限制',
    description: '乐观、好奇，热爱生活和各种体验。',
    strengths: ['乐观', '创造力', '好奇心', '适应能力'],
    growthTips: ['学会面对痛苦', '专注一件事', '珍惜当下'],
    level: ['健康：快乐、自由', '一般：逃避、肤浅', '不健康：冲动、放纵']
  },
  '8': {
    name: '挑战者',
    alias: '保护者',
    coreMotivation: '寻求控制与正义',
    coreFear: '被控制与软弱',
    description: '自信、果断，敢于面对挑战和保护他人。',
    strengths: ['勇气', '领导力', '正义感', '决断力'],
    growthTips: ['学会倾听', '控制愤怒', '示弱也是力量'],
    level: ['健康：强大、正义', '一般：霸道、对抗', '不健康：暴力、残忍']
  },
  '9': {
    name: '和平使者',
    alias: '调停者',
    coreMotivation: '维持和谐与内心平静',
    coreFear: '冲突与分离',
    description: '温和、包容，致力于创造和平与和谐的环境。',
    strengths: ['平和', '包容', '耐心', '同理心'],
    growthTips: ['学会表达自己', '做出选择', '面对冲突'],
    level: ['健康：平和、包容', '一般：被动、逃避', '不健康：麻木、顽固']
  }
};

module.exports = {
  MBTI_PROFILES,
  COGNITIVE_FUNCTIONS,
  ENNEAGRAM_PROFILES
};
