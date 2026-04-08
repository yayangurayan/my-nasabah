<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-blue-900">Mapping Mingguan</h2>
      <p class="text-gray-600 mt-2">Analisa dan skenario trading mingguan dari Andrian untuk komunitas My Nasabah.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-100 text-red-700 p-4 rounded-md">
      {{ errorMsg }}
    </div>

    <!-- Empty State -->
    <div v-else-if="mappings.length === 0" class="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
      <p class="text-gray-500">Belum ada mapping mingguan yang diunggah.</p>
    </div>

    <!-- Galeri Mapping -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="map in mappings" :key="map.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
        <!-- Gambar Mapping -->
        <div class="h-48 overflow-hidden bg-gray-100 relative">
          <img v-if="map.image_url" :src="map.image_url" :alt="map.title" class="w-full h-full object-cover hover:scale-105 transition duration-300">
          <div v-else class="flex items-center justify-center w-full h-full text-gray-400">
            Tidak ada gambar
          </div>
          <!-- Label Pair -->
          <div class="absolute top-2 right-2 bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded">
            {{ map.pair }}
          </div>
        </div>
        
        <!-- Detail Mapping -->
        <div class="p-5">
          <div class="text-xs text-gray-400 mb-1">{{ new Date(map.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ map.title }}</h3>
          <p class="text-sm text-gray-600 line-clamp-3">{{ map.description }}</p>
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
    // Mengambil data mapping, diurutkan dari yang terbaru (descending)
    const { data, error } = await supabase
      .from('mappings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    mappings.value = data || []
  } catch (error) {
    errorMsg.value = 'Gagal memuat data mapping: ' + error.message
  } finally {
    loading.value = false
  }
})
</script>