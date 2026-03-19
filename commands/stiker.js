const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
  name: "stiker",
  description: "Membuat stiker dari gambar",
  async execute(sock, msg, from) {
    const timestamp = Date.now();
    const inputPath = `./temp_${timestamp}.jpg`;
    const outputPath = `./temp_${timestamp}.webp`;

    try {
      let imageMessage = null;

      // cek gambar langsung
      if (msg.message?.imageMessage) {
        imageMessage = msg.message.imageMessage;
      }

      // cek gambar dari reply
      if (!imageMessage && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
        imageMessage = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
      }

      if (!imageMessage) {
        return sock.sendMessage(
          from,
          { text: "⚠️ Kirim/reply gambar dengan *.stiker*" },
          { quoted: msg }
        );
      }

      // kasih reaksi proses
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // download gambar
      const stream = await downloadContentFromMessage(imageMessage, "image");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      fs.writeFileSync(inputPath, buffer);

      // convert ke webp (stiker)
      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=0x00000000" -y ${outputPath}`,
          (err) => (err ? reject(err) : resolve())
        );
      });

      const stickerBuffer = fs.readFileSync(outputPath);

      // kirim stiker
      await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

      // kasih reaksi sukses
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error("❌ Error plugin stiker:", err);
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
      await sock.sendMessage(from, { text: "❌ Gagal membuat stiker." }, { quoted: msg });
    } finally {
      // hapus file sementara kalau ada
      try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch {}
      try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); } catch {}
    }
  }
};