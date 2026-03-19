const axios = require("axios");
const FormData = require("form-data");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "smeme",
  alias: ["stickermeme", "sm"],
  desc: "Buat stiker meme dari gambar yang direply",

  async execute(sock, msg, args) {
    const from = msg.from;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: msg });

    try {
      // kasih reaksi ⏳ saat mulai proses
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // pastikan reply ke gambar
      let quoted = msg.quoted?.imageMessage ? msg.quoted : null;
      if (!quoted) return reply("⚠️ Reply ke gambar + kasih teks.\nContoh: `.smeme Atas | Bawah`");

      // ambil teks
      let text = args.join(" ");
      if (!text) return reply("⚠️ Kasih teks memenya!\nContoh: `.smeme Atas | Bawah`");
      let [top, bottom] = text.split("|").map(t => t.trim());
      top = encodeURIComponent(top || "");
      bottom = encodeURIComponent(bottom || "");

      // download buffer gambar pakai downloadContentFromMessage
      const stream = await downloadContentFromMessage(quoted, "image");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // upload ke memegen
      let form = new FormData();
      form.append("background", buffer, "image.jpg");

      let res = await axios.post("https://api.memegen.link/images/custom", form, {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
        params: { top, bottom },
      });

      // kirim stiker
      await sock.sendMessage(from, { sticker: res.data }, { quoted: msg });

      // kasih reaksi ✅
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (e) {
      console.error("❌ Error smeme:", e);
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
      reply("❌ Gagal bikin stiker meme.");
    }
  },
};