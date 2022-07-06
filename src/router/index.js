import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/mapChart'

  },
  {
    path: '/mapChart',
    name: 'mapChart',
    component: () => import('../views/mapChart/mapChart.vue')
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../views/poetryGame.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
