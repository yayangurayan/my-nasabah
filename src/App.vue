<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans w-full">
    <!-- HEADER -->
    <header class="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        <!-- Logo / Brand -->
        <h1 class="text-2xl font-bold tracking-wider truncate">
          <router-link to="/">My Nasabah</router-link>
        </h1>
        
        <!-- ======================= -->
        <!-- NAVIGASI DESKTOP -->
        <!-- ======================= -->
        <nav class="hidden md:flex gap-6 items-center">
          <router-link to="/" class="hover:text-blue-300 font-medium transition">Beranda</router-link>
          <router-link to="/mapping" class="hover:text-blue-300 font-medium transition">Mapping Mingguan</router-link>
          
          <!-- Dropdown Pairs (Desktop) - DIPERBAIKI -->
          <div class="group relative">
            <!-- Tambahkan padding vertikal (py-2) pada tombol agar area sentuh/hover lebih luas -->
            <button class="cursor-pointer hover:text-blue-300 font-medium transition flex items-center gap-1 focus:outline-none py-2">
              Dashboard Pairs ▾
            </button>
            
            <!-- Wrapper tak terlihat dengan padding-top (pt-2) sebagai jembatan mouse -->
            <div class="absolute left-0 top-full hidden group-hover:block pt-1 z-20 w-40">
              <!-- Kotak Dropdown aslinya -->
              <div class="bg-white text-gray-800 py-2 rounded-md shadow-xl overflow-hidden border border-gray-100">
                <router-link to="/dashboard/gbpusd" class="block px-5 py-2 hover:bg-gray-100 transition font-medium">GBPUSD</router-link>
                <router-link to="/dashboard/gbpjpy" class="block px-5 py-2 hover:bg-gray-100 transition font-medium">GBPJPY</router-link>
                <router-link to="/dashboard/usdjpy" class="block px-5 py-2 hover:bg-gray-100 transition font-medium">USDJPY</router-link>
              </div>
            </div>
          </div>
          
          <router-link to="/admin" class="hover:bg-blue-700 bg-blue-800 text-white transition text-sm font-semibold flex items-center px-4 py-2 rounded-md shadow-sm border border-blue-700">
            Admin Login
          </router-link>
        </nav>

        <!-- ======================= -->
        <!-- TOMBOL MENU MOBILE -->
        <!-- ======================= -->
        <button @click="toggleMobileMenu" class="md:hidden flex items-center text-white focus:outline-none p-1 rounded-md hover:bg-blue-800 transition">
          <svg v-if="!isMobileMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- ======================= -->
      <!-- DROPDOWN NAVIGASI MOBILE-->
      <!-- ======================= -->
      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-show="isMobileMenuOpen" class="md:hidden bg-blue-800 border-t border-blue-700 absolute w-full shadow-lg">
          <nav class="flex flex-col px-4 pt-3 pb-5 space-y-2">
            <router-link to="/" @click="closeMobileMenu" class="block hover:bg-blue-700 px-4 py-3 rounded-md font-medium transition">Beranda</router-link>
            <router-link to="/mapping" @click="closeMobileMenu" class="block hover:bg-blue-700 px-4 py-3 rounded-md font-medium transition">Mapping Mingguan</router-link>
            
            <!-- Dropdown Pairs (Mobile) -->
            <div>
              <button @click="isMobilePairsOpen = !isMobilePairsOpen" class="w-full text-left hover:bg-blue-700 px-4 py-3 rounded-md font-medium transition flex justify-between items-center focus:outline-none">
                Dashboard Pairs
                <span :class="{'rotate-180': isMobilePairsOpen}" class="transition-transform duration-200">▾</span>
              </button>
              
              <div v-show="isMobilePairsOpen" class="bg-blue-900 rounded-md mt-1 overflow-hidden mx-2 shadow-inner">
                <router-link to="/dashboard/gbpusd" @click="closeMobileMenu" class="block px-6 py-3 hover:bg-blue-700 text-sm font-medium border-b border-blue-800">GBPUSD</router-link>
                <router-link to="/dashboard/gbpjpy" @click="closeMobileMenu" class="block px-6 py-3 hover:bg-blue-700 text-sm font-medium border-b border-blue-800">GBPJPY</router-link>
                <router-link to="/dashboard/usdjpy" @click="closeMobileMenu" class="block px-6 py-3 hover:bg-blue-700 text-sm font-medium">USDJPY</router-link>
              </div>
            </div>

            <div class="pt-3 pb-1 border-t border-blue-700 mt-2">
              <router-link to="/admin" @click="closeMobileMenu" class="block bg-white text-blue-900 text-center px-4 py-3 rounded-md font-bold hover:bg-gray-100 transition">
                Admin Dashboard
              </router-link>
            </div>
          </nav>
        </div>
      </transition>
    </header>

    <!-- KONTEN UTAMA -->
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <router-view></router-view>
    </main>

    <!-- FOOTER SEDERHANA -->
    <footer class="bg-gray-900 text-gray-400 py-6 text-center text-sm w-full mt-auto">
      <p>&copy; {{ new Date().getFullYear() }} My Nasabah. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
const isMobilePairsOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Tutup submenu jika menu utama ditutup
  if (!isMobileMenuOpen.value) {
    isMobilePairsOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isMobilePairsOpen.value = false
}
</script>