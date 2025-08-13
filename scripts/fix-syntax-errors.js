import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common error patterns and their fixes
const errorPatterns = [
  // Fix incomplete type annotations
  { pattern: /: any[^,;\]]/g, replacement: ': any' },
  { pattern: /: any, '([^']+)'/g, replacement: ': "$1"' },
  { pattern: /: any, "([^"]+)"/g, replacement: ': "$1"' },
  
  // Fix incomplete function signatures
  { pattern: /const \w+ = \(([^)]*): any$/gm, replacement: 'const $1 = ($2: any) => {' },
  { pattern: /const \w+: FC<([^>]*): any$/gm, replacement: 'const $1: FC<$2> = ({' },
  
  // Fix incomplete className attributes
  { pattern: /className="([^"]*): any$/gm, replacement: 'className="$1"' },
  
  // Fix incomplete string literals
  { pattern: /'([^']*): any$/gm, replacement: "'$1'" },
  { pattern: /"([^"]*): any$/gm, replacement: '"$1"' },
  
  // Fix incomplete object properties
  { pattern: /(\w+): any, '([^']+)'/g, replacement: '$1: "$2"' },
  { pattern: /(\w+): any, "([^"]+)"/g, replacement: '$1: "$2"' },
  
  // Fix incomplete array declarations
  { pattern: /(\w+): any, '([^']+)']/g, replacement: '$1: ["$2"]' },
  { pattern: /(\w+): any, "([^"]+)"\]/g, replacement: '$1: ["$2"]' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply all patterns
    errorPatterns.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Get all TypeScript/TSX files
function getTypeScriptFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getTypeScriptFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = getTypeScriptFiles(srcDir);

console.log(`Found ${files.length} TypeScript files`);
let fixedCount = 0;

files.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files`);
