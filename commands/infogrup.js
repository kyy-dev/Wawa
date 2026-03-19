module.exports = {
    name: "infogrup",
    alias: ["gcinfo", "groupinfo"],
    async execute(sock, msg, args, { isOwner }) {
        const from = msg.from;
        if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Hanya bisa di grup!" });

        try {
            const metadata = await sock.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin !== null).length;
            const creation = new Date(metadata.creation * 1000).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
            
            let teks = `*📋 GROUP INFORMATION*\n\n`
            teks += `◦ *Nama:* ${metadata.subject}\n`
            teks += `◦ *ID Grup:* ${metadata.id}\n`
            teks += `◦ *Dibuat:* ${creation}\n`
            teks += `◦ *Owner:* @${metadata.owner ? metadata.owner.split("@")[0] : "Tidak diketahui"}\n`
            teks += `◦ *Jumlah Member:* ${metadata.participants.length}\n`
            teks += `◦ *Jumlah Admin:* ${admins}\n`
            teks += `◦ *Deskripsi:* \n${metadata.desc || "Tidak ada deskripsi."}`

            await sock.sendMessage(from, { text: teks, mentions: [metadata.owner] }, { quoted: msg });
        } catch (err) {
            console.error(err);
        }
    }
};
