const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { spawn } = require("child_process");

module.exports = {
  name: "tomp3",
  description: "Ubah video jadi audio (ringan, cepat, minimal install)",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    try {
      // kasih reaksi ⏳ saat mulai
      await sock.sendMessage(from, {
        react: { text: "⏳", key: msg.key }
      });

      // ambil video dari pesan / quoted
      const quoted =
        msg.message?.videoMessage ||
        msg.quoted?.videoMessage ||
        msg.message?.documentMessage ||
        msg.quoted?.documentMessage;

      if (!quoted) {
        return sock.sendMessage(from, { text: "⚠️ Kirim/reply video dengan *.tomp3*" }, { quoted: msg });
      }

      // ambil buffer video
      const buffer = await downloadMediaMessage(
        { message: { videoMessage: quoted } },
        "buffer",
        {},
        { logger: console }
      );

      // convert ke mp3 pake ffmpeg
      const ffmpeg = spawn("ffmpeg", [
        "-i", "pipe:0",
        "-f", "mp3",
        "-ab", "192k",
        "-vn",
        "pipe:1"
      ]);

      ffmpeg.stdin.write(buffer);
      ffmpeg.stdin.end();

      const chunks = [];
      ffmpeg.stdout.on("data", chunk => chunks.push(chunk));

      ffmpeg.on("close", async code => {
        if (code !== 0) {
          await sock.sendMessage(from, {
            react: { text: "❌", key: msg.key }
          });
          return sock.sendMessage(from, { text: "❌ Gagal konversi video ke MP3" }, { quoted: msg });
        }

        const mp3Buffer = Buffer.concat(chunks);

        await sock.sendMessage(
          from,
          { audio: mp3Buffer, mimetype: "audio/mpeg" },
          { quoted: msg }
        );

        // kasih reaksi ✅ kalau sukses
        await sock.sendMessage(from, {
          react: { text: "✅", key: msg.key }
        });
      });

    } catch (err) {
      console.error("❌ Error tomp3:", err);
      await sock.sendMessage(from, {
        react: { text: "❌", key: msg.key }
      });
      await sock.sendMessage(from, { text: "❌ Gagal ubah video ke MP3" }, { quoted: msg });
    }
  },
};