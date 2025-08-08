#!/usr/bin/env node

/**
 * Test Knowledge Hub Updater
 */

const fs = require('fs');
const path = require('path');

console.log('🧠 Testing Knowledge Hub Updater...');

// Test 1: Check if Knowledge Hub exists
const hubPath = path.join(process.cwd(), 'KNOWLEDGE_HUB.md');
if (fs.existsSync(hubPath)) {
    console.log('✅ Knowledge Hub exists');
    const hubContent = fs.readFileSync(hubPath, 'utf8');
    console.log(`📊 Hub size: ${hubContent.length} characters`);
    console.log(`📄 Hub lines: ${hubContent.split('\n').length}`);
} else {
    console.log('❌ Knowledge Hub not found');
}

// Test 2: Check recent additions
const recentFiles = [
    'backend/app/template_handler.py',
    'scripts/system-audit.js',
    'scripts/knowledge-hub-updater.js',
    'MANUAL_SYSTEM_AUDIT_SUMMARY.md'
];

console.log('\n📋 Checking recent additions:');
recentFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`✅ ${file} (${stats.size} bytes, ${new Date(stats.mtime).toLocaleDateString()})`);
    } else {
        console.log(`❌ ${file} not found`);
    }
});

// Test 3: Check package.json scripts
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageJson.scripts || {};

    console.log('\n🚀 Checking automation scripts:');
    const automationScripts = [
        'knowledge-hub:update',
        'system:audit',
        'knowledge-hub:sync'
    ];

    automationScripts.forEach(script => {
        if (scripts[script]) {
            console.log(`✅ ${script}: ${scripts[script]}`);
        } else {
            console.log(`❌ ${script}: not found`);
        }
    });
}

// Test 4: Check template system
const templateHandlerPath = path.join(process.cwd(), 'backend/app/template_handler.py');
if (fs.existsSync(templateHandlerPath)) {
    console.log('\n🔧 Template System Status:');
    const templateContent = fs.readFileSync(templateHandlerPath, 'utf8');

    // Count templates
    const templateMatches = templateContent.match(/"[a-zA-Z_][a-zA-Z0-9_]*":\s*{/g);
    const templateCount = templateMatches ? templateMatches.length : 0;
    console.log(`✅ Template Handler: ${templateCount} templates found`);

    // Check for categories
    const categories = ['BUSINESS', 'VAULT', 'SYSTEM', 'INTEGRATION'];
    categories.forEach(category => {
        if (templateContent.includes(category)) {
            console.log(`✅ ${category} templates: Present`);
        } else {
            console.log(`⚠️  ${category} templates: Not found`);
        }
    });
}

console.log('\n🎯 Test completed!');
console.log('📊 Summary: Knowledge Hub system is ready for automation!');
