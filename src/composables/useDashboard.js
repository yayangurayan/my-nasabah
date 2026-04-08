import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export function useDashboard(pairFilter = null) {
  const trades = ref([])
  const loading = ref(true)
  const errorMsg = ref('')

  // 1. Fetch Data dari Supabase
  const fetchTrades = async () => {
    try {
      loading.value = true
      let query = supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: true }) // Urut dari terlama ke terbaru untuk Equity Curve

      if (pairFilter) {
        query = query.eq('pair', pairFilter)
      }

      const { data, error } = await query

      if (error) throw error
      trades.value = data || []
    } catch (error) {
      errorMsg.value = 'Gagal memuat data: ' + error.message
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 2. Perhitungan Metrik Utama (Fase 3)
  const totalTrades = computed(() => trades.value.length)
  
  const totalPips = computed(() => {
    return trades.value.reduce((acc, trade) => acc + Number(trade.pips || 0), 0).toFixed(1)
  })

  const winRate = computed(() => {
    if (totalTrades.value === 0) return 0
    const wins = trades.value.filter(t => t.result === 'Win').length
    return ((wins / totalTrades.value) * 100).toFixed(1)
  })

  const profitFactor = computed(() => {
    let grossProfit = 0
    let grossLoss = 0
    trades.value.forEach(t => {
      const pips = Number(t.pips || 0)
      if (pips > 0) grossProfit += pips
      if (pips < 0) grossLoss += Math.abs(pips)
    })
    if (grossLoss === 0) return grossProfit > 0 ? 'Maksimal' : 0 // Hindari pembagian dengan nol
    return (grossProfit / grossLoss).toFixed(2)
  })

  const avgRR = computed(() => {
    const tradesWithRR = trades.value.filter(t => t.rr_ratio)
    if (tradesWithRR.length === 0) return 0
    const sumRR = tradesWithRR.reduce((acc, t) => acc + Number(t.rr_ratio), 0)
    return (sumRR / tradesWithRR.length).toFixed(2)
  })

  // 3. Persiapan Data untuk Grafik (Fase 4)
  
  // A. Data Equity Curve (Akumulasi Pips)
  const equityChartData = computed(() => {
    let currentEquity = 0
    const labels = []
    const dataPoints = []

    trades.value.forEach(t => {
      // Format tanggal sederhana: DD/MM
      const date = new Date(t.created_at)
      labels.push(`${date.getDate()}/${date.getMonth() + 1}`)
      
      currentEquity += Number(t.pips || 0)
      dataPoints.push(currentEquity)
    })

    return {
      labels,
      datasets: [{
        label: 'Pertumbuhan Pips (Equity Curve)',
        data: dataPoints,
        borderColor: '#2563eb', // Blue-600 Tailwind
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3 // Membuat garis sedikit melengkung (smooth)
      }]
    }
  })

  // B. Data Monthly Bar Chart (Performa Per Bulan)
  const monthlyChartData = computed(() => {
    const monthlyPips = {}

    trades.value.forEach(t => {
      const date = new Date(t.created_at)
      const monthYear = `${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`
      
      if (!monthlyPips[monthYear]) {
        monthlyPips[monthYear] = 0
      }
      monthlyPips[monthYear] += Number(t.pips || 0)
    })

    const labels = Object.keys(monthlyPips)
    const dataPoints = Object.values(monthlyPips)

    return {
      labels,
      datasets: [{
        label: 'Pips per Bulan',
        data: dataPoints,
        backgroundColor: dataPoints.map(p => p >= 0 ? '#10b981' : '#ef4444'), // Hijau jika profit, Merah jika loss
        borderRadius: 4
      }]
    }
  })

  return {
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
  }
}