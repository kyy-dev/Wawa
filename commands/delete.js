module.exports = {
    name: "del",
    alias: ["delete"],
    async execute(sock, msg, args, { isOwner }) {
        if (!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) return;
        const from = msg.from;
        const key = {
            remoteJid: from,
            fromMe: false,
            id: msg.message.extendedTextMessage.contextInfo.stanzaId,
            participant: msg.message.extendedTextMessage.contextInfo.participant
        };
        await sock.sendMessage(from, { delete: key });
    }
};
