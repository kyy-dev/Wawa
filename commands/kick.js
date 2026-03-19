module.exports = {
    name: "kick",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Hanya bisa di grup!" });

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const sender = msg.key.participant || msg.key.remoteJid;
            const admins = participants.filter(p => p.admin !== null).map(p => p.id);
            const isAdmin = admins.includes(sender);

            if (!isAdmin && !isOwner) return sock.sendMessage(from, { text: "❌ Lu bukan admin!" });

            let users = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                users.push(msg.message.extendedTextMessage.contextInfo.participant);
            }
            users = [...new Set(users)];

            if (users.length === 0) return sock.sendMessage(from, { text: "Tag atau reply orangnya!" });

            await sock.groupParticipantsUpdate(from, users, "remove");
            await sock.sendMessage(from, { text: "✅ Berhasil mengeluarkan member." });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(from, { text: "❌ Gagal! Pastikan bot adalah admin." });
        }
    }
};
