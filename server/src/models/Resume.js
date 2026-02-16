const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Resume = sequelize.define('Resume', {
  personalDetails: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  projects: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  templateId: {
    type: DataTypes.STRING,
    defaultValue: 'template-1'
  },
  customColor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customBgColor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  atsScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Relationships
User.hasMany(Resume, { foreignKey: 'userId', onDelete: 'CASCADE' });
Resume.belongsTo(User, { foreignKey: 'userId' });

module.exports = Resume;
