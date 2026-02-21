const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    premiumExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Master Profile Fields
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON, // Stores array of strings
        allowNull: true
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: true
    },
    targetTitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;
