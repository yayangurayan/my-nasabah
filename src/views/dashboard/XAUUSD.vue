<template>
  <div>
    <div class="mb-8 flex items-center gap-3">
      <h2 class="text-3xl font-bold text-blue-900">Performa XAUUSD</h2>
      <span class="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">Dashboard Pair Spesifik</span>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>

    <div v-else-if="errorMsg" class="bg-red-100 text-red-700 p-4 rounded-md">
      {{ errorMsg }}
    </div>

    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium mb-1">Total Pips XAUUSD</p>
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Equity Curve XAUUSD</h3>
          <div class="h-64"><Line :data="equityChartData" :options="chartOptions" /></div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Performa Bulanan</h3>
          <div class="h-64"><Bar :data="monthlyChartData" :options="chartOptions" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboard } from '../../composables/useDashboard'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

// Perhatikan parameter di sini adalah 'XAUUSD'
const { trades, loading, errorMsg, fetchTrades, totalTrades, totalPips, winRate, profitFactor, avgRR, equityChartData, monthlyChartData } = useDashboard('XAUUSD')

onMounted(() => fetchTrades())

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: false, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
}
</script>