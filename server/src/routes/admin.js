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

module.exports = router;
