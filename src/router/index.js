import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Mapping from '../views/Mapping.vue'
import GBPUSD from '../views/dashboard/GBPUSD.vue'
import USDCHF from '../views/dashboard/USDCHF.vue'
import XAUUSD from '../views/dashboard/XAUUSD.vue'
import MappingDetail from '../views/MappingDetail.vue'
import TradeDetail from '../views/TradeDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/mapping', name: 'Mapping', component: Mapping },
  { path: '/mapping/:id', name: 'MappingDetail', component: MappingDetail },
  { path: '/trade/:id', name: 'TradeDetail', component: TradeDetail },
  { path: '/dashboard/gbpusd', name: 'GBPUSD', component: GBPUSD },
  { path: '/dashboard/usdchf', name: 'USDCHF', component: USDCHF },
  { path: '/dashboard/xauusd', name: 'XAUUSD', component: XAUUSD }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router