const { run, get } = require('./dbhelper');

// ...（维度定义 FACETS 等保持不变）...

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
    { name: '真诚', desc: '在人际交往中坦率、不虚伪' },
    { name: '公平', desc: '避免欺诈和腐败，遵循道德原则' },
    { name: '贪婪回避', desc: '对奢侈品和特权不感兴趣' },
    { name: '谦逊', desc: '不自夸，不认为自己比别人优越' }
  ],
  E: [
    { name: '恐惧', desc: '对身体伤害和危险的担忧' },
    { name: '焦虑', desc: '面对压力时的紧张倾向' },
    { name: '依赖', desc: '需要他人的情感支持' },
    { name: '多愁善感', desc: '强烈的情感依恋和共情' }
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

// 预设题项模板（每个子面 4 题，部分反向计分）
const QUESTION_TEMPLATES = {
  H_真诚: [
    { stem: '在与人交谈时，我总是坦诚表达自己的想法，即使对方可能不爱听。', reverse: 0 },
    { stem: '我觉得为了维护人际关系，有时必要的善意谎言是可以接受的。', reverse: 1 },
    { stem: '我不会为了讨好别人而说违心的话。', reverse: 0 },
    { stem: '当别人问我的意见时，我更倾向于说出他们认为想听的话。', reverse: 1 }
  ],
  H_公平: [
    { stem: '即使没人监督，我也会严格遵守规则。', reverse: 0 },
    { stem: '如果有机会在不被察觉的情况下获得额外利益，我可能会利用它。', reverse: 1 },
    { stem: '我认为每个人都应该得到公平的对待，无论他们是谁。', reverse: 0 },
    { stem: '在竞争环境中，为了获胜我可以适当放宽道德标准。', reverse: 1 }
  ],
  H_贪婪回避: [
    { stem: '奢华的物品和昂贵的享受对我来说并不重要。', reverse: 0 },
    { stem: '我渴望拥有别人都羡慕的财富和地位。', reverse: 1 },
    { stem: '我觉得简单的生活就很好，不需要太多的物质享受。', reverse: 0 },
    { stem: '如果能赚到更多钱，我愿意为此付出很大努力。', reverse: 1 }
  ],
  H_谦逊: [
    { stem: '我认为自己并不比身边的人更优秀。', reverse: 0 },
    { stem: '我经常在谈话中提及自己的成就。', reverse: 1 },
    { stem: '当别人称赞我时，我会觉得很不自在。', reverse: 0 },
    { stem: '我清楚地知道自己在很多方面都比别人强。', reverse: 1 }
  ],
  E_恐惧: [
    { stem: '看到危险的场景或新闻报道会让我感到不安。', reverse: 0 },
    { stem: '在面对潜在危险时，我通常能保持冷静。', reverse: 1 },
    { stem: '我不太喜欢看恐怖电影，因为会让我难受好几天。', reverse: 0 },
    { stem: '我很少为身体安全感到担忧。', reverse: 1 }
  ],
  E_焦虑: [
    { stem: '在面临重要决定时，我很容易变得焦虑不安。', reverse: 0 },
    { stem: '我很少被压力打倒。', reverse: 1 },
    { stem: '即使是很小的事情，我也经常会过度担心。', reverse: 0 },
    { stem: '在压力情境下，我能够很好地调整自己的情绪。', reverse: 1 }
  ],
  E_依赖: [
    { stem: '做重要决定时，我非常需要听听亲近的人的意见。', reverse: 0 },
    { stem: '我习惯自己解决问题，不太需要别人的情感支持。', reverse: 1 },
    { stem: '当我情绪低落时，我需要有人陪在身边才能好起来。', reverse: 0 },
    { stem: '我认为在情感上过度依赖别人是不健康的表现。', reverse: 1 }
  ],
  E_多愁善感: [
    { stem: '看感人的电影或故事时，我很容易流泪。', reverse: 0 },
    { stem: '我对别人的痛苦感同身受，经常会深受触动。', reverse: 0 },
    { stem: '我很少因为情感上的事情哭出来。', reverse: 1 },
    { stem: '我觉得过度的情感表达是不成熟的表现。', reverse: 1 }
  ],
  X_社交自尊: [
    { stem: '在社交场合中，我对自己很有信心。', reverse: 0 },
    { stem: '我经常觉得自己在聚会中不受欢迎。', reverse: 1 },
    { stem: '我觉得自己是个有趣的、值得交往的人。', reverse: 0 },
    { stem: '在陌生人面前，我总是担心自己会表现得很差劲。', reverse: 1 }
  ],
  X_社交胆略: [
    { stem: '在团队中，我经常主动承担领导角色。', reverse: 0 },
    { stem: '在讨论中我倾向于让别人先发言，自己不愿主动开口。', reverse: 1 },
    { stem: '面对群体发言时，我能够从容地表达自己的观点。', reverse: 0 },
    { stem: '我尽量避免成为众人关注的焦点。', reverse: 1 }
  ],
  X_社交活跃: [
    { stem: '我喜欢参加各种社交活动，认识新朋友。', reverse: 0 },
    { stem: '相比热闹的聚会，我更喜欢安静独处。', reverse: 1 },
    { stem: '在与人的互动中我总能获得能量。', reverse: 0 },
    { stem: '频繁的社交活动让我感到精疲力竭。', reverse: 1 }
  ],
  X_活力: [
    { stem: '我每天都充满干劲，精力充沛。', reverse: 0 },
    { stem: '我经常感到无精打采，提不起劲。', reverse: 1 },
    { stem: '我热爱生活，总是积极寻找有趣的事情做。', reverse: 0 },
    { stem: '大多数时候我觉得自己需要更多的休息。', reverse: 1 }
  ],
  A_宽容: [
    { stem: '即使别人做错了事，我也倾向于给他们第二次机会。', reverse: 0 },
    { stem: '如果有人欺骗了我，我很难再信任他们。', reverse: 1 },
    { stem: '我觉得人性本善，大多数人都是值得信赖的。', reverse: 0 },
    { stem: '在人际关系中，我长期记恨那些伤害过我的人。', reverse: 1 }
  ],
  A_温和: [
    { stem: '在评价他人时，我总是尽量往好的方面想。', reverse: 0 },
    { stem: '我很容易发现别人的缺点并直言不讳。', reverse: 1 },
    { stem: '我觉得对别人过于苛刻是不对的。', reverse: 0 },
    { stem: '我对很多人和事都持批评态度。', reverse: 1 }
  ],
  A_灵活性: [
    { stem: '在与人意见不合时，我愿意做出让步以达成共识。', reverse: 0 },
    { stem: '我认为坚持自己的立场非常重要，即使会引发冲突。', reverse: 1 },
    { stem: '我善于在不同的观点之间找到折中方案。', reverse: 0 },
    { stem: '在争论中，我倾向于坚持己见直到对方认输。', reverse: 1 }
  ],
  A_耐心: [
    { stem: '即使遇到烦人的事情，我也能保持心平气和。', reverse: 0 },
    { stem: '我很容易因为别人的小错误而生气。', reverse: 1 },
    { stem: '在排队或等待时，我通常很有耐心。', reverse: 0 },
    { stem: '当事情进展不顺时，我会变得烦躁易怒。', reverse: 1 }
  ],
  C_组织性: [
    { stem: '我的工作和生活空间总是保持得井井有条。', reverse: 0 },
    { stem: '我经常找不到自己需要的东西，因为太乱了。', reverse: 1 },
    { stem: '我喜欢制定详细的计划并按计划行事。', reverse: 0 },
    { stem: '在有条理的系统中工作让我感到舒适。', reverse: 0 }
  ],
  C_勤奋: [
    { stem: '一旦设定了目标，我会全力以赴直到完成。', reverse: 0 },
    { stem: '我经常把事情拖到最后一刻才开始做。', reverse: 1 },
    { stem: '即使面对困难的任务，我也会坚持到底。', reverse: 0 },
    { stem: '我倾向于选择轻松的方式来完成任务。', reverse: 1 }
  ],
  C_完美主义: [
    { stem: '我对自己的工作质量有很高的要求。', reverse: 0 },
    { stem: '差不多就行了，没必要事事追求完美。', reverse: 1 },
    { stem: '如果一件事不能做到最好，我宁愿不做。', reverse: 0 },
    { stem: '我会反复检查工作的细节，确保没有错误。', reverse: 0 }
  ],
  C_审慎: [
    { stem: '在做决定之前，我会仔细权衡所有的利弊。', reverse: 0 },
    { stem: '我倾向于凭直觉快速做决定，而不是花时间深思熟虑。', reverse: 1 },
    { stem: '我很少冲动行事，总是先想清楚后果。', reverse: 0 },
    { stem: '在冲动购物后，我经常会后悔。', reverse: 1 }
  ],
  O_审美欣赏: [
    { stem: '我经常被大自然的美丽景色所深深打动。', reverse: 0 },
    { stem: '我对艺术没有太大的兴趣。', reverse: 1 },
    { stem: '欣赏音乐、绘画或文学作品是我生活的重要部分。', reverse: 0 },
    { stem: '我觉得花时间欣赏美的东西是浪费时间的。', reverse: 1 }
  ],
  O_求知欲: [
    { stem: '我对各种学科的知识都充满好奇。', reverse: 0 },
    { stem: '我觉得学习新东西是一件麻烦的事。', reverse: 1 },
    { stem: '我经常阅读或观看纪录片来拓展自己的知识面。', reverse: 0 },
    { stem: '对我来说，了解事物的运作原理并不重要。', reverse: 1 }
  ],
  O_创造力: [
    { stem: '我经常有新奇的想法和创意。', reverse: 0 },
    { stem: '我更喜欢遵循已有的方法，而不是尝试新的方式。', reverse: 1 },
    { stem: '解决问题时，我总能想到别人想不到的办法。', reverse: 0 },
    { stem: '我觉得标新立异是不必要的。', reverse: 1 }
  ],
  O_非常规性: [
    { stem: '我乐于挑战传统观念，接受新思潮。', reverse: 0 },
    { stem: '我认为遵循传统是非常重要的。', reverse: 1 },
    { stem: '我对非主流的文化和生活方式抱持开放态度。', reverse: 0 },
    { stem: '我希望社会能够回归到更传统的生活方式。', reverse: 1 }
  ]
};

function seedDatabase() {
  // 检查是否已初始化
  const count = get('SELECT COUNT(*) as cnt FROM dimensions');
  if (count && count.cnt > 0) {
    console.log('数据库已初始化，跳过种子数据。');
    return;
  }

  // 插入维度
  for (const dim of DIMENSIONS) {
    run('INSERT INTO dimensions (code, name, description, sort_order) VALUES (?, ?, ?, ?)',
      [dim.code, dim.name, dim.description, dim.sort]);
  }

  let facetId = 0;

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
        }
      }
    }
  }

  console.log('种子数据初始化完成。');
  console.log(`- ${DIMENSIONS.length} 个维度`);
  console.log(`- ${Object.values(FACETS).flat().length} 个子面`);
  console.log(`- ${Object.values(QUESTION_TEMPLATES).flat().length} 道题目`);
}

module.exports = { seedDatabase };
