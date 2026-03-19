module.exports = {
    command: ['tod', 'truth', 'dare'],
    execute: async (sock, msg, args) => {
        const { from } = msg;

        const listTruth = [
            "Siapa orang yang terakhir kamu stalking di sosmed?",
            "Apa hal paling memalukan yang pernah kamu lakukan di depan umum?",
            "Pernahkah kamu menyukai seseorang di grup ini secara diam-diam?",
            "Apa kebohongan terbesar yang pernah kamu katakan kepada orang tuamu?",
            "Siapa orang yang paling ingin kamu hapus dari ingatanmu?"
        ];

        const listDare = [
            "Kirimkan chat ke mantan kamu: 'Aku kangen kamu' dan kirimkan buktinya ke sini!",
            "Ganti foto profil WhatsApp kamu jadi foto paling jelek selama 1 jam.",
            "Rekam suara (VN) kamu bernyanyi lagu anak-anak dengan nada sedih.",
            "Tulis di status WA: 'Aku sayang banget sama [Nama Random]' selama 30 menit.",
            "Kirim stiker secara acak ke kontak ke-5 di daftar chat kamu."
        ];

        const pickTruth = listTruth[Math.floor(Math.random() * listTruth.length)];
        const pickDare = listDare[Math.floor(Math.random() * listDare.length)];

        if (args[0] === 'truth') {
            return sock.sendMessage(from, { text: `✨ *TRUTH*\n\n"${pickTruth}"` }, { quoted: msg });
        } else if (args[0] === 'dare') {
            return sock.sendMessage(from, { text: `🔥 *DARE*\n\n"${pickDare}"` }, { quoted: msg });
        } else {
            const teks = `🎲 *TRUTH OR DARE*\n\nSilakan pilih salah satu:\nKetik *.truth* atau *.dare*`;
            return sock.sendMessage(from, { text: teks }, { quoted: msg });
        }
    }
};
