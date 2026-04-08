<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-10">
    <div v-if="loading" class="text-center py-10 text-gray-500">Memuat data sinyal...</div>
    <div v-else-if="trade">
      <div class="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">{{ trade.pair }} Sinyal</h2>
          <p class="text-gray-500 mt-1">{{ formatDate(trade.created_at) }}</p>
        </div>
        <span :class="{
          'bg-yellow-100 text-yellow-800 border-yellow-200': trade.result === 'Pending',
          'bg-green-100 text-green-800 border-green-200': trade.result === 'Win',
          'bg-red-100 text-red-800 border-red-200': trade.result === 'Loss',
          'bg-gray-100 text-gray-800 border-gray-200': trade.result === 'BE'
        }" class="px-4 py-2 inline-flex text-sm font-bold rounded-full border">
          Status: {{ trade.result }}
        </span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div>
          <p class="text-xs text-gray-500 uppercase font-semibold">Tipe</p>
          <p class="text-lg font-bold text-gray-900">{{ trade.type }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase font-semibold">Entry Price</p>
          <p class="text-lg font-bold text-blue-600">{{ trade.entry_price }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase font-semibold">Stop Loss (SL)</p>
          <p class="text-lg font-bold text-red-600">{{ trade.stop_loss || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase font-semibold">Take Profit (TP)</p>
          <p class="text-lg font-bold text-green-600">{{ trade.take_profit || '-' }}</p>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Catatan Analisis:</h3>
        <p class="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-md border border-gray-200 leading-relaxed">{{ trade.note || 'Tidak ada catatan khusus.' }}</p>
      </div>

      <!-- Tampil jika sudah selesai -->
      <div v-if="trade.result !== 'Pending'" class="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 class="text-lg font-bold text-blue-900 mb-4">Hasil Akhir Trading</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold">Exit Price</p>
            <p class="text-lg font-bold text-gray-900">{{ trade.exit_price || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-semibold">Pips Bersih</p>
            <p class="text-lg font-bold text-gray-900">{{ trade.pips ? trade.pips + ' Pips' : '-' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-red-500 font-medium">Sinyal tidak ditemukan.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const trade = ref(null)
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  const { data, error } = await supabase.from('trades').select('*').eq('id', route.params.id).single()
  if (!error && data) trade.value = data
  loading.value = false
})
</script>