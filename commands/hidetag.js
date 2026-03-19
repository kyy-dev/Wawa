module.exports = {
    command: ["h", "hidetag"],
    description: "Hidetag murni tanpa teks tambahan",
    category: "Group",
    owner: false,
    group: true,
    admin: true,

    execute: async function (sock, m, args) {
        try {
            if (!m.isGroup) return;

            const groupMetadata = await sock.groupMetadata(m.from);
            const participants = groupMetadata.participants;

            // 1. Ambil teks dari argumen (teks setelah .hidetag)
            // 2. Jika tidak ada teks, gunakan string kosong murni ""
            // 3. Tambahkan pengecekan: Jika teks kosong, bot hanya akan tag
            let textToTag = args.length > 0 ? args.join(" ") : "";

            // Jika kamu ingin benar-benar TIDAK ADA chat kosong muncul saat tidak ada teks:
            // Pastikan tidak ada karakter \n atau spasi di variabel text
            await sock.sendMessage(m.from, {
                text: textToTag, 
                mentions: participants.map(a => a.id)
            });

        } catch (err) {
            throw err; 
        }
    }
};
