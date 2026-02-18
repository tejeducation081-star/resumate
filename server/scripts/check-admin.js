const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

async function checkAdmin() {
    try {
        await connectDB();
        const admin = await User.findOne({ where: { isAdmin: true } });
        if (admin) {
            console.log('Admin User Found:');
            console.log('Username:', admin.username);
            console.log('Email:', admin.email);
            console.log('IsAdmin:', admin.isAdmin);
            // Don't log the password for security, but we know it's there
            console.log('Password exists:', !!admin.password);
        } else {
            console.log('No Admin User Found!');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAdmin();
