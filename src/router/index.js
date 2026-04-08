import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase' // Import Supabase client

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/mapping', name: 'Mapping', component: () => import('../views/Mapping.vue') },
  { path: '/dashboard/gbpusd', name: 'GBPUSD', component: () => import('../views/dashboard/GBPUSD.vue') },
  { path: '/dashboard/gbpjpy', name: 'GBPJPY', component: () => import('../views/dashboard/GBPJPY.vue') },
  { path: '/dashboard/usdjpy', name: 'USDJPY', component: () => import('../views/dashboard/USDJPY.vue') },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true } // Tandai bahwa rute ini butuh login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard untuk mengecek status login Supabase
router.beforeEach(async (to, from, next) => {
  // Ambil sesi user saat ini dari Supabase
  const { data: { session } } = await supabase.auth.getSession()

  // Jika rute butuh auth dan tidak ada sesi/user
  if (to.meta.requiresAuth && !session) {
    // Biarkan tetap di halaman admin, nanti di Admin.vue kita atur untuk menampilkan form login
    next() 
  } else {
    next()
  }
})

export default router