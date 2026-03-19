const { exec } = require("child_process");

module.exports = {
    command: ["$", "exec"],
    description: "Menjalankan perintah terminal",
    category: "Owner",
    owner: true,
    execute: async function (sock, m, args) {
        if (!args[0]) return;
        exec(args.join(" "), (err, stdout) => {
            if (err) return sock.sendMessage(m.from, { text: `❌ Error:\n${err.message}` });
            if (stdout) sock.sendMessage(m.from, { text: stdout });
        });
    }
};
