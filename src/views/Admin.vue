<template>
  <div class="max-w-6xl mx-auto">
    <div v-if="!session" class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-10 border border-gray-100">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500" />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 mt-4">
        <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button @click="handleLogout" class="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition font-medium">Logout</button>
      </div>

      <div class="flex gap-4 mb-6">
        <button @click="activeTab = 'trades'" :class="activeTab === 'trades' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'" class="px-6 py-2 rounded-md font-medium transition">Kelola Sinyal (Trades)</button>
        <button @click="activeTab = 'mappings'" :class="activeTab === 'mappings' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'" class="px-6 py-2 rounded-md font-medium transition">Kelola Mapping</button>
      </div>

      <div v-if="message" :class="messageType === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'" class="p-4 rounded-md mb-6 border font-medium">
        {{ message }}
      </div>

      <div v-if="activeTab === 'trades'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Daftar Sinyal</h3>
          <button @click="openTradeModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium">+ Tambah Sinyal Baru</button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pair & Order</th> <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="trade in trades" :key="trade.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(trade.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {{ trade.pair }} 
                  <span class="font-normal text-gray-500">({{ trade.type }} - {{ trade.order_type || 'N/A' }})</span> </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{'bg-yellow-100 text-yellow-800': trade.result === 'Pending', 'bg-green-100 text-green-800': trade.result === 'Win', 'bg-red-100 text-red-800': trade.result === 'Loss', 'bg-gray-100 text-gray-800': trade.result === 'BE'}" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-200">{{ trade.result }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/trade/${trade.id}`" target="_blank" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">Lihat Detail</router-link>
                  <button @click="openTradeModal(trade)" class="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                  <button @click="deleteTrade(trade.id)" class="text-red-600 hover:text-red-900 font-semibold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'mappings'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Daftar Mapping Mingguan</h3>
          <button @click="openMappingModal()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium">+ Tambah Mapping</button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pair</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="mapping in mappings" :key="mapping.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(mapping.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ mapping.pair }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{{ mapping.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/mapping/${mapping.id}`" target="_blank" class="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">Lihat Detail</router-link>
                  <button @click="openMappingModal(mapping)" class="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                  <button @click="deleteMapping(mapping.id, mapping.image_url)" class="text-red-600 hover:text-red-900 font-semibold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showTradeModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 border relative">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditingTrade ? 'Update Sinyal' : 'Kirim Sinyal Baru' }}</h3>
          <button @click="showTradeModal = false" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        <form @submit.prevent="saveTrade" class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label class="block text-sm font-semibold text-gray-700">Pair Mata Uang</label>
            <select v-model="tradeForm.pair" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
              <option value="GBPUSD">GBPUSD</option><option value="GBPJPY">GBPJPY</option><option value="USDJPY">USDJPY</option>
            </select>
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Tipe Trading</label>
            <select v-model="tradeForm.type" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
              <option value="Intraday">Intraday</option><option value="Swing">Swing</option>
            </select>
          </div>
          
          <div class="md:col-span-2"><label class="block text-sm font-semibold text-gray-700">Jenis Order</label>
            <select v-model="tradeForm.order_type" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
              <option value="Buy Limit">Buy Limit</option>
              <option value="Sell Limit">Sell Limit</option>
            </select>
          </div>

          <div class="md:col-span-2"><label class="block text-sm font-semibold text-gray-700">Entry Price</label>
            <input v-model.number="tradeForm.entry_price" type="number" step="0.00001" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Stop Loss (SL)</label>
            <input v-model.number="tradeForm.stop_loss" type="number" step="0.00001" class="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-gray-900" />
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Take Profit (TP)</label>
            <input v-model.number="tradeForm.take_profit" type="number" step="0.00001" class="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md bg-green-50 text-gray-900" />
          </div>

          <div class="md:col-span-2"><label class="block text-sm font-semibold text-gray-700">Catatan Sinyal</label>
            <textarea v-model="tradeForm.note" rows="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"></textarea>
          </div>

          <div class="md:col-span-2 border-t mt-2 pt-4"><h4 class="text-md font-bold text-blue-800 mb-1">Update Hasil Sinyal</h4></div>

          <div><label class="block text-sm font-semibold text-gray-700">Hasil (Result)</label>
            <select v-model="tradeForm.result" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
              <option value="Pending">Pending / Aktif</option><option value="Win">Win</option><option value="Loss">Loss</option><option value="BE">Break Even (BE)</option>
            </select>
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Exit Price</label>
            <input v-model.number="tradeForm.exit_price" type="number" step="0.00001" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Pips Bersih</label>
            <input v-model.number="tradeForm.pips" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
          </div>
          <div><label class="block text-sm font-semibold text-gray-700">Risk:Reward (Contoh: 2)</label>
            <input v-model.number="tradeForm.rr_ratio" type="number" step="0.1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
          </div>

          <div class="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" @click="showTradeModal = false" class="px-5 py-2 border rounded-md font-medium">Batal</button>
            <button type="submit" :disabled="loading" class="px-5 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-50">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showMappingModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 border">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
          <h3 class="text-xl font-bold">{{ isEditingMapping ? 'Update Mapping' : 'Tambah Mapping Baru' }}</h3>
          <button @click="showMappingModal = false" class="text-gray-400 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="saveMapping" class="space-y-5">
          <div><label class="block text-sm font-semibold">Pair Mata Uang</label>
            <select v-model="mappingForm.pair" required class="mt-1 block w-full px-3 py-2 border rounded-md bg-white text-gray-900"><option value="GBPUSD">GBPUSD</option><option value="GBPJPY">GBPJPY</option><option value="USDJPY">USDJPY</option></select>
          </div>
          <div><label class="block text-sm font-semibold">Judul</label>
            <input v-model="mappingForm.title" type="text" required class="mt-1 block w-full px-3 py-2 border rounded-md bg-white text-gray-900" />
          </div>
          <div><label class="block text-sm font-semibold">Deskripsi Analisis</label>
            <textarea v-model="mappingForm.description" rows="4" class="mt-1 block w-full px-3 py-2 border rounded-md bg-white text-gray-900"></textarea>
          </div>
          <div><label class="block text-sm font-semibold">Upload Gambar Mapping</label>
            <div v-if="mappingForm.image_url" class="mb-3 p-2 bg-gray-50 border"><img :src="mappingForm.image_url" class="max-h-48" /></div>
            <input type="file" @change="handleFileChange" accept="image/*" :required="!isEditingMapping" class="mt-1 block w-full text-sm border bg-white" />
          </div>
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="showMappingModal = false" class="px-5 py-2 border rounded-md font-medium">Batal</button>
            <button type="submit" :disabled="loading" class="px-5 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-50">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const session = ref(null); const email = ref(''); const password = ref('');
const loading = ref(false); const message = ref(''); const messageType = ref('');
const activeTab = ref('trades'); const trades = ref([]); const mappings = ref([]);

const showTradeModal = ref(false); const isEditingTrade = ref(false);
// UPDATE PAYLOAD DEFAULT
const tradeForm = ref({ id: null, pair: 'GBPUSD', type: 'Intraday', order_type: 'Buy', entry_price: null, stop_loss: null, take_profit: null, exit_price: null, pips: null, result: 'Pending', rr_ratio: null, percentage: null, note: '' })

const showMappingModal = ref(false); const isEditingMapping = ref(false);
const mappingForm = ref({ id: null, pair: 'GBPUSD', title: '', description: '', image_url: null })
const selectedFile = ref(null);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => { session.value = data.session; if(session.value) { fetchTrades(); fetchMappings(); }})
  supabase.auth.onAuthStateChange((_, _s) => { session.value = _s; if(_s) { fetchTrades(); fetchMappings(); }})
})

const handleLogin = async () => {
  loading.value = true; message.value = '';
  try { const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value }); if(error) throw error; } 
  catch(e) { message.value = 'Gagal Login: '+e.message; messageType.value='error' } finally { loading.value = false; }
}
const handleLogout = async () => await supabase.auth.signOut()
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const showMessage = (msg, type = 'success') => { message.value = msg; messageType.value = type; window.scrollTo({ top: 0 }); setTimeout(() => message.value = '', 6000) }

// --- INTEGRASI WA FONNTE ---
const sendWhatsAppNotification = async (msgText, imageUrl = null) => {
  const token = import.meta.env.VITE_FONNTE_TOKEN;
  const target = import.meta.env.VITE_WA_GROUP_ID; 
  
  if (!token || !target) {
    console.warn("Kredensial Fonnte WA belum diatur di .env. Skip kirim WA.");
    return;
  }

  const formData = new FormData();
  formData.append('target', target);
  formData.append('message', msgText);
  if (imageUrl) formData.append('url', imageUrl);

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': token },
      body: formData
    });
    console.log("Notifikasi WA Berhasil Dikirim!");
  } catch (err) {
    console.error("Gagal mengirim WA via Fonnte:", err);
  }
}

// --- TRADES ---
const fetchTrades = async () => { const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: false }); trades.value = data || [] }
const openTradeModal = (trade = null) => {
  if (trade) { isEditingTrade.value = true; tradeForm.value = { ...trade } } 
  else { isEditingTrade.value = false; tradeForm.value = { id: null, pair: 'GBPUSD', type: 'Intraday', order_type: 'Buy', entry_price: null, stop_loss: null, take_profit: null, exit_price: null, pips: null, result: 'Pending', rr_ratio: null, percentage: null, note: '' } }
  showTradeModal.value = true;
}
const saveTrade = async () => {
  loading.value = true;
  try {
    // UPDATE PAYLOAD SIMPAN
    const payload = { pair: tradeForm.value.pair, type: tradeForm.value.type, order_type: tradeForm.value.order_type, entry_price: tradeForm.value.entry_price, stop_loss: tradeForm.value.stop_loss || null, take_profit: tradeForm.value.take_profit || null, exit_price: tradeForm.value.exit_price || null, pips: tradeForm.value.pips || null, result: tradeForm.value.result, rr_ratio: tradeForm.value.rr_ratio || null, percentage: tradeForm.value.percentage || null, note: tradeForm.value.note }
    
    if (isEditingTrade.value) {
      await supabase.from('trades').update(payload).eq('id', tradeForm.value.id);
      showMessage('Sinyal berhasil diupdate!');
    } else {
      const { data, error } = await supabase.from('trades').insert([payload]).select();
      if(error) throw error;
      
      showMessage('Sinyal baru berhasil disimpan! WA sedang dikirim...');
      
      // AUTO SEND WA KETIKA INSERT (DITAMBAHKAN ORDER TYPE)
      const waMsg = `🚨 *SINYAL BARU MY NASABAH* 🚨\n\nPair: *${payload.pair}*\nTipe: *${payload.type}*\nOrder: *${payload.order_type}*\nEntry: *${payload.entry_price}*\nSL: *${payload.stop_loss || '-'}*\nTP: *${payload.take_profit || '-'}*\n\nCatatan:\n_${payload.note || '-'}_`;
      await sendWhatsAppNotification(waMsg);
    }
    showTradeModal.value = false; fetchTrades();
  } catch (e) { showMessage('Gagal menyimpan: '+e.message, 'error') } finally { loading.value = false }
}
const deleteTrade = async (id) => { if(confirm('Hapus sinyal?')) { await supabase.from('trades').delete().eq('id', id); fetchTrades(); } }

// --- MAPPINGS ---
const fetchMappings = async () => { const { data } = await supabase.from('mappings').select('*').order('created_at', { ascending: false }); mappings.value = data || [] }
const openMappingModal = (mapping = null) => { selectedFile.value = null; if (mapping) { isEditingMapping.value = true; mappingForm.value = { ...mapping } } else { isEditingMapping.value = false; mappingForm.value = { id: null, pair: 'GBPUSD', title: '', description: '', image_url: null } }; showMappingModal.value = true; }
const handleFileChange = (e) => selectedFile.value = e.target.files[0];
const saveMapping = async () => {
  loading.value = true;
  try {
    let finalImageUrl = mappingForm.value.image_url;
    if (selectedFile.value) {
      const ext = selectedFile.value.name.split('.').pop(); const name = `${Date.now()}_${Math.random().toString(36).substring(2,9)}.${ext}`;
      await supabase.storage.from('mappings').upload(name, selectedFile.value);
      finalImageUrl = supabase.storage.from('mappings').getPublicUrl(name).data.publicUrl;
    }
    const payload = { pair: mappingForm.value.pair, title: mappingForm.value.title, description: mappingForm.value.description, image_url: finalImageUrl }
    
    if (isEditingMapping.value) {
      await supabase.from('mappings').update(payload).eq('id', mappingForm.value.id);
      showMessage('Mapping diupdate!');
    } else {
      await supabase.from('mappings').insert([payload]);
      showMessage('Mapping disimpan! WA sedang dikirim...');
      const waMsg = `📊 *MAPPING BARU MY NASABAH* 📊\n\nPair: *${payload.pair}*\nJudul: *${payload.title}*\n\nDeskripsi:\n_${payload.description || '-'}_`;
      await sendWhatsAppNotification(waMsg, finalImageUrl);
    }
    showMappingModal.value = false; fetchMappings();
  } catch (e) { showMessage('Gagal mapping: '+e.message, 'error') } finally { loading.value = false }
}
const deleteMapping = async (id) => { if(confirm('Hapus mapping?')) { await supabase.from('mappings').delete().eq('id', id); fetchMappings(); } }
</script>