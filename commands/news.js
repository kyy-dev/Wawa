// commands/news.js
const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (sock, msg, args) => {
  const from = msg.from;
  const kategori = (args[0] || "indo").toLowerCase();

  try {
    // kasih react loading
    await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

    let rssUrl, sumber;
    if (kategori === "indo") {
      rssUrl = "https://www.antaranews.com/rss/terkini.xml";
      sumber = "ANTARA (Indonesia)";
    } else if (kategori === "world") {
      rssUrl = "http://feeds.bbci.co.uk/news/world/rss.xml";
      sumber = "BBC World News";
    } else {
      return await sock.sendMessage(from, { text: "⚠️ Pilih:\n.news indo\n.news world" }, { quoted: msg });
    }

    const resp = await axios.get(rssUrl);
    const parsed = await xml2js.parseStringPromise(resp.data, { trim: true });
    const items = parsed.rss.channel[0].item;

    if (!items || items.length === 0) {
      return await sock.sendMessage(from, { text: "⚠️ Tidak ada berita terkini" }, { quoted: msg });
    }

    const top5 = items.slice(0, 5).map((item, i) => {
      return `${i + 1}. *${item.title[0]}*\n🔗 ${item.link[0]}`;
    }).join("\n\n");

    await sock.sendMessage(from, { text: `📰 *Berita Terkini (${sumber}):*\n\n${top5}` }, { quoted: msg });
    await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

  } catch (err) {
    console.error("❌ Error news:", err);
    await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
    await sock.sendMessage(from, { text: "❌ Gagal ambil berita" }, { quoted: msg });
  }
};