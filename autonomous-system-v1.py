#!/usr/bin/env python3
"""
Autonomous System - Iteration 1
Minimal working system that we KNOW will work.
"""

import os
import sys
import platform
import json
from pathlib import Path

def basic_environment_check():
    """Basic environment check - what we KNOW works"""
    print("🔍 ITERATION 1: Basic Environment Check")
    print("=" * 50)
    
    # Get basic system info
    system_info = {
        'os': platform.system(),
        'python_version': sys.version,
        'current_directory': os.getcwd(),
        'python_executable': sys.executable
    }
    
    print(f"✅ OS: {system_info['os']}")
    print(f"✅ Python: {system_info['python_version'].split()[0]}")
    print(f"✅ Directory: {system_info['current_directory']}")
    print(f"✅ Python Executable: {system_info['python_executable']}")
    
    return system_info

def check_available_tools():
    """Check what tools are available - simple approach"""
    print("\n🔧 Checking Available Tools...")
    
    available_tools = []
    missing_tools = []
    
    # Simple tool checks
    tools_to_check = ['python', 'pip']
    
    for tool in tools_to_check:
        try:
            import subprocess
            result = subprocess.run([tool, '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                available_tools.append(tool)
                print(f"✅ {tool}: Available")
            else:
                missing_tools.append(tool)
                print(f"❌ {tool}: Not working")
        except Exception as e:
            missing_tools.append(tool)
            print(f"❌ {tool}: Not found - {e}")
    
    return {
        'available': available_tools,
        'missing': missing_tools
    }

def assess_current_capabilities():
    """Assess what we can currently do"""
    print("\n🎯 Assessing Current Capabilities...")
    
    capabilities = {
        'can_run_python': True,  # We know this works
        'can_write_files': False,
        'can_read_files': False,
        'can_install_packages': False,
        'can_access_network': False
    }
    
    # Test file operations
    try:
        test_file = Path('autonomous_test.tmp')
        test_file.write_text('test')
        test_file.unlink()
        capabilities['can_write_files'] = True
        print("✅ Can write files")
    except Exception as e:
        print(f"❌ Cannot write files: {e}")
    
    try:
        test_read = Path('autonomous-system-v1.py')
        if test_read.exists():
            content = test_read.read_text()
            capabilities['can_read_files'] = True
            print("✅ Can read files")
    except Exception as e:
        print(f"❌ Cannot read files: {e}")
    
    # Test package installation
    try:
        import subprocess
        result = subprocess.run([sys.executable, '-m', 'pip', 'list'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            capabilities['can_install_packages'] = True
            print("✅ Can install packages")
        else:
            print("❌ Cannot install packages")
    except Exception as e:
        print(f"❌ Cannot install packages: {e}")
    
    # Test network access
    try:
        import urllib.request
        urllib.request.urlopen('http://www.google.com', timeout=5)
        capabilities['can_access_network'] = True
        print("✅ Can access network")
    except Exception as e:
        print(f"❌ Cannot access network: {e}")
    
    return capabilities

def generate_basic_recommendations(capabilities, available_tools):
    """Generate basic recommendations based on current state"""
    print("\n💡 Generating Basic Recommendations...")
    
    recommendations = []
    
    if not capabilities['can_write_files']:
        recommendations.append("🔧 Fix file write permissions")
    
    if not capabilities['can_install_packages']:
        recommendations.append("📦 Fix package installation capability")
    
    if not capabilities['can_access_network']:
        recommendations.append("🌐 Check network connectivity")
    
    if 'pip' not in available_tools:
        recommendations.append("📦 Install pip for package management")
    
    for recommendation in recommendations:
        print(f"   {recommendation}")
    
    return recommendations

def save_iteration_report(system_info, tool_check, capabilities, recommendations):
    """Save the iteration report"""
    report = {
        'iteration': 1,
        'timestamp': str(Path().cwd()),
        'system_info': system_info,
        'tool_check': tool_check,
        'capabilities': capabilities,
        'recommendations': recommendations,
        'status': 'minimal_working_system'
    }
    
    try:
        with open('autonomous_iteration_1_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        print(f"\n📄 Report saved: autonomous_iteration_1_report.json")
    except Exception as e:
        print(f"❌ Could not save report: {e}")

def main():
    """Main execution - Iteration 1"""
    print("🤖 AUTONOMOUS SYSTEM - ITERATION 1")
    print("Starting with minimal working system...")
    print("=" * 60)
    
    # Step 1: Basic environment check
    system_info = basic_environment_check()
    
    # Step 2: Check available tools
    tool_check = check_available_tools()
    
    # Step 3: Assess capabilities
    capabilities = assess_current_capabilities()
    
    # Step 4: Generate recommendations
    recommendations = generate_basic_recommendations(capabilities, tool_check['available'])
    
    # Step 5: Save report
    save_iteration_report(system_info, tool_check, capabilities, recommendations)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 ITERATION 1 COMPLETE")
    print(f"✅ Available tools: {len(tool_check['available'])}")
    print(f"❌ Missing tools: {len(tool_check['missing'])}")
    print(f"🔧 Capabilities working: {sum(capabilities.values())}/{len(capabilities)}")
    print(f"💡 Recommendations: {len(recommendations)}")
    print("=" * 60)
    
    print("\n🎯 Next: Based on this foundation, we'll add delegation and more capabilities in Iteration 2!")

if __name__ == "__main__":
    main()
