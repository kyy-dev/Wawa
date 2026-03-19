const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
require("moment/locale/id");
moment.locale("id");

module.exports = async (sock, msg, args, { isOwner }) => {
  try {
    const from = msg.from;
    const sender = msg.pushName || "User";
    const nomor = from ? from.split("@")[0] : "Tidak diketahui";

    // Reaksi ✍️
    await sock.sendMessage(from, { react: { text: "✍️", key: msg.key } });

    // Logo (opsional)
    const imagePath = path.join(__dirname, "../kyybot.png");
    const buffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    // Waktu & ucapan
    const jam = moment().tz("Asia/Jakarta").hour();
    let ucapan = "Selamat Malam 🌙";
    if (jam >= 5 && jam < 11) ucapan = "Selamat Pagi 🌅";
    else if (jam >= 11 && jam < 15) ucapan = "Selamat Siang ☀️";
    else if (jam >= 15 && jam < 18) ucapan = "Selamat Sore 🌇";

    const waktu = moment().tz("Asia/Jakarta").format("dddd, DD MMMM YYYY HH:mm");

    // Teks maker menu
    const caption = `
╭───「 *MAKER MENU* 」
│ 👋 Hai, ${sender}
│ ${ucapan}
│ 📆 ${waktu}
│ 📱 ${nomor}
│ ${isOwner ? "👑 Status: Owner" : "🙋 Status: User"}
╰───────────────

🖼️ *Maker Tools*
├ .stiker 
├ .brat
├ .figure 
├ .iqc 
├ .rvo 
├ .toimg 
├ .tomp3
╰───────────────

© 2025 *KyyBot* • Simple • Fast • Reliable
    `;

    // Kirim menu
    if (buffer) {
      await sock.sendMessage(
        from,
        { image: buffer, caption },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(from, { text: caption }, { quoted: msg });
    }

    // Reaksi 📃
    await sock.sendMessage(from, { react: { text: "📃", key: msg.key } });
  } catch (err) {
    console.error("❌ Error makermenu:", err);
    await sock.sendMessage(
      msg.from,
      { text: "❌ Terjadi error di maker menu" },
      { quoted: msg }
    );
  }
};