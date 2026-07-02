<template>
  <div class="jungian-theater">
    <div class="theater-stage">
      <div class="stage-background"></div>
      <div class="stage-light"></div>
      
      <div class="position hero" @click="selectFunction('hero')" :class="{ active: selected === 'hero' }">
        <div class="position-icon">🦸</div>
        <div class="position-name">{{ data.dominant.name }}</div>
        <div class="position-label">{{ data.dominant.label }}</div>
        <div class="position-role">英雄</div>
      </div>
      
      <div class="position parent" @click="selectFunction('parent')" :class="{ active: selected === 'parent' }">
        <div class="position-icon">👨‍👩‍👧</div>
        <div class="position-name">{{ data.auxiliary.name }}</div>
        <div class="position-label">{{ data.auxiliary.label }}</div>
        <div class="position-role">父母</div>
      </div>
      
      <div class="position child" @click="selectFunction('child')" :class="{ active: selected === 'child' }">
        <div class="position-icon">👶</div>
        <div class="position-name">{{ data.tertiary.name }}</div>
        <div class="position-label">{{ data.tertiary.label }}</div>
        <div class="position-role">孩童</div>
      </div>
      
      <div class="position anima" @click="selectFunction('anima')" :class="{ active: selected === 'anima' }">
        <div class="position-icon">💫</div>
        <div class="position-name">{{ data.inferior.name }}</div>
        <div class="position-label">{{ data.inferior.label }}</div>
        <div class="position-role">阿尼玛/阿尼姆斯</div>
      </div>
      
      <div class="shadow-row">
        <div class="shadow-position" v-for="(item, idx) in data.shadow" :key="idx" @click="selectShadow(idx)">
          <div class="shadow-icon">{{ shadowIcons[idx] }}</div>
          <div class="shadow-name">{{ item.name }}</div>
          <div class="shadow-role">{{ item.position }}</div>
        </div>
      </div>
    </div>
    
    <div class="function-detail" v-if="selected">
      <div class="detail-header">
        <span class="detail-icon">{{ getIcon(selected) }}</span>
        <div class="detail-info">
          <span class="detail-role">{{ getRoleName(selected) }}</span>
          <span class="detail-name">{{ getSelectedFunction()?.name }}</span>
        </div>
      </div>
      <p class="detail-desc">{{ getSelectedFunction()?.description }}</p>
      <div class="detail-characteristics">
        <h4>核心特征</h4>
        <ul>
          <li>{{ getCharacteristics(selected)[0] }}</li>
          <li>{{ getCharacteristics(selected)[1] }}</li>
          <li>{{ getCharacteristics(selected)[2] }}</li>
        </ul>
      </div>
    </div>
    
    <div class="legend">
      <div class="legend-item">
        <span class="legend-dot conscious"></span>
        <span>意识功能（阳面）</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot unconscious"></span>
        <span>无意识功能（阴面）</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const selected = ref(null)

const shadowIcons = ['👹', '👿', '😈', '💀']

function selectFunction(role) {
  selected.value = role
}

function selectShadow(idx) {
  selected.value = 'shadow-' + idx
}

function getIcon(role) {
  const icons = {
    hero: '🦸',
    parent: '👨‍👩‍👧',
    child: '👶',
    anima: '💫'
  }
  if (role.startsWith('shadow-')) {
    return shadowIcons[parseInt(role.split('-')[1])]
  }
  return icons[role] || '❓'
}

function getRoleName(role) {
  const names = {
    hero: '英雄',
    parent: '父母',
    child: '孩童',
    anima: '阿尼玛/阿尼姆斯'
  }
  if (role.startsWith('shadow-')) {
    return props.data.shadow[parseInt(role.split('-')[1])]?.position || '阴影'
  }
  return names[role] || '未知'
}

function getSelectedFunction() {
  const mapping = {
    hero: props.data.dominant,
    parent: props.data.auxiliary,
    child: props.data.tertiary,
    anima: props.data.inferior
  }
  if (selected.value.startsWith('shadow-')) {
    return props.data.shadow[parseInt(selected.value.split('-')[1])]
  }
  return mapping[selected.value]
}

function getCharacteristics(role) {
  const characteristics = {
    hero: ['最自然、最自信的功能', '用来解决问题和展示能力', '核心身份认同来源'],
    parent: ['支持和辅助英雄功能', '提供价值观和指导', '负责维护规则和秩序'],
    child: ['带来乐趣和创造力', '不受约束的表达方式', '探索新可能性的源泉'],
    anima: ['与深层情感和直觉连接', '代表内心渴望和潜力', '需要发展和整合'],
    'shadow-0': ['过度批判和挑剔', '害怕被他人控制', '隐藏的竞争意识'],
    'shadow-1': ['过度敏感和防御', '害怕被误解或拒绝', '情绪爆发的倾向'],
    'shadow-2': ['盲目行动和冲动', '害怕无聊和平淡', '缺乏深度的风险'],
    'shadow-3': ['自我毁灭的倾向', '最深的恐惧所在', '需要面对和接纳']
  }
  return characteristics[role] || ['待开发', '待发现', '待整合']
}
</script>

<style scoped>
.jungian-theater {
  padding: 24px;
}

.theater-stage {
  position: relative;
  height: 320px;
  margin-bottom: 24px;
}

.stage-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);
  border-radius: 16px;
  overflow: hidden;
}

.stage-light {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.position {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.position:hover,
.position.active {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.5);
  transform: scale(1.05);
}

.position-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.position-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.position-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.position-role {
  font-size: 10px;
  color: rgba(255, 215, 0, 0.8);
  padding: 2px 8px;
  background: rgba(255, 215, 0, 0.15);
  border-radius: 10px;
}

.position.hero { top: 20px; left: 50%; transform: translateX(-50%); }
.position.parent { top: 40px; left: 20%; }
.position.child { top: 40px; right: 20%; }
.position.anima { top: 180px; left: 50%; transform: translateX(-50%); }

.shadow-row {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.shadow-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(100, 100, 100, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(100, 100, 100, 0.3);
}

.shadow-position:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-3px);
}

.shadow-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.shadow-name {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}

.shadow-role {
  font-size: 9px;
  color: #64748b;
}

.function-detail {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-icon {
  font-size: 32px;
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-role {
  font-size: 12px;
  color: #94a3b8;
}

.detail-name {
  font-size: 20px;
  font-weight: 700;
  color: #334155;
}

.detail-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.detail-characteristics {
  background: #fff;
  padding: 14px;
  border-radius: 8px;
}

.detail-characteristics h4 {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 10px 0;
}

.detail-characteristics ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-characteristics li {
  font-size: 13px;
  color: #64748b;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.detail-characteristics li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: #8b5cf6;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.conscious {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.legend-dot.unconscious {
  background: linear-gradient(135deg, #64748b, #94a3b8);
}

@media (max-width: 640px) {
  .theater-stage {
    height: 400px;
  }
  
  .position.hero { top: 10px; }
  .position.parent { top: 100px; left: 10%; }
  .position.child { top: 100px; right: 10%; }
  .position.anima { top: 220px; }
  
  .shadow-row {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .shadow-position {
    padding: 8px;
    min-width: 70px;
  }
}
</style>
