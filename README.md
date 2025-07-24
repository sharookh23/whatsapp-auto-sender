# 📤 WhatsApp Auto Message Sender (Bulk Campaign Tool)

A Node.js tool that automates sending personalized messages and PDFs to multiple WhatsApp numbers using WhatsApp Web. Designed for lead follow-ups, marketing, or internal updates.

---

## 🧠 What It Does

- Reads contacts from an Excel sheet
- Sends a message from a text file
- Attaches multiple PDFs from a media folder
- Logs delivery status to an Excel report

---

## 🛠️ Tech Stack

| Tool             | Purpose                    |
|------------------|----------------------------|
| Node.js          | Runtime                    |
| whatsapp-web.js  | WhatsApp Web Automation    |
| qrcode-terminal  | Display QR code in terminal|
| xlsx             | Read/write Excel files     |
| fs               | File handling              |

---

## 📁 Folder Structure

```

whatsapp-auto-sender/
├── index.js                 # Main script
├── contacts.xlsx            # Phone numbers + names
├── message.txt              # The message content to send
├── media/                   # PDFs to attach
├── Reports/                 # Sent logs (auto-generated)
├── .wwebjs\_auth/            # WhatsApp auth cache (auto)
├── .wwebjs\_cache/           # WhatsApp session cache (auto)
├── package.json             # npm dependencies
└── README.md                # Project overview

````

---

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
````

### 2. Prepare the Inputs

* `contacts.xlsx`: Must have at least a column named `Number`.
  Optional: `S.No`, `Name`

* `message.txt`: Your message to send (plain text)

* `media/`: Add your `.pdf` files here. The script is hardcoded to send:

  * Leafarpaperbag.pdf
  * LEAFAR.pdf
  * premium customers.pdf

Edit `index.js` if you want to change these files.

---

## 🚀 Run the Script

```bash
node index.js
```

You’ll see a QR code in the terminal. Scan it once with your WhatsApp app.

---

## 🧾 What You Get

* Each contact gets:

  * A message from `message.txt`
  * All files from `media/`
* A delivery report is saved to `/Reports/report-[timestamp].xlsx`

---

## ✅ Example Output (Report)

| S.No | Name     | Number     | Status                | Timestamp           |
| ---- | -------- | ---------- | --------------------- | ------------------- |
| 1    | John Doe | 9876543210 | Sent dtls on whatsapp | 2025-07-23 11:32 AM |

---

## 🔒 Privacy & Disclaimer

This script uses your own WhatsApp Web session securely.
No messages are sent without user login and manual QR authentication.
Intended for ethical, personal, and business uses only.

---

## 📌 Notes

* Only works with Indian mobile numbers (starting with 6,7,8,9)
* Adds country code `+91` automatically
* Delay between messages: 10 seconds (to avoid blocking)
* Not tested with groups or international numbers
Edit `index.js` if you want to change these files.

---

## 📧 Contact

Built by **Mohamed Sharookh Latheef**
[LinkedIn](https://www.linkedin.com/in/mohamedsharookhlatheef/) | [GitHub](https://github.com/sharookh23)

````
