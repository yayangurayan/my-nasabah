<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 selection:text-indigo-900">
    <!-- Modern Glassmorphism Navbar -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <!-- Logo Area -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h1 class="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800">
            MyNasabah
          </h1>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 font-medium text-sm">
          <router-link to="/" class="text-slate-500 hover:text-indigo-600 transition-colors">Beranda</router-link>
          <router-link to="/mapping" class="text-slate-500 hover:text-indigo-600 transition-colors">Mapping</router-link>
          
          <!-- Modern Dropdown -->
          <div class="group relative py-2">
            <span class="cursor-pointer text-slate-500 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              Pairs 
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
              <div class="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-2 flex flex-col gap-1">
                <router-link to="/dashboard/gbpusd" class="px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">🇬🇧 GBP/USD</router-link>
                <router-link to="/dashboard/gbpjpy" class="px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">🇬🇧 GBP/JPY</router-link>
                <router-link to="/dashboard/usdjpy" class="px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">🇺🇸 USD/JPY</router-link>
              </div>
            </div>
          </div>
        </nav>

        <!-- Admin Button -->
        <router-link to="/admin" class="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Admin Login
        </router-link>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
/* CSS Tambahan untuk animasi transisi halus */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
body {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
</style>