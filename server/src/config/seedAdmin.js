const User = require('../models/User');

/**
 * Seeds the admin user if it doesn't exist
 */
async function seedAdminUser() {
    try {
        const adminEmail = 'admin.resumate@gmail.com';

        // Check if admin already exists
        const user = await User.findOne({ where: { email: adminEmail } });

        if (user) {
            if (!user.isAdmin) {
                // If user exists but is not an admin, promote them
                await user.update({
                    isAdmin: true,
                    isPremium: true,
                    premiumExpiresAt: null
                });
                console.log('✅ Existing user promoted to Admin');
            } else {
                console.log('✅ Admin user already exists');
            }
            return;
        }

        // Create admin user
        await User.create({
            username: 'admin',
            email: adminEmail,
            password: 'admin@123',
            isAdmin: true,
            isPremium: true,
            premiumExpiresAt: null // Admin has permanent premium
        });

        console.log('✅ Admin user created successfully');
        console.log(`   Email: ${adminEmail}`);
        console.log('   Password: admin@123');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    }
}

module.exports = { seedAdminUser };
