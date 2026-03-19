const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, msg, args) => {
  const from = msg.from;

  try {
    // kasih reaksi ⏳ (lagi proses)
    await sock.sendMessage(from, {
      react: { text: "⏳", key: msg.key }
    });

    // cek apakah reply ke stiker
    const quoted = msg.quoted;
    if (!quoted || !quoted.stickerMessage) {
      return await sock.sendMessage(
        from,
        { text: "⚠️ Reply stiker dengan *.toimg*" },
        { quoted: msg }
      );
    }

    // download stiker
    const buffer = await downloadMediaMessage(
      { message: { stickerMessage: quoted.stickerMessage } },
      "buffer",
      {},
      { logger: console }
    );

    // kirim hasil sebagai gambar
    await sock.sendMessage(
      from,
      { image: buffer, caption: "✅ Nih hasilnya" },
      { quoted: msg }
    );

    // kasih reaksi sukses ✅
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error toimg:", err);
    await sock.sendMessage(from, {
      react: { text: "❌", key: msg.key }
    });
    await sock.sendMessage(
      from,
      { text: "❌ Gagal ubah stiker ke gambar" },
      { quoted: msg }
    );
  }
};