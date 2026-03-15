
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Basic env parser
const env = {};
try {
    const envPath = path.join(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) {
            env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
        }
    });
} catch (e) {
    console.error("Failed to read .env file:", e.message);
}

const resend = new Resend(env.RESEND_API_KEY);

async function testResend() {
    console.log("Testing Resend API directly...");
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'delivered@resend.dev', // Resend testing address
            subject: 'Test Crypte Direct',
            html: '<p>Ceci est un test direct de l\'API Resend.</p>'
        });

        if (error) {
            console.error("❌ Resend API Error:", error);
        } else {
            console.log("✅ Resend API Success!", data);
        }
    } catch (err) {
        console.error("💥 Crashed during Resend test:", err);
    }
}

testResend();
