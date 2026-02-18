const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

async function forceAdmin() {
    try {
        await connectDB();
        const adminEmail = 'admin.resumate@gmail.com';

        // Delete any existing user with this email or username to start fresh
        await User.destroy({ where: { email: adminEmail } });
        await User.destroy({ where: { username: 'admin' } });

        console.log('Force creating admin user...');
        await User.create({
            username: 'admin',
            email: adminEmail,
            password: 'admin@123',
            isAdmin: true,
            isPremium: true
        });

        console.log('✅ Admin user force-recreated!');
        console.log('ID: admin');
        console.log('Password: admin@123');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

forceAdmin();
