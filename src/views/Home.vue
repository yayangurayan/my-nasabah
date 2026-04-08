<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-indigo-900 to-slate-800 p-8 rounded-3xl shadow-xl shadow-indigo-900/20 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div class="relative z-10">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Performa Sinyal</h2>
        <p class="text-indigo-200 mt-2 text-lg">Transparansi total hasil trading All Pairs oleh Andrian.</p>
      </div>
      <div class="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-sm font-medium">Sistem Live Terhubung</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="relative w-16 h-16">
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ errorMsg }}
    </div>

    <div v-else class="space-y-8">
      <!-- Metrik Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <!-- Card 1 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            <p class="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Pips</p>
          </div>
          <p :class="totalPips >= 0 ? 'text-emerald-500' : 'text-rose-500'" class="text-4xl font-black tracking-tighter">
            {{ totalPips > 0 ? '+' : '' }}{{ totalPips }}
          </p>
        </div>
        
        <!-- Card 2 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg></div>
            <p class="text-sm text-slate-500 font-semibold uppercase tracking-wider">Win Rate</p>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-4xl font-black text-slate-800 tracking-tighter">{{ winRate }}%</p>
            <p class="text-xs text-slate-400 font-medium">/ {{ totalTrades }} Trade</p>
          </div>
        </div>
        
        <!-- Card 3 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
            <p class="text-sm text-slate-500 font-semibold uppercase tracking-wider">Profit Factor</p>
          </div>
          <p class="text-4xl font-black text-slate-800 tracking-tighter">{{ profitFactor }}</p>
        </div>
        
        <!-- Card 4 -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg></div>
            <p class="text-sm text-slate-500 font-semibold uppercase tracking-wider">Avg RR</p>
          </div>
          <p class="text-4xl font-black text-slate-800 tracking-tighter">1:{{ avgRR }}</p>
        </div>
      </div>

      <!-- Grafik Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Equity Curve Chart -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-extrabold text-slate-800">Equity Curve</h3>
            <span class="p-2 bg-slate-50 rounded-lg text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg></span>
          </div>
          <div class="h-72 w-full">
            <Line :data="equityChartData" :options="lineOptions" />
          </div>
        </div>

        <!-- Monthly Performance Chart -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-extrabold text-slate-800">Performa Bulanan</h3>
            <span class="p-2 bg-slate-50 rounded-lg text-slate-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></span>
          </div>
          <div class="h-72 w-full">
            <Bar :data="monthlyChartData" :options="barOptions" />
          </div>
        </div>
      </div>

      <!-- Tabel Jurnal Sinyal -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 class="text-lg font-extrabold text-slate-800">Riwayat Sinyal Terbaru</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th class="p-5 font-semibold">Tanggal</th>
                <th class="p-5 font-semibold">Pair</th>
                <th class="p-5 font-semibold">Tipe</th>
                <th class="p-5 font-semibold">Entry / Exit</th>
                <th class="p-5 font-semibold">Hasil</th>
                <th class="p-5 font-semibold text-right">Pips</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="trade in trades.slice().reverse().slice(0, 10)" :key="trade.id" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                <td class="p-5 text-slate-500">{{ new Date(trade.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) }}</td>
                <td class="p-5 font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ trade.pair }}</td>
                <td class="p-5"><span class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{{ trade.type }}</span></td>
                <td class="p-5 text-slate-500 font-mono text-xs">{{ trade.entry_price }} <span class="text-slate-300 mx-1">➔</span> {{ trade.exit_price || 'Aktif' }}</td>
                <td class="p-5">
                  <div :class="{
                    'bg-emerald-100/50 text-emerald-600 border-emerald-200': trade.result === 'Win',
                    'bg-rose-100/50 text-rose-600 border-rose-200': trade.result === 'Loss',
                    'bg-slate-100 text-slate-600 border-slate-200': trade.result === 'BE'
                  }" class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border">
                    {{ trade.result }}
                  </div>
                </td>
                <td :class="trade.pips >= 0 ? 'text-emerald-500' : 'text-rose-500'" class="p-5 font-black text-right text-base">
                  {{ trade.pips > 0 ? '+' : '' }}{{ trade.pips || 0 }}
                </td>
              </tr>
              <tr v-if="trades.length === 0">
                <td colspan="6" class="p-12 text-center">
                  <div class="flex flex-col items-center justify-center text-slate-400">
                    <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    <p>Belum ada riwayat trading.</p>
                  </div>
                </td>
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
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const { trades, loading, errorMsg, fetchTrades, totalTrades, totalPips, winRate, profitFactor, avgRR, equityChartData, monthlyChartData } = useDashboard()

onMounted(() => fetchTrades())

// Opsi Chart.js yang Dipercantik
const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      titleFont: { size: 13, family: 'sans-serif' },
      bodyFont: { size: 14, weight: 'bold', family: 'sans-serif' },
      displayColors: false,
      callbacks: { label: (context) => `Total Pips: ${context.parsed.y}` }
    }
  },
  scales: {
    y: { border: { display: false }, grid: { color: '#f1f5f9', drawTicks: false }, ticks: { padding: 10, color: '#94a3b8', font: { weight: '600' } } },
    x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: '600' } } }
  },
  interaction: { intersect: false, mode: 'index' }
}

const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      displayColors: false,
      callbacks: { label: (context) => `Pips: ${context.parsed.y}` }
    }
  },
  scales: {
    y: { border: { display: false }, grid: { color: '#f1f5f9', drawTicks: false }, ticks: { padding: 10, color: '#94a3b8', font: { weight: '600' } } },
    x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8', font: { weight: '600' } } }
  }
}
</script>