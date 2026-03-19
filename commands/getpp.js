module.exports = {
    name: "getpp",
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                     msg.message?.extendedTextMessage?.contextInfo?.participant || 
                     msg.key.remoteJid;

        try {
            const ppUrl = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(from, { image: { url: ppUrl }, caption: `✅ Profile Picture @${target.split("@")[0]}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(from, { text: "❌ Tidak dapat mengambil foto profil (Mungkin diprivasi)." });
        }
    }
};
