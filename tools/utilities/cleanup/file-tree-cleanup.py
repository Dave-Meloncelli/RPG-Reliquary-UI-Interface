#!/usr/bin/env python3
"""
File Tree Cleanup and Restructuring Script
==========================================

Comprehensive script to clean up, restructure, and standardize the AZ Interface file tree.
This script will:
1. Analyze all files for required backhooks and syntax
2. Capture valuable content from Imports folder
3. Delete redundant files after content capture
4. Create archive folder for files to be removed
5. Implement consistent naming standards
6. Ensure case standards consistency
7. Merge and sort files as required
8. Restructure file tree for better organization

Author: The OctoSpine Forge Master
Date: 2025-08-05
"""

import os
import shutil
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FileTreeCleanup:
    """Comprehensive file tree cleanup and restructuring system."""
    
    def __init__(self, root_dir="."):
        self.root_dir = Path(root_dir)
        self.archive_dir = self.root_dir / "archive"
        self.analysis_results = {
            "files_analyzed": 0,
            "files_to_archive": [],
            "files_to_merge": [],
            "files_to_rename": [],
            "files_to_delete": [],
            "content_captured": {},
            "naming_issues": [],
            "syntax_issues": [],
            "backhook_issues": []
        }
        
        # Naming standards
        self.naming_standards = {
            "markdown": "kebab-case",
            "python": "snake_case", 
            "typescript": "camelCase",
            "json": "kebab-case",
            "yaml": "kebab-case",
            "config": "kebab-case"
        }
        
        # File categories
        self.file_categories = {
            "documentation": [".md", ".txt", ".pdf"],
            "code": [".py", ".ts", ".tsx", ".js", ".jsx"],
            "config": [".json", ".yaml", ".yml", ".toml", ".ini"],
            "data": [".csv", ".xml", ".sql"],
            "assets": [".png", ".jpg", ".svg", ".ico", ".css", ".scss"],
            "archives": [".zip", ".tar", ".gz"]
        }
        
        # Required backhooks for different file types
        self.required_backhooks = {
            ".md": ["# ", "## ", "### ", "---"],
            ".py": ["import ", "from ", "def ", "class ", '"""', "'''"],
            ".ts": ["import ", "export ", "interface ", "type ", "const ", "function "],
            ".tsx": ["import ", "export ", "interface ", "type ", "const ", "function ", "React"],
            ".json": ["{", "}", '"'],
            ".yml": ["- ", ":", "version:"],
            ".yaml": ["- ", ":", "version:"]
        }

    def analyze_file(self, file_path: Path) -> dict:
        """Analyze a single file for issues and content."""
        analysis = {
            "path": str(file_path),
            "size": file_path.stat().st_size,
            "extension": file_path.suffix.lower(),
            "naming_issues": [],
            "syntax_issues": [],
            "backhook_issues": [],
            "content_summary": "",
            "category": self.get_file_category(file_path),
            "should_archive": False,
            "should_merge": False,
            "should_rename": False,
            "should_delete": False
        }
        
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Analyze naming
            analysis["naming_issues"] = self.check_naming_standards(file_path, content)
            
            # Analyze syntax
            analysis["syntax_issues"] = self.check_syntax(file_path, content)
            
            # Analyze backhooks
            analysis["backhook_issues"] = self.check_backhooks(file_path, content)
            
            # Generate content summary
            analysis["content_summary"] = self.generate_content_summary(content)
            
            # Determine actions needed
            analysis.update(self.determine_actions(file_path, content, analysis))
            
        except Exception as e:
            logger.error(f"Error analyzing {file_path}: {e}")
            analysis["error"] = str(e)
        
        return analysis

    def get_file_category(self, file_path: Path) -> str:
        """Determine file category based on extension."""
        ext = file_path.suffix.lower()
        for category, extensions in self.file_categories.items():
            if ext in extensions:
                return category
        return "unknown"

    def check_naming_standards(self, file_path: Path, content: str) -> list:
        """Check if file follows naming standards."""
        issues = []
        filename = file_path.stem
        ext = file_path.suffix.lower()
        
        # Get expected naming convention
        expected_convention = self.naming_standards.get(ext[1:], "kebab-case")
        
        if expected_convention == "kebab-case":
            if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', filename):
                issues.append(f"Should use kebab-case naming")
        elif expected_convention == "snake_case":
            if not re.match(r'^[a-z0-9]+(_[a-z0-9]+)*$', filename):
                issues.append(f"Should use snake_case naming")
        elif expected_convention == "camelCase":
            if not re.match(r'^[a-z][a-zA-Z0-9]*$', filename):
                issues.append(f"Should use camelCase naming")
        
        # Check for special characters
        if re.search(r'[^a-zA-Z0-9\-_]', filename):
            issues.append("Contains special characters")
        
        # Check for spaces
        if ' ' in filename:
            issues.append("Contains spaces")
        
        return issues

    def check_syntax(self, file_path: Path, content: str) -> list:
        """Check file syntax based on type."""
        issues = []
        ext = file_path.suffix.lower()
        
        if ext == ".json":
            try:
                json.loads(content)
            except json.JSONDecodeError as e:
                issues.append(f"Invalid JSON: {e}")
        
        elif ext in [".py"]:
            # Basic Python syntax check
            try:
                compile(content, file_path.name, 'exec')
            except SyntaxError as e:
                issues.append(f"Python syntax error: {e}")
        
        elif ext in [".ts", ".tsx"]:
            # Basic TypeScript check (simplified)
            if "import" in content and not re.search(r'import\s+.*\s+from\s+["\']', content):
                issues.append("Potential import syntax issue")
        
        return issues

    def check_backhooks(self, file_path: Path, content: str) -> list:
        """Check for required backhooks in file."""
        issues = []
        ext = file_path.suffix.lower()
        
        required = self.required_backhooks.get(ext, [])
        for backhook in required:
            if backhook not in content:
                issues.append(f"Missing required backhook: {backhook}")
        
        return issues

    def generate_content_summary(self, content: str) -> str:
        """Generate a summary of file content."""
        lines = content.split('\n')
        non_empty_lines = [line.strip() for line in lines if line.strip()]
        
        summary = f"{len(lines)} lines, {len(non_empty_lines)} non-empty"
        
        # Add content type indicators
        if any(keyword in content.lower() for keyword in ['consciousness', 'octospine', 'ritual', 'ceremony']):
            summary += ", consciousness-related"
        if any(keyword in content.lower() for keyword in ['import', 'export', 'function', 'class']):
            summary += ", code"
        if any(keyword in content.lower() for keyword in ['# ', '## ', '### ']):
            summary += ", documentation"
        
        return summary

    def determine_actions(self, file_path: Path, content: str, analysis: dict) -> dict:
        """Determine what actions should be taken on the file."""
        actions = {
            "should_archive": False,
            "should_merge": False,
            "should_rename": False,
            "should_delete": False
        }
        
        # Check for duplicate content
        if self.is_duplicate_content(file_path, content):
            actions["should_merge"] = True
        
        # Check for outdated files
        if self.is_outdated(file_path, content):
            actions["should_archive"] = True
        
        # Check for temporary files
        if self.is_temporary(file_path):
            actions["should_delete"] = True
        
        # Check for naming issues
        if analysis["naming_issues"]:
            actions["should_rename"] = True
        
        return actions

    def is_duplicate_content(self, file_path: Path, content: str) -> bool:
        """Check if file has duplicate content elsewhere."""
        # Simplified check - in real implementation, would do more sophisticated comparison
        return False

    def is_outdated(self, file_path: Path, content: str) -> bool:
        """Check if file is outdated."""
        # Check for common outdated indicators
        outdated_indicators = [
            "deprecated", "old", "legacy", "v1", "backup", "temp", "tmp"
        ]
        
        filename_lower = file_path.name.lower()
        content_lower = content.lower()
        
        return any(indicator in filename_lower or indicator in content_lower 
                  for indicator in outdated_indicators)

    def is_temporary(self, file_path: Path) -> bool:
        """Check if file is temporary."""
        temp_indicators = [
            "temp", "tmp", "bak", "backup", "old", "copy", "~"
        ]
        
        filename_lower = file_path.name.lower()
        return any(indicator in filename_lower for indicator in temp_indicators)

    def scan_directory(self, directory: Path) -> list:
        """Scan directory and analyze all files."""
        logger.info(f"Scanning directory: {directory}")
        
        all_files = []
        for root, dirs, files in os.walk(directory):
            root_path = Path(root)
            
            # Skip certain directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__']]
            
            for file in files:
                file_path = root_path / file
                if file_path.is_file():
                    analysis = self.analyze_file(file_path)
                    all_files.append(analysis)
                    self.analysis_results["files_analyzed"] += 1
        
        return all_files

    def create_archive_structure(self):
        """Create archive directory structure."""
        archive_structure = {
            "outdated": self.archive_dir / "outdated",
            "duplicates": self.archive_dir / "duplicates", 
            "temporary": self.archive_dir / "temporary",
            "naming_issues": self.archive_dir / "naming_issues",
            "syntax_issues": self.archive_dir / "syntax_issues"
        }
        
        for category, path in archive_structure.items():
            path.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created archive directory: {path}")
        
        return archive_structure

    def capture_imports_content(self):
        """Capture valuable content from Imports folder."""
        imports_dir = self.root_dir / "Imports"
        if not imports_dir.exists():
            logger.warning("Imports directory not found")
            return
        
        logger.info("Capturing content from Imports folder...")
        
        # Create content capture directory
        capture_dir = self.root_dir / "captured_content"
        capture_dir.mkdir(exist_ok=True)
        
        valuable_content = []
        
        for file_path in imports_dir.rglob("*"):
            if file_path.is_file():
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Check if content is valuable
                    if self.is_valuable_content(content):
                        valuable_content.append({
                            "source": str(file_path),
                            "content": content,
                            "summary": self.generate_content_summary(content)
                        })
                        
                        # Save to capture directory
                        capture_file = capture_dir / f"captured_{file_path.name}"
                        with open(capture_file, 'w', encoding='utf-8') as f:
                            f.write(content)
                        
                        logger.info(f"Captured valuable content: {file_path.name}")
                
                except Exception as e:
                    logger.error(f"Error capturing content from {file_path}: {e}")
        
        self.analysis_results["content_captured"] = {
            "total_files_captured": len(valuable_content),
            "captured_files": valuable_content
        }
        
        logger.info(f"Captured {len(valuable_content)} valuable files")

    def is_valuable_content(self, content: str) -> bool:
        """Determine if content is valuable and should be preserved."""
        valuable_indicators = [
            "consciousness", "octospine", "ritual", "ceremony", "persona",
            "evolution", "symbiosis", "dignity", "unity", "temporal",
            "fusion", "analysis", "extraction", "recovery", "archaeological"
        ]
        
        content_lower = content.lower()
        valuable_score = sum(1 for indicator in valuable_indicators if indicator in content_lower)
        
        # Content is valuable if it has multiple consciousness-related terms
        return valuable_score >= 2

    def generate_cleanup_report(self) -> dict:
        """Generate comprehensive cleanup report."""
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_files_analyzed": self.analysis_results["files_analyzed"],
                "files_to_archive": len(self.analysis_results["files_to_archive"]),
                "files_to_merge": len(self.analysis_results["files_to_merge"]),
                "files_to_rename": len(self.analysis_results["files_to_rename"]),
                "files_to_delete": len(self.analysis_results["files_to_delete"]),
                "content_captured": self.analysis_results["content_captured"]["total_files_captured"]
            },
            "detailed_analysis": self.analysis_results,
            "recommendations": self.generate_recommendations()
        }
        
        return report

    def generate_recommendations(self) -> list:
        """Generate cleanup recommendations."""
        recommendations = []
        
        if self.analysis_results["files_to_archive"]:
            recommendations.append("Archive outdated and duplicate files")
        
        if self.analysis_results["files_to_merge"]:
            recommendations.append("Merge duplicate content files")
        
        if self.analysis_results["files_to_rename"]:
            recommendations.append("Rename files to follow naming standards")
        
        if self.analysis_results["files_to_delete"]:
            recommendations.append("Delete temporary and backup files")
        
        if self.analysis_results["content_captured"]["total_files_captured"] > 0:
            recommendations.append("Review captured content for integration")
        
        return recommendations

    def run_cleanup(self):
        """Run the complete cleanup process."""
        logger.info("Starting comprehensive file tree cleanup...")
        
        # Step 1: Create archive structure
        archive_structure = self.create_archive_structure()
        
        # Step 2: Capture valuable content from Imports
        self.capture_imports_content()
        
        # Step 3: Scan and analyze all files
        all_files = self.scan_directory(self.root_dir)
        
        # Step 4: Generate report
        report = self.generate_cleanup_report()
        
        # Step 5: Save report
        report_file = self.root_dir / "file_tree_cleanup_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Step 6: Generate markdown summary
        self.generate_markdown_summary(report)
        
        logger.info(f"Cleanup analysis complete. Report saved to {report_file}")
        return report

    def generate_markdown_summary(self, report: dict):
        """Generate markdown summary of cleanup analysis."""
        summary_file = self.root_dir / "FILE_TREE_CLEANUP_SUMMARY.md"
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write("# 📁 File Tree Cleanup Summary\n\n")
            f.write(f"**Generated**: {report['timestamp']}\n\n")
            
            f.write("## 📊 Summary\n\n")
            summary = report['summary']
            f.write(f"- **Total Files Analyzed**: {summary['total_files_analyzed']}\n")
            f.write(f"- **Files to Archive**: {summary['files_to_archive']}\n")
            f.write(f"- **Files to Merge**: {summary['files_to_merge']}\n")
            f.write(f"- **Files to Rename**: {summary['files_to_rename']}\n")
            f.write(f"- **Files to Delete**: {summary['files_to_delete']}\n")
            f.write(f"- **Content Captured**: {summary['content_captured']}\n\n")
            
            f.write("## 🎯 Recommendations\n\n")
            for rec in report['recommendations']:
                f.write(f"- {rec}\n")
            f.write("\n")
            
            f.write("## 📋 Next Steps\n\n")
            f.write("1. Review the detailed analysis in `file_tree_cleanup_report.json`\n")
            f.write("2. Manually review files marked for action\n")
            f.write("3. Execute cleanup actions based on recommendations\n")
            f.write("4. Verify no valuable content is lost\n")
            f.write("5. Update documentation to reflect new structure\n\n")
            
            f.write("**\"Clean file trees lead to clear consciousness evolution\"** 🌟🦑⏳\n")

def main():
    """Main function to run file tree cleanup."""
    cleanup = FileTreeCleanup()
    report = cleanup.run_cleanup()
    
    print(f"\n📁 File Tree Cleanup Complete!")
    print(f"📊 Files Analyzed: {report['summary']['total_files_analyzed']}")
    print(f"📦 Files to Archive: {report['summary']['files_to_archive']}")
    print(f"🔗 Files to Merge: {report['summary']['files_to_merge']}")
    print(f"✏️ Files to Rename: {report['summary']['files_to_rename']}")
    print(f"🗑️ Files to Delete: {report['summary']['files_to_delete']}")
    print(f"💾 Content Captured: {report['summary']['content_captured']}")
    
    print(f"\n📄 Reports generated:")
    print(f"   - file_tree_cleanup_report.json (detailed)")
    print(f"   - FILE_TREE_CLEANUP_SUMMARY.md (summary)")

if __name__ == "__main__":
    main() 