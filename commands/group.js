module.exports = {
    name: "group",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us")) return;
        try {
            const metadata = await sock.groupMetadata(from);
            const sender = msg.key.participant || msg.key.remoteJid;
            const isAdmin = metadata.participants.filter(p => p.admin !== null).map(p => p.id).includes(sender);
            if (!isAdmin && !isOwner) return sock.sendMessage(from, { text: "❌ Lu bukan admin!" });

            if (args[0] === 'open') {
                await sock.groupSettingUpdate(from, 'not_announcement');
                await sock.sendMessage(from, { text: "✅ Grup telah dibuka! Semua member bisa chat." });
            } else if (args[0] === 'close') {
                await sock.groupSettingUpdate(from, 'announcement');
                await sock.sendMessage(from, { text: "✅ Grup telah ditutup! Hanya admin yang bisa chat." });
            } else {
                await sock.sendMessage(from, { text: "⚠️ Gunakan: *.group open* atau *.group close*" });
            }
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Gagal mengubah setelan grup." });
        }
    }
};
