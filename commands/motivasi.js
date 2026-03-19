const axios = require("axios");

module.exports = async (sock, msg, args) => {
  try {
    // Reaksi saat memproses
    await sock.sendMessage(msg.from, {
      react: { text: "⏳", key: msg.key },
    });

    const response = await axios.get("https://api.sxtream.xyz/randomtext/motivasi");

    // Pastikan data berupa array, kalau cuma string ubah menjadi array
    let motivasiData = Array.isArray(response.data.data)
      ? response.data.data
      : [response.data.data];

    // Ambil random
    const randomIndex = Math.floor(Math.random() * motivasiData.length);
    const randomText = motivasiData[randomIndex];

    // Kirim hasil random dengan tanda kutip
    await sock.sendMessage(msg.from, {
      text: `"${randomText}"`,
      contextInfo: { mentionedJid: [], forwardingScore: 0, isForwarded: false },
      detectLinks: false,
    });

    // Reaksi selesai
    await sock.sendMessage(msg.from, {
      react: { text: "✅", key: msg.key },
    });
  } catch (err) {
    console.error("Error di plugin motivasi:", err);
    await sock.sendMessage(msg.from, { text: "❌ Gagal mengambil Motivasi" });
    await sock.sendMessage(msg.from, {
      react: { text: "❌", key: msg.key },
    });
  }
};
