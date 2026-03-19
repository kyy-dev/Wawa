const moment = require("moment-timezone");
const fs = require("fs");

module.exports = {
    command: ["menu", "help"],
    description: "Menampilkan daftar perintah bot",
    category: "Main",
    execute: async function (sock, m, args) {
        const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
        const date = moment().tz("Asia/Jakarta").format("DD/MM/YYYY");
        
        // Header Menu
        let menuText = `╔════════════════════════╗\n`;
        menuText += `║     ✨ *KYY-BOT MENU* ✨     \n`;
        menuText += `╠════════════════════════╝\n`;
        menuText += `║ 👤 *User:* ${m.pushName || 'User'}\n`;
        menuText += `║ 📅 *Date:* ${date}\n`;
        menuText += `║ ⌚ *Time:* ${time} WIB\n`;
        menuText += `╚═════════════════════════\n\n`;

        // --- KATEGORI: OWNER ---
        menuText += `┎───『 *OWNER ONLY* 』\n`;
        menuText += `┃ 🛠️ .exec (Terminal)\n`;
        menuText += `┃ 🧪 .eval (JavaScript)\n`;
        menuText += `┃ 👤 .owner\n`;
        menuText += `┃ 📢 .bc / .broadcast\n`;
        menuText += `┗━━━━━━━━━━━━━━━\n\n`;

        // --- KATEGORI: GROUP & ADMIN ---
        menuText += `┎───『 *GROUP ADMIN* 』\n`;
        menuText += `┃ 🚫 .antilink (On/Off)\n`;
        menuText += `┃ ➕ .add / .kick\n`;
        menuText += `┃ ⬆️ .promote / .demote\n`;
        menuText += `┃ 🏷️ .hidetag\n`;
        menuText += `┃ ⚙️ .group (Open/Close)\n`;
        menuText += `┃ 📝 .setname / .setpp\n`;
        menuText += `┃ ℹ️ .infogrup\n`;
        menuText += `┗━━━━━━━━━━━━━━━\n\n`;

        // --- KATEGORI: MAKER & TOOLS ---
        menuText += `┎───『 *MAKER & TOOLS* 』\n`;
        menuText += `┃ 🖼️ .stiker / .smeme\n`;
        menuText += `┃ 🎨 .brat / .figure\n`;
        menuText += `┃ 📸 .remini / .removebg\n`;
        menuText += `┃ 🔄 .toimg / .tomp3\n`;
        menuText += `┃ 📥 .ttdl (TikTok)\n`;
        menuText += `┃ 📦 .cekresi\n`;
        menuText += `┃ 🔍 .getpp / .me\n`;
        menuText += `┗━━━━━━━━━━━━━━━\n\n`;

        // --- KATEGORI: INFORMATION & FUN ---
        menuText += `┎───『 *INFO & FUN* 』\n`;
        menuText += `┃ 💬 .quotes / .quotesanime\n`;
        menuText += `┃ 🔮 .quotesilmuan\n`;
        menuText += `┃ 💡 .motivasi / .news\n`;
        menuText += `┃ 📊 .runtime / .ping\n`;
        menuText += `┃ 🚀 .speedtest\n`;
        menuText += `┃ 🕵️ .rvo (Read View Once)\n`;
        menuText += `┗━━━━━━━━━━━━━━━\n\n`;

        menuText += `_© KYY-BOT Multi Device_`;

        // Kirim Menu dengan gambar bot lo (kyybot.png)
        if (fs.existsSync("./kyybot.png")) {
            await sock.sendMessage(m.from, { 
                image: { url: "./kyybot.png" }, 
                caption: menuText 
            }, { quoted: m });
        } else {
            await sock.sendMessage(m.from, { text: menuText }, { quoted: m });
        }
    }
};
