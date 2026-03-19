module.exports = {
    command: ["ping"],
    description: "Cek kecepatan respon bot",
    category: "Main",
    execute: async function (sock, m, args) {
        const start = Date.now();
        await sock.sendMessage(m.from, { text: "Pinging..." }, { quoted: m }).then((msg) => {
            const end = Date.now();
            const ping = end - start;
            sock.sendMessage(m.from, { 
                text: `🏓 Pong!\nRespon: ${ping}ms`, 
                edit: msg.key 
            });
        });
    }
};
