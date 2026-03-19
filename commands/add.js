module.exports = {
    name: "add",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        
        // Pastikan hanya bisa di grup
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Fitur ini hanya untuk grup!" });

        try {
            // Ambil data metadata untuk cek admin (Sama kayak di kick.js lo)
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const sender = msg.key.participant || msg.key.remoteJid;
            const admins = participants.filter(p => p.admin !== null).map(p => p.id);
            const isAdmin = admins.includes(sender);

            // Cek: Kalau bukan Admin DAN bukan Owner, maka ditolak
            if (!isAdmin && !isOwner) return sock.sendMessage(from, { text: "❌ Lu bukan admin!" });

            // Ambil nomor dari argumen atau dari nomor yang di-reply (jika ada)
            let input = args.join(" ").replace(/[^0-9]/g, ""); // Bersihkan karakter non-angka
            let users = [];

            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                // Jika me-reply pesan seseorang
                users.push(msg.message.extendedTextMessage.contextInfo.participant);
            } else if (input) {
                // Jika mengetik nomor langsung (misal: .add 628123xxx)
                users.push(input + "@s.whatsapp.net");
            }

            if (users.length === 0) {
                return sock.sendMessage(from, { text: "⚠️ Tag, reply, atau masukkan nomor target!\nContoh: *.add 62812xxx*" });
            }

            // Eksekusi penambahan anggota
            const response = await sock.groupParticipantsUpdate(from, users, "add");

            // Cek status respon
            for (let res of response) {
                if (res.status === "200") {
                    await sock.sendMessage(from, { text: `✅ Berhasil menambahkan @${res.jid.split("@")[0]}`, mentions: [res.jid] });
                } else if (res.status === "403") {
                    await sock.sendMessage(from, { text: `⚠️ Gagal menambahkan @${res.jid.split("@")[0]} karena privasi user. Undangan telah dikirim.`, mentions: [res.jid] });
                } else {
                    await sock.sendMessage(from, { text: `❌ Gagal menambahkan @${res.jid.split("@")[0]}.` });
                }
            }

        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: "❌ Gagal! Pastikan bot sudah menjadi admin grup." });
        }
    }
};
