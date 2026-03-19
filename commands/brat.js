const axios = require("axios");

module.exports = async (sock, msg, args) => {
  const from = msg.from;
  const query = args.join(" ");

  if (!query) {
    return await sock.sendMessage(
      from,
      { text: "⚠️ Harap berikan teks setelah perintah.\nContoh: *.brat Halo Dunia*" },
      { quoted: msg }
    );
  }

  try {
    // kasih reaksi loading
    await sock.sendMessage(from, {
      react: { text: "⏳", key: msg.key },
    });

    // API Brat
    const url = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(
      query
    )}&isAnimated=false&delay=500`;

    const response = await axios.get(url, { responseType: "arraybuffer" });
    const stickerBuffer = Buffer.from(response.data, "binary");

    // kirim stiker hasil
    await sock.sendMessage(
      from,
      { sticker: stickerBuffer },
      { quoted: msg }
    );

    // kasih reaksi sukses
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key },
    });
  } catch (error) {
    console.error("❌ Gagal membuat stiker Brat:", error);
    await sock.sendMessage(
      from,
      { text: "❌ Terjadi kesalahan saat membuat stiker Brat." },
      { quoted: msg }
    );
  }
};