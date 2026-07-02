import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('../views/QuizView.vue')
  },
  {
    path: '/report/:id?',
    name: 'Report',
    component: () => import('../views/ReportView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
