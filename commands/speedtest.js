const { exec } = require("child_process");

module.exports = async (sock, msg, args) => {
  const from = msg.from;

  await sock.sendMessage(from, { text: "⏳ Testing speed internet..." }, { quoted: msg });

  exec("speedtest --simple", (err, stdout) => {
    if (err) {
      return sock.sendMessage(
        from,
        { text: "❌ Speedtest gagal dijalankan. Pastikan `speedtest-cli` sudah terinstall." },
        { quoted: msg }
      );
    }

    sock.sendMessage(
      from,
      { text: `📊 *Hasil Speedtest:*\n\n${stdout}` },
      { quoted: msg }
    );
  });
};