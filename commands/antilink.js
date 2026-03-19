const fs = require('fs')
const dbPath = './antilink.json'

module.exports = {
    command: ["antilink", "al"],
    execute: async function (sock, msg, args, { isOwner }) {
        const from = msg.from
        if (!msg.from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Hanya untuk grup!" })
        
        // Cek Admin
        const metadata = await sock.groupMetadata(from)
        const isAdmin = metadata.participants.find(p => p.id === (msg.key.participant || msg.participant))?.admin !== null
        if (!isAdmin && !isOwner) return sock.sendMessage(from, { text: "❌ Khusus Admin!" })

        let db = JSON.parse(fs.readFileSync(dbPath))
        let groupIndex = db.findIndex(i => i.id === from)

        if (args[0] === "on") {
            if (groupIndex === -1) db.push({ id: from, status: true })
            else db[groupIndex].status = true
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
            sock.sendMessage(from, { text: "✅ Anti-link Otomatis ON" })
        } else if (args[0] === "off") {
            if (groupIndex === -1) db.push({ id: from, status: false })
            else db[groupIndex].status = false
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
            sock.sendMessage(from, { text: "❌ Anti-link dimatikan" })
        } else {
            sock.sendMessage(from, { text: "Contoh: .antilink off" })
        }
    }
}
