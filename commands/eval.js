module.exports = {
    command: [">", "eval"],
    description: "Menjalankan kode javascript",
    category: "Owner",
    owner: true,
    execute: async function (sock, m, args) {
        if (!args[0]) return;
        try {
            let evaled = await eval(args.join(" "));
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            sock.sendMessage(m.from, { text: evaled });
        } catch (err) {
            sock.sendMessage(m.from, { text: String(err) });
        }
    }
};
