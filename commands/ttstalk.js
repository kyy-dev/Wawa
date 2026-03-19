const axios = require('axios');

module.exports = {
    command: ['ttstalk', 'tiktokstalk', 'stalk'],
    execute: async (sock, msg, args) => {
        const { from } = msg;
        const user = args[0];

        if (!user) return sock.sendMessage(from, { text: "⚠️ Masukkan username TikTok!\nContoh: .ttstalk kysnku" });

        await sock.sendMessage(from, { text: "🔍 Mengambil data sesuai struktur database Siputzx..." });

        try {
            const res = await axios.get(`https://api.siputzx.my.id/api/stalk/tiktok?username=${user}`);
            const result = res.data;
            
            if (!result || result.status !== true || !result.data) {
                return sock.sendMessage(from, { text: "❌ Data tidak ditemukan untuk username tersebut." });
            }

            // Deklarasi variabel sesuai struktur JSON yang kamu kirim
            const userData = result.data.user;
            const statsData = result.data.stats;

            // Proteksi angka agar tidak toLocaleString error
            const followers = (statsData?.followerCount || 0).toLocaleString();
            const following = (statsData?.followingCount || 0).toLocaleString();
            const likes = (statsData?.heartCount || 0).toLocaleString();
            const videos = (statsData?.videoCount || 0).toLocaleString();
            const friends = (statsData?.friendCount || 0).toLocaleString();

            let caption = `*─── [ TIKTOK STALK ] ───*\n\n`
            caption += `👤 *Nama:* ${userData?.nickname || '-'}\n`
            caption += `🆔 *Username:* @${userData?.uniqueId || '-'}\n`
            caption += `🆔 *User ID:* ${userData?.id || '-'}\n`
            caption += `📝 *Bio:* ${userData?.signature || 'Tidak ada bio.'}\n`
            caption += `🌐 *Bahasa:* ${userData?.language || '-'}\n\n`
            
            caption += `📊 *STATISTIK AKUN*\n`
            caption += `👥 *Followers:* ${followers}\n`
            caption += `📈 *Following:* ${following}\n`
            caption += `👫 *Teman:* ${friends}\n`
            caption += `❤️ *Total Like:* ${likes}\n`
            caption += `🎥 *Total Video:* ${videos}\n\n`
            
            caption += `🛡️ *INFO STATUS*\n`
            caption += `✅ *Verified:* ${userData?.verified ? "Ya" : "Tidak"}\n`
            caption += `🔒 *Privat:* ${userData?.privateAccount ? "Ya" : "Tidak"}\n`
            caption += `🚫 *Banned:* ${userData?.isEmbedBanned ? "Ya" : "Tidak"}`

            await sock.sendMessage(from, { text: caption }, { quoted: msg });

        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat memproses data API." });
        }
    }
}
