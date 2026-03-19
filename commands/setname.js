module.exports = {
    name: "setname",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us") || !args.length) return;
        try {
            const metadata = await sock.groupMetadata(from);
            const sender = msg.key.participant || msg.key.remoteJid;
            const isAdmin = metadata.participants.filter(p => p.admin !== null).map(p => p.id).includes(sender);
            if (!isAdmin && !isOwner) return;

            await sock.groupUpdateSubject(from, args.join(" "));
            await sock.sendMessage(from, { text: "✅ Nama grup berhasil diganti." });
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Gagal ganti nama grup." });
        }
    }
};
