const axios = require('axios');

module.exports = {
    command: ['mutasi', 'cekmutasi'],
    execute: async (sock, msg, args, { isOwner }) => {
        const { from } = msg;
        if (!isOwner) return sock.sendMessage(from, { text: "Fitur ini hanya untuk Owner!" });

        const API_KEY = 'YOUR_API_KEY_HERE'; // Ganti dengan API Key Cekmutasi.id anda

        try {
            const res = await axios.get('https://api.cekmutasi.id/v1/bank/search', {
                headers: { 'Api-Key': API_KEY }
            });
            
            let teks = "📝 *Riwayat Mutasi Terakhir:*\n\n";
            res.data.response.forEach((m) => {
                teks += `📅 ${m.date}\n💰 Rp${m.amount}\n📝 ${m.description}\n📌 ${m.type}\n\n`;
            });
            
            sock.sendMessage(from, { text: teks }, { quoted: msg });
        } catch (e) {
            sock.sendMessage(from, { text: "❌ Gagal mengambil data mutasi. Cek API Key atau koneksi." });
        }
    }
};
