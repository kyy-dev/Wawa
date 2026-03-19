const axios = require("axios");

module.exports = async function (sock, msg, args) {
  try {
    const from = msg.from;
    const messageText = args.join(" ");

    // Validasi input
    if (!messageText) {
      return sock.sendMessage(
        from,
        { text: "❗ Contoh penggunaan:\n.iqc Halo, ini pesan quoted iPhone style" },
        { quoted: msg }
      );
    }

    // Reaksi loading
    await sock.sendMessage(from, {
      react: { text: "⏳", key: msg.key }
    });

    // Request ke API eksternal
    const response = await axios.get("https://brat.siputzx.my.id/iphone-quoted", {
      params: { messageText },
      responseType: "arraybuffer",
      timeout: 15000, // timeout biar gak ngegantung
    });

    // Kirim hasil gambar
    await sock.sendMessage(
      from,
      {
        image: Buffer.from(response.data),
        caption: `✅ *iPhone Quoted Style*\n\n💬 ${messageText}`,
      },
      { quoted: msg }
    );

    // Reaksi sukses
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (error) {
    console.error("❌ Error di IQC:", error.message);

    let errorMsg = "❌ Terjadi kesalahan saat membuat iPhone quoted.";
    if (error.code === "ECONNABORTED") {
      errorMsg = "⚠️ Gagal: Permintaan ke server terlalu lama (timeout).";
    } else if (error.response) {
      errorMsg = `⚠️ Server error: ${error.response.status} ${error.response.statusText}`;
    }

    await sock.sendMessage(
      msg.from,
      { text: errorMsg },
      { quoted: msg }
    );

    // Reaksi gagal
    await sock.sendMessage(msg.from, {
      react: { text: "❌", key: msg.key }
    });
  }
};