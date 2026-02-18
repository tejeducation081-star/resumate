const { connectDB } = require('./src/config/db');
const { seedAdminUser } = require('./src/config/seedAdmin');
const User = require('./src/models/User');

async function debugSeed() {
    try {
        console.log('--- Connecting to DB ---');
        await connectDB();

        console.log('--- Running seedAdminUser() ---');
        await seedAdminUser();

        console.log('--- Checking User again ---');
        const admin = await User.findOne({ where: { isAdmin: true } });
        if (admin) {
            console.log('Admin User Found After Seed:');
            console.log('Username:', admin.username);
            console.log('Email:', admin.email);
            console.log('IsAdmin:', admin.isAdmin);
        } else {
            console.log('Still No Admin User Found!');
        }
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
}

debugSeed();
