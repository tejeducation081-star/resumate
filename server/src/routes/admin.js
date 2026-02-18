const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes require admin authentication
router.use(adminMiddleware);

/**
 * GET /api/admin/users
 * Get all users with their subscription status
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'isAdmin', 'isPremium', 'premiumExpiresAt', 'createdAt'],
            where: {
                isAdmin: false  // Exclude admin users from the list
            },
            order: [['createdAt', 'DESC']]
        });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/admin/users/:userId/premium
 * Grant premium access to a user for 1 month
 */
router.post('/users/:userId/premium', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate expiration date (1 month from now)
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        // Update user
        await user.update({
            isPremium: true,
            premiumExpiresAt: expirationDate
        });

        res.json({
            message: 'Premium access granted successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isPremium: user.isPremium,
                premiumExpiresAt: user.premiumExpiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/admin/users/:userId/premium
 * Revoke premium access from a user
 */
router.delete('/users/:userId/premium', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Revoke premium
        await user.update({
            isPremium: false,
            premiumExpiresAt: null
        });

        res.json({
            message: 'Premium access revoked successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isPremium: user.isPremium,
                premiumExpiresAt: user.premiumExpiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/admin/import
 * Bulk import users from JSON (sent from frontend)
 */
router.post('/import', async (req, res) => {
    try {
        const { users } = req.body;
        if (!Array.isArray(users)) {
            return res.status(400).json({ error: 'Invalid data format. Expected an array of users.' });
        }

        const stats = { success: 0, failed: 0, errors: [] };

        for (const userData of users) {
            try {
                if (!userData.username || !userData.password) {
                    throw new Error('Missing username or password');
                }

                // If no email provided, generate a dummy internal one
                const email = userData.email || `${userData.username.toLowerCase().replace(/\s+/g, '')}@resumate.internal`;

                // Calculate expiration date (1 month from now)
                const expirationDate = new Date();
                expirationDate.setMonth(expirationDate.getMonth() + 1);

                // Create user with 1 month premium
                await User.create({
                    username: userData.username,
                    email: email,
                    password: userData.password,
                    isPremium: true,
                    isAdmin: false,
                    premiumExpiresAt: expirationDate
                });

                stats.success++;
            } catch (err) {
                stats.failed++;
                stats.errors.push(`Row ${stats.success + stats.failed}: ${err.message}`);
            }
        }

        res.json({
            message: 'Bulk import task completed',
            stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/admin/users/:userId
 * Permanently remove a user and their data
 */
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isAdmin) {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        await user.destroy();
        res.json({ message: 'User removed from network successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
