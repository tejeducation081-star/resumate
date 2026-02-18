const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

async function resetAdmin() {
    try {
        await connectDB();
        const adminEmail = 'admin.resumate@gmail.com';
        const user = await User.findOne({ where: { email: adminEmail } });

        if (user) {
            console.log('Found admin, resetting password...');
            user.password = 'admin@123';
            await user.save();
            console.log('✅ Admin password reset to: admin@123');
        } else {
            console.log('Admin not found, creating...');
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: 'admin@123',
                isAdmin: true,
                isPremium: true
            });
            console.log('✅ Admin user created with password: admin@123');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetAdmin();
