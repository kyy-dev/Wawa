module.exports = {
    name: "me",
    async execute(sock, msg, args, { isOwner }) {
        const sender = (msg.key.participant || msg.key.remoteJid);
        const text = `*👤 USER INFO*
        
◦ *Nomor:* @${sender.split("@")[0]}
◦ *Status:* ${isOwner ? "Owner/Developer" : "Member"}
◦ *Device:* Android (Termux)`;
        await sock.sendMessage(msg.from, { text, mentions: [sender] });
    }
};
