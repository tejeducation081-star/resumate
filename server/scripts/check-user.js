const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

async function checkSpecificUser() {
    try {
        await connectDB();
        const email = 'admin.resumate@gmail.com';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log('User Found with Admin Email:');
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('IsAdmin:', user.isAdmin);
        } else {
            console.log('No user found with email:', email);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSpecificUser();
