const { remini } = require("../lib/remini");

module.exports = {
  name: "remini",
  description: "Enhance foto dengan AI",
  async execute(sock, msg, args) {
    try {
      const from = msg.from;
      const mode = args[0] || "enhance";

      // cek ada media?
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mime = quoted?.imageMessage?.mimetype;

      if (!quoted || !mime) {
        return await sock.sendMessage(from, { text: "📸 Reply gambar dengan caption: .remini [mode]\nMode: enhance | recolor | dehaze" }, { quoted: msg });
      }

      // kasih reaksi ⏳
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // download media
      const buffer = await sock.downloadMediaMessage({ message: quoted });

      // proses pakai remini
      const hasil = await remini(buffer, mode);

      // kirim hasil
      await sock.sendMessage(from, {
        image: hasil,
        caption: `✨ *Remini - ${mode}*\nFoto berhasil diproses!`
      }, { quoted: msg });

      // reaksi ✅
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.from, { text: "❌ Terjadi error saat memproses foto." }, { quoted: msg });
      await sock.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
    }
  }
};