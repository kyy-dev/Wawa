const fs = require('fs');

module.exports = {
    command: ['deposit', 'depo', 'topup'],
    execute: async (sock, msg, args) => {
        const { from, sender } = msg;
        const nominal = args[0];
        
        if (!nominal || isNaN(nominal)) return sock.sendMessage(from, { text: "Contoh: .deposit 10000" });

        // Contoh integrasi tampilan QRIS (Anda bisa ganti dengan link gambar QRIS statis Anda)
        const qrisImage = "https://path-to-your-qris-image.com/qris.jpg"; 
        
        let caption = `💳 *REQUEST DEPOSIT*\n\n`;
        caption += `👤 User: @${sender.split('@')[0]}\n`;
        caption += `💰 Nominal: Rp${Number(nominal).toLocaleString()}\n`;
        caption += `⏱️ Status: Pending\n\n`;
        caption += `Silakan scan QRIS di atas dan kirimkan bukti transfer ke Owner. Saldo akan diinput manual/otomatis setelah pengecekan mutasi.`;

        await sock.sendMessage(from, { 
            image: { url: qrisImage }, 
            caption: caption,
            mentions: [sender]
        }, { quoted: msg });
    }
};
