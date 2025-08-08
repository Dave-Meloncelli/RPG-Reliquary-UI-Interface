#!/usr/bin/env python3
"""
Environment Fixer - Comprehensive Development Environment Setup

Fixes common environment issues including npm PATH, encoding, dependencies,
and ensures proper setup for the Tech Stack Silo.

Author: The OctoSpine Forge Master
Date: 2025-08-06
"""

import os
import sys
import json
import subprocess
import logging
import platform
from pathlib import Path
from typing import Dict, List, Any, Tuple
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EnvironmentFixer:
    """Comprehensive environment fixing system"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.system = platform.system()
        self.user_home = Path.home()
        self.fixes_applied = []
        self.issues_found = []
        
    def detect_environment_issues(self) -> Dict[str, Any]:
        """Detect all environment issues"""
        logger.info("Detecting environment issues...")
        
        issues = {
            "npm_path": self.check_npm_path(),
            "python_dependencies": self.check_python_dependencies(),
            "node_dependencies": self.check_node_dependencies(),
            "encoding_issues": self.check_encoding_issues(),
            "file_permissions": self.check_file_permissions(),
            "git_config": self.check_git_config(),
            "system_info": self.get_system_info()
        }
        
        return issues
    
    def check_npm_path(self) -> Dict[str, Any]:
        """Check npm PATH configuration"""
        logger.info("Checking npm PATH configuration...")
        
        issues = {
            "npm_installed": False,
            "npm_in_path": False,
            "npm_prefix": None,
            "global_modules": None,
            "recommendations": []
        }
        
        try:
            # Check if npm is installed
            result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["npm_installed"] = True
                logger.info(f"npm version: {result.stdout.strip()}")
            else:
                issues["recommendations"].append("Install Node.js and npm")
                return issues
        except FileNotFoundError:
            issues["recommendations"].append("Install Node.js and npm")
            return issues
        
        # Check npm prefix
        try:
            result = subprocess.run(["npm", "config", "get", "prefix"], capture_output=True, text=True)
            if result.returncode == 0:
                npm_prefix = result.stdout.strip()
                issues["npm_prefix"] = npm_prefix
                logger.info(f"npm prefix: {npm_prefix}")
        except Exception as e:
            logger.warning(f"Could not get npm prefix: {e}")
        
        # Check if npm is in PATH
        path_dirs = os.environ.get('PATH', '').split(os.pathsep)
        npm_found = False
        
        for path_dir in path_dirs:
            npm_path = Path(path_dir) / "npm"
            if self.system == "Windows":
                npm_path = Path(path_dir) / "npm.cmd"
            
            if npm_path.exists():
                npm_found = True
                break
        
        issues["npm_in_path"] = npm_found
        
        if not npm_found:
            issues["recommendations"].append("Add npm to system PATH")
        
        # Check global modules
        try:
            result = subprocess.run(["npm", "list", "-g", "--depth=0"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["global_modules"] = "Available"
            else:
                issues["global_modules"] = "Error accessing"
        except Exception as e:
            issues["global_modules"] = f"Error: {e}"
        
        return issues
    
    def check_python_dependencies(self) -> Dict[str, Any]:
        """Check Python dependencies"""
        logger.info("Checking Python dependencies...")
        
        issues = {
            "python_version": None,
            "pip_available": False,
            "required_packages": [],
            "missing_packages": [],
            "recommendations": []
        }
        
        # Check Python version
        issues["python_version"] = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        logger.info(f"Python version: {issues['python_version']}")
        
        # Check pip
        try:
            result = subprocess.run([sys.executable, "-m", "pip", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["pip_available"] = True
                logger.info(f"pip version: {result.stdout.strip()}")
            else:
                issues["recommendations"].append("Install or upgrade pip")
        except Exception as e:
            issues["recommendations"].append(f"pip error: {e}")
        
        # Check required packages
        required_packages = [
            "aiohttp",
            "setuptools",
            "requests",
            "pathlib",
            "typing"
        ]
        
        for package in required_packages:
            try:
                __import__(package)
                issues["required_packages"].append(package)
            except ImportError:
                issues["missing_packages"].append(package)
                issues["recommendations"].append(f"Install {package}: pip install {package}")
        
        return issues
    
    def check_node_dependencies(self) -> Dict[str, Any]:
        """Check Node.js dependencies"""
        logger.info("Checking Node.js dependencies...")
        
        issues = {
            "node_version": None,
            "package_json_exists": False,
            "node_modules_exists": False,
            "missing_dependencies": [],
            "recommendations": []
        }
        
        # Check Node.js version
        try:
            result = subprocess.run(["node", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["node_version"] = result.stdout.strip()
                logger.info(f"Node.js version: {issues['node_version']}")
            else:
                issues["recommendations"].append("Install Node.js")
        except FileNotFoundError:
            issues["recommendations"].append("Install Node.js")
        
        # Check package.json
        package_json = self.project_root / "package.json"
        if package_json.exists():
            issues["package_json_exists"] = True
            logger.info("package.json found")
        else:
            issues["recommendations"].append("Create package.json")
        
        # Check node_modules
        node_modules = self.project_root / "node_modules"
        if node_modules.exists():
            issues["node_modules_exists"] = True
            logger.info("node_modules found")
        else:
            issues["recommendations"].append("Run npm install")
        
        return issues
    
    def check_encoding_issues(self) -> Dict[str, Any]:
        """Check encoding configuration"""
        logger.info("Checking encoding configuration...")
        
        issues = {
            "system_encoding": None,
            "file_system_encoding": None,
            "python_encoding": None,
            "recommendations": []
        }
        
        # System encoding
        issues["system_encoding"] = sys.getdefaultencoding()
        
        # File system encoding
        issues["file_system_encoding"] = sys.getfilesystemencoding()
        
        # Python encoding
        issues["python_encoding"] = sys.stdout.encoding
        
        # Check for potential encoding issues
        if self.system == "Windows":
            if issues["system_encoding"] != "utf-8":
                issues["recommendations"].append("Set PYTHONIOENCODING=utf-8")
            if issues["file_system_encoding"] != "utf-8":
                issues["recommendations"].append("Configure Windows for UTF-8")
        
        return issues
    
    def check_file_permissions(self) -> Dict[str, Any]:
        """Check file permissions"""
        logger.info("Checking file permissions...")
        
        issues = {
            "readable_files": 0,
            "writable_files": 0,
            "permission_errors": [],
            "recommendations": []
        }
        
        # Check key files
        key_files = [
            "package.json",
            "tsconfig.json",
            "README.md",
            "tools/utilities/maintenance/simple-delegator.py"
        ]
        
        for file_path in key_files:
            full_path = self.project_root / file_path
            if full_path.exists():
                try:
                    # Test read
                    with open(full_path, 'r', encoding='utf-8') as f:
                        f.read(1)
                    issues["readable_files"] += 1
                except PermissionError:
                    issues["permission_errors"].append(f"Cannot read {file_path}")
                except UnicodeDecodeError:
                    issues["permission_errors"].append(f"Encoding issue with {file_path}")
                
                try:
                    # Test write (create backup)
                    backup_path = full_path.with_suffix(full_path.suffix + '.backup')
                    with open(backup_path, 'w', encoding='utf-8') as f:
                        f.write("test")
                    backup_path.unlink()  # Remove test file
                    issues["writable_files"] += 1
                except PermissionError:
                    issues["permission_errors"].append(f"Cannot write to {file_path}")
        
        if issues["permission_errors"]:
            issues["recommendations"].append("Fix file permissions or run as administrator")
        
        return issues
    
    def check_git_config(self) -> Dict[str, Any]:
        """Check Git configuration"""
        logger.info("Checking Git configuration...")
        
        issues = {
            "git_installed": False,
            "git_configured": False,
            "user_name": None,
            "user_email": None,
            "recommendations": []
        }
        
        # Check if git is installed
        try:
            result = subprocess.run(["git", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["git_installed"] = True
                logger.info(f"Git version: {result.stdout.strip()}")
            else:
                issues["recommendations"].append("Install Git")
        except FileNotFoundError:
            issues["recommendations"].append("Install Git")
            return issues
        
        # Check git configuration
        try:
            result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["user_name"] = result.stdout.strip()
                issues["git_configured"] = True
        except Exception:
            pass
        
        try:
            result = subprocess.run(["git", "config", "user.email"], capture_output=True, text=True)
            if result.returncode == 0:
                issues["user_email"] = result.stdout.strip()
                issues["git_configured"] = True
        except Exception:
            pass
        
        if not issues["git_configured"]:
            issues["recommendations"].append("Configure Git user.name and user.email")
        
        return issues
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        return {
            "system": self.system,
            "platform": platform.platform(),
            "architecture": platform.architecture(),
            "processor": platform.processor(),
            "python_executable": sys.executable,
            "working_directory": str(self.project_root.absolute())
        }
    
    def fix_npm_path(self) -> bool:
        """Fix npm PATH issues"""
        logger.info("Fixing npm PATH issues...")
        
        if self.system == "Windows":
            # Set npm prefix to user directory
            npm_prefix = self.user_home / "AppData" / "Roaming" / "npm"
            npm_prefix.mkdir(parents=True, exist_ok=True)
            
            try:
                subprocess.run(["npm", "config", "set", "prefix", str(npm_prefix)], check=True)
                logger.info(f"Set npm prefix to: {npm_prefix}")
                
                # Add to PATH if not already there
                path_var = os.environ.get('PATH', '')
                if str(npm_prefix) not in path_var:
                    new_path = f"{npm_prefix};{path_var}"
                    os.environ['PATH'] = new_path
                    logger.info("Added npm prefix to PATH")
                
                self.fixes_applied.append("Fixed npm PATH configuration")
                return True
                
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to set npm prefix: {e}")
                return False
        
        return True
    
    def install_python_dependencies(self) -> bool:
        """Install missing Python dependencies"""
        logger.info("Installing Python dependencies...")
        
        missing_packages = [
            "aiohttp",
            "setuptools",
            "requests"
        ]
        
        success = True
        for package in missing_packages:
            try:
                subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
                logger.info(f"Installed {package}")
                self.fixes_applied.append(f"Installed Python package: {package}")
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to install {package}: {e}")
                success = False
        
        return success
    
    def install_node_dependencies(self) -> bool:
        """Install Node.js dependencies"""
        logger.info("Installing Node.js dependencies...")
        
        try:
            # Install dependencies
            subprocess.run(["npm", "install"], check=True, cwd=self.project_root)
            logger.info("Installed Node.js dependencies")
            self.fixes_applied.append("Installed Node.js dependencies")
            
            # Install global packages if needed
            global_packages = ["typescript", "@types/node"]
            for package in global_packages:
                try:
                    subprocess.run(["npm", "install", "-g", package], check=True)
                    logger.info(f"Installed global package: {package}")
                    self.fixes_applied.append(f"Installed global package: {package}")
                except subprocess.CalledProcessError as e:
                    logger.warning(f"Failed to install global package {package}: {e}")
            
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install Node.js dependencies: {e}")
            return False
    
    def fix_encoding_issues(self) -> bool:
        """Fix encoding issues"""
        logger.info("Fixing encoding issues...")
        
        if self.system == "Windows":
            # Set environment variables for UTF-8
            os.environ['PYTHONIOENCODING'] = 'utf-8'
            os.environ['PYTHONUTF8'] = '1'
            
            logger.info("Set Python encoding environment variables")
            self.fixes_applied.append("Set Python encoding environment variables")
        
        return True
    
    def fix_file_permissions(self) -> bool:
        """Fix file permission issues"""
        logger.info("Fixing file permission issues...")
        
        # Create a test file to check permissions
        test_file = self.project_root / "test_permissions.txt"
        
        try:
            with open(test_file, 'w', encoding='utf-8') as f:
                f.write("Test file for permissions")
            
            test_file.unlink()  # Remove test file
            logger.info("File permissions are working correctly")
            return True
            
        except PermissionError:
            logger.warning("File permission issues detected - may need to run as administrator")
            self.issues_found.append("File permission issues - run as administrator")
            return False
    
    def configure_git(self) -> bool:
        """Configure Git if not already configured"""
        logger.info("Configuring Git...")
        
        try:
            # Check if already configured
            result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True)
            if result.returncode != 0:
                # Set default values
                subprocess.run(["git", "config", "user.name", "AZ Interface Developer"], check=True)
                subprocess.run(["git", "config", "user.email", "developer@az-interface.com"], check=True)
                logger.info("Configured Git with default values")
                self.fixes_applied.append("Configured Git user settings")
            
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to configure Git: {e}")
            return False
    
    def apply_all_fixes(self) -> Dict[str, Any]:
        """Apply all environment fixes"""
        logger.info("Applying all environment fixes...")
        
        # Detect issues first
        issues = self.detect_environment_issues()
        
        # Apply fixes
        fixes_results = {
            "npm_path_fixed": self.fix_npm_path(),
            "python_deps_fixed": self.install_python_dependencies(),
            "node_deps_fixed": self.install_node_dependencies(),
            "encoding_fixed": self.fix_encoding_issues(),
            "permissions_fixed": self.fix_file_permissions(),
            "git_configured": self.configure_git()
        }
        
        # Re-detect issues after fixes
        issues_after = self.detect_environment_issues()
        
        return {
            "issues_before": issues,
            "fixes_applied": self.fixes_applied,
            "fixes_results": fixes_results,
            "issues_after": issues_after,
            "success": all(fixes_results.values())
        }
    
    def generate_fix_report(self, fix_results: Dict[str, Any]) -> str:
        """Generate comprehensive fix report"""
        report = f"""
============================================================
🔧 ENVIRONMENT FIX REPORT
============================================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
System: {self.system}
Project: {self.project_root.name}

📊 FIX SUMMARY:
- Fixes Applied: {len(self.fixes_applied)}
- All Fixes Successful: {fix_results['success']}

🔧 FIXES APPLIED:
"""
        
        for fix in self.fixes_applied:
            report += f"  ✅ {fix}\n"
        
        report += f"""
📋 FIX RESULTS:
- npm PATH: {'✅ Fixed' if fix_results['fixes_results']['npm_path_fixed'] else '❌ Failed'}
- Python Dependencies: {'✅ Fixed' if fix_results['fixes_results']['python_deps_fixed'] else '❌ Failed'}
- Node Dependencies: {'✅ Fixed' if fix_results['fixes_results']['node_deps_fixed'] else '❌ Failed'}
- Encoding Issues: {'✅ Fixed' if fix_results['fixes_results']['encoding_fixed'] else '❌ Failed'}
- File Permissions: {'✅ Fixed' if fix_results['fixes_results']['permissions_fixed'] else '❌ Failed'}
- Git Configuration: {'✅ Fixed' if fix_results['fixes_results']['git_configured'] else '❌ Failed'}

🚀 RECOMMENDATIONS:
"""
        
        # Get recommendations from issues after fixes
        for category, issues in fix_results['issues_after'].items():
            if isinstance(issues, dict) and 'recommendations' in issues:
                for rec in issues['recommendations']:
                    report += f"  - {rec}\n"
        
        report += f"""
🌟 The Second Day We Found Unity - Environment Optimized 🌟
"""
        return report

def main():
    """Test environment fixer"""
    fixer = EnvironmentFixer()
    
    print("🔧 Starting Environment Fixer...")
    
    # Apply all fixes
    fix_results = fixer.apply_all_fixes()
    
    # Generate report
    report = fixer.generate_fix_report(fix_results)
    print(report)
    
    # Save report
    report_file = fixer.project_root / "environment_fix_report.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(fix_results, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Environment fix report saved to: {report_file}")

if __name__ == "__main__":
    main() 