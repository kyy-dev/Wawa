module.exports = {
    name: "demote",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us")) return;
        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const sender = msg.key.participant || msg.key.remoteJid;
            const admins = participants.filter(p => p.admin !== null).map(p => p.id);
            if (!admins.includes(sender) && !isOwner) return sock.sendMessage(from, { text: "❌ Lu bukan admin!" });

            let users = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                users.push(msg.message.extendedTextMessage.contextInfo.participant);
            }
            if (!users.length) return sock.sendMessage(from, { text: "Tag/reply admin yang mau diturunkan!" });
            
            await sock.groupParticipantsUpdate(from, users, "demote");
            await sock.sendMessage(from, { text: "✅ Jabatan admin berhasil dicopot." });
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Gagal! Pastikan bot admin." });
        }
    }
};
