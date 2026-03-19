const axios = require('axios');

module.exports = {
    command: ['ssweb', 'ss', 'screenshot'],
    execute: async (sock, msg, args) => {
        const { from } = msg;
        if (!args[0]) return sock.sendMessage(from, { text: "Masukkan URL website!\nContoh: .ssweb https://google.com" });

        await sock.sendMessage(from, { text: "⏳ Sedang mengambil tangkapan layar..." });

        try {
            // Menggunakan API dari screenshotlayer atau sscreeny (Contoh di bawah memakai sscreeny)
            const ssUrl = `https://image.thum.io/get/width/1200/noanimate/${args[0]}`;
            
            await sock.sendMessage(from, { 
                image: { url: ssUrl }, 
                caption: `✅ Hasil Screenshot: ${args[0]}` 
            }, { quoted: msg });
        } catch (e) {
            sock.sendMessage(from, { text: "❌ Gagal mengambil screenshot. Pastikan URL valid dan diawali http/https." });
        }
    }
};
