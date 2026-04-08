<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-blue-900">Ringkasan Performa</h2>
      <p class="text-gray-600 mt-2">Transparansi hasil trading dari seluruh pairs (All Pairs).</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="bg-red-100 text-red-700 p-4 rounded-md">
      {{ errorMsg }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Metrik Utama (Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium mb-1">Total Pips</p>
          <p :class="totalPips >= 0 ? 'text-green-600' : 'text-red-600'" class="text-3xl font-bold">
            {{ totalPips > 0 ? '+' : '' }}{{ totalPips }}
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium mb-1">Win Rate</p>
          <p class="text-3xl font-bold text-blue-900">{{ winRate }}%</p>
          <p class="text-xs text-gray-400 mt-1">Dari {{ totalTrades }} Trade</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium mb-1">Profit Factor</p>
          <p class="text-3xl font-bold text-blue-900">{{ profitFactor }}</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium mb-1">Avg Risk:Reward</p>
          <p class="text-3xl font-bold text-blue-900">1:{{ avgRR }}</p>
        </div>
      </div>

      <!-- Area Grafik -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Equity Curve Chart -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Equity Curve</h3>
          <div class="h-64">
            <Line :data="equityChartData" :options="lineOptions" />
          </div>
        </div>

        <!-- Monthly Performance Chart -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Performa Bulanan</h3>
          <div class="h-64">
            <Bar :data="monthlyChartData" :options="barOptions" />
          </div>
        </div>
      </div>

      <!-- Tabel Jurnal Sinyal -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">Riwayat Sinyal Terbaru</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th class="p-4 font-medium">Tanggal</th>
                <th class="p-4 font-medium">Pair</th>
                <th class="p-4 font-medium">Tipe</th>
                <th class="p-4 font-medium">Entry/Exit</th>
                <th class="p-4 font-medium">Hasil</th>
                <th class="p-4 font-medium text-right">Pips</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trade in trades.slice().reverse().slice(0, 10)" :key="trade.id" class="border-b border-gray-50 hover:bg-gray-50 transition">
                <td class="p-4 text-sm">{{ new Date(trade.created_at).toLocaleDateString('id-ID') }}</td>
                <td class="p-4 text-sm font-semibold text-blue-900">{{ trade.pair }}</td>
                <td class="p-4 text-sm text-gray-600">{{ trade.type }}</td>
                <td class="p-4 text-sm text-gray-600">{{ trade.entry_price }} ➔ {{ trade.exit_price || '-' }}</td>
                <td class="p-4">
                  <span :class="{
                    'bg-green-100 text-green-700': trade.result === 'Win',
                    'bg-red-100 text-red-700': trade.result === 'Loss',
                    'bg-gray-200 text-gray-700': trade.result === 'BE'
                  }" class="px-2 py-1 rounded text-xs font-bold uppercase">
                    {{ trade.result }}
                  </span>
                </td>
                <td :class="trade.pips >= 0 ? 'text-green-600' : 'text-red-600'" class="p-4 text-sm font-bold text-right">
                  {{ trade.pips > 0 ? '+' : '' }}{{ trade.pips || 0 }}
                </td>
              </tr>
              <tr v-if="trades.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-500">Belum ada riwayat trading.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboard } from '../composables/useDashboard'

// Import Chart.js dan Vue-Chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Inisialisasi composable untuk All Pairs (tanpa filter pair)
const {
  trades,
  loading,
  errorMsg,
  fetchTrades,
  totalTrades,
  totalPips,
  winRate,
  profitFactor,
  avgRR,
  equityChartData,
  monthlyChartData
} = useDashboard()

onMounted(() => {
  fetchTrades()
})

// Opsi konfigurasi untuk Grafik Line (Equity Curve)
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: false, grid: { color: '#f3f4f6' } },
    x: { grid: { display: false } }
  }
}

// Opsi konfigurasi untuk Grafik Bar (Monthly)
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
    x: { grid: { display: false } }
  }
}
</script>