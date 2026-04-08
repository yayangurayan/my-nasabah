// Kita hapus baris import yang bermasalah, karena kita akan pakai Deno.serve() bawaan!

// GANTI DENGAN KREDENSIAL FONNTE KAMU
const FONNTE_TOKEN = "thwSvJEe9ozNHEPc6CJi"
const TARGET_WA = "120363425139174430@g.us" // Masukkan nomor HP testing atau ID Group Fonnte

// 1 & 2. Memakai Deno.serve dan menambahkan tipe ": Request" pada req
Deno.serve(async (req: Request) => {
  try {
    // Tangkap data yang dikirim oleh Webhook Supabase
    const payload = await req.json()
    const record = payload.record // Data baris baru yang diinput
    const table = payload.table   // Nama tabel ('trades' atau 'mappings')

    let waMessage = ""
    let imageUrl = ""

    // Format Pesan jika yang diinput adalah Trade Sinyal
    if (table === "trades") {
      const pipsIcon = record.pips >= 0 ? "✅" : "❌"
      const pipsSign = record.pips > 0 ? "+" : ""
      
      waMessage = `🚨 *SIGNAL UPDATE - MY NASABAH* 🚨\n\n` +
                  `*Pair:* ${record.pair}\n` +
                  `*Tipe:* ${record.type}\n` +
                  `*Entry:* ${record.entry_price}\n` +
                  `*Exit:* ${record.exit_price || 'Aktif'}\n` +
                  `*Hasil:* ${record.result} ${pipsIcon} (${pipsSign}${record.pips} Pips)\n\n` +
                  `*Catatan Andrian:*\n_${record.note || 'Tidak ada catatan'}_\n\n` +
                  `Cek performa lengkap di Dashboard Web kita! 🌐`
    } 
    // Format Pesan jika yang diinput adalah Mapping Mingguan
    else if (table === "mappings") {
      waMessage = `🗺️ *NEW MAPPING - MY NASABAH* 🗺️\n\n` +
                  `*Pair:* ${record.pair}\n` +
                  `*Skenario:* ${record.title}\n\n` +
                  `*Analisa:*\n${record.description}\n\n` +
                  `Cek gambar chart resolusi tinggi di web! 🌐`
      
      imageUrl = record.image_url // Jika Fonnte mendukung kirim gambar via URL
    }

    // Eksekusi pengiriman ke Fonnte
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": FONNTE_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: TARGET_WA,
        message: waMessage,
        url: imageUrl 
      })
    })

    const result = await response.json()
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })

  // 3. Mengubah 'error' menjadi tipe 'any' agar tidak dibaca 'unknown'
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Terjadi kesalahan sistem" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})