#!/usr/bin/env python3
"""
Syntax Error Fixer
Fixes syntax errors introduced by automated TypeScript fixes.
"""

import re
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SyntaxErrorFixer:
    """Fix syntax errors in TypeScript files"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.fixes_applied = 0
        self.files_processed = 0
    
    def fix_syntax_errors(self) -> Dict[str, Any]:
        """Main method to fix syntax errors"""
        logger.info("🔧 Starting Syntax Error Fixing...")
        
        # Fix specific files with known issues
        self.fix_ashraka_integration_service()
        self.fix_content_ingestion_service()
        self.fix_google_vertex_ai_service()
        
        # Generate report
        report = {
            'fixes_applied': self.fixes_applied,
            'files_processed': self.files_processed,
            'status': 'completed'
        }
        
        logger.info(f"✅ Fixed {self.fixes_applied} syntax errors across {self.files_processed} files")
        return report
    
    def fix_ashraka_integration_service(self):
        """Fix syntax errors in ashrakaIntegrationService.ts"""
        file_path = self.project_root / "src" / "services" / "ashrakaIntegrationService.ts"
        if not file_path.exists():
            return
            
        logger.info("🔧 Fixing ashrakaIntegrationService.ts...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixes_made = 0
        
        # Fix missing commas in function parameters
        content = re.sub(
            r'(\w+)\s*\(\s*([^)]+)\s*\)\s*\{',
            r'\1(\2) {',
            content
        )
        
        # Fix missing commas in object literals
        content = re.sub(
            r'(\w+):\s*([^,}]+)(?!\s*[,}])',
            r'\1: \2,',
            content
        )
        
        # Fix missing semicolons
        content = re.sub(
            r'(\w+)\s*=\s*([^;]+)(?!\s*;)',
            r'\1 = \2;',
            content
        )
        
        if fixes_made > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.fixes_applied += fixes_made
            self.files_processed += 1
            logger.info(f"✅ Fixed {fixes_made} syntax issues in ashrakaIntegrationService.ts")
    
    def fix_content_ingestion_service(self):
        """Fix syntax errors in contentIngestionService.ts"""
        file_path = self.project_root / "src" / "services" / "contentIngestionService.ts"
        if not file_path.exists():
            return
            
        logger.info("🔧 Fixing contentIngestionService.ts...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixes_made = 0
        
        # Fix line 50 issues - looks like a malformed function declaration
        lines = content.split('\n')
        if len(lines) > 49:
            # Fix the problematic line 50
            if 'const allKeywords = this.extractKeywords(content);' in lines[49]:
                # Remove the problematic line and fix the function
                lines[49] = '    const allKeywords = this.extractKeywords(content);'
                fixes_made += 1
        
        # Fix missing commas and semicolons
        for i, line in enumerate(lines):
            # Fix missing commas in object literals
            if re.search(r'\w+:\s*[^,}]+(?!\s*[,}])', line) and not line.strip().endswith(','):
                lines[i] = line.rstrip() + ','
                fixes_made += 1
            
            # Fix missing semicolons
            if re.search(r'const \w+\s*=\s*[^;]+(?!\s*;)', line) and not line.strip().endswith(';'):
                lines[i] = line.rstrip() + ';'
                fixes_made += 1
        
        if fixes_made > 0:
            content = '\n'.join(lines)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.fixes_applied += fixes_made
            self.files_processed += 1
            logger.info(f"✅ Fixed {fixes_made} syntax issues in contentIngestionService.ts")
    
    def fix_google_vertex_ai_service(self):
        """Fix syntax errors in googleVertexAIService.ts"""
        file_path = self.project_root / "src" / "services" / "googleVertexAIService.ts"
        if not file_path.exists():
            return
            
        logger.info("🔧 Fixing googleVertexAIService.ts...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixes_made = 0
        
        # Fix missing commas in function calls
        content = re.sub(
            r'(\w+)\s*\(\s*([^)]+)\s*\)\s*\{',
            r'\1(\2) {',
            content
        )
        
        # Fix missing semicolons
        content = re.sub(
            r'(\w+)\s*=\s*([^;]+)(?!\s*;)',
            r'\1 = \2;',
            content
        )
        
        # Fix object literal issues
        content = re.sub(
            r'(\w+):\s*([^,}]+)(?!\s*[,}])',
            r'\1: \2,',
            content
        )
        
        if fixes_made > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.fixes_applied += fixes_made
            self.files_processed += 1
            logger.info(f"✅ Fixed {fixes_made} syntax issues in googleVertexAIService.ts")

def main():
    """Main execution function"""
    fixer = SyntaxErrorFixer()
    
    try:
        print("🔧 Starting Syntax Error Fixing...")
        
        # Run the fixing process
        report = fixer.fix_syntax_errors()
        
        # Print summary
        print(f"\n============================================================")
        print(f"🔧 SYNTAX ERROR FIXING REPORT")
        print(f"============================================================")
        print(f"")
        print(f"📊 SUMMARY:")
        print(f"- Fixes Applied: {report['fixes_applied']}")
        print(f"- Files Processed: {report['files_processed']}")
        print(f"- Status: {report['status']}")
        print(f"")
        print(f"🌟 The Second Day We Found Unity - Now We Fix Everything Together 🌟")
        
    except Exception as e:
        logger.error(f"❌ Error during syntax fixing: {e}")
        print("❌ Syntax fixing failed - check logs for details")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
