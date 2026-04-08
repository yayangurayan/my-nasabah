<template>
  <div class="max-w-6xl mx-auto">
    <!-- TAMPILAN LOGIN JIKA BELUM LOGIN -->
    <div v-if="!session" class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
    </div>

    <!-- TAMPILAN DASHBOARD ADMIN JIKA SUDAH LOGIN -->
    <div v-else>
      <div class="flex justify-between items-center mb-8 border-b pb-4">
        <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button @click="handleLogout" class="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition">
          Logout
        </button>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex gap-4 mb-6">
        <button @click="activeTab = 'trades'" :class="activeTab === 'trades' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'" class="px-6 py-2 rounded-md font-medium transition">
          Kelola Sinyal (Trades)
        </button>
        <button @click="activeTab = 'mappings'" :class="activeTab === 'mappings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'" class="px-6 py-2 rounded-md font-medium transition">
          Kelola Mapping
        </button>
      </div>

      <!-- ERROR / SUCCESS MESSAGES -->
      <div v-if="message" :class="messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'" class="p-4 rounded-md mb-6">
        {{ message }}
      </div>

      <!-- ==============================
           TAB TRADES / SINYAL 
      =============================== -->
      <div v-if="activeTab === 'trades'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Daftar Sinyal</h3>
          <button @click="openTradeModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            + Tambah Sinyal Baru
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair & Tipe</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="trade in trades" :key="trade.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(trade.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ trade.pair }} ({{ trade.type }})</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ trade.entry_price }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'bg-yellow-100 text-yellow-800': trade.result === 'Pending',
                    'bg-green-100 text-green-800': trade.result === 'Win',
                    'bg-red-100 text-red-800': trade.result === 'Loss',
                    'bg-gray-100 text-gray-800': trade.result === 'BE'
                  }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ trade.result }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openTradeModal(trade)" class="text-blue-600 hover:text-blue-900 mr-4">Edit/Update</button>
                  <button @click="deleteTrade(trade.id)" class="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==============================
           TAB MAPPINGS 
      =============================== -->
      <div v-if="activeTab === 'mappings'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Daftar Mapping Mingguan</h3>
          <button @click="openMappingModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            + Tambah Mapping
          </button>
        </div>
        <p class="text-gray-500 italic">Fitur kelola mapping akan dikembangkan di fase selanjutnya sesuai roadmap WDD. Saat ini fokus perbaikan Sinyal (Trades).</p>
      </div>

    </div>

    <!-- ==============================
         MODAL FORM TRADE (TAMBAH & EDIT)
    =============================== -->
    <div v-if="showTradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 my-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ isEditingTrade ? 'Update Sinyal' : 'Kirim Sinyal Baru' }}</h3>
          <button @click="showTradeModal = false" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form @submit.prevent="saveTrade" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Default Fields (Saat Sinyal Baru) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Pair Mata Uang</label>
            <select v-model="tradeForm.pair" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Tipe Trading</label>
            <select v-model="tradeForm.type" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="Intraday">Intraday</option>
              <option value="Swing">Swing</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Entry Price</label>
            <input v-model.number="tradeForm.entry_price" type="number" step="0.00001" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Risk:Reward (Contoh: 2)</label>
            <input v-model.number="tradeForm.rr_ratio" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Catatan Sinyal</label>
            <textarea v-model="tradeForm.note" rows="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400" placeholder="Alasan entry sinyal ini..."></textarea>
          </div>

          <hr class="md:col-span-2 my-2 border-gray-200" />

          <!-- Fields untuk Update/Hasil Akhir (Bisa diisi nanti) -->
          <div class="md:col-span-2">
            <h4 class="text-md font-semibold text-blue-800 mb-2">Update Hasil Sinyal (Isi jika sudah close/Hit TP/SL)</h4>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Hasil (Result)</label>
            <select v-model="tradeForm.result" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              <option value="Pending">Pending / Aktif</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="BE">Break Even (BE)</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Biarkan "Pending" saat pertama kali rilis sinyal.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Exit Price</label>
            <input v-model.number="tradeForm.exit_price" type="number" step="0.00001" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Pips Bersih</label>
            <input v-model.number="tradeForm.pips" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Persentase P/L (%)</label>
            <input v-model.number="tradeForm.percentage" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" @click="showTradeModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Menyimpan...' : 'Simpan Sinyal' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

// State Auth
const session = ref(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

// State Dashboard
const activeTab = ref('trades')
const trades = ref([])
const mappings = ref([])

// State Modal Trade
const showTradeModal = ref(false)
const isEditingTrade = ref(false)
const tradeForm = ref({
  id: null,
  pair: 'GBPUSD',
  type: 'Intraday',
  entry_price: null,
  exit_price: null,
  pips: null,
  result: 'Pending', // Default selalu Pending saat awal
  rr_ratio: null,
  percentage: null,
  note: ''
})

// Lifecycle
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    if (session.value) fetchTrades()
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

// Auth Functions
const handleLogin = async () => {
  loading.value = true
  message.value = ''
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    fetchTrades()
  } catch (error) {
    message.value = 'Gagal Login: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
}

// Format Tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Tampilkan Notifikasi
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => message.value = '', 5000)
}

// --- FUNGSI CRUD TRADES (SINYAL) ---

const fetchTrades = async () => {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    trades.value = data
  } catch (error) {
    console.error("Error fetching trades:", error)
  }
}

const openTradeModal = (trade = null) => {
  if (trade) {
    isEditingTrade.value = true
    tradeForm.value = { ...trade }
  } else {
    isEditingTrade.value = false
    // Reset Form untuk Sinyal Baru. Status dikunci ke "Pending"
    tradeForm.value = {
      id: null,
      pair: 'GBPUSD',
      type: 'Intraday',
      entry_price: null,
      exit_price: null,
      pips: null,
      result: 'Pending',
      rr_ratio: null,
      percentage: null,
      note: ''
    }
  }
  showTradeModal.value = true
}

const saveTrade = async () => {
  loading.value = true
  try {
    // Siapkan payload data, ubah string kosong menjadi null untuk angka
    const payload = {
      pair: tradeForm.value.pair,
      type: tradeForm.value.type,
      entry_price: tradeForm.value.entry_price,
      exit_price: tradeForm.value.exit_price || null,
      pips: tradeForm.value.pips || null,
      result: tradeForm.value.result,
      rr_ratio: tradeForm.value.rr_ratio || null,
      percentage: tradeForm.value.percentage || null,
      note: tradeForm.value.note
    }

    if (isEditingTrade.value) {
      // PROSES UPDATE SINYAL
      const { error } = await supabase
        .from('trades')
        .update(payload)
        .eq('id', tradeForm.value.id)
      
      if (error) throw error
      showMessage('Sinyal berhasil diupdate!')
    } else {
      // PROSES INSERT SINYAL BARU
      const { error } = await supabase
        .from('trades')
        .insert([payload])
      
      if (error) throw error
      showMessage('Sinyal baru berhasil disimpan! (Trigger WA berjalan di background)')
      
      // CATATAN WDD: Trigger Notifikasi WA (Webhook Fonnte/Pihak Ketiga)
      // Idealnya disetup di Supabase Database Webhooks, bukan di Frontend
      // agar lebih aman.
    }

    showTradeModal.value = false
    fetchTrades() // Refresh tabel
  } catch (error) {
    showMessage('Gagal menyimpan: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const deleteTrade = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus sinyal ini?')) return

  try {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    showMessage('Sinyal berhasil dihapus!')
    fetchTrades()
  } catch (error) {
    showMessage('Gagal menghapus: ' + error.message, 'error')
  }
}

// --- FUNGSI MAPPING (Placeholder untuk Fase Selanjutnya) ---
const openMappingModal = () => {
  alert("Sesuai roadmap, form upload gambar mapping akan dibuat di tahap berikutnya. Supabase Storage harus diatur terlebih dahulu.")
}

</script>