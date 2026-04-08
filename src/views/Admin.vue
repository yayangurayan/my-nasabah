<template>
  <div class="max-w-6xl mx-auto">
    <!-- TAMPILAN LOGIN JIKA BELUM LOGIN -->
    <div v-if="!session" class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-10 border border-gray-100">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium">
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
    </div>

    <!-- TAMPILAN DASHBOARD ADMIN JIKA SUDAH LOGIN -->
    <div v-else>
      <div class="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 mt-4">
        <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button @click="handleLogout" class="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition font-medium">
          Logout
        </button>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex gap-4 mb-6">
        <button @click="activeTab = 'trades'" :class="activeTab === 'trades' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'" class="px-6 py-2 rounded-md font-medium transition">
          Kelola Sinyal (Trades)
        </button>
        <button @click="activeTab = 'mappings'" :class="activeTab === 'mappings' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'" class="px-6 py-2 rounded-md font-medium transition">
          Kelola Mapping
        </button>
      </div>

      <!-- ERROR / SUCCESS MESSAGES -->
      <div v-if="message" :class="messageType === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'" class="p-4 rounded-md mb-6 border font-medium">
        {{ message }}
      </div>

      <!-- ==============================
           TAB TRADES / SINYAL 
      =============================== -->
      <div v-if="activeTab === 'trades'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Daftar Sinyal</h3>
          <button @click="openTradeModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium shadow-sm">
            + Tambah Sinyal Baru
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pair & Tipe</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entry</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="trade in trades" :key="trade.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(trade.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ trade.pair }} <span class="font-normal text-gray-500">({{ trade.type }})</span></td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ trade.entry_price }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'bg-yellow-100 text-yellow-800 border border-yellow-200': trade.result === 'Pending',
                    'bg-green-100 text-green-800 border border-green-200': trade.result === 'Win',
                    'bg-red-100 text-red-800 border border-red-200': trade.result === 'Loss',
                    'bg-gray-100 text-gray-800 border border-gray-200': trade.result === 'BE'
                  }" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full">
                    {{ trade.result }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openTradeModal(trade)" class="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit/Update</button>
                  <button @click="deleteTrade(trade.id)" class="text-red-600 hover:text-red-900 font-semibold">Hapus</button>
                </td>
              </tr>
              <tr v-if="trades.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">Belum ada data sinyal.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==============================
           TAB MAPPINGS 
      =============================== -->
      <div v-if="activeTab === 'mappings'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Daftar Mapping Mingguan</h3>
          <button @click="openMappingModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium shadow-sm">
            + Tambah Mapping
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pair</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gambar</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="mapping in mappings" :key="mapping.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(mapping.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ mapping.pair }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ mapping.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <a v-if="mapping.image_url" :href="mapping.image_url" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1">
                    Lihat Gambar
                  </a>
                  <span v-else class="text-gray-400 italic">Tidak ada</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openMappingModal(mapping)" class="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                  <button @click="deleteMapping(mapping.id, mapping.image_url)" class="text-red-600 hover:text-red-900 font-semibold">Hapus</button>
                </td>
              </tr>
              <tr v-if="mappings.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">Belum ada data mapping.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ==============================
         MODAL FORM TRADE (TAMBAH & EDIT)
    =============================== -->
    <div v-if="showTradeModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 border border-gray-100 relative">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditingTrade ? 'Update Sinyal' : 'Kirim Sinyal Baru' }}</h3>
          <button @click="showTradeModal = false" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        <form @submit.prevent="saveTrade" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div>
            <label class="block text-sm font-semibold text-gray-700">Pair Mata Uang</label>
            <select v-model="tradeForm.pair" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Tipe Trading</label>
            <select v-model="tradeForm.type" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="Intraday">Intraday</option>
              <option value="Swing">Swing</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Entry Price</label>
            <input v-model.number="tradeForm.entry_price" type="number" step="0.00001" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Risk:Reward (Contoh: 2)</label>
            <input v-model.number="tradeForm.rr_ratio" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700">Catatan Sinyal</label>
            <textarea v-model="tradeForm.note" rows="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 shadow-sm" placeholder="Alasan entry sinyal ini..."></textarea>
          </div>

          <div class="md:col-span-2 border-t border-gray-200 mt-2 pt-4">
            <h4 class="text-md font-bold text-blue-800 mb-1">Update Hasil Sinyal</h4>
            <p class="text-xs text-gray-500 mb-4">Isi bagian ini hanya jika sinyal sudah mengenai TP (Take Profit) atau SL (Stop Loss).</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Hasil (Result)</label>
            <select v-model="tradeForm.result" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="Pending">Pending / Aktif</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="BE">Break Even (BE)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Exit Price</label>
            <input v-model.number="tradeForm.exit_price" type="number" step="0.00001" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Pips Bersih</label>
            <input v-model.number="tradeForm.pips" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Persentase P/L (%)</label>
            <input v-model.number="tradeForm.percentage" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" @click="showTradeModal = false" class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition">Batal</button>
            <button type="submit" :disabled="loading" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition shadow-md">
              {{ loading ? 'Menyimpan...' : 'Simpan Sinyal' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==============================
         MODAL FORM MAPPING (TAMBAH & EDIT)
    =============================== -->
    <div v-if="showMappingModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 border border-gray-100 relative">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditingMapping ? 'Update Mapping' : 'Tambah Mapping Baru' }}</h3>
          <button @click="showMappingModal = false" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        <form @submit.prevent="saveMapping" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Pair Mata Uang</label>
            <select v-model="mappingForm.pair" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Judul (Title)</label>
            <input v-model="mappingForm.title" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Misal: Setup GBPUSD Minggu ke-3" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Deskripsi Analisis</label>
            <textarea v-model="mappingForm.description" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 shadow-sm" placeholder="Jelaskan setup, konfirmasi, dan ekspektasi pergerakan harga..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Upload Gambar Mapping</label>
            <div v-if="mappingForm.image_url" class="mb-3 p-2 border border-gray-200 rounded bg-gray-50">
              <img :src="mappingForm.image_url" alt="Current Mapping" class="w-full max-h-48 object-contain rounded" />
              <p class="text-xs text-gray-500 mt-2 text-center">Gambar saat ini. Upload file baru di bawah jika ingin mengganti.</p>
            </div>
            
            <input type="file" @change="handleFileChange" accept="image/*" :required="!isEditingMapping" class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            <p class="text-xs text-gray-500 mt-1">Format didukung: JPG, PNG, WEBP.</p>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" @click="showMappingModal = false" class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition">Batal</button>
            <button type="submit" :disabled="loading" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition shadow-md">
              {{ loading ? 'Mengupload...' : 'Simpan Mapping' }}
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
  result: 'Pending',
  rr_ratio: null,
  percentage: null,
  note: ''
})

// State Modal Mapping
const showMappingModal = ref(false)
const isEditingMapping = ref(false)
const mappingForm = ref({
  id: null,
  pair: 'GBPUSD',
  title: '',
  description: '',
  image_url: null
})
const selectedFile = ref(null)

// Lifecycle
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    if (session.value) {
      fetchTrades()
      fetchMappings()
    }
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    if (_session) {
      fetchTrades()
      fetchMappings()
    }
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
    fetchMappings()
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

// Global Helpers
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => message.value = '', 6000)
}

// ==========================================
// FUNGSI CRUD TRADES (SINYAL)
// ==========================================
const fetchTrades = async () => {
  try {
    const { data, error } = await supabase.from('trades').select('*').order('created_at', { ascending: false })
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
    tradeForm.value = {
      id: null, pair: 'GBPUSD', type: 'Intraday', entry_price: null, exit_price: null,
      pips: null, result: 'Pending', rr_ratio: null, percentage: null, note: ''
    }
  }
  showTradeModal.value = true
}

const saveTrade = async () => {
  loading.value = true
  try {
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
      const { error } = await supabase.from('trades').update(payload).eq('id', tradeForm.value.id)
      if (error) throw error
      showMessage('Sinyal berhasil diupdate!')
    } else {
      const { error } = await supabase.from('trades').insert([payload])
      if (error) throw error
      showMessage('Sinyal baru berhasil disimpan!')
    }

    showTradeModal.value = false
    fetchTrades()
  } catch (error) {
    showMessage('Gagal menyimpan sinyal: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const deleteTrade = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus sinyal ini?')) return
  try {
    const { error } = await supabase.from('trades').delete().eq('id', id)
    if (error) throw error
    showMessage('Sinyal berhasil dihapus!')
    fetchTrades()
  } catch (error) {
    showMessage('Gagal menghapus: ' + error.message, 'error')
  }
}

// ==========================================
// FUNGSI CRUD MAPPING
// ==========================================
const fetchMappings = async () => {
  try {
    const { data, error } = await supabase.from('mappings').select('*').order('created_at', { ascending: false })
    if (error) throw error
    mappings.value = data
  } catch (error) {
    console.error("Error fetching mappings:", error)
  }
}

const openMappingModal = (mapping = null) => {
  selectedFile.value = null // reset file input
  if (mapping) {
    isEditingMapping.value = true
    mappingForm.value = { ...mapping }
  } else {
    isEditingMapping.value = false
    mappingForm.value = { id: null, pair: 'GBPUSD', title: '', description: '', image_url: null }
  }
  showMappingModal.value = true
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) selectedFile.value = file
}

const saveMapping = async () => {
  loading.value = true
  try {
    let finalImageUrl = mappingForm.value.image_url

    // PROSES UPLOAD GAMBAR KE SUPABASE STORAGE
    if (selectedFile.value) {
      const file = selectedFile.value
      const fileExt = file.name.split('.').pop()
      // Generate nama unik untuk mencegah duplikasi
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('mappings') // PENTING: Anda harus membuat bucket bernama "mappings" di Supabase
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('mappings').getPublicUrl(fileName)
      finalImageUrl = data.publicUrl
    }

    const payload = {
      pair: mappingForm.value.pair,
      title: mappingForm.value.title,
      description: mappingForm.value.description,
      image_url: finalImageUrl
    }

    if (isEditingMapping.value) {
      const { error } = await supabase.from('mappings').update(payload).eq('id', mappingForm.value.id)
      if (error) throw error
      showMessage('Mapping berhasil diupdate!')
    } else {
      if (!finalImageUrl) throw new Error("Gambar wajib diupload untuk mapping baru!")
      const { error } = await supabase.from('mappings').insert([payload])
      if (error) throw error
      showMessage('Mapping baru berhasil disimpan!')
    }

    showMappingModal.value = false
    fetchMappings()
  } catch (error) {
    showMessage('Gagal menyimpan mapping: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const deleteMapping = async (id, imageUrl) => {
  if (!confirm('Apakah Anda yakin ingin menghapus mapping ini beserta gambarnya?')) return

  try {
    // Hapus gambar fisik dari Supabase Storage jika url-nya ada
    if (imageUrl) {
      try {
        const urlPath = new URL(imageUrl).pathname
        const segments = urlPath.split('/')
        const bucketIndex = segments.indexOf('mappings')
        if (bucketIndex !== -1) {
          const filePath = segments.slice(bucketIndex + 1).join('/')
          await supabase.storage.from('mappings').remove([filePath])
        }
      } catch (e) {
        console.warn("Gambar di storage tidak ditemukan atau gagal dihapus.", e)
      }
    }

    // Hapus data baris di Database
    const { error } = await supabase.from('mappings').delete().eq('id', id)
    if (error) throw error
    
    showMessage('Mapping berhasil dihapus secara permanen!')
    fetchMappings()
  } catch (error) {
    showMessage('Gagal menghapus mapping: ' + error.message, 'error')
  }
}
</script>