<template>
  <div class="max-w-4xl mx-auto mt-6">
    <!-- Form Login (Jika belum login) -->
    <div v-if="!user" class="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-md mx-auto mt-10">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="admin@mynasabah.com">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>

        <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>

    <!-- Dashboard Admin (Jika sudah login) -->
    <div v-else class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <!-- Header Admin -->
      <div class="bg-blue-900 px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white">Dashboard Admin - My Nasabah</h2>
        <button @click="handleLogout" class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
      </div>

      <!-- Tab Navigasi -->
      <div class="flex border-b border-gray-200">
        <button @click="activeTab = 'trades'" :class="activeTab === 'trades' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-4 text-center font-medium transition">
          Input Jurnal Trade
        </button>
        <button @click="activeTab = 'mappings'" :class="activeTab === 'mappings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-4 text-center font-medium transition">
          Input Mapping Mingguan
        </button>
      </div>

      <!-- Notifikasi -->
      <div v-if="submitMsg.text" :class="submitMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-6 py-3 text-sm font-medium">
        {{ submitMsg.text }}
      </div>

      <!-- Konten Tab: Trades -->
      <div v-if="activeTab === 'trades'" class="p-6">
        <form @submit.prevent="submitTrade" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pair</label>
            <select v-model="tradeForm.pair" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipe Trading</label>
            <select v-model="tradeForm.type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="Intraday">Intraday</option>
              <option value="Swing">Swing</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Entry Price</label>
            <input v-model="tradeForm.entry_price" type="number" step="0.001" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Exit Price</label>
            <input v-model="tradeForm.exit_price" type="number" step="0.001" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Hasil (Result)</label>
            <select v-model="tradeForm.result" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="BE">Break Even (BE)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Pips Bersih</label>
            <input v-model="tradeForm.pips" type="number" step="0.1" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Risk:Reward Ratio (Contoh: 2 untuk 1:2)</label>
            <input v-model="tradeForm.rr_ratio" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Persentase P/L (%)</label>
            <input v-model="tradeForm.percentage" type="number" step="0.1" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Catatan Analisa</label>
            <textarea v-model="tradeForm.note" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          
          <div class="md:col-span-2 mt-4">
            <button type="submit" :disabled="submitLoading" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {{ submitLoading ? 'Menyimpan...' : 'Simpan Jurnal Trade' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Konten Tab: Mappings -->
      <div v-if="activeTab === 'mappings'" class="p-6">
        <form @submit.prevent="submitMapping" class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pair</label>
            <select v-model="mappingForm.pair" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Judul Mapping</label>
            <input v-model="mappingForm.title" type="text" required placeholder="Contoh: Setup Buy GBPUSD H4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Deskripsi / Skenario</label>
            <textarea v-model="mappingForm.description" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Upload Gambar Chart</label>
            <input type="file" accept="image/*" @change="handleFileChange" required class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>
          
          <div class="mt-4">
            <button type="submit" :disabled="submitLoading" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {{ submitLoading ? 'Mengupload & Menyimpan...' : 'Simpan Mapping' }}
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

// --- State Autentikasi ---
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const user = ref(null)

// --- State UI Admin ---
const activeTab = ref('trades') // 'trades' atau 'mappings'
const submitLoading = ref(false)
const submitMsg = ref({ type: '', text: '' })

// --- State Form Trades ---
const tradeForm = ref({
  pair: 'GBPUSD',
  type: 'Intraday',
  entry_price: null,
  exit_price: null,
  pips: null,
  result: 'Win',
  rr_ratio: null,
  percentage: null,
  note: ''
})

// --- State Form Mappings ---
const mappingForm = ref({
  pair: 'GBPUSD',
  title: '',
  description: '',
  file: null
})

// --- Cek Status Login ---
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})

// --- Fungsi Autentikasi ---
const handleLogin = async () => {
  try {
    loading.value = true; errorMsg.value = ''
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) throw error
  } catch (error) {
    errorMsg.value = error.message || 'Gagal login. Periksa kembali email dan password.'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
}

// --- Fungsi Notifikasi ---
const showMsg = (type, text) => {
  submitMsg.value = { type, text }
  setTimeout(() => { submitMsg.value = { type: '', text: '' } }, 5000)
}

// --- Submit Form Trade ---
const submitTrade = async () => {
  try {
    submitLoading.value = true
    const { error } = await supabase.from('trades').insert([{
      pair: tradeForm.value.pair,
      type: tradeForm.value.type,
      entry_price: tradeForm.value.entry_price,
      exit_price: tradeForm.value.exit_price || null,
      pips: tradeForm.value.pips,
      result: tradeForm.value.result,
      rr_ratio: tradeForm.value.rr_ratio || null,
      percentage: tradeForm.value.percentage,
      note: tradeForm.value.note
    }])

    if (error) throw error
    showMsg('success', '✅ Jurnal Trade berhasil disimpan!')
    
    // Reset form parsial
    tradeForm.value.entry_price = null
    tradeForm.value.exit_price = null
    tradeForm.value.pips = null
    tradeForm.value.percentage = null
    tradeForm.value.note = ''
  } catch (error) {
    showMsg('error', '❌ Gagal menyimpan data: ' + error.message)
  } finally {
    submitLoading.value = false
  }
}

// --- Handle File Upload Mappings ---
const handleFileChange = (event) => {
  mappingForm.value.file = event.target.files[0]
}

const submitMapping = async (event) => {
  if (!mappingForm.value.file) {
    showMsg('error', 'Pilih gambar terlebih dahulu!')
    return
  }

  try {
    submitLoading.value = true
    
    const file = mappingForm.value.file
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${mappingForm.value.pair}/${fileName}`

    // 1. Upload ke Supabase Storage (Bucket: mappings)
    const { error: uploadError } = await supabase.storage
      .from('mappings')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Dapatkan URL Publik
    const { data: publicUrlData } = supabase.storage
      .from('mappings')
      .getPublicUrl(filePath)

    // 3. Simpan ke Database
    const { error: dbError } = await supabase.from('mappings').insert([{
      pair: mappingForm.value.pair,
      title: mappingForm.value.title,
      description: mappingForm.value.description,
      image_url: publicUrlData.publicUrl
    }])

    if (dbError) throw dbError

    showMsg('success', '✅ Mapping berhasil diupload & disimpan!')
    
    // Reset Form
    mappingForm.value.title = ''
    mappingForm.value.description = ''
    mappingForm.value.file = null
    event.target.reset() // Note: ini butuh ref ke form asli di real-world, tapi file input state sudah di-clear.
  } catch (error) {
    showMsg('error', '❌ Gagal mengupload: ' + error.message)
  } finally {
    submitLoading.value = false
  }
}
</script>