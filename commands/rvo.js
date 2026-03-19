const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
    command: ["rvo", "readviewonce"],
    description: "Membuka pesan view-once (sekali lihat)",
    category: "Tools",
    execute: async function (sock, msg, args) {
        try {
            const from = msg.from;
            // Cek apakah pesan yang di-reply ada
            // Di index.js lo, pastikan msg.message.extendedTextMessage.contextInfo terkirim sebagai msg.quoted
            let quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                return sock.sendMessage(from, { text: "❗ Reply pesan *view-once* yang mau dibuka" }, { quoted: msg });
            }

            // Normalisasi pesan view-once
            if (quoted.viewOnceMessageV2) quoted = quoted.viewOnceMessageV2.message;
            if (quoted.viewOnceMessage) quoted = quoted.viewOnceMessage.message;

            const mediaMsg = quoted.imageMessage || quoted.videoMessage || quoted.audioMessage;

            if (!mediaMsg) {
                return sock.sendMessage(from, { text: "❗ Itu bukan pesan view-once media" }, { quoted: msg });
            }

            const mime = mediaMsg.mimetype || "";
            const mediaType = /image/.test(mime) ? "image" : /video/.test(mime) ? "video" : "audio";

            // Download media
            const stream = await downloadContentFromMessage(mediaMsg, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Kirim ulang tanpa fitur view-once
            if (/image/.test(mime)) {
                await sock.sendMessage(from, { image: buffer, caption: mediaMsg.caption || "Success Open View Once By KYY-BOT" }, { quoted: msg });
            } else if (/video/.test(mime)) {
                await sock.sendMessage(from, { video: buffer, caption: mediaMsg.caption || "Success Open View Once By KYY-BOT" }, { quoted: msg });
            } else if (/audio/.test(mime)) {
                await sock.sendMessage(from, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: msg });
            }
            
            console.log(`[ RVO ] Success opened media from ${msg.key.remoteJid}`);

        } catch (err) {
            console.error("❌ Plugin rvo error:", err);
            await sock.sendMessage(msg.from, { text: "⚠️ Gagal membuka pesan view-once. Pastikan media belum kadaluarsa." }, { quoted: msg });
        }
    }
};
