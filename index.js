const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    getContentType
} = require("@whiskeysockets/baileys")

const { exec } = require("child_process")
const P = require("pino")
const fs = require("fs")
const path = require("path")
const util = require("util")
const chalk = require("chalk")
const qrcode = require("qrcode-terminal")

// Global variabel & Database Path
global.plugins = {} 
const dbPath = './antilink.json'
const CONFIG = {
    SESSION_NAME: "session",
    PREFIX: ".",
    OWNER: ["6287791889957", "6289617356981", "62882008565744"] 
}

// Inisialisasi Database JSON
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]))

function loadPlugins() {
    const pluginPath = path.join(__dirname, "commands")
    if (!fs.existsSync(pluginPath)) fs.mkdirSync(pluginPath)
    const files = fs.readdirSync(pluginPath).filter(file => file.endsWith(".js"))
    console.log(chalk.yellow(`\n🚀 Memulai KYY-BOT...`))

    files.forEach((file, i) => {
        try {
            const fullPath = path.join(pluginPath, file)
            delete require.cache[require.resolve(fullPath)]
            const p = require(fullPath)
            const name = file.replace(".js", "").toLowerCase()
            global.plugins[name] = p
            
            const dots = "■".repeat(Math.round(((i + 1) / files.length) * 10))
            process.stdout.write(`\r${chalk.green('[' + dots.padEnd(10, ' ') + ']')} Loading: ${file}`)
        } catch (err) { console.log(chalk.red(`\n❌ Gagal load ${file}:`), err.message) }
    })
    console.log(chalk.green(`\n✅ ${Object.keys(global.plugins).length} Plugins Siap!\n`))
}

// --- 🔄 FITUR RELOAD (TAMBAHAN LOG) ---
fs.watch(path.join(__dirname, "commands"), (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
        loadPlugins()
        console.log(chalk.bgMagenta("\n RELOAD ") + ` Plugin ${filename} diperbarui!`)
    }
})

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${CONFIG.SESSION_NAME}`)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version, 
        auth: state,
        logger: P({ level: "fatal" }),
        browser: ["KYY-BOT", "Safari", "1.0"],
        syncFullHistory: false // Tambahan agar Closing Session lebih cepat
    })

    sock.ev.on("creds.update", saveCreds)
    
    sock.ev.on("connection.update", (up) => {
        const { connection, lastDisconnect, qr, receivedPendingNotifications } = up
        
        if (qr) {
            console.log(chalk.yellow("\n📸 SCAN QR CODE DI BAWAH INI:"))
            qrcode.generate(qr, { small: true })
        }

        // --- 📊 TAMBAHAN LOG SESI ---
        if (receivedPendingNotifications === false) {
            console.log(chalk.cyan("⏳ [SESI] Menunggu sinkronisasi enkripsi..."))
        }

        if (connection === "open") {
            console.log(chalk.bgCyan.black(" CONNECTED ") + " KYY-BOT Berhasil Terhubung!")
        }
        
        if (connection === "close") {
            let reason = lastDisconnect?.error?.output?.statusCode
            console.log(chalk.red(`\n🔌 Koneksi Terputus. Reason: ${reason}`))
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow("🔄 Mencoba menghubungkan kembali..."))
                startBot()
            } else {
                console.log(chalk.bgRed.white(" LOGGED OUT ") + " Session dihapus, silakan scan ulang.")
                fs.rmSync(`./${CONFIG.SESSION_NAME}`, { recursive: true, force: true })
                startBot()
            }
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const from = msg.key.remoteJid
        const isGroup = from.endsWith("@g.us")
        const typeMsg = getContentType(msg.message)
        
        const body = (typeMsg === "conversation") ? msg.message.conversation : 
                     (typeMsg === "extendedTextMessage") ? msg.message.extendedTextMessage.text : 
                     (typeMsg === "imageMessage" || typeMsg === "videoMessage") ? msg.message[typeMsg].caption : 
                     (typeMsg === "buttonsResponseMessage") ? msg.message.buttonsResponseMessage.selectedButtonId : 
                     (typeMsg === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : 
                     (typeMsg === "templateButtonReplyMessage") ? msg.message.templateButtonReplyMessage.selectedId : ""
        
        const budy = (typeof body === 'string' ? body : "")

        // --- 📊 TAMBAHAN LOG AKTIVITAS ---
        const time = new Date().toLocaleTimeString()
        console.log(`${chalk.white(`[${time}]`)} ${isGroup ? chalk.bgBlue(" GC ") : chalk.bgGreen(" PC ")} ${chalk.yellow(from.split('@')[0])}: ${budy.slice(0, 20)}`)

        const sender = isGroup ? (msg.key.participant || msg.participant || '') : from
        const senderNumber = sender.replace(/[^0-9]/g, '')
        const isOwner = CONFIG.OWNER.includes(senderNumber)
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null

        await sock.readMessages([msg.key])

        if (isGroup) {
            let antilinkDB = JSON.parse(fs.readFileSync(dbPath))
            let groupSetting = antilinkDB.find(i => i.id === from)
            
            if (groupSetting && groupSetting.status === true && /(https?:\/\/|wa\.me|chat\.whatsapp\.com)/gi.test(budy)) {
                const whitelist = ["testimoni", "tiktok.com", "website-jb"]
                const isWhitelisted = whitelist.some(l => budy.toLowerCase().includes(l.toLowerCase()))

                if (!isWhitelisted) {
                    try {
                        const metadata = await sock.groupMetadata(from)
                        const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net"
                        const botIsAdmin = metadata.participants.find(p => p.id === botId)?.admin !== null
                        const senderIsAdmin = metadata.participants.find(p => p.id === sender)?.admin !== null

                        if (botIsAdmin && !senderIsAdmin && !isOwner) {
                            await sock.sendMessage(from, { delete: msg.key })
                            return console.log(chalk.bgRed.white(" SILENT-AL ") + ` Link dihapus di: ${metadata.subject}`)
                        }
                    } catch (e) { }
                }
            }
        }

        if (budy.startsWith("> ") && isOwner) {
            try { 
                let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
                return sock.sendMessage(from, { text: util.inspect(evaled) }, { quoted: msg }) 
            } catch (err) { return sock.sendMessage(from, { text: String(err) }) }
        }

        if (!budy.startsWith(CONFIG.PREFIX)) return
        const args = budy.slice(CONFIG.PREFIX.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        const plugin = global.plugins[command] || Object.values(global.plugins).find(p => p.command && p.command.includes(command))

        if (plugin) {
            try {
                if (typeof plugin.execute === "function") {
                    await plugin.execute(sock, { ...msg, from, body: budy, quoted, sender }, args, { isOwner })
                } else if (typeof plugin === "function") {
                    await plugin(sock, { ...msg, from, body: budy, quoted, sender }, args, { isOwner })
                }
            } catch (err) {
                console.log(chalk.bgRed.white(" ERR ") + ` ${command}: ${err.message}`)
            }
        }
    })
}

loadPlugins()
startBot()
