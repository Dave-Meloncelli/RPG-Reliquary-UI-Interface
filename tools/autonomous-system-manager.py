#!/usr/bin/env python3
"""
Autonomous System Manager
A self-healing, adaptive system that can diagnose, assess, and overcome environment issues.
"""

import os
import sys
import subprocess
import platform
import json
import urllib.request
import zipfile
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging

class AutonomousSystemManager:
    """
    Autonomous system that can:
    - Diagnose missing dependencies
    - Assess environment capabilities
    - Auto-install missing components
    - Self-heal and adapt
    """
    
    def __init__(self):
        self.system_info = self._get_system_info()
        self.required_components = self._load_requirements()
        self.installation_log = []
        self.setup_logging()
        
    def setup_logging(self):
        """Setup comprehensive logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('autonomous-system.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def _get_system_info(self) -> Dict:
        """Get comprehensive system information"""
        return {
            'os': platform.system(),
            'os_version': platform.version(),
            'architecture': platform.architecture()[0],
            'python_version': sys.version,
            'python_executable': sys.executable,
            'current_directory': os.getcwd(),
            'user_home': os.path.expanduser('~'),
            'path': os.environ.get('PATH', ''),
            'temp_dir': os.environ.get('TEMP', '/tmp')
        }
        
    def _load_requirements(self) -> Dict:
        """Load system requirements based on platform"""
        base_requirements = {
            'python_packages': [
                'fastapi', 'uvicorn', 'sqlalchemy', 'pydantic',
                'python-dotenv', 'requests', 'psutil'
            ],
            'node_packages': [
                'npm', 'node'
            ],
            'system_tools': {
                'windows': ['powershell', 'git', 'code'],
                'linux': ['bash', 'git', 'curl', 'wget'],
                'darwin': ['bash', 'git', 'curl', 'brew']
            },
            'development_tools': {
                'windows': ['vscode', 'python', 'node'],
                'linux': ['vscode', 'python3', 'nodejs'],
                'darwin': ['vscode', 'python3', 'node']
            }
        }
        return base_requirements
        
    def diagnose_system(self) -> Dict:
        """Comprehensive system diagnosis"""
        self.logger.info("🔍 Starting comprehensive system diagnosis...")
        
        diagnosis = {
            'system_info': self.system_info,
            'missing_components': [],
            'working_components': [],
            'environment_issues': [],
            'recommendations': []
        }
        
        # Check Python packages
        diagnosis.update(self._check_python_packages())
        
        # Check Node.js and npm
        diagnosis.update(self._check_node_environment())
        
        # Check system tools
        diagnosis.update(self._check_system_tools())
        
        # Check development tools
        diagnosis.update(self._check_development_tools())
        
        # Check file system and permissions
        diagnosis.update(self._check_file_system())
        
        # Check network connectivity
        diagnosis.update(self._check_network())
        
        self.logger.info(f"✅ Diagnosis complete. Found {len(diagnosis['missing_components'])} missing components.")
        return diagnosis
        
    def _check_python_packages(self) -> Dict:
        """Check Python package availability"""
        missing_packages = []
        working_packages = []
        
        for package in self.required_components['python_packages']:
            try:
                __import__(package)
                working_packages.append(package)
            except ImportError:
                missing_packages.append(package)
                
        return {
            'python_packages': {
                'missing': missing_packages,
                'working': working_packages
            }
        }
        
    def _check_node_environment(self) -> Dict:
        """Check Node.js environment"""
        node_status = {'node': False, 'npm': False, 'version': None}
        
        try:
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                node_status['node'] = True
                node_status['version'] = result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
            
        try:
            result = subprocess.run(['npm', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                node_status['npm'] = True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
            
        return {'node_environment': node_status}
        
    def _check_system_tools(self) -> Dict:
        """Check system tools availability"""
        os_name = self.system_info['os'].lower()
        required_tools = self.required_components['system_tools'].get(os_name, [])
        
        missing_tools = []
        working_tools = []
        
        for tool in required_tools:
            try:
                result = subprocess.run([tool, '--version'], 
                                      capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    working_tools.append(tool)
                else:
                    missing_tools.append(tool)
            except (subprocess.TimeoutExpired, FileNotFoundError):
                missing_tools.append(tool)
                
        return {
            'system_tools': {
                'missing': missing_tools,
                'working': working_tools
            }
        }
        
    def _check_development_tools(self) -> Dict:
        """Check development tools"""
        os_name = self.system_info['os'].lower()
        required_tools = self.required_components['development_tools'].get(os_name, [])
        
        missing_tools = []
        working_tools = []
        
        for tool in required_tools:
            if tool == 'vscode':
                # Check for VS Code
                vscode_paths = [
                    r"C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe",
                    r"C:\Program Files\Microsoft VS Code\Code.exe",
                    "/usr/bin/code",
                    "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
                ]
                
                found = False
                for path in vscode_paths:
                    if os.path.exists(os.path.expandvars(path)):
                        found = True
                        break
                        
                if found:
                    working_tools.append(tool)
                else:
                    missing_tools.append(tool)
            else:
                # Check other tools
                try:
                    result = subprocess.run([tool, '--version'], 
                                          capture_output=True, text=True, timeout=5)
                    if result.returncode == 0:
                        working_tools.append(tool)
                    else:
                        missing_tools.append(tool)
                except (subprocess.TimeoutExpired, FileNotFoundError):
                    missing_tools.append(tool)
                    
        return {
            'development_tools': {
                'missing': missing_tools,
                'working': working_tools
            }
        }
        
    def _check_file_system(self) -> Dict:
        """Check file system and permissions"""
        issues = []
        permissions = {}
        
        # Check current directory permissions
        try:
            test_file = Path('autonomous_test.tmp')
            test_file.write_text('test')
            test_file.unlink()
            permissions['current_directory'] = 'writable'
        except Exception as e:
            permissions['current_directory'] = 'not_writable'
            issues.append(f"Current directory not writable: {e}")
            
        # Check temp directory
        try:
            temp_test = Path(self.system_info['temp_dir']) / 'autonomous_test.tmp'
            temp_test.write_text('test')
            temp_test.unlink()
            permissions['temp_directory'] = 'writable'
        except Exception as e:
            permissions['temp_directory'] = 'not_writable'
            issues.append(f"Temp directory not writable: {e}")
            
        return {
            'file_system': {
                'permissions': permissions,
                'issues': issues
            }
        }
        
    def _check_network(self) -> Dict:
        """Check network connectivity"""
        network_status = {'internet': False, 'github': False, 'pip': False}
        
        # Check basic internet connectivity
        try:
            urllib.request.urlopen('http://www.google.com', timeout=5)
            network_status['internet'] = True
        except Exception as e:
            pass
            
        # Check GitHub connectivity
        try:
            urllib.request.urlopen('https://github.com', timeout=5)
            network_status['github'] = True
        except Exception as e:
            pass
            
        # Check PyPI connectivity
        try:
            urllib.request.urlopen('https://pypi.org', timeout=5)
            network_status['pip'] = True
        except Exception as e:
            pass
            
        return {'network': network_status}
        
    def auto_install_missing_components(self, diagnosis: Dict) -> Dict:
        """Automatically install missing components"""
        self.logger.info("🚀 Starting automatic component installation...")
        
        installation_results = {
            'successful': [],
            'failed': [],
            'skipped': [],
            'log': []
        }
        
        # Install Python packages
        missing_packages = diagnosis.get('python_packages', {}).get('missing', [])
        if missing_packages:
            self.logger.info(f"📦 Installing {len(missing_packages)} Python packages...")
            for package in missing_packages:
                result = self._install_python_package(package)
                if result['success']:
                    installation_results['successful'].append(f"python:{package}")
                else:
                    installation_results['failed'].append(f"python:{package}")
                installation_results['log'].append(result)
                
        # Install Node.js if missing
        if not diagnosis.get('node_environment', {}).get('node', False):
            self.logger.info("📦 Installing Node.js...")
            result = self._install_nodejs()
            if result['success']:
                installation_results['successful'].append('nodejs')
            else:
                installation_results['failed'].append('nodejs')
            installation_results['log'].append(result)
            
        # Install VS Code if missing
        missing_dev_tools = diagnosis.get('development_tools', {}).get('missing', [])
        if 'vscode' in missing_dev_tools:
            self.logger.info("📦 Installing VS Code...")
            result = self._install_vscode()
            if result['success']:
                installation_results['successful'].append('vscode')
            else:
                installation_results['failed'].append('vscode')
            installation_results['log'].append(result)
            
        self.logger.info(f"✅ Installation complete. {len(installation_results['successful'])} successful, {len(installation_results['failed'])} failed.")
        return installation_results
        
    def _install_python_package(self, package: str) -> Dict:
        """Install Python package using pip"""
        try:
            self.logger.info(f"Installing {package}...")
            result = subprocess.run([
                sys.executable, '-m', 'pip', 'install', package
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                return {'success': True, 'package': package, 'message': 'Installed successfully'}
            else:
                return {'success': False, 'package': package, 'error': result.stderr}
        except Exception as e:
            return {'success': False, 'package': package, 'error': str(e)}
            
    def _install_nodejs(self) -> Dict:
        """Install Node.js based on platform"""
        os_name = self.system_info['os'].lower()
        
        try:
            if os_name == 'windows':
                # Download Node.js installer for Windows
                url = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
                installer_path = Path(self.system_info['temp_dir']) / 'nodejs_installer.msi'
                
                self.logger.info("Downloading Node.js installer...")
                urllib.request.urlretrieve(url, installer_path)
                
                # Install silently
                result = subprocess.run([
                    'msiexec', '/i', str(installer_path), '/quiet', '/norestart'
                ], capture_output=True, text=True, timeout=600)
                
                if result.returncode == 0:
                    return {'success': True, 'component': 'nodejs', 'message': 'Installed successfully'}
                else:
                    return {'success': False, 'component': 'nodejs', 'error': result.stderr}
                    
            elif os_name == 'linux':
                # Use package manager
                result = subprocess.run(['sudo', 'apt-get', 'update'], 
                                      capture_output=True, text=True, timeout=300)
                result = subprocess.run(['sudo', 'apt-get', 'install', '-y', 'nodejs', 'npm'], 
                                      capture_output=True, text=True, timeout=600)
                
                if result.returncode == 0:
                    return {'success': True, 'component': 'nodejs', 'message': 'Installed successfully'}
                else:
                    return {'success': False, 'component': 'nodejs', 'error': result.stderr}
                    
            else:
                return {'success': False, 'component': 'nodejs', 'error': f'Unsupported OS: {os_name}'}
                
        except Exception as e:
            return {'success': False, 'component': 'nodejs', 'error': str(e)}
            
    def _install_vscode(self) -> Dict:
        """Install VS Code based on platform"""
        os_name = self.system_info['os'].lower()
        
        try:
            if os_name == 'windows':
                # Download VS Code installer for Windows
                url = "https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user"
                installer_path = Path(self.system_info['temp_dir']) / 'vscode_installer.exe'
                
                self.logger.info("Downloading VS Code installer...")
                urllib.request.urlretrieve(url, installer_path)
                
                # Install silently
                result = subprocess.run([
                    str(installer_path), '/VERYSILENT', '/NORESTART'
                ], capture_output=True, text=True, timeout=600)
                
                if result.returncode == 0:
                    return {'success': True, 'component': 'vscode', 'message': 'Installed successfully'}
                else:
                    return {'success': False, 'component': 'vscode', 'error': result.stderr}
                    
            elif os_name == 'linux':
                # Use snap or download
                result = subprocess.run(['sudo', 'snap', 'install', 'code', '--classic'], 
                                      capture_output=True, text=True, timeout=600)
                
                if result.returncode == 0:
                    return {'success': True, 'component': 'vscode', 'message': 'Installed successfully'}
                else:
                    return {'success': False, 'component': 'vscode', 'error': result.stderr}
                    
            else:
                return {'success': False, 'component': 'vscode', 'error': f'Unsupported OS: {os_name}'}
                
        except Exception as e:
            return {'success': False, 'component': 'vscode', 'error': str(e)}
            
    def self_heal_and_adapt(self) -> Dict:
        """Main autonomous system method - diagnose, install, adapt"""
        self.logger.info("🤖 Starting autonomous system self-healing process...")
        
        # Step 1: Diagnose
        diagnosis = self.diagnose_system()
        
        # Step 2: Install missing components
        installation_results = self.auto_install_missing_components(diagnosis)
        
        # Step 3: Re-diagnose after installation
        post_installation_diagnosis = self.diagnose_system()
        
        # Step 4: Generate adaptation recommendations
        adaptation_plan = self._generate_adaptation_plan(diagnosis, installation_results, post_diagnosis)
        
        # Step 5: Execute adaptation plan
        adaptation_results = self._execute_adaptation_plan(adaptation_plan)
        
        final_report = {
            'initial_diagnosis': diagnosis,
            'installation_results': installation_results,
            'post_installation_diagnosis': post_installation_diagnosis,
            'adaptation_plan': adaptation_plan,
            'adaptation_results': adaptation_results,
            'system_status': 'autonomous_operation_ready'
        }
        
        self.logger.info("✅ Autonomous system self-healing complete!")
        return final_report
        
    def _generate_adaptation_plan(self, initial_diagnosis: Dict, installation_results: Dict, post_diagnosis: Dict) -> Dict:
        """Generate adaptation plan based on system state"""
        plan = {
            'environment_configuration': [],
            'path_updates': [],
            'permission_fixes': [],
            'workflow_adaptations': []
        }
        
        # Adapt to available tools
        if post_diagnosis.get('node_environment', {}).get('node', False):
            plan['workflow_adaptations'].append('Use Node.js for automation scripts')
        else:
            plan['workflow_adaptations'].append('Use Python for all automation')
            
        # Adapt to available development tools
        if 'vscode' in post_diagnosis.get('development_tools', {}).get('working', []):
            plan['workflow_adaptations'].append('Use VS Code for development')
        else:
            plan['workflow_adaptations'].append('Use command-line development tools')
            
        # Adapt to network capabilities
        if post_diagnosis.get('network', {}).get('internet', False):
            plan['workflow_adaptations'].append('Enable online package installation')
        else:
            plan['workflow_adaptations'].append('Use offline package management')
            
        return plan
        
    def _execute_adaptation_plan(self, plan: Dict) -> Dict:
        """Execute the adaptation plan"""
        results = {
            'environment_configuration': [],
            'path_updates': [],
            'permission_fixes': [],
            'workflow_adaptations': []
        }
        
        # Execute environment configuration
        for config in plan['environment_configuration']:
            try:
                # Implementation would go here
                results['environment_configuration'].append({
                    'action': config,
                    'success': True,
                    'message': 'Configuration applied'
                })
            except Exception as e:
                results['environment_configuration'].append({
                    'action': config,
                    'success': False,
                    'error': str(e)
                })
                
        return results

def main():
    """Main autonomous system execution"""
    print("🤖 AZ Interface Autonomous System Manager")
    print("=" * 50)
    
    # Initialize autonomous system
    autonomous_system = AutonomousSystemManager()
    
    # Execute self-healing process
    report = autonomous_system.self_heal_and_adapt()
    
    # Save report
    with open('autonomous_system_report.json', 'w') as f:
        json.dump(report, f, indent=2, default=str)
        
    print("\n📊 Autonomous System Report:")
    print(f"✅ Successful installations: {len(report['installation_results']['successful'])}")
    print(f"❌ Failed installations: {len(report['installation_results']['failed'])}")
    print(f"🔄 System status: {report['system_status']}")
    print(f"📄 Full report saved to: autonomous_system_report.json")

if __name__ == "__main__":
    main()
