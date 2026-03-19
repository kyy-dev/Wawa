const quoteIndo = require("quote-indo");

module.exports = {
  name: "quotes",
  description: "Ambil quotes Indonesia acak (bisa pilih kategori)",

  async execute(sock, msg, args) {
    const from = msg.from;

    try {
      // kasih reaksi ⏳ proses
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // ambil kategori (default random)
      let kategori = args[0] || "random"; 
      const quote = await quoteIndo.Quotes(kategori);

      if (!quote) {
        throw new Error("Tidak ada quote untuk kategori ini");
      }

      // kirim hasil
      await sock.sendMessage(
        from,
        { text: `💬 *${quote}*` },
        { quoted: msg }
      );

      // kasih reaksi sukses ✅
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error("❌ Error quotes:", err);

      // kasih reaksi gagal ❌
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
      await sock.sendMessage(from, { text: "❌ Gagal ambil quotes" }, { quoted: msg });
    }
  }
};