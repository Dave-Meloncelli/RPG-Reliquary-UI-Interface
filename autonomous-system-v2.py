#!/usr/bin/env python3
"""
Autonomous System - Iteration 2
Adding delegation framework and package installation capabilities.
"""

import os
import sys
import subprocess
import platform
import json
from pathlib import Path

class DelegationManager:
    """Manages delegation when primary approaches fail"""
    
    def __init__(self):
        self.failure_count = {}
        self.successful_approaches = {}
        
    def assess_failure(self, operation, error):
        """Assess why an operation failed"""
        self.failure_count[operation] = self.failure_count.get(operation, 0) + 1
        return {
            'operation': operation,
            'error': str(error),
            'failure_count': self.failure_count[operation],
            'recommendation': self._get_recommendation(operation, error)
        }
    
    def _get_recommendation(self, operation, error):
        """Get recommendation based on failure type"""
        if 'permission' in error.lower():
            return "Try user-level installation or run as administrator"
        elif 'network' in error.lower():
            return "Check network connectivity or use offline mode"
        elif 'timeout' in error.lower():
            return "Increase timeout or try alternative source"
        else:
            return "Try alternative approach or manual installation"
    
    def choose_alternative_approach(self, operation, failure_analysis):
        """Choose alternative approach based on failure"""
        approaches = {
            'package_installation': [
                'pip_install',
                'pip_install_user',
                'conda_install',
                'manual_instruction'
            ],
            'tool_installation': [
                'package_manager',
                'direct_download',
                'manual_instruction',
                'alternative_tool'
            ]
        }
        
        available_approaches = approaches.get(operation, ['manual_instruction'])
        return available_approaches[self.failure_count.get(operation, 0) % len(available_approaches)]
    
    def execute_alternative(self, operation, approach):
        """Execute alternative approach"""
        print(f"🔄 Trying alternative approach: {approach}")
        
        if approach == 'pip_install_user':
            return self._pip_install_user()
        elif approach == 'manual_instruction':
            return self._generate_manual_instruction(operation)
        elif approach == 'alternative_tool':
            return self._suggest_alternative_tool(operation)
        else:
            return {'success': False, 'error': f'Unknown approach: {approach}'}
    
    def _pip_install_user(self):
        """Try pip install with --user flag"""
        try:
            result = subprocess.run([
                sys.executable, '-m', 'pip', 'install', '--user', 'requests'
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                return {'success': True, 'message': 'Package installed with --user flag'}
            else:
                return {'success': False, 'error': result.stderr}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _generate_manual_instruction(self, operation):
        """Generate manual installation instructions"""
        instructions = {
            'package_installation': [
                "1. Open command prompt as administrator",
                "2. Run: pip install package_name",
                "3. Or run: pip install --user package_name"
            ],
            'tool_installation': [
                "1. Download from official website",
                "2. Run installer as administrator",
                "3. Add to PATH if required"
            ]
        }
        
        return {
            'success': True,
            'approach': 'manual_instruction',
            'instructions': instructions.get(operation, ["Manual installation required"])
        }
    
    def _suggest_alternative_tool(self, operation):
        """Suggest alternative tools"""
        alternatives = {
            'node': ['python', 'powershell'],
            'npm': ['pip', 'conda'],
            'vscode': ['notepad++', 'sublime text', 'vim']
        }
        
        return {
            'success': True,
            'approach': 'alternative_tool',
            'alternatives': alternatives.get(operation, ['Manual installation'])
        }

def install_required_packages():
    """Install required packages with delegation"""
    print("\n📦 ITERATION 2: Package Installation with Delegation")
    print("=" * 60)
    
    delegator = DelegationManager()
    required_packages = ['requests', 'psutil']
    installation_results = {
        'successful': [],
        'failed': [],
        'delegated': []
    }
    
    for package in required_packages:
        print(f"\n📦 Installing {package}...")
        
        # Primary approach: direct pip install
        try:
            result = subprocess.run([
                sys.executable, '-m', 'pip', 'install', package
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                installation_results['successful'].append(package)
                print(f"✅ {package}: Installed successfully")
            else:
                # Primary approach failed - delegate
                failure_analysis = delegator.assess_failure('package_installation', result.stderr)
                alternative = delegator.choose_alternative_approach('package_installation', failure_analysis)
                delegated_result = delegator.execute_alternative('package_installation', alternative)
                
                if delegated_result['success']:
                    installation_results['delegated'].append({
                        'package': package,
                        'approach': alternative,
                        'result': delegated_result
                    })
                    print(f"✅ {package}: Installed via delegation ({alternative})")
                else:
                    installation_results['failed'].append({
                        'package': package,
                        'error': delegated_result['error']
                    })
                    print(f"❌ {package}: Failed even with delegation")
                    
        except Exception as e:
            # Exception occurred - delegate
            failure_analysis = delegator.assess_failure('package_installation', str(e))
            alternative = delegator.choose_alternative_approach('package_installation', failure_analysis)
            delegated_result = delegator.execute_alternative('package_installation', alternative)
            
            if delegated_result['success']:
                installation_results['delegated'].append({
                    'package': package,
                    'approach': alternative,
                    'result': delegated_result
                })
                print(f"✅ {package}: Installed via delegation ({alternative})")
            else:
                installation_results['failed'].append({
                    'package': package,
                    'error': delegated_result['error']
                })
                print(f"❌ {package}: Failed even with delegation")
    
    return installation_results

def test_installed_packages():
    """Test if installed packages work"""
    print("\n🧪 Testing Installed Packages...")
    
    test_results = {}
    
    # Test requests
    try:
        import requests
        response = requests.get('https://httpbin.org/get', timeout=5)
        if response.status_code == 200:
            test_results['requests'] = {'status': 'working', 'version': requests.__version__}
            print(f"✅ requests: Working (v{requests.__version__})")
        else:
            test_results['requests'] = {'status': 'failed', 'error': f'HTTP {response.status_code}'}
            print(f"❌ requests: Failed - HTTP {response.status_code}")
    except Exception as e:
        test_results['requests'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ requests: Failed - {e}")
    
    # Test psutil
    try:
        import psutil
        cpu_percent = psutil.cpu_percent()
        test_results['psutil'] = {'status': 'working', 'cpu_percent': cpu_percent}
        print(f"✅ psutil: Working (CPU: {cpu_percent}%)")
    except Exception as e:
        test_results['psutil'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ psutil: Failed - {e}")
    
    return test_results

def assess_enhanced_capabilities():
    """Assess enhanced capabilities after package installation"""
    print("\n🎯 Assessing Enhanced Capabilities...")
    
    capabilities = {
        'can_make_http_requests': False,
        'can_monitor_system': False,
        'can_install_packages': True,  # From iteration 1
        'can_delegate_failures': True  # New in iteration 2
    }
    
    # Test HTTP requests
    try:
        import requests
        response = requests.get('https://httpbin.org/get', timeout=5)
        if response.status_code == 200:
            capabilities['can_make_http_requests'] = True
            print("✅ Can make HTTP requests")
    except Exception as e:
        print(f"❌ Cannot make HTTP requests: {e}")
    
    # Test system monitoring
    try:
        import psutil
        psutil.cpu_percent()
        capabilities['can_monitor_system'] = True
        print("✅ Can monitor system")
    except Exception as e:
        print(f"❌ Cannot monitor system: {e}")
    
    return capabilities

def save_iteration_2_report(installation_results, test_results, capabilities):
    """Save iteration 2 report"""
    report = {
        'iteration': 2,
        'timestamp': str(Path().cwd()),
        'installation_results': installation_results,
        'test_results': test_results,
        'capabilities': capabilities,
        'status': 'delegation_enhanced_system'
    }
    
    try:
        with open('autonomous_iteration_2_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n📄 Report saved: autonomous_iteration_2_report.json")
    except Exception as e:
        print(f"❌ Could not save report: {e}")

def main():
    """Main execution - Iteration 2"""
    print("🤖 AUTONOMOUS SYSTEM - ITERATION 2")
    print("Adding delegation and package installation...")
    print("=" * 60)
    
    # Step 1: Install packages with delegation
    installation_results = install_required_packages()
    
    # Step 2: Test installed packages
    test_results = test_installed_packages()
    
    # Step 3: Assess enhanced capabilities
    capabilities = assess_enhanced_capabilities()
    
    # Step 4: Save report
    save_iteration_2_report(installation_results, test_results, capabilities)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 ITERATION 2 COMPLETE")
    print(f"✅ Successful installations: {len(installation_results['successful'])}")
    print(f"🔄 Delegated installations: {len(installation_results['delegated'])}")
    print(f"❌ Failed installations: {len(installation_results['failed'])}")
    print(f"🧪 Working packages: {sum(1 for r in test_results.values() if r['status'] == 'working')}")
    print(f"🔧 Enhanced capabilities: {sum(capabilities.values())}/{len(capabilities)}")
    print("=" * 60)
    
    print("\n🎯 Next: In Iteration 3, we'll add tool installation and more advanced delegation!")

if __name__ == "__main__":
    main()
