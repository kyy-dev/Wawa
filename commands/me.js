module.exports = {
    name: "me",
    async execute(sock, msg, args, { isOwner }) {
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushname = msg.pushName || "User";
        
        let teks = `*👤 USER PROFILE*\n\n`
        teks += `◦ *Nama:* ${pushname}\n`
        teks += `◦ *Nomor:* @${sender.split("@")[0]}\n`
        teks += `◦ *Status:* ${isOwner ? "Owner / Developer 👑" : "Member / User 👤"}\n`
        teks += `◦ *Device:* Android (Termux)`

        await sock.sendMessage(msg.from, { text: teks, mentions: [sender] }, { quoted: msg });
    }
};
