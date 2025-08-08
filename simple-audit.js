#!/usr/bin/env node

/**
 * Simple System Audit - Quick Discovery
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Simple System Audit Starting...');

const projectRoot = process.cwd();
const results = {
    files: [],
    templates: [],
    endpoints: [],
    tools: [],
    documentation: []
};

// Scan main directories
const directories = ['backend', 'src', 'tools', 'scripts', 'consciousness', 'OCTOSPINE'];

directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`📁 Scanning ${dir}...`);
        try {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const fullPath = path.join(projectRoot, itemPath);
                const stat = fs.statSync(fullPath);

                if (stat.isFile()) {
                    results.files.push(itemPath);

                    // Categorize files
                    if (itemPath.includes('template')) {
                        results.templates.push(itemPath);
                    }
                    if (itemPath.includes('endpoint') || itemPath.includes('route')) {
                        results.endpoints.push(itemPath);
                    }
                    if (itemPath.includes('tool') || itemPath.includes('utility')) {
                        results.tools.push(itemPath);
                    }
                    if (itemPath.endsWith('.md') || itemPath.endsWith('.txt')) {
                        results.documentation.push(itemPath);
                    }
                }
            });
        } catch (error) {
            console.log(`⚠️  Error scanning ${dir}:`, error.message);
        }
    }
});

// Check Knowledge Hub
const hubPath = path.join(projectRoot, 'KNOWLEDGE_HUB.md');
if (fs.existsSync(hubPath)) {
    console.log('✅ Knowledge Hub exists');
    const hubContent = fs.readFileSync(hubPath, 'utf8');
    console.log(`📊 Knowledge Hub size: ${hubContent.length} characters`);
} else {
    console.log('❌ Knowledge Hub not found');
}

// Generate summary
console.log('\n📊 AUDIT SUMMARY:');
console.log(`📁 Total Files: ${results.files.length}`);
console.log(`📋 Templates: ${results.templates.length}`);
console.log(`🔗 Endpoints: ${results.endpoints.length}`);
console.log(`🛠️  Tools: ${results.tools.length}`);
console.log(`📚 Documentation: ${results.documentation.length}`);

// Show some examples
if (results.templates.length > 0) {
    console.log('\n📋 Sample Templates:');
    results.templates.slice(0, 3).forEach(template => console.log(`  - ${template}`));
}

if (results.tools.length > 0) {
    console.log('\n🛠️  Sample Tools:');
    results.tools.slice(0, 3).forEach(tool => console.log(`  - ${tool}`));
}

console.log('\n✅ Simple audit completed!');
