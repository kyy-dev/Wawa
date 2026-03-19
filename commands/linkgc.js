module.exports = {
    name: "linkgc",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us")) return;
        try {
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `https://chat.whatsapp.com/${code}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Gagal mengambil link! Pastikan bot admin." });
        }
    }
};
