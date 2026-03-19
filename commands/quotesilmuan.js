const axios = require("axios");

module.exports = async (sock, msg, args) => {
  try {
    // kasih reaction ⏳ saat proses
    await sock.sendMessage(msg.from, {
      react: { text: "⏳", key: msg.key },
    });

    const response = await axios.get("https://api.sxtream.xyz/randomtext/quotesilmuan");
    
    if (!response.data || !response.data.data) {
      return sock.sendMessage(msg.from, { text: "❌ Gagal mengambil Quotes Ilmuwan" });
    }

    const quoteData = response.data.data; // data biasanya berisi { author, quote }

    const textToSend = `"${quoteData.quote}"\n\n- ${quoteData.author}`;

    await sock.sendMessage(msg.from, {
      text: textToSend,
      contextInfo: { mentionedJid: [], forwardingScore: 0, isForwarded: false },
      detectLinks: false,
    });

    // kasih reaction ✅ setelah selesai
    await sock.sendMessage(msg.from, {
      react: { text: "✅", key: msg.key },
    });

  } catch (err) {
    console.error("Error di plugin quotesilmuan:", err);
    await sock.sendMessage(msg.from, { text: "❌ Gagal mengambil Quotes Ilmuwan" });
    await sock.sendMessage(msg.from, {
      react: { text: "❌", key: msg.key },
    });
  }
};