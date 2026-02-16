const { Sequelize } = require('sequelize');
const dns = require('dns').promises;
require('dotenv').config();

const rawConnection = process.env.DATABASE_URL || process.env.SUPABASE_CONNECTION_STRING;
const connectionString = rawConnection ? rawConnection.replace(/^"(.*)"$/, '$1').trim() : undefined;

if (!connectionString) {
    console.error('❌ CRITICAL ERROR: No DB connection string found. Set `DATABASE_URL` or `SUPABASE_CONNECTION_STRING`.');
}

// Extract host for DNS lookup
const hostMatch = connectionString ? connectionString.match(/@([^:]+):/) : null;
const explicitHost = hostMatch ? hostMatch[1] : undefined;
let _isConnected = false;

// Initialize Sequelize immediately so models can use it
// We use the hostname from the connection string by default
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const isDbConnected = () => _isConnected;

const connectDB = async () => {
    if (!connectionString) return;

    try {
        // Platform connectivity check (IPv4 vs IPv6 preference)
        if (explicitHost) {
            try {
                const addrs = await dns.lookup(explicitHost, { all: true });
                const hasV4 = addrs.some(a => a.family === 4);
                if (!hasV4) {
                    console.warn(`ℹ️ Host ${explicitHost} is IPv6-only. If this fails, use the Supabase Connection Pooler (port 6543).`);
                }
            } catch (e) {
                // Ignore DNS check errors
            }
        }

        await sequelize.authenticate();
        console.log(`✅ Database Connected Successfully`);

        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced');
        _isConnected = true;
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);

        if (err.message.includes('ENETUNREACH') || err.message.includes('ETIMEDOUT')) {
            console.error('\n' + '='.repeat(50));
            console.error('🚨 RAILWAY / HOSTING CONNECTIVITY ISSUE DETECTED');
            console.error('Your database host is likely IPv6-only, but Railway lacks IPv6 support.');
            console.error('FIX:');
            console.error('1. Go to Supabase Dashboard -> Project Settings -> Database');
            console.error('2. Locate "Connection Pooler"');
            console.error('3. Use the Connection String provided there (usually port 6543)');
            console.error('4. Ensure mode is "Transaction" or "Session"');
            console.error('='.repeat(50) + '\n');
        }
    }
};

module.exports = { sequelize, connectDB, isDbConnected };
