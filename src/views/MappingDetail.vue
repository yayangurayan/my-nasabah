<template>
  <div class="max-w-4xl mx-auto mt-10">
    <!-- TOMBOL KEMBALI -->
    <button @click="goBack" class="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Kembali
    </button>

    <div class="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
      <div v-if="loading" class="text-center py-10 text-gray-500">Memuat data mapping...</div>
      <div v-else-if="mapping">
        <div class="mb-6">
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ mapping.pair }}</span>
          <h2 class="text-3xl font-bold text-gray-900 mt-4">{{ mapping.title }}</h2>
          <p class="text-gray-500 mt-2 text-sm">{{ formatDate(mapping.created_at) }}</p>
        </div>

        <div v-if="mapping.image_url" class="mb-8">
          <img :src="mapping.image_url" alt="Mapping Image" class="w-full rounded-lg shadow-sm border border-gray-200" />
        </div>

        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Deskripsi Analisis</h3>
          <p class="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{{ mapping.description || 'Tidak ada deskripsi.' }}</p>
        </div>
      </div>
      <div v-else class="text-center py-10 text-red-500 font-medium">Mapping tidak ditemukan.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const router = useRouter()
const mapping = ref(null)
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const goBack = () => {
  router.go(-1) // Kembali ke halaman sebelumnya
}

onMounted(async () => {
  const { data, error } = await supabase.from('mappings').select('*').eq('id', route.params.id).single()
  if (!error && data) mapping.value = data
  loading.value = false
})
</script>