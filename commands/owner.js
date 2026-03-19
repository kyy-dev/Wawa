module.exports = async (sock, msg, args) => {
  const from = msg.from;

  try {
    // kasih reaksi 👑
    await sock.sendMessage(from, {
      react: { text: "👑", key: msg.key }
    });

    await sock.sendMessage(
      from,
      {
        text: `👑 *Owner Bot*

• Nama: Jaki
• Instagram: @kyreacher
• Tiktok: tiktok.com/@kysnku
`
      },
      { quoted: msg }
    );

    // kasih reaksi sukses ✅
    await sock.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error plugin owner:", err);
    await sock.sendMessage(from, {
      react: { text: "❌", key: msg.key }
    });
    await sock.sendMessage(
      from,
      { text: "❌ Gagal menampilkan info owner" },
      { quoted: msg }
    );
  }
};