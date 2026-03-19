const axios = require('axios');

module.exports = {
    command: ['shortlink', 'tinyurl'],
    execute: async (sock, msg, args) => {
        const { from } = msg;
        if (!args[0]) return sock.sendMessage(from, { text: "Masukkan link yang ingin dipendekkan.\nContoh: .shortlink https://google.com" });

        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${args[0]}`);
            sock.sendMessage(from, { text: `✅ *Link Berhasil Dipendekkan:*\n\n${res.data}` }, { quoted: msg });
        } catch (e) {
            sock.sendMessage(from, { text: "❌ Gagal membuat shortlink. Pastikan URL valid." });
        }
    }
};
