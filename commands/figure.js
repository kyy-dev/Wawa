const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, msg, args) => {
  const from = msg.from;

  try {
    // kasih reaksi proses
    await sock.sendMessage(from, {
      react: { text: "⏳", key: msg.key }
    });

    // ambil gambar: reply atau caption langsung
    let quoted = null;
    if (msg.quoted && msg.quoted.imageMessage) {
      quoted = msg.quoted; // gambar reply
    } else if (msg.message?.imageMessage) {
      quoted = msg; // gambar dengan caption .figure
    }

    if (!quoted) {
      return await sock.sendMessage(
        from,
        {
          text: "⚠️ Kirim atau reply sebuah foto dengan caption *.figure*",
        },
        { quoted: msg }
      );
    }

    // download gambar dari WhatsApp
    const buffer = await downloadMediaMessage(
      quoted,
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    // upload ke Catbox
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, { filename: "figure.jpg" });

    const upload = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const imageUrl = upload.data;

    // request ke API figure
    const apiUrl = `https://api.sxtream.xyz/maker/figure?url=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    // kirim hasil
    await sock.sendMessage(
      from,
      {
        image: Buffer.from(response.data),
        caption: "✅ Berikut hasil figure Anda",
      },
      { quoted: msg }
    );

    // kasih reaksi sukses
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error plugin figure:", err);
    await sock.sendMessage(from, {
      react: { text: "❌", key: msg.key }
    });
    await sock.sendMessage(
      from,
      { text: "❌ Maaf, terjadi kesalahan saat membuat figure." },
      { quoted: msg }
    );
  }
};