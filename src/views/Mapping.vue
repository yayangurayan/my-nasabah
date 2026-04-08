<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center md:text-left">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">Mapping Mingguan</h2>
        <p class="text-slate-500 mt-2">Analisa teknikal eksklusif dari Andrian untuk komunitas My Nasabah.</p>
      </div>
      <div class="mt-4 md:mt-0 p-3 bg-indigo-50 rounded-2xl text-indigo-600">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="relative w-12 h-12">
        <div class="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMsg }}
    </div>

    <!-- Empty State -->
    <div v-else-if="mappings.length === 0" class="bg-white py-20 px-4 rounded-3xl border border-slate-100 text-center">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <p class="text-slate-500 font-medium">Belum ada mapping minggu ini.</p>
    </div>

    <!-- Galeri Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-for="map in mappings" :key="map.id" class="bg-white rounded-3xl border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
        
        <!-- Gambar dengan Animasi Zoom -->
        <div class="aspect-video w-full overflow-hidden bg-slate-100 relative">
          <img v-if="map.image_url" :src="map.image_url" :alt="map.title" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <!-- Badge -->
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {{ map.pair }}
          </div>
        </div>
        
        <!-- Konten -->
        <div class="p-6 flex flex-col flex-grow">
          <div class="flex items-center gap-2 mb-3 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {{ new Date(map.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{{ map.title }}</h3>
          <p class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{{ map.description }}</p>
          
          <!-- Tombol Aksi Bawah -->
          <div class="mt-auto pt-4 border-t border-slate-50">
            <a :href="map.image_url" target="_blank" class="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Lihat Layar Penuh <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const mappings = ref([])
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.from('mappings').select('*').order('created_at', { ascending: false })
    if (error) throw error
    mappings.value = data || []
  } catch (error) {
    errorMsg.value = 'Gagal memuat data mapping: ' + error.message
  } finally {
    loading.value = false
  }
})
</script>