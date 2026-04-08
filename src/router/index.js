import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/mapping', name: 'Mapping', component: () => import('../views/Mapping.vue') },
  { path: '/dashboard/gbpusd', name: 'GBPUSD', component: () => import('../views/dashboard/GBPUSD.vue') },
  { path: '/dashboard/gbpjpy', name: 'GBPJPY', component: () => import('../views/dashboard/GBPJPY.vue') },
  { path: '/dashboard/usdjpy', name: 'USDJPY', component: () => import('../views/dashboard/USDJPY.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') },
  
  // Rute Baru Untuk Halaman Detail (Tab Baru)
  { path: '/trade/:id', name: 'TradeDetail', component: () => import('../views/TradeDetail.vue') },
  { path: '/mapping/:id', name: 'MappingDetail', component: () => import('../views/MappingDetail.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router