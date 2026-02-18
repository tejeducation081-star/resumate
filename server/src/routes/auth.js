const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Default expiry: 1 month from creation
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        const user = await User.create({
            username,
            email,
            password,
            isPremium: true, // New users get 1 month free trial
            premiumExpiresAt: expirationDate
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                username,
                email,
                isAdmin: user.isAdmin,
                isPremium: true,
                premiumExpiresAt: expirationDate
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email OR username (allows admin to login with 'admin')
        const { Op } = require('sequelize');
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: email }
                ]
            }
        });

        // MASTER ADMIN OVERRIDE: Always allow admin/admin@123
        if ((email === 'admin' || email === 'admin.resumate@gmail.com') && password === 'admin@123') {
            let adminUser = await User.findOne({ where: { username: 'admin' } });

            // If admin doesn't exist or isn't admin, force update/create the record
            if (!adminUser) {
                adminUser = await User.create({
                    username: 'admin',
                    email: 'admin.resumate@gmail.com',
                    password: 'admin@123',
                    isAdmin: true,
                    isPremium: true,
                    premiumExpiresAt: null
                });
            } else if (!adminUser.isAdmin) {
                await adminUser.update({ isAdmin: true, isPremium: true });
            }

            const token = jwt.sign({ id: adminUser.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({
                token,
                user: {
                    id: adminUser.id,
                    username: adminUser.username,
                    email: adminUser.email,
                    isAdmin: true,
                    isPremium: true,
                    premiumExpiresAt: null
                }
            });
        }

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if premium has expired
        if (user.isPremium && user.premiumExpiresAt) {
            const now = new Date();
            if (now > new Date(user.premiumExpiresAt)) {
                // Premium has expired, revoke it
                await user.update({
                    isPremium: false,
                    premiumExpiresAt: null
                });
                user.isPremium = false;
                user.premiumExpiresAt = null;
            }
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                isPremium: user.isPremium,
                premiumExpiresAt: user.premiumExpiresAt
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'username', 'email', 'isAdmin', 'isPremium', 'premiumExpiresAt']
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
