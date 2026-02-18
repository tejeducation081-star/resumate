#!/usr/bin/env node

/**
 * Resume Diagnostic Script
 * Helps locate missing resumes in the database
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('../config/db');
const Resume = require('../models/Resume');
const User = require('../models/User');

async function runDiagnostics() {
    console.log('\n========================================');
    console.log('📋 RESUME DIAGNOSTIC TOOL');
    console.log('========================================\n');

    try {
        // Connect to database
        console.log('🔗 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected\n');

        // Check users
        console.log('👥 USERS IN DATABASE:');
        const users = await User.findAll({
            attributes: ['id', 'email', 'createdAt']
        });
        
        if (users.length === 0) {
            console.log('   ⚠️  No users found');
        } else {
            users.forEach((user, i) => {
                console.log(`   ${i + 1}. ${user.email} (ID: ${user.id})`);
            });
        }

        console.log('\n📄 RESUMES IN DATABASE:');
        const resumes = await Resume.findAll({
            attributes: ['id', 'userId', 'personalDetails', 'createdAt', 'updatedAt'],
            order: [['updatedAt', 'DESC']],
            limit: 50
        });

        if (resumes.length === 0) {
            console.log('   ⚠️  No resumes found in database');
        } else {
            resumes.forEach((resume, i) => {
                const details = JSON.parse(resume.personalDetails || '{}');
                const name = details.fullName || 'Unnamed Resume';
                console.log(`   ${i + 1}. "${name}" (ID: ${resume.id})`);
                console.log(`      User ID: ${resume.userId}`);
                console.log(`      Created: ${resume.createdAt}`);
                console.log(`      Updated: ${resume.updatedAt}\n`);
            });
        }

        // Summary
        console.log('📊 SUMMARY:');
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Total Resumes: ${resumes.length}`);

        if (resumes.length > 0 && users.length > 0) {
            console.log('\n✅ Data appears intact!');
            console.log('Possible issues:');
            console.log('   • Frontend caching - clear browser cache');
            console.log('   • User not logged in - ensure authentication token is valid');
            console.log('   • API error - check server logs');
        } else if (resumes.length === 0 && users.length > 0) {
            console.log('\n⚠️  No resumes found but users exist');
            console.log('   • Resume may not have been saved successfully');
            console.log('   • Check frontend console for errors during save');
        }

        console.log('\n========================================\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        process.exit();
    }
}

runDiagnostics();
