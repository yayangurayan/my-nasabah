<template>
  <div class="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 mt-10">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const mapping = ref(null)
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  const { data, error } = await supabase.from('mappings').select('*').eq('id', route.params.id).single()
  if (!error && data) mapping.value = data
  loading.value = false
})
</script>