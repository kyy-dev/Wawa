module.exports = {
    command: ['payment', 'bayar', 'metode'],
    execute: async (sock, msg) => {
        const { from } = msg;

        let teks = `💳 *METODE PEMBAYARAN KYY-BOT*\n\n`;
        teks += `🔹 *E-WALLET*\n`;
        teks += `• DANA: 087791889957\n`;
        teks += `• GOPAY: 087791889957\n`;
        teks += `• OVO: 087791889957\n\n`;
        
        teks += `🔹 *BANK*\n`;
        teks += `• SEA BANK: 9012 3456 7890\n\n`;
        
        teks += `🔹 *OTOMATIS*\n`;
        teks += `• QRIS: Ketik *.deposit [nominal]*\n\n`;
        
        teks += `📢 *PENTING:* Harap kirimkan bukti transfer jika membayar melalui E-Wallet/Bank manual ke owner.`;

        sock.sendMessage(from, { 
            image: { url: "https://path-to-your-qris-image.com/qris.jpg" }, // Ganti link ke QRIS kamu
            caption: teks 
        }, { quoted: msg });
    }
};
