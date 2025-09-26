#!/usr/bin/env node

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

console.log('🔐 GJS RSVP System - Authentication Setup\n');

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET=' + nextAuthSecret);

// Generate admin password hash
const adminPassword = 'GJS2025Admin123';
const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);

console.log('\nADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=' + adminPassword);
console.log('ADMIN_PASSWORD_HASH=' + adminPasswordHash);

console.log('\n📋 Copy these to your .env.local file:');
console.log('=====================================');
console.log('NEXTAUTH_SECRET=' + nextAuthSecret);
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=' + adminPassword);
console.log('ADMIN_PASSWORD_HASH=' + adminPasswordHash);
console.log('NEXTAUTH_URL=http://localhost:3000');

console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('- Change the ADMIN_PASSWORD in production');
console.log('- Use HTTPS in production');
console.log('- Keep your .env.local file secure');
console.log('- Never commit .env.local to version control');

console.log('\n🚀 Default admin credentials:');
console.log('Username: admin');
console.log('Password: ' + adminPassword);
