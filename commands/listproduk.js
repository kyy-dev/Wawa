module.exports = {
    command: ['listproduk', 'produk', 'harga'],
    execute: async (sock, msg) => {
        const { from } = msg;

        let teks = `📦 *DAFTAR LAYANAN WEBSITE JB*\n\n`;
        teks += `🚀 *SMM PANEL*\n`;
        teks += `• 1000 Follower IG: Rp15.000\n`;
        teks += `• 1000 Like IG: Rp5.000\n`;
        teks += `• 1000 View TikTok: Rp2.000\n\n`;
        
        teks += `🎮 *AKUN JB*\n`;
        teks += `• Akun ML Mythic: Rp50.000+\n`;
        teks += `• Akun FF Old: Rp100.000+\n\n`;
        
        teks += `⚠️ *Note:* Harga dapat berubah sewaktu-waktu.\n`;
        teks += `Ketik *.deposit* untuk isi saldo atau *.owner* untuk order manual.`;

        sock.sendMessage(from, { 
            text: teks,
            contextInfo: {
                externalAdReply: {
                    title: "KYY-BOT MARKETPLACE",
                    body: "Layanan Murah & Terpercaya",
                    thumbnailUrl: "https://path-to-your-logo.com/logo.jpg", // Ganti dengan logo JB kamu
                    sourceUrl: "https://your-website-jb.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: msg });
    }
};
