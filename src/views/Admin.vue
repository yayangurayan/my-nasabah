<template>
  <div class="max-w-4xl mx-auto mt-4 mb-10">
    <!-- Form Login Modern -->
    <div v-if="!user" class="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 max-w-md mx-auto mt-16 relative overflow-hidden">
      <!-- Ornamen Dekoratif -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10">
        <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 class="text-2xl font-extrabold text-center text-slate-800 mb-8 tracking-tight">Portal Admin</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Email</label>
            <input v-model="email" type="email" required class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="admin@mynasabah.com">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Kata Sandi</label>
            <input v-model="password" type="password" required class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••">
          </div>

          <div v-if="errorMsg" class="text-rose-500 text-sm font-medium text-center bg-rose-50 p-3 rounded-lg">{{ errorMsg }}</div>

          <button type="submit" :disabled="loading" class="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-xl hover:shadow-slate-900/20 focus:outline-none focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-70 flex justify-center">
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Dashboard Admin -->
    <div v-else class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <!-- Header Admin -->
      <div class="bg-slate-900 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white">Console Admin</h2>
          <p class="text-slate-400 text-sm mt-1">Sistem Input Jurnal My Nasabah</p>
        </div>
        <button @click="handleLogout" class="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition border border-white/10">Keluar</button>
      </div>

      <!-- Tab Navigasi -->
      <div class="flex p-2 bg-slate-50 border-b border-slate-100">
        <button @click="activeTab = 'trades'" :class="activeTab === 'trades' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100'" class="flex-1 py-2.5 px-4 rounded-xl text-sm transition-all">
          📝 Input Trade
        </button>
        <button @click="activeTab = 'mappings'" :class="activeTab === 'mappings' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100'" class="flex-1 py-2.5 px-4 rounded-xl text-sm transition-all">
          📈 Upload Mapping
        </button>
      </div>

      <!-- Notifikasi Animasi -->
      <transition name="fade">
        <div v-if="submitMsg.text" :class="submitMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'bg-rose-50 text-rose-700 border-l-4 border-rose-500'" class="m-6 p-4 rounded-r-xl shadow-sm text-sm font-bold flex items-center gap-3">
          {{ submitMsg.text }}
        </div>
      </transition>

      <!-- Konten Tab: Trades -->
      <div v-if="activeTab === 'trades'" class="p-8">
        <form @submit.prevent="submitTrade" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Pair Mata Uang</label>
            <select v-model="tradeForm.pair" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Tipe Trading</label>
            <select v-model="tradeForm.type" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="Intraday">Intraday</option>
              <option value="Swing">Swing</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Entry Price</label>
            <input v-model="tradeForm.entry_price" type="number" step="0.001" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Exit Price</label>
            <input v-model="tradeForm.exit_price" type="number" step="0.001" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Hasil (Result)</label>
            <select v-model="tradeForm.result" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold" :class="{'text-emerald-600': tradeForm.result === 'Win', 'text-rose-600': tradeForm.result === 'Loss'}">
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="BE">Break Even (BE)</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Pips Bersih</label>
            <input v-model="tradeForm.pips" type="number" step="0.1" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono font-bold text-indigo-600">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Risk:Reward (Contoh: 2)</label>
            <input v-model="tradeForm.rr_ratio" type="number" step="0.1" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Persentase P/L (%)</label>
            <input v-model="tradeForm.percentage" type="number" step="0.1" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="md:col-span-2 space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Catatan Analisa</label>
            <textarea v-model="tradeForm.note" rows="3" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Kenapa trade ini diambil..."></textarea>
          </div>
          
          <div class="md:col-span-2 mt-2">
            <button type="submit" :disabled="submitLoading" class="w-full py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
               <svg v-if="submitLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ submitLoading ? 'Memproses Data...' : '💾 Simpan Jurnal Trade' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Konten Tab: Mappings -->
      <div v-if="activeTab === 'mappings'" class="p-8">
        <form @submit.prevent="submitMapping" class="space-y-6 max-w-2xl mx-auto">
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Pair</label>
            <select v-model="mappingForm.pair" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="GBPUSD">GBPUSD</option>
              <option value="GBPJPY">GBPJPY</option>
              <option value="USDJPY">USDJPY</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Judul Skenario</label>
            <input v-model="mappingForm.title" type="text" required placeholder="Setup Buy / Sell..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Analisa Teknis</label>
            <textarea v-model="mappingForm.description" rows="4" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"></textarea>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700">Screenshot Chart</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <div class="flex text-sm text-slate-600 justify-center">
                  <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 px-2 py-1 shadow-sm">
                    <span>Upload file</span>
                    <input type="file" accept="image/*" @change="handleFileChange" required class="sr-only">
                  </label>
                </div>
                <p class="text-xs text-slate-500 mt-2">{{ mappingForm.file ? mappingForm.file.name : 'PNG, JPG, GIF max 5MB' }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <button type="submit" :disabled="submitLoading" class="w-full py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
              <svg v-if="submitLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ submitLoading ? 'Mengupload ke Server...' : '🚀 Simpan Mapping' }}
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const user = ref(null)
const activeTab = ref('trades')
const submitLoading = ref(false)
const submitMsg = ref({ type: '', text: '' })

const tradeForm = ref({ pair: 'GBPUSD', type: 'Intraday', entry_price: null, exit_price: null, pips: null, result: 'Win', rr_ratio: null, percentage: null, note: '' })
const mappingForm = ref({ pair: 'GBPUSD', title: '', description: '', file: null })

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  supabase.auth.onAuthStateChange((_event, session) => { user.value = session?.user || null })
})

const handleLogin = async () => {
  try {
    loading.value = true; errorMsg.value = ''
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) throw error
  } catch (error) { errorMsg.value = 'Gagal login. Periksa kembali email & sandi.' } finally { loading.value = false }
}
const handleLogout = async () => { await supabase.auth.signOut() }

const showMsg = (type, text) => {
  submitMsg.value = { type, text }
  setTimeout(() => { submitMsg.value = { type: '', text: '' } }, 5000)
}

const submitTrade = async () => {
  try {
    submitLoading.value = true
    const { error } = await supabase.from('trades').insert([{
      pair: tradeForm.value.pair, type: tradeForm.value.type, entry_price: tradeForm.value.entry_price, exit_price: tradeForm.value.exit_price || null, pips: tradeForm.value.pips, result: tradeForm.value.result, rr_ratio: tradeForm.value.rr_ratio || null, percentage: tradeForm.value.percentage, note: tradeForm.value.note
    }])
    if (error) throw error
    showMsg('success', 'Jurnal Trade berhasil disimpan! 📊')
    tradeForm.value.entry_price = null; tradeForm.value.exit_price = null; tradeForm.value.pips = null; tradeForm.value.percentage = null; tradeForm.value.note = ''
  } catch (error) { showMsg('error', 'Gagal menyimpan: ' + error.message) } finally { submitLoading.value = false }
}

const handleFileChange = (event) => { mappingForm.value.file = event.target.files[0] }

const submitMapping = async () => {
  if (!mappingForm.value.file) return showMsg('error', 'Upload gambar chart terlebih dahulu!')
  try {
    submitLoading.value = true
    const file = mappingForm.value.file
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage.from('mappings').upload(`${mappingForm.value.pair}/${fileName}`, file)
    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase.storage.from('mappings').getPublicUrl(`${mappingForm.value.pair}/${fileName}`)
    const { error: dbError } = await supabase.from('mappings').insert([{
      pair: mappingForm.value.pair, title: mappingForm.value.title, description: mappingForm.value.description, image_url: publicUrlData.publicUrl
    }])
    if (dbError) throw dbError

    showMsg('success', 'Mapping berhasil tayang! 🚀')
    mappingForm.value.title = ''; mappingForm.value.description = ''; mappingForm.value.file = null
  } catch (error) { showMsg('error', 'Gagal upload: ' + error.message) } finally { submitLoading.value = false }
}
</script>