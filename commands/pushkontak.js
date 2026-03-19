module.exports = {
    command: ['pushkontak', 'getmember'],
    execute: async (sock, msg, args, { isOwner }) => {
        const { from, sender } = msg;
        if (!isOwner) return sock.sendMessage(from, { text: "Fitur ini khusus Owner!" });
        if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: "Fitur ini hanya bisa digunakan di dalam grup!" });

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            let kontak = "";
            
            for (let mem of participants) {
                kontak += `BEGIN:VCARD\nVERSION:3.0\nFN:Member ${metadata.subject}\nTEL;type=CELL;type=VOICE;waid=${mem.id.split('@')[0]}:+${mem.id.split('@')[0]}\nEND:VCARD\n`;
            }

            // Mengirim file VCF agar owner bisa langsung simpan ke HP
            await sock.sendMessage(sender, { 
                document: Buffer.from(kontak), 
                fileName: `Kontak_${metadata.subject}.vcf`, 
                mimetype: 'text/vcard' 
            });
            
            sock.sendMessage(from, { text: `✅ Berhasil mengambil ${participants.length} kontak. File VCF telah dikirim ke chat pribadi Anda.` }, { quoted: msg });
        } catch (e) {
            sock.sendMessage(from, { text: "❌ Gagal mengambil kontak grup." });
        }
    }
};
