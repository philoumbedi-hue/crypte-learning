
const { createClient } = require('@supabase/supabase-js');
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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey?.length);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignUp() {
    const email = `test.crypte.${Date.now()}@gmail.com`;
    const password = "Password123!";

    console.log(`Testing SignUp for: ${email}`);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://crypte-learning.vercel.app/auth/callback'
            }
        });

        if (error) {
            console.error("❌ SignUp Error:", error.message);
            console.error("Full Error Object:", JSON.stringify(error, null, 2));
        } else {
            console.log("✅ SignUp Success!");
            console.log("User Data:", data.user ? "User created" : "No user?!");
            console.log("Identities:", data.user?.identities);
            console.log("Confirmation Sent:", data.user?.confirmation_sent_at);
        }
    } catch (err) {
        console.error("💥 Crashed during signUp:", err);
    }
}

testSignUp();
