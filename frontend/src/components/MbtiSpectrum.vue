<template>
  <div class="mbti-spectrum">
    <div class="mbti-type">
      <span class="type-letter">{{ data.type.charAt(0) }}</span>
      <span class="type-letter">{{ data.type.charAt(1) }}</span>
      <span class="type-letter">{{ data.type.charAt(2) }}</span>
      <span class="type-letter">{{ data.type.charAt(3) }}</span>
    </div>
    <div class="spectrum-container">
      <div class="spectrum-item" v-for="(dim, key) in mbtiDimensions" :key="key">
        <div class="spectrum-labels">
          <span class="label-left">{{ dim.left }}</span>
          <span class="label-right">{{ dim.right }}</span>
        </div>
        <div class="spectrum-track">
          <div 
            class="spectrum-fill" 
            :style="{ width: dim.percent + '%' }"
            :class="dim.type.toLowerCase()"
          ></div>
          <div 
            class="spectrum-pointer" 
            :style="{ left: dim.percent + '%' }"
          ></div>
        </div>
        <div class="spectrum-info">
          <span class="dimension-type">{{ dim.type }}</span>
          <span class="dimension-percent">{{ dim.percent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const mbtiDimensions = computed(() => ({
  EI: {
    left: '内向 (I)',
    right: '外向 (E)',
    type: props.data.EI.type,
    percent: props.data.EI.percent
  },
  SN: {
    left: '感觉 (S)',
    right: '直觉 (N)',
    type: props.data.SN.type,
    percent: props.data.SN.percent
  },
  TF: {
    left: '思考 (T)',
    right: '情感 (F)',
    type: props.data.TF.type,
    percent: props.data.TF.percent
  },
  JP: {
    left: '感知 (P)',
    right: '判断 (J)',
    type: props.data.JP.type,
    percent: props.data.JP.percent
  }
}))
</script>

<style scoped>
.mbti-spectrum {
  padding: 24px;
}

.mbti-type {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.type-letter {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.spectrum-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.spectrum-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spectrum-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
}

.label-left,
.label-right {
  font-weight: 500;
}

.spectrum-track {
  position: relative;
  height: 16px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: visible;
}

.spectrum-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 8px;
  transition: width 0.8s ease;
}

.spectrum-fill.e,
.spectrum-fill.n,
.spectrum-fill.f,
.spectrum-fill.j {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.spectrum-fill.i,
.spectrum-fill.s,
.spectrum-fill.t,
.spectrum-fill.p {
  background: linear-gradient(90deg, #8b5cf6, #6366f1);
}

.spectrum-pointer {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #fff;
  border: 3px solid #6366f1;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: left 0.8s ease;
}

.spectrum-info {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dimension-type {
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
}

.dimension-percent {
  font-size: 14px;
  color: #888;
}
</style>
