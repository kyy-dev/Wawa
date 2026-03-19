module.exports = async (sock, msg, args) => {
  const from = msg.from;
  const uptime = process.uptime();

  const format = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h} jam ${m} menit ${s} detik`;
  };

  await sock.sendMessage(
    from,
    { text: `⏱ Bot aktif selama: *${format(uptime)}*` },
    { quoted: msg }
  );
};