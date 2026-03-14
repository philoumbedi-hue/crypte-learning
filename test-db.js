const { Client } = require('pg');

const connectionString = "postgresql://postgres.nfxcmvgprrctcuyhtnbb:philosopheumbedi@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0";

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Attempting to connect to:", connectionString.split('@')[1]);
        await client.connect();
        console.log("Successfully connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log("Current Time:", res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err.message);
        if (err.code) console.error("Error Code:", err.code);
    }
}

testConnection();
