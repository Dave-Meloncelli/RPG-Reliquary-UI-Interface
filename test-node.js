console.log('🔍 Testing Node.js functionality...');

const fs = require('fs');
const path = require('path');

console.log('✅ Node.js is working');
console.log('✅ File system access is working');

// Test if we can read the current directory
try {
    const files = fs.readdirSync('.');
    console.log(`✅ Found ${files.length} items in current directory`);
    console.log('📁 Sample files:', files.slice(0, 5));
} catch (error) {
    console.error('❌ Error reading directory:', error.message);
}

// Test if we can read the scripts directory
try {
    const scripts = fs.readdirSync('scripts');
    console.log(`✅ Found ${scripts.length} scripts`);
    console.log('📁 Scripts:', scripts.slice(0, 5));
} catch (error) {
    console.error('❌ Error reading scripts directory:', error.message);
}

console.log('🎯 Test completed!');
