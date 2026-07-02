export async function exportToPDF(elementId, filename = 'personality-report') {
  const [html2canvas, jsPDF] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ])

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  const canvas = await html2canvas.default(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f5f7fa',
    logging: false
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF.default({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(`${filename}.pdf`)
}

export async function exportToImage(elementId, filename = 'personality-report') {
  const { default: html2canvas } = await import('html2canvas')

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f5f7fa',
    logging: false
  })

  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export function copyShareLink(sessionId) {
  const url = `${window.location.origin}/report/${sessionId}`
  return navigator.clipboard.writeText(url).then(() => {
    return { success: true, message: '链接已复制到剪贴板', url }
  }).catch(() => {
    return { success: false, message: '复制失败，请手动复制', url }
  })
}

export function generateShareCard(result) {
  const mbti = result.mbti?.type || '???'
  const enneagram = result.enneagram?.type || '?'
  const hexacoSummary = result.hexaco?.map(d => `${d.code}:${Math.round(d.tScore)}`).join(', ') || ''
  
  return {
    title: `我的人格分析报告`,
    description: `MBTI: ${mbti} | 九型人格: ${enneagram}号 | HEXACO: ${hexacoSummary}`,
    imageUrl: ''
  }
}
