#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Testing app registry validation...');

const rootDir = process.cwd();
const constantsPath = path.join(rootDir, 'src/constants/constants.tsx');
const appsDir = path.join(rootDir, 'src/apps');

console.log('Root dir:', rootDir);
console.log('Constants path:', constantsPath);
console.log('Apps dir:', appsDir);
console.log('Constants exists:', fs.existsSync(constantsPath));
console.log('Apps dir exists:', fs.existsSync(this.appsDir));

if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  console.log('Constants file content length:', content.length);
  
  const appMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  console.log('App matches found:', appMatches ? appMatches.length : 0);
  
  if (appMatches) {
    const apps = appMatches.map(match => {
      const appId = match.match(/['"]([^'"]+)['"]/)[1];
      return appId;
    });
    console.log('Registered apps:', apps);
  }
}

if (fs.existsSync(appsDir)) {
  const files = fs.readdirSync(appsDir);
  const appFiles = files.filter(file => file.endsWith('App.tsx'));
  console.log('App files found:', appFiles);
}

console.log('Test completed'); 