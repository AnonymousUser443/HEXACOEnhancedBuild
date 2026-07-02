const { run, get } = require('./dbhelper');

const DIMENSIONS = [
  { code: 'H', name: '诚实-谦逊', description: '真诚、公平、贪婪回避、谦逊', sort: 1 },
  { code: 'E', name: '情绪性', description: '恐惧、焦虑、依赖、多愁善感', sort: 2 },
  { code: 'X', name: '外向性', description: '社交自尊、社交胆略、社交活跃、活力', sort: 3 },
  { code: 'A', name: '宜人性', description: '宽容、温和、灵活性、耐心', sort: 4 },
  { code: 'C', name: '严谨性', description: '组织性、勤奋、完美主义、审慎', sort: 5 },
  { code: 'O', name: '开放性', description: '审美欣赏、求知欲、创造力、非常规性', sort: 6 }
];

const FACETS = {
  H: [
    { name: '真诚', desc: '在人际交往中坦率、不虚伪，不做作' },
    { name: '公平', desc: '避免欺诈和腐败，遵循道德原则' },
    { name: '贪婪回避', desc: '对奢侈品和特权不感兴趣' },
    { name: '谦逊', desc: '不自夸，不认为自己比别人优越' }
  ],
  E: [
    { name: '恐惧', desc: '对身体伤害和危险的担忧程度' },
    { name: '焦虑', desc: '面对压力时的紧张倾向' },
    { name: '依赖', desc: '需要他人的情感支持和陪伴' },
    { name: '多愁善感', desc: '强烈的情感依恋和共情倾向' }
  ],
  X: [
    { name: '社交自尊', desc: '在社交场合的自我价值感' },
    { name: '社交胆略', desc: '在社交中的主导和领导倾向' },
    { name: '社交活跃', desc: '享受社交互动和聚会' },
    { name: '活力', desc: '精力充沛、积极进取' }
  ],
  A: [
    { name: '宽容', desc: '愿意原谅和信任他人' },
    { name: '温和', desc: '对他人评价温和、不苛责' },
    { name: '灵活性', desc: '在争议中愿意妥协合作' },
    { name: '耐心', desc: '不容易被激怒或生气' }
  ],
  C: [
    { name: '组织性', desc: '追求秩序和整洁' },
    { name: '勤奋', desc: '工作刻苦、目标导向' },
    { name: '完美主义', desc: '追求精准和高质量' },
    { name: '审慎', desc: '深思熟虑、三思而后行' }
  ],
  O: [
    { name: '审美欣赏', desc: '对艺术和自然美的敏感' },
    { name: '求知欲', desc: '对知识的好奇和探索' },
    { name: '创造力', desc: '喜欢创新和新思路' },
    { name: '非常规性', desc: '对非传统观念的开放' }
  ]
};

/**
 * HEXACO-CN 加强版题库 v3.0
 *
 * 每个子面 6 题（共 144 题），基于以下来源构建：
 * - 官方 HEXACO-100 简体中文版（hexaco.org 官方译本）
 * - 现有自定义题库精选补充
 *
 * 计分：5 点 Likert 量表（1=极不同意, 5=非常同意）
 * reverse: 1 表示反向计分（5↔1）
 *
 * 每个子面前 4 题 = 官方 HEXACO-100 计分键对应题目
 * 每个子面后 2 题 = 自定义题库精选补充
 */
const QUESTION_TEMPLATES = {
  // ═══════════════════════════════════════════════
  // 维度 H: 诚实-谦逊 (Honesty-Humility)
  // ═══════════════════════════════════════════════
  // 官方计分键: 6R,30,54R,78 → 反向: 1,0,1,0
  H_真诚: [
    { stem: '为了从自己不喜欢的人手中得到一些东西, 我会假装对那个人很友善。', reverse: 1 },
    { stem: '即使我相信用巴结的方式可以得到奖励，我也不会这么做。', reverse: 0 },
    { stem: '如果我想从某人手中得到一些东西, 即使那个人讲的笑话再不好笑，我也会哈哈大笑。', reverse: 1 },
    { stem: '我不会为了让某人帮我做事而假装喜欢那个人。', reverse: 0 },
    { stem: '我不会为了讨好别人而说违心的话。', reverse: 0 },
    { stem: '当别人问我的意见时，我更倾向于说出他们认为想听的话。', reverse: 1 }
  ],
  // 官方计分键: 12R,36R,60,84R → 反向: 1,1,0,1
  H_公平: [
    { stem: '如果知道我自己永远不会被抓，我会想要通过盗窃的方式获得一百万元人民币。', reverse: 1 },
    { stem: '如果手头很紧, 我可能会禁不起诱惑去购买赃物。', reverse: 1 },
    { stem: '即使很有价值或金额很大，我也绝不会接受贿赂。', reverse: 0 },
    { stem: '如果我确定绝不会被抓到，我会禁不住诱惑使用伪钞。', reverse: 1 },
    { stem: '即使没人监督，我也会严格遵守规则。', reverse: 0 },
    { stem: '为了在竞争中获胜，我可以适当放宽道德标准。', reverse: 1 }
  ],
  // 官方计分键: 18,42R,66R,90R → 反向: 0,1,1,1
  H_贪婪回避: [
    { stem: '对我来说，拥有很多金钱不是特别重要。', reverse: 0 },
    { stem: '我希望能够住在一个很昂贵而且很高级的社区。', reverse: 1 },
    { stem: '我想让别人看到我开着名贵的轿车。', reverse: 1 },
    { stem: '如果有机会可以拥有昂贵的奢侈品，我会获得很大的快乐。', reverse: 1 },
    { stem: '奢华的物品和昂贵的享受对我来说并不重要。', reverse: 0 },
    { stem: '我觉得简单的生活就很好，不需要太多的物质享受。', reverse: 0 }
  ],
  // 官方计分键: 24,48,72R,96R → 反向: 0,0,1,1
  H_谦逊: [
    { stem: '我认为自己是个普普通通的人，并不比其他人优秀。', reverse: 0 },
    { stem: '我不想要别人对待我的方式好像我比他们优秀。', reverse: 0 },
    { stem: '我认为我比一般人更有资格得到更多尊重。', reverse: 1 },
    { stem: '我想让别人知道我是个地位高的重要人物。', reverse: 1 },
    { stem: '我经常在谈话中提及自己的成就。', reverse: 1 },
    { stem: '当别人称赞我时，我会觉得很不自在。', reverse: 0 }
  ],

  // ═══════════════════════════════════════════════
  // 维度 E: 情绪性 (Emotionality)
  // ═══════════════════════════════════════════════
  // 官方计分键: 5,29R,53,77R → 反向: 0,1,0,1
  E_恐惧: [
    { stem: '如果我必须在恶劣气候之下出行，我会感到害怕。', reverse: 0 },
    { stem: '我不介意去做一些有危险性的工作。', reverse: 1 },
    { stem: '面对可能使身体受伤的险境，我会很害怕。', reverse: 0 },
    { stem: '即使面对危急情况, 我不会感觉到惊慌。', reverse: 1 },
    { stem: '看到危险的场景或新闻报道会让我感到不安。', reverse: 0 },
    { stem: '我不太喜欢看恐怖电影，因为会让我难受好几天。', reverse: 0 }
  ],
  // 官方计分键: 11,35R,59R,83 → 反向: 0,1,1,0
  E_焦虑: [
    { stem: '在一些时候，我会不由自主的为一些小事而感到焦躁不安。', reverse: 0 },
    { stem: '比起大多数人，我担心的事少了很多。', reverse: 1 },
    { stem: '我很少因为压力或忧虑而失眠。', reverse: 1 },
    { stem: '在等待一些重大决定的结果时，我会变得非常焦躁。', reverse: 0 },
    { stem: '在面临重要决定时，我很容易变得焦虑不安。', reverse: 0 },
    { stem: '即使是很小的事情，我也经常会过度担心。', reverse: 0 }
  ],
  // 官方计分键: 17,41R,65,89R → 反向: 0,1,0,1
  E_依赖: [
    { stem: '当我遭遇到痛苦的经验时，我需要其他人的安慰。', reverse: 0 },
    { stem: '我可以面对困难的处境而不需要任何人的情感支持。', reverse: 1 },
    { stem: '每当我忧心某些事，我总想跟别人说说自己的忧虑。', reverse: 0 },
    { stem: '我很少跟别人讨论自己的问题。', reverse: 1 },
    { stem: '做重要决定时，我非常需要听听亲近的人的意见。', reverse: 0 },
    { stem: '当我情绪低落时，我需要有人陪在身边才能好起来。', reverse: 0 }
  ],
  // 官方计分键: 23,47,71,95R → 反向: 0,0,0,1
  E_多愁善感: [
    { stem: '看到别人哭时，我也会想哭。', reverse: 0 },
    { stem: '当与我很亲近的人不开心的时候，我往往会感同身受。', reverse: 0 },
    { stem: '当亲近的人要离开一段很长的时间，我会有很深的感伤。', reverse: 0 },
    { stem: '即使在会让大多数人变得很感伤的情境中，我仍可不动情感。', reverse: 1 },
    { stem: '看感人的电影或故事时，我很容易流泪。', reverse: 0 },
    { stem: '我很少因为情感上的事情哭出来。', reverse: 1 }
  ],

  // ═══════════════════════════════════════════════
  // 维度 X: 外向性 (eXtraversion)
  // ═══════════════════════════════════════════════
  // 官方计分键: 4,28,52R,76R → 反向: 0,0,1,1
  X_社交自尊: [
    { stem: '整体而言我对自己还算满意。', reverse: 0 },
    { stem: '我认为大多数人喜爱我的某些个性。', reverse: 0 },
    { stem: '我觉得自己是个不受欢迎的人。', reverse: 1 },
    { stem: '我有时会觉得自已一文不值。', reverse: 1 },
    { stem: '在社交场合中，我对自己很有信心。', reverse: 0 },
    { stem: '我觉得自己是个有趣的、值得交往的人。', reverse: 0 }
  ],
  // 官方计分键: 10R,34,58,82R → 反向: 1,0,0,1
  X_社交胆略: [
    { stem: '在团体讨论中，我很少表达自己的意见。', reverse: 1 },
    { stem: '在社交场合里, 我通常都是那个先主动搭讪的人。', reverse: 0 },
    { stem: '在团体中，我常是那个代表团体说话的人。', reverse: 0 },
    { stem: '在一群人面前说话, 我会感到非常不自然。', reverse: 1 },
    { stem: '在团队中，我经常主动承担领导角色。', reverse: 0 },
    { stem: '在讨论中我倾向于让别人先发言，自己不愿主动开口。', reverse: 1 }
  ],
  // 官方计分键: 16R,40,64,88 → 反向: 1,0,0,0
  X_社交活跃: [
    { stem: '我常常会避免跟其他人闲聊。', reverse: 1 },
    { stem: '我喜欢一群人聚在一起闲聊。', reverse: 0 },
    { stem: '相比较于只需独自一人进行的工作，我更喜欢需要积极与别人互动的工作。', reverse: 0 },
    { stem: '通常我到新环境做的第一件事就是交新朋友。', reverse: 0 },
    { stem: '我喜欢参加各种社交活动，认识新朋友。', reverse: 0 },
    { stem: '在与人的互动中我总能获得能量。', reverse: 0 }
  ],
  // 官方计分键: 22,46,70R,94R → 反向: 0,0,1,1
  X_活力: [
    { stem: '几乎所有时候我都精力充沛。', reverse: 0 },
    { stem: '大多数日子里, 我都感到愉快和乐观。', reverse: 0 },
    { stem: '别人常常对我说，我应该试着快乐起来。', reverse: 1 },
    { stem: '大多数人都比平常的我要更乐观和更有活力。', reverse: 1 },
    { stem: '我每天都充满干劲，精力充沛。', reverse: 0 },
    { stem: '我经常感到无精打采，提不起劲。', reverse: 1 }
  ],

  // ═══════════════════════════════════════════════
  // 维度 A: 宜人性 (Agreeableness)
  // ═══════════════════════════════════════════════
  // 官方计分键: 3,27,51R,75R → 反向: 0,0,1,1
  A_宽容: [
    { stem: '我很少有怨恨，即使面对那些对我很坏的人。', reverse: 0 },
    { stem: '面对那些对我很坏的人，我的态度通常是"原谅与忘记"。', reverse: 0 },
    { stem: '如果有人欺骗过我一次, 我以后都会怀疑这人。', reverse: 1 },
    { stem: '我发觉很难完全原谅曾对我刻薄的人。', reverse: 1 },
    { stem: '即使别人做错了事，我也倾向于给他们第二次机会。', reverse: 0 },
    { stem: '我觉得人性本善，大多数人都是值得信赖的。', reverse: 0 }
  ],
  // 官方计分键: 9R,33,57,81 → 反向: 1,0,0,0
  A_温和: [
    { stem: '有时候其他人告诉我，我对别人太挑剔。', reverse: 1 },
    { stem: '我通常会接受别人所犯的错误，而不会抱怨他们。', reverse: 0 },
    { stem: '我会用宽厚的态度去评论他人。', reverse: 0 },
    { stem: '即使在别人犯了很多错误的时候, 我也很少说难听的话。', reverse: 0 },
    { stem: '在评价他人时，我总是尽量往好的方面想。', reverse: 0 },
    { stem: '我很容易发现别人的缺点并直言不讳。', reverse: 1 }
  ],
  // 官方计分键: 15R,39,63R,87R → 反向: 1,0,1,1
  A_灵活性: [
    { stem: '有时候其他人认为我太顽固。', reverse: 1 },
    { stem: '当别人不同意我的时候,我通常能让自己的意见保持相当的弹性。', reverse: 0 },
    { stem: '当别人说我错了的时候，通常我的第一个反应就是跟他们争辩。', reverse: 1 },
    { stem: '当我坚信自己是正确的时候，我发觉自己很难去跟人妥协。', reverse: 1 },
    { stem: '在与人意见不合时，我愿意做出让步以达成共识。', reverse: 0 },
    { stem: '我善于在不同的观点之间找到折中方案。', reverse: 0 }
  ],
  // 官方计分键: 21R,45,69,93R → 反向: 1,0,0,1
  A_耐心: [
    { stem: '别人认为我是一个很暴躁的人。', reverse: 1 },
    { stem: '即使别人对待我很差，我也很少生气。', reverse: 0 },
    { stem: '大多数的人比我容易生气。', reverse: 0 },
    { stem: '当有人侮辱我时，我发觉很难去控制自己的脾气。', reverse: 1 },
    { stem: '即使遇到烦人的事情，我也能保持心平气和。', reverse: 0 },
    { stem: '我很容易因为别人的小错误而生气。', reverse: 1 }
  ],

  // ═══════════════════════════════════════════════
  // 维度 C: 严谨性 (Conscientiousness)
  // ═══════════════════════════════════════════════
  // 官方计分键: 2,26,50R,74R → 反向: 0,0,1,1
  C_组织性: [
    { stem: '我经常清理自己的办公室或居家环境。', reverse: 0 },
    { stem: '我会在事前计划和组织要做的事，避免最后一分钟手忙脚乱。', reverse: 0 },
    { stem: '别人时常取笑我房间或桌子凌乱。', reverse: 1 },
    { stem: '在工作上, 我有时候会因为没有事先进行很好的计划而遇到困难。', reverse: 1 },
    { stem: '我的工作和生活空间总是保持得井井有条。', reverse: 0 },
    { stem: '在有条理的系统中工作让我感到舒适。', reverse: 0 }
  ],
  // 官方计分键: 8,32,56R,80R → 反向: 0,0,1,1
  C_勤奋: [
    { stem: '当工作时, 我通常会为自己订下规模宏大的目标。', reverse: 0 },
    { stem: '为了达到目标，我通常把自己逼得很紧。', reverse: 0 },
    { stem: '我为自己定下的目标，常常最后未完成就放弃。', reverse: 1 },
    { stem: '我只做每天应做的最少工作量。', reverse: 1 },
    { stem: '一旦设定了目标，我会全力以赴直到完成。', reverse: 0 },
    { stem: '即使面对困难的任务，我也会坚持到底。', reverse: 0 }
  ],
  // 官方计分键: 14,38R,62,86 → 反向: 0,1,0,0
  C_完美主义: [
    { stem: '为了找出任何可能的错误，我会反复检查自己的工作。', reverse: 0 },
    { stem: '做事时, 我往往不太注意小细节。', reverse: 1 },
    { stem: '为了在工作上精益求精，我会不惜花费很多时间。', reverse: 0 },
    { stem: '别人常说我是个完美主义者。', reverse: 0 },
    { stem: '我对自己的工作质量有很高的要求。', reverse: 0 },
    { stem: '差不多就行了，没必要事事追求完美。', reverse: 1 }
  ],
  // 官方计分键: 20R,44R,68,92R → 反向: 1,1,0,1
  C_审慎: [
    { stem: '我在做决定的时候常常依赖自己当时的感受，而不会去仔细思考和比较得失。', reverse: 1 },
    { stem: '我因采取行动前没有仔细思考而犯下很多错误。', reverse: 1 },
    { stem: '我不会因为冲动而做出不理智的行为。', reverse: 0 },
    { stem: '我喜欢想到什么就做什么，不喜欢按计划行事。', reverse: 1 },
    { stem: '在做决定之前，我会仔细权衡所有的利弊。', reverse: 0 },
    { stem: '我很少冲动行事，总是先想清楚后果。', reverse: 0 }
  ],

  // ═══════════════════════════════════════════════
  // 维度 O: 开放性 (Openness to Experience)
  // ═══════════════════════════════════════════════
  // 官方计分键: 1R,25R,49,73 → 反向: 1,1,0,0
  O_审美欣赏: [
    { stem: '我觉得参观美术馆很无聊。', reverse: 1 },
    { stem: '我不愿花时间去阅读诗集。', reverse: 1 },
    { stem: '如果我有机会, 我会想去参加古典音乐会。', reverse: 0 },
    { stem: '有时候我喜欢静静地看着风吹过树稍。', reverse: 0 },
    { stem: '我经常被大自然的美丽景色所深深打动。', reverse: 0 },
    { stem: '欣赏音乐、绘画或文学作品是我生活的重要部分。', reverse: 0 }
  ],
  // 官方计分键: 7,31,55R,79R → 反向: 0,0,1,1
  O_求知欲: [
    { stem: '我喜欢去学习外国的历史和政治。', reverse: 0 },
    { stem: '我喜欢看不同地方的地图。', reverse: 0 },
    { stem: '我觉得关于科学史和科技史的书都很无趣。', reverse: 1 },
    { stem: '翻阅百科全书这件事，我从没真正喜欢过。', reverse: 1 },
    { stem: '我对各种学科的知识都充满好奇。', reverse: 0 },
    { stem: '我经常阅读或观看纪录片来拓展自己的知识面。', reverse: 0 }
  ],
  // 官方计分键: 13R,37,61,85R → 反向: 1,0,0,1
  O_创造力: [
    { stem: '我喜欢做遵照惯例、简单重复的工作，而不是需要创意的工作。', reverse: 1 },
    { stem: '我喜欢从事艺术创作，例如，写小说、写歌、绘画。', reverse: 0 },
    { stem: '别人经常说我有很好的想象力。', reverse: 0 },
    { stem: '我不认为自己是那种有艺术天份或创意的人。', reverse: 1 },
    { stem: '我经常有新奇的想法和创意。', reverse: 0 },
    { stem: '解决问题时，我总能想到别人想不到的办法。', reverse: 0 }
  ],
  // 官方计分键: 19R,43,67,91R → 反向: 1,0,0,1
  O_非常规性: [
    { stem: '我认为听取别人的极端意见是在浪费时间。', reverse: 1 },
    { stem: '我喜欢那些对事情有独特见解的人。', reverse: 0 },
    { stem: '我认为自己算是个不墨守成规的人。', reverse: 0 },
    { stem: '我发觉讨论哲学很乏味。', reverse: 1 },
    { stem: '我乐于挑战传统观念，接受新思潮。', reverse: 0 },
    { stem: '我对非主流的文化和生活方式抱持开放态度。', reverse: 0 }
  ]
};

function seedDatabase() {
  // 检查是否已初始化
  const count = get('SELECT COUNT(*) as cnt FROM dimensions');
  if (count && count.cnt > 0) {
    console.log('数据库已初始化，跳过种子数据。');
    console.log('如需重新初始化，请删除 data/personality.db 后重启。');
    return;
  }

  // 插入维度
  for (const dim of DIMENSIONS) {
    run('INSERT INTO dimensions (code, name, description, sort_order) VALUES (?, ?, ?, ?)',
      [dim.code, dim.name, dim.description, dim.sort]);
  }

  let facetId = 0;
  let totalQuestions = 0;

  // 插入子面
  for (const dim of DIMENSIONS) {
    const facets = FACETS[dim.code];
    for (let i = 0; i < facets.length; i++) {
      facetId++;
      run('INSERT INTO facets (id, dimension_code, name, description, sort_order) VALUES (?, ?, ?, ?, ?)',
        [facetId, dim.code, facets[i].name, facets[i].desc, i + 1]);

      // 插入该子面对应的题目
      const key = `${dim.code}_${facets[i].name}`;
      const questions = QUESTION_TEMPLATES[key];
      if (questions) {
        for (let j = 0; j < questions.length; j++) {
          run('INSERT INTO questions (facet_id, stem, reverse_scored, sort_order) VALUES (?, ?, ?, ?)',
            [facetId, questions[j].stem, questions[j].reverse, j + 1]);
          totalQuestions++;
        }
      }
    }
  }

  console.log('=== HEXACO-CN 加强版题库 v3.0 初始化完成 ===');
  console.log(`- ${DIMENSIONS.length} 个维度`);
  console.log(`- ${Object.values(FACETS).flat().length} 个子面`);
  console.log(`- ${totalQuestions} 道题目（每个子面 6 题）`);
  console.log('- 来源：官方 HEXACO-100 简体中文版（hexaco.org）+ 自定义精选补充');
}

module.exports = { seedDatabase };
