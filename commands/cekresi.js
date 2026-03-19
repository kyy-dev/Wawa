const axios = require("axios");

module.exports = async (sock, msg, args) => {
  const from = msg.from;
  const resi = args[0];

  if (!resi) {
    return sock.sendMessage(
      from,
      { text: "⚠️ Contoh: .cekresi JNE1234567890" },
      { quoted: msg }
    );
  }

  try {
    // kasih reaksi loading
    await sock.sendMessage(from, {
      react: { text: "⏳", key: msg.key },
    });

    const { data } = await axios.get(`https://api-rekab.my.id/cekresi?resi=${resi}`);

    // kalau API error atau kosong
    if (!data || data.error) {
      return await sock.sendMessage(
        from,
        { text: "⚠️ Resi tidak ditemukan" },
        { quoted: msg }
      );
    }

    // format hasil biar rapi
    let hasil = `📦 *Hasil Cek Resi*\n\n`;
    hasil += `🔖 Resi: ${resi}\n`;
    hasil += `🚚 Kurir: ${data.kurir || "-"}\n`;
    hasil += `📌 Status: ${data.status || "-"}\n\n`;

    if (data.history && Array.isArray(data.history)) {
      hasil += "*Riwayat Pengiriman:*\n";
      data.history.forEach((h, i) => {
        hasil += `${i + 1}. ${h.date} - ${h.desc}\n`;
      });
    }

    await sock.sendMessage(from, { text: hasil }, { quoted: msg });

    // kasih reaksi sukses
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key },
    });

  } catch (err) {
    console.error("❌ Error cekresi:", err);

    await sock.sendMessage(from, {
      react: { text: "❌", key: msg.key },
    });

    await sock.sendMessage(
      from,
      { text: "❌ Resi tidak ditemukan atau error" },
      { quoted: msg }
    );
  }
};