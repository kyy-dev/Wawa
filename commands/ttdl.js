const { Tiktok } = require("../lib/tiktok");

module.exports = {
  name: "ttdl",
  description: "Download video TikTok tanpa watermark",
  async execute(sock, msg, args) {
    try {
      const from = msg.from;
      const text = args[0];

      if (!text) {
        return await sock.sendMessage(from, { text: "❌ Contoh: .ttdl https://vt.tiktok.com/xxxx" }, { quoted: msg });
      }

      // Reaksi ⏳ (loading)
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      const res = await Tiktok(text);

      if (!res.nowm) {
        return await sock.sendMessage(from, { text: "⚠️ Gagal ambil video." }, { quoted: msg });
      }

      // Kirim video
      await sock.sendMessage(
        from,
        {
          video: { url: res.nowm },
          caption: `🎬 *${res.title}*\n👤 Author: ${res.author}\n🔗 Source: ${text}`
        },
        { quoted: msg }
      );

      // Reaksi ✅ (berhasil)
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error("❌ Error ttdl:", err);
      await sock.sendMessage(msg.from, { text: "❌ Terjadi error saat download TikTok." }, { quoted: msg });
      await sock.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
    }
  }
};