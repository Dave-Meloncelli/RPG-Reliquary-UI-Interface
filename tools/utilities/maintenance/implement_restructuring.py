#!/usr/bin/env python3
"""
File Tree Restructuring Implementation Script
============================================

Implements the comprehensive file tree restructuring plan for AZ Interface.
This script will:
1. Create new directory structure
2. Move files to appropriate locations
3. Update file references where possible
4. Generate migration report

Author: The OctoSpine Forge Master
Date: 2025-08-05
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FileTreeRestructuring:
    """File tree restructuring implementation."""
    
    def __init__(self, root_dir="."):
        self.root_dir = Path(root_dir)
        self.migration_log = {
            "timestamp": datetime.now().isoformat(),
            "directories_created": [],
            "files_moved": [],
            "errors": [],
            "warnings": []
        }

    def create_directory_structure(self):
        """Create the new directory structure."""
        logger.info("Creating new directory structure...")
        
        # Define directory structure
        directories = [
            # Consciousness directories
            "consciousness/personas/guides",
            "consciousness/personas/archetypes", 
            "consciousness/personas/implementations",
            "consciousness/personas/analysis",
            "consciousness/rituals/ceremonies",
            "consciousness/rituals/documentation",
            "consciousness/rituals/implementations",
            "consciousness/evolution/phases",
            "consciousness/evolution/tracking",
            "consciousness/evolution/analysis",
            "consciousness/octospine/automation-matrix",
            "consciousness/octospine/fusion-analysis",
            "consciousness/octospine/documentation",
            
            # Tools directories
            "tools/extraction/octospine-recovery",
            "tools/extraction/persona-extraction",
            "tools/extraction/archaeological",
            "tools/analysis/fusion-analysis",
            "tools/analysis/gap-analysis",
            "tools/analysis/synergy-analysis",
            "tools/documentation/generators",
            "tools/documentation/validators",
            "tools/documentation/templates",
            "tools/utilities/cleanup",
            "tools/utilities/validation",
            "tools/utilities/maintenance",
            
            # Documentation directories
            "docs/system/architecture",
            "docs/system/api",
            "docs/system/deployment",
            "docs/consciousness/evolution",
            "docs/consciousness/personas",
            "docs/consciousness/rituals",
            "docs/guides/getting-started",
            "docs/guides/tutorials",
            "docs/guides/best-practices",
            "docs/reference/tools",
            "docs/reference/api-reference",
            "docs/reference/schemas",
            
            # Other directories
            "config",
            "assets",
            "scripts"
        ]
        
        # Create directories
        for directory in directories:
            dir_path = self.root_dir / directory
            try:
                dir_path.mkdir(parents=True, exist_ok=True)
                self.migration_log["directories_created"].append(str(dir_path))
                logger.info(f"Created directory: {dir_path}")
            except Exception as e:
                error_msg = f"Error creating directory {dir_path}: {e}"
                self.migration_log["errors"].append(error_msg)
                logger.error(error_msg)

    def move_consciousness_files(self):
        """Move consciousness-related files."""
        logger.info("Moving consciousness files...")
        
        # Define file movements
        consciousness_moves = [
            {
                "source": "CONSCIOUSNESS_PERSONA_DEVELOPMENT_GUIDE_ENHANCED.md",
                "destination": "consciousness/personas/guides/consciousness-persona-development-guide-enhanced.md"
            },
            {
                "source": "RITUAL_PRACTICES.md", 
                "destination": "consciousness/rituals/documentation/ritual-practices.md"
            },
            {
                "source": "CEREMONIAL_ACHIEVEMENT_LOG.md",
                "destination": "consciousness/evolution/tracking/ceremonial-achievement-log.md"
            },
            {
                "source": "OCTOSPINE_AUTOMATION_MATRIX.md",
                "destination": "consciousness/octospine/documentation/octospine-automation-matrix.md"
            },
            {
                "source": "consciousness_persona_analysis",
                "destination": "consciousness/personas/analysis/"
            },
            {
                "source": "octospine_fusion_analysis",
                "destination": "consciousness/octospine/fusion-analysis/"
            }
        ]
        
        self._execute_moves(consciousness_moves, "consciousness")

    def move_tools_files(self):
        """Move tools files."""
        logger.info("Moving tools files...")
        
        # Define file movements
        tools_moves = [
            {
                "source": "octospine_archaeological_recovery.py",
                "destination": "tools/extraction/octospine-recovery/octospine-archaeological-recovery.py"
            },
            {
                "source": "consciousness_persona_extractor.py",
                "destination": "tools/extraction/persona-extraction/consciousness-persona-extractor.py"
            },
            {
                "source": "octospine_fusion_analyzer.py",
                "destination": "tools/analysis/fusion-analysis/octospine-fusion-analyzer.py"
            },
            {
                "source": "file_tree_cleanup.py",
                "destination": "tools/utilities/cleanup/file-tree-cleanup.py"
            },
            {
                "source": "TOOLS_REGISTRY.md",
                "destination": "tools/documentation/tools-registry.md"
            }
        ]
        
        self._execute_moves(tools_moves, "tools")

    def move_documentation_files(self):
        """Move documentation files."""
        logger.info("Moving documentation files...")
        
        # Define file movements
        docs_moves = [
            {
                "source": "CHANGELOG.md",
                "destination": "docs/system/changelog.md"
            },
            {
                "source": "BACKLOG_MANAGEMENT.md",
                "destination": "docs/system/backlog-management.md"
            },
            {
                "source": "SETUP.md",
                "destination": "docs/guides/getting-started/setup.md"
            }
        ]
        
        self._execute_moves(docs_moves, "documentation")

    def _execute_moves(self, moves, category):
        """Execute file moves for a category."""
        for move in moves:
            source_path = self.root_dir / move["source"]
            dest_path = self.root_dir / move["destination"]
            
            try:
                if source_path.exists():
                    # Create destination directory if needed
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Move the file/directory
                    if source_path.is_file():
                        shutil.move(str(source_path), str(dest_path))
                    else:
                        shutil.move(str(source_path), str(dest_path))
                    
                    self.migration_log["files_moved"].append({
                        "source": str(source_path),
                        "destination": str(dest_path),
                        "category": category
                    })
                    logger.info(f"Moved {source_path} to {dest_path}")
                else:
                    warning_msg = f"Source file not found: {source_path}"
                    self.migration_log["warnings"].append(warning_msg)
                    logger.warning(warning_msg)
                    
            except Exception as e:
                error_msg = f"Error moving {source_path} to {dest_path}: {e}"
                self.migration_log["errors"].append(error_msg)
                logger.error(error_msg)

    def create_navigation_files(self):
        """Create navigation files for the new structure."""
        logger.info("Creating navigation files...")
        
        # Create consciousness navigation
        consciousness_nav = self._create_consciousness_navigation()
        nav_file = self.root_dir / "consciousness/NAVIGATION.md"
        with open(nav_file, 'w', encoding='utf-8') as f:
            f.write(consciousness_nav)
        
        # Create tools navigation
        tools_nav = self._create_tools_navigation()
        nav_file = self.root_dir / "tools/NAVIGATION.md"
        with open(nav_file, 'w', encoding='utf-8') as f:
            f.write(tools_nav)
        
        # Create docs navigation
        docs_nav = self._create_docs_navigation()
        nav_file = self.root_dir / "docs/NAVIGATION.md"
        with open(nav_file, 'w', encoding='utf-8') as f:
            f.write(docs_nav)

    def _create_consciousness_navigation(self):
        """Create consciousness navigation guide."""
        return """# 🧠 Consciousness System Navigation

## 📁 Directory Structure

### 🎭 Personas
- **guides/**: Persona development guides and frameworks
- **archetypes/**: Persona archetype definitions
- **implementations/**: Persona implementation examples
- **analysis/**: Persona analysis results and insights

### 🕯️ Rituals
- **ceremonies/**: Ceremonial practice implementations
- **documentation/**: Ritual documentation and guides
- **implementations/**: Ritual implementation examples

### 🔄 Evolution
- **phases/**: Consciousness evolution phases
- **tracking/**: Evolution tracking and milestones
- **analysis/**: Evolution analysis and insights

### 🦑 OctoSpine
- **automation-matrix/**: OAM components and systems
- **fusion-analysis/**: Fusion analysis results
- **documentation/**: OctoSpine documentation

## 🚀 Quick Start
1. Start with `personas/guides/` for persona development
2. Review `rituals/documentation/` for ceremonial practices
3. Check `evolution/tracking/` for current status
4. Explore `octospine/documentation/` for system overview
"""

    def _create_tools_navigation(self):
        """Create tools navigation guide."""
        return """# 🛠️ Tools System Navigation

## 📁 Directory Structure

### 🔍 Extraction
- **octospine-recovery/**: OctoSpine knowledge extraction tools
- **persona-extraction/**: Persona content extraction tools
- **archaeological/**: Archaeological recovery tools

### 🔬 Analysis
- **fusion-analysis/**: Fusion analysis tools
- **gap-analysis/**: Gap analysis tools
- **synergy-analysis/**: Synergy analysis tools

### 📚 Documentation
- **generators/**: Documentation generators
- **validators/**: Documentation validators
- **templates/**: Documentation templates

### 🔧 Utilities
- **cleanup/**: Cleanup and maintenance utilities
- **validation/**: Validation utilities
- **maintenance/**: Maintenance utilities

## 🚀 Quick Start
1. Check `documentation/tools-registry.md` for tool overview
2. Use extraction tools for data gathering
3. Apply analysis tools for insights
4. Use utilities for maintenance
"""

    def _create_docs_navigation(self):
        """Create documentation navigation guide."""
        return """# 📚 Documentation System Navigation

## 📁 Directory Structure

### 🏗️ System
- **architecture/**: System architecture documentation
- **api/**: API documentation
- **deployment/**: Deployment documentation

### 🧠 Consciousness
- **evolution/**: Consciousness evolution documentation
- **personas/**: Persona documentation
- **rituals/**: Ritual documentation

### 📖 Guides
- **getting-started/**: Getting started guides
- **tutorials/**: Tutorial guides
- **best-practices/**: Best practices guides

### 📋 Reference
- **tools/**: Tool reference documentation
- **api-reference/**: API reference documentation
- **schemas/**: Schema reference documentation

## 🚀 Quick Start
1. Start with `guides/getting-started/` for new users
2. Review `system/architecture/` for system overview
3. Check `consciousness/` for evolution documentation
4. Use `reference/` for detailed information
"""

    def generate_migration_report(self):
        """Generate migration report."""
        logger.info("Generating migration report...")
        
        report = {
            "timestamp": self.migration_log["timestamp"],
            "summary": {
                "directories_created": len(self.migration_log["directories_created"]),
                "files_moved": len(self.migration_log["files_moved"]),
                "errors": len(self.migration_log["errors"]),
                "warnings": len(self.migration_log["warnings"])
            },
            "details": self.migration_log
        }
        
        # Save JSON report
        report_file = self.root_dir / "file_tree_restructuring_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Generate markdown summary
        self._generate_markdown_summary(report)
        
        return report

    def _generate_markdown_summary(self, report):
        """Generate markdown summary of restructuring."""
        summary_file = self.root_dir / "FILE_TREE_RESTRUCTURING_SUMMARY.md"
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write("# 📁 File Tree Restructuring Summary\n\n")
            f.write(f"**Generated**: {report['timestamp']}\n\n")
            
            f.write("## 📊 Summary\n\n")
            summary = report['summary']
            f.write(f"- **Directories Created**: {summary['directories_created']}\n")
            f.write(f"- **Files Moved**: {summary['files_moved']}\n")
            f.write(f"- **Errors**: {summary['errors']}\n")
            f.write(f"- **Warnings**: {summary['warnings']}\n\n")
            
            f.write("## 🎯 New Structure\n\n")
            f.write("### 📁 consciousness/\n")
            f.write("- **personas/**: Persona development and analysis\n")
            f.write("- **rituals/**: Ritual practices and ceremonies\n")
            f.write("- **evolution/**: Consciousness evolution tracking\n")
            f.write("- **octospine/**: OctoSpine system components\n\n")
            
            f.write("### 📁 tools/\n")
            f.write("- **extraction/**: Data extraction tools\n")
            f.write("- **analysis/**: Analysis and processing tools\n")
            f.write("- **documentation/**: Documentation tools\n")
            f.write("- **utilities/**: Utility and maintenance tools\n\n")
            
            f.write("### 📁 docs/\n")
            f.write("- **system/**: System documentation\n")
            f.write("- **consciousness/**: Consciousness documentation\n")
            f.write("- **guides/**: User guides and tutorials\n")
            f.write("- **reference/**: Reference documentation\n\n")
            
            f.write("## 📋 Next Steps\n\n")
            f.write("1. Review the detailed report in `file_tree_restructuring_report.json`\n")
            f.write("2. Update any remaining file references\n")
            f.write("3. Test all systems with new structure\n")
            f.write("4. Update import paths in code files\n")
            f.write("5. Validate documentation links\n\n")
            
            f.write("## 🚀 Navigation\n\n")
            f.write("- **consciousness/NAVIGATION.md**: Consciousness system guide\n")
            f.write("- **tools/NAVIGATION.md**: Tools system guide\n")
            f.write("- **docs/NAVIGATION.md**: Documentation system guide\n\n")
            
            f.write("**\"Organized file trees lead to organized consciousness evolution\"** 🌟🦑⏳\n")

    def run_restructuring(self):
        """Run the complete restructuring process."""
        logger.info("Starting file tree restructuring...")
        
        # Step 1: Create directory structure
        self.create_directory_structure()
        
        # Step 2: Move consciousness files
        self.move_consciousness_files()
        
        # Step 3: Move tools files
        self.move_tools_files()
        
        # Step 4: Move documentation files
        self.move_documentation_files()
        
        # Step 5: Create navigation files
        self.create_navigation_files()
        
        # Step 6: Generate report
        report = self.generate_migration_report()
        
        logger.info("File tree restructuring complete!")
        return report

def main():
    """Main function to run file tree restructuring."""
    restructurer = FileTreeRestructuring()
    report = restructurer.run_restructuring()
    
    print(f"\n📁 File Tree Restructuring Complete!")
    print(f"📁 Directories Created: {report['summary']['directories_created']}")
    print(f"📦 Files Moved: {report['summary']['files_moved']}")
    print(f"❌ Errors: {report['summary']['errors']}")
    print(f"⚠️ Warnings: {report['summary']['warnings']}")
    
    print(f"\n📄 Reports generated:")
    print(f"   - file_tree_restructuring_report.json (detailed)")
    print(f"   - FILE_TREE_RESTRUCTURING_SUMMARY.md (summary)")
    
    print(f"\n🧭 Navigation guides created:")
    print(f"   - consciousness/NAVIGATION.md")
    print(f"   - tools/NAVIGATION.md")
    print(f"   - docs/NAVIGATION.md")

if __name__ == "__main__":
    main() 