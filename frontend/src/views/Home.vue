<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">多维人格交叉量表</h1>
        <p class="hero-subtitle">基于 HEXACO 六因素模型的人格分析系统</p>
        <p class="hero-description">
          通过 96 道专业题目，全面评估您的人格特征，生成详细的 HEXACO 雷达图报告和 MBTI 类型分析。
        </p>
        <div class="hero-buttons">
          <button class="btn-primary" @click="$router.push('/quiz')">
            开始测验
          </button>
          <button class="btn-secondary" @click="$router.push('/report')">
            查看示例报告
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hexagon-ring">
          <div class="hexagon"></div>
          <div class="hexagon h2"></div>
          <div class="hexagon h3"></div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3>HEXACO 六维度</h3>
        <p>诚实-谦逊、情绪性、外向性、宜人性、严谨性、开放性</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>专业报告</h3>
        <p>详细的雷达图、条形图、MBTI 光谱分析</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>效度评估</h3>
        <p>基于响应时间和一致性的测验有效性评估</p>
      </div>
    </section>

    <section class="dimensions-preview">
      <h2>HEXACO 维度简介</h2>
      <div class="dimensions-grid">
        <div class="dimension-card h">
          <span class="dim-code">H</span>
          <span class="dim-name">诚实-谦逊</span>
          <p>真诚、公平、避免贪婪、谦逊</p>
        </div>
        <div class="dimension-card e">
          <span class="dim-code">E</span>
          <span class="dim-name">情绪性</span>
          <p>焦虑、抑郁、脆弱、情绪波动</p>
        </div>
        <div class="dimension-card x">
          <span class="dim-code">X</span>
          <span class="dim-name">外向性</span>
          <p>社交、活跃、寻求刺激、乐观</p>
        </div>
        <div class="dimension-card a">
          <span class="dim-code">A</span>
          <span class="dim-name">宜人性</span>
          <p>宽容、温和、耐心、谦虚</p>
        </div>
        <div class="dimension-card c">
          <span class="dim-code">C</span>
          <span class="dim-name">严谨性</span>
          <p>组织、尽责、自律、审慎</p>
        </div>
        <div class="dimension-card o">
          <span class="dim-code">O</span>
          <span class="dim-name">开放性</span>
          <p>审美、好奇心、创造力、非常规</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>&copy; 2026 多维人格交叉量表系统</p>
    </footer>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 40px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.hero-subtitle {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.hero-description {
  font-size: 15px;
  line-height: 1.7;
  margin: 0 0 32px 0;
  opacity: 0.85;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary {
  padding: 14px 32px;
  background: #fff;
  color: #6366f1;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-left: 40px;
}

.hexagon-ring {
  position: relative;
  width: 200px;
  height: 200px;
}

.hexagon {
  position: absolute;
  width: 100px;
  height: 115.47px;
  background: rgba(255, 255, 255, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 3s ease-in-out infinite;
}

.hexagon.h2 {
  width: 150px;
  height: 173.2px;
  animation: pulse 3s ease-in-out infinite 0.5s;
}

.hexagon.h3 {
  width: 200px;
  height: 230.94px;
  animation: pulse 3s ease-in-out infinite 1s;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
}

.features {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 40px 20px;
}

.feature-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 280px;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.dimensions-preview {
  padding: 40px 20px;
  background: #fff;
}

.dimensions-preview h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 32px 0;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.dimension-card {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.dimension-card.h { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
.dimension-card.e { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
.dimension-card.x { background: linear-gradient(135deg, #fef3c7, #fde68a); }
.dimension-card.a { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }
.dimension-card.c { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); }
.dimension-card.o { background: linear-gradient(135deg, #f3e8ff, #e9d5ff); }

.dim-code {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.dim-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.dimension-card p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.footer {
  padding: 24px;
  text-align: center;
  background: #f1f5f9;
}

.footer p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 40px 20px;
    text-align: center;
  }
  
  .hero-content {
    max-width: 100%;
    margin-bottom: 32px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-visual {
    padding-left: 0;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .features-card {
    max-width: 100%;
  }
  
  .dimensions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dimensions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
