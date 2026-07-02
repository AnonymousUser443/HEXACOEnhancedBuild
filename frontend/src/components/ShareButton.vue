<template>
  <div class="share-button">
    <button class="action-btn pdf-btn" @click="handleExportPDF">
      <span class="btn-icon">📄</span>
      <span class="btn-text">导出 PDF</span>
    </button>
    <button class="action-btn image-btn" @click="handleExportImage">
      <span class="btn-icon">🖼️</span>
      <span class="btn-text">导出图片</span>
    </button>
    <button class="action-btn share-btn" @click="handleCopyLink">
      <span class="btn-icon">🔗</span>
      <span class="btn-text">复制链接</span>
    </button>
    <div class="toast" v-if="toast.show" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportToPDF, exportToImage, copyShareLink } from '../utils/exportUtils'

const props = defineProps({
  sessionId: {
    type: String,
    required: true
  }
})

const toast = ref({ show: false, message: '', type: 'success' })

async function handleExportPDF() {
  try {
    showToast('正在生成 PDF...', 'info')
    await exportToPDF('report-content', `personality-report-${Date.now()}`)
    showToast('PDF 导出成功！', 'success')
  } catch (error) {
    showToast('导出失败，请重试', 'error')
    console.error('PDF export error:', error)
  }
}

async function handleExportImage() {
  try {
    showToast('正在生成图片...', 'info')
    await exportToImage('report-content', `personality-report-${Date.now()}`)
    showToast('图片导出成功！', 'success')
  } catch (error) {
    showToast('导出失败，请重试', 'error')
    console.error('Image export error:', error)
  }
}

async function handleCopyLink() {
  try {
    const result = await copyShareLink(props.sessionId)
    showToast(result.message, result.success ? 'success' : 'error')
  } catch (error) {
    showToast('复制失败，请手动复制', 'error')
    console.error('Copy link error:', error)
  }
}

function showToast(message, type) {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.share-button {
  position: relative;
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  font-size: 13px;
}

.pdf-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
}

.pdf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.image-btn {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: #fff;
}

.image-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
}

.share-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}

.toast.info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .share-button {
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 100px;
    justify-content: center;
  }
}
</style>
