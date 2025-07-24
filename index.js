const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const XLSX = require('xlsx');
const fs = require('fs');
const readlineSync = require('readline-sync');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("🔐 Scan the QR code above with your WhatsApp.");
});

client.on('ready', async () => {
    console.log('✅ WhatsApp is ready!');

    const rawContacts = loadContactsFromExcel('contacts.xlsx');
    const contacts = filterValidUniqueContacts(rawContacts);

    const message = fs.readFileSync('message.txt', 'utf-8');

    await sendMessages(contacts, message);
    console.log('📊 Campaign completed. Report saved.');
});

function loadContactsFromExcel(file) {
    const wb = XLSX.readFile(file);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Normalize keys
    return rawData.map(row => {
        const newRow = {};
        for (const key in row) {
            const normalizedKey = key.toLowerCase().replace(/[\s.]/g, '');
            newRow[normalizedKey] = row[key];
        }
        return newRow;
    });
}

function filterValidUniqueContacts(contacts) {
    const seen = new Set();
    const filtered = [];

    for (const contact of contacts) {
        const sno = contact.sno || contact.sno === 0 ? contact.sno : '';
        const numberField = contact.number;
        const name = contact.name?.toString().trim() || '-';

        if (!numberField) {
            console.log(`⚠️ Skipping entry (S.No: ${sno}) with missing number`);
            continue;
        }

        const rawNumber = numberField.toString().replace(/\D/g, '');

        if (!/^[6-9]\d{9}$/.test(rawNumber)) {
            console.log(`⚠️ Skipping non-Indian or invalid number: ${rawNumber}`);
            continue;
        }

        if (seen.has(rawNumber)) {
            console.log(`⚠️ Skipping duplicate number: ${rawNumber}`);
            continue;
        }

        seen.add(rawNumber);
        filtered.push({
            sno,
            name,
            cleanNumber: rawNumber,
            fullNumber: '91' + rawNumber
        });
    }

    return filtered;
}

async function sendMessages(contacts, message) {
    const delayMs = 10000; // 10 seconds delay
    const report = [];
    const mediaFiles = ['Leafarpaperbag.pdf', 'LEAFAR.pdf', 'premium customers.pdf'];

    for (const contact of contacts) {
        const chatId = contact.fullNumber + '@c.us';
        const timestamp = new Date().toLocaleString();

        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            console.log(`❌ Not on WhatsApp: ${contact.cleanNumber}`);
            report.push({
                'S.No': contact.sno,
                'Name': contact.name,
                'Number': contact.cleanNumber,
                'Status': 'Not on WhatsApp',
                'Timestamp': timestamp
            });
            continue;
        }

        try {
            await client.sendMessage(chatId, message);

            for (const file of mediaFiles) {
                const media = MessageMedia.fromFilePath(`media/${file}`);
                await client.sendMessage(chatId, media);
            }

            console.log(`📤 Sent to ${contact.cleanNumber}`);
            report.push({
                'S.No': contact.sno,
                'Name': contact.name,
                'Number': contact.cleanNumber,
                'Status': 'Sent dtls on whatsapp', //Status : Report
                'Timestamp': timestamp
            });
        } catch (err) {
            console.log(`⚠️ Failed to send to ${contact.cleanNumber}: ${err.message}`);
            report.push({
                'S.No': contact.sno,
                'Name': contact.name,
                'Number': contact.cleanNumber,
                'Status': 'Failed',
                'Timestamp': timestamp
            });
        }

        await delay(delayMs);
    }

    saveReportToXLSX(report);
}

function saveReportToXLSX(reportData) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const reportsDir = 'Reports';
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }
    XLSX.writeFile(wb, `${reportsDir}/report-${timestamp}.xlsx`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.initialize();
