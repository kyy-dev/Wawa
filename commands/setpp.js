const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "setpp",
    alias: ["setppgc", "gantipp"],
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        
        // Pastikan hanya bisa di grup
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Perintah ini hanya untuk mengganti Foto Profil Grup!" });

        try {
            // --- LOGIKA IDENTIK DENGAN KICK.JS ---
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const sender = msg.key.participant || msg.key.remoteJid;
            const admins = participants.filter(p => p.admin !== null).map(p => p.id);
            const isAdmin = admins.includes(sender);

            // Cek Izin: Hanya Admin atau Owner (Dzaki)
            if (!isAdmin && !isOwner) return sock.sendMessage(from, { text: "❌ Lu bukan admin!" });
            // -------------------------------------

            const typeMsg = Object.keys(msg.message)[0];
            const isQuoted = typeMsg === 'extendedTextMessage';
            const quotedType = isQuoted ? Object.keys(msg.message.extendedTextMessage.contextInfo.quotedMessage)[0] : null;

            // Pastikan media yang dikirim adalah FOTO (karena PP grup gak bisa video)
            const isImage = typeMsg === 'imageMessage';
            const isQuotedImage = quotedType === 'imageMessage';

            if (!isImage && !isQuotedImage) {
                return sock.sendMessage(from, { text: "⚠️ Kirim atau reply foto dengan caption *.setpp* untuk mengganti ikon grup!" });
            }

            // Proses Download Foto
            const target = isImage ? msg.message.imageMessage : msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
            
            const stream = await downloadContentFromMessage(target, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Eksekusi Ganti Foto Profil Grup
            await sock.updateProfilePicture(from, buffer);

            const caption = args.length > 0 ? args.join(" ") : "Foto profil grup telah diperbarui! ✨";
            const allParticipants = participants.map(p => p.id);

            // Kirim notifikasi hidetag biar semua member tahu
            await sock.sendMessage(from, {
                text: `*📢 GROUP PROFILE UPDATED*\n*By:* @${sender.split("@")[0]}\n\n${caption}`,
                mentions: [sender, ...allParticipants]
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            // Error ini biasanya karena jimp belum terinstall atau bot bukan admin
            await sock.sendMessage(from, { text: "❌ Gagal mengganti foto profil! Pastikan bot adalah admin dan library 'jimp' sudah terpasang." });
        }
    }
};
