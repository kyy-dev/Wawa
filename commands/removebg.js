const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    command: ['removebg', 'rbg', 'nobg'],
    execute: async (sock, msg, args, { quoted }) => {
        const { from } = msg;
        // Pastikan ada gambar yang direply atau dikirim dengan caption
        const isImage = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
        
        if (!isImage) return sock.sendMessage(from, { text: "Balas (reply) atau kirim gambar dengan caption .removebg" });

        const API_KEY = 'GANTI_DENGAN_API_KEY_KAMU'; // Ambil di remove.bg

        try {
            await sock.sendMessage(from, { text: "⏳ Sedang menghapus background..." });
            
            // Download gambar
            const buffer = await require('@whiskeysockets/baileys').downloadContentFromMessage(
                (msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage), 
                'image'
            );
            
            let chunks = [];
            for await (const chunk of buffer) { chunks.push(chunk); }
            const imageBuffer = Buffer.concat(chunks);

            const formData = new FormData();
            formData.append('size', 'auto');
            formData.append('image_file', imageBuffer, { filename: 'no-bg.png' });

            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: { ...formData.getHeaders(), 'X-Api-Key': API_KEY },
                responseType: 'arraybuffer'
            });

            await sock.sendMessage(from, { image: Buffer.from(response.data), caption: "✅ Background berhasil dihapus!" }, { quoted: msg });
        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ Gagal menghapus background. Cek API Key atau pastikan gambar jelas." });
        }
    }
};
