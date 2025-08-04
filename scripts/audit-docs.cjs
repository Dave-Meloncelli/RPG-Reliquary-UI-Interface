const fs = require('fs');
const path = require('path');

function auditDocumentation() {
  console.log('🔍 Auditing documentation files...');
  
  const requiredDocs = [
    'README.md',
    'TECH_STACK_REGISTRY.md',
    'COMPREHENSIVE_BACKLOG_ANALYSIS.md',
    'COMPREHENSIVE_PRE_PUSH_AUDIT.md',
    'GITHUB_PUSH_STRATEGY_FRAMEWORK.md',
    'CRITICAL_AUDIT_FINDINGS.md',
    'POST_COMMIT_AUDIT_FRAMEWORK.md'
  ];

  const missingDocs = requiredDocs.filter(doc => !fs.existsSync(doc));
  
  if (missingDocs.length > 0) {
    console.error('❌ Missing documentation files:', missingDocs);
    process.exit(1);
  }

  console.log('✅ All required documentation files present');
  
  // Check for recent updates (within last 24 hours)
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const outdatedDocs = requiredDocs.filter(doc => {
    const stats = fs.statSync(doc);
    return stats.mtime.getTime() < oneDayAgo;
  });
  
  if (outdatedDocs.length > 0) {
    console.warn('⚠️  Potentially outdated documentation:', outdatedDocs);
  }
}

function verifyInternalLinks() {
  console.log('🔍 Verifying internal links...');
  
  const markdownFiles = fs.readdirSync('.').filter(file => file.endsWith('.md'));
  
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractInternalLinks(content);
    
    for (const link of links) {
      if (!fs.existsSync(link)) {
        console.error(`❌ Broken internal link in ${file}: ${link}`);
        process.exit(1);
      }
    }
  }
  
  console.log('✅ All internal links valid');
}

function extractInternalLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('./') || url.startsWith('../') || (!url.startsWith('http') && !url.startsWith('#'))) {
      links.push(url);
    }
  }
  
  return links;
}

function checkBrokenRefs() {
  console.log('🔍 Checking for broken references...');
  
  const markdownFiles = fs.readdirSync('.').filter(file => file.endsWith('.md'));
  
  for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for broken image references
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let imageMatch;
    
    while ((imageMatch = imageRegex.exec(content)) !== null) {
      const imagePath = imageMatch[2];
      if (!imagePath.startsWith('http') && !fs.existsSync(imagePath)) {
        console.error(`❌ Broken image reference in ${file}: ${imagePath}`);
        process.exit(1);
      }
    }
    
    // Check for broken file references
    const fileRegex = /\[([^\]]+)\]\(([^)]+\.(md|ts|tsx|js|jsx|json|yml|yaml))\)/g;
    let fileMatch;
    
    while ((fileMatch = fileRegex.exec(content)) !== null) {
      const filePath = fileMatch[2];
      if (!filePath.startsWith('http') && !fs.existsSync(filePath)) {
        console.error(`❌ Broken file reference in ${file}: ${filePath}`);
        process.exit(1);
      }
    }
  }
  
  console.log('✅ No broken references found');
}

function verifyBacklogLinks() {
  console.log('🔍 Verifying backlog links...');
  
  if (fs.existsSync('COMPREHENSIVE_BACKLOG_ANALYSIS.md')) {
    const content = fs.readFileSync('COMPREHENSIVE_BACKLOG_ANALYSIS.md', 'utf8');
    
    // Check for TODO/FIXME items that should be updated
    const todoRegex = /- \[ \] .+/g;
    const todos = content.match(todoRegex) || [];
    
    console.log(`📋 Found ${todos.length} pending backlog items`);
    
    // Check for outdated timestamps
    const timestampRegex = /Last Updated: .+/g;
    const timestamps = content.match(timestampRegex) || [];
    
    for (const timestamp of timestamps) {
      const dateMatch = timestamp.match(/Last Updated: (.+)/);
      if (dateMatch) {
        const date = new Date(dateMatch[1]);
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        if (date.getTime() < oneWeekAgo) {
          console.warn(`⚠️  Potentially outdated timestamp: ${timestamp}`);
        }
      }
    }
  }
  
  console.log('✅ Backlog links verified');
}

if (require.main === module) {
  try {
    auditDocumentation();
    verifyInternalLinks();
    checkBrokenRefs();
    verifyBacklogLinks();
    console.log('🎉 Documentation audit completed successfully!');
  } catch (error) {
    console.error('❌ Documentation audit failed:', error.message);
    process.exit(1);
  }
}

module.exports = { 
  auditDocumentation, 
  verifyInternalLinks, 
  checkBrokenRefs, 
  verifyBacklogLinks 
}; 