<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="bg-blue-900 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold tracking-wider">My Nasabah</h1>
        <nav class="hidden md:flex gap-6">
          <router-link to="/" class="hover:text-blue-300 transition">Beranda</router-link>
          <router-link to="/mapping" class="hover:text-blue-300 transition">Mapping Mingguan</router-link>
          
          <div class="group relative">
            <span class="cursor-pointer hover:text-blue-300 transition">Dashboard Pairs ▾</span>
            <div class="absolute hidden group-hover:block bg-white text-gray-800 mt-2 rounded shadow-lg overflow-hidden z-10 w-32">
              <router-link to="/dashboard/gbpusd" class="block px-4 py-2 hover:bg-gray-100">GBPUSD</router-link>
              <router-link to="/dashboard/gbpjpy" class="block px-4 py-2 hover:bg-gray-100">GBPJPY</router-link>
              <router-link to="/dashboard/usdjpy" class="block px-4 py-2 hover:bg-gray-100">USDJPY</router-link>
            </div>
          </div>
          
          <router-link to="/admin" class="hover:text-blue-300 transition text-sm flex items-center bg-blue-800 px-3 py-1 rounded">Admin Login</router-link>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Layout utama yang simpel dan bersih
</script>