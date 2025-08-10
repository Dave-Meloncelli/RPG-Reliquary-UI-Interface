#!/usr/bin/env python3
"""
Simple Autonomous System Test
Demonstrates the autonomous capabilities you described.
"""

import os
import sys
import subprocess
import platform
import json
from pathlib import Path

def diagnose_environment():
    """Diagnose the current environment"""
    print("🔍 DIAGNOSING ENVIRONMENT...")
    
    diagnosis = {
        'os': platform.system(),
        'python_version': sys.version,
        'current_directory': os.getcwd(),
        'missing_tools': [],
        'available_tools': [],
        'issues': []
    }
    
    # Check for common tools
    tools_to_check = ['python', 'pip', 'node', 'npm', 'git', 'code']
    
    for tool in tools_to_check:
        try:
            result = subprocess.run([tool, '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                diagnosis['available_tools'].append(tool)
                print(f"✅ {tool}: Available")
            else:
                diagnosis['missing_tools'].append(tool)
                print(f"❌ {tool}: Missing")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            diagnosis['missing_tools'].append(tool)
            print(f"❌ {tool}: Not found")
    
    # Check for VS Code specifically
    vscode_paths = [
        r"C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe",
        r"C:\Program Files\Microsoft VS Code\Code.exe"
    ]
    
    vscode_found = False
    for path in vscode_paths:
        if os.path.exists(os.path.expandvars(path)):
            vscode_found = True
            break
    
    if vscode_found:
        diagnosis['available_tools'].append('vscode')
        print("✅ vscode: Available")
    else:
        diagnosis['missing_tools'].append('vscode')
        print("❌ vscode: Missing")
    
    return diagnosis

def auto_install_missing_tools(diagnosis):
    """Attempt to install missing tools"""
    print("\n🚀 ATTEMPTING AUTO-INSTALLATION...")
    
    results = {
        'successful': [],
        'failed': [],
        'attempted': []
    }
    
    for tool in diagnosis['missing_tools']:
        print(f"📦 Attempting to install {tool}...")
        results['attempted'].append(tool)
        
        if tool == 'vscode':
            # For VS Code, we'll provide instructions
            print("   → VS Code requires manual installation from https://code.visualstudio.com/")
            results['failed'].append(tool)
        elif tool in ['node', 'npm']:
            # For Node.js, we'll provide instructions
            print("   → Node.js requires manual installation from https://nodejs.org/")
            results['failed'].append(tool)
        else:
            # For other tools, we'll try to install via package manager
            try:
                if platform.system() == 'Windows':
                    # Try using winget or chocolatey
                    result = subprocess.run(['winget', 'install', tool], 
                                          capture_output=True, text=True, timeout=60)
                    if result.returncode == 0:
                        results['successful'].append(tool)
                        print(f"   ✅ {tool}: Installed successfully")
                    else:
                        results['failed'].append(tool)
                        print(f"   ❌ {tool}: Installation failed")
                else:
                    results['failed'].append(tool)
                    print(f"   ❌ {tool}: Manual installation required")
            except Exception as e:
                results['failed'].append(tool)
                print(f"   ❌ {tool}: Error - {e}")
    
    return results

def adapt_workflow(diagnosis, installation_results):
    """Adapt the workflow based on available tools"""
    print("\n🔄 ADAPTING WORKFLOW...")
    
    adaptations = []
    
    # Adapt based on available tools
    if 'node' in diagnosis['available_tools']:
        adaptations.append("✅ Using Node.js for automation scripts")
    else:
        adaptations.append("⚠️  Using Python-only automation (Node.js not available)")
    
    if 'vscode' in diagnosis['available_tools']:
        adaptations.append("✅ Using VS Code for development")
    else:
        adaptations.append("⚠️  Using command-line development tools")
    
    if 'git' in diagnosis['available_tools']:
        adaptations.append("✅ Git version control available")
    else:
        adaptations.append("⚠️  Manual file management required")
    
    # Adapt based on installation results
    if installation_results['successful']:
        adaptations.append(f"🆕 Newly installed tools: {', '.join(installation_results['successful'])}")
    
    for adaptation in adaptations:
        print(f"   {adaptation}")
    
    return adaptations

def generate_recommendations(diagnosis, installation_results, adaptations):
    """Generate recommendations for optimal operation"""
    print("\n💡 GENERATING RECOMMENDATIONS...")
    
    recommendations = []
    
    # Based on missing tools
    if 'vscode' in diagnosis['missing_tools']:
        recommendations.append("📝 Install VS Code for better development experience")
    
    if 'node' in diagnosis['missing_tools']:
        recommendations.append("📦 Install Node.js for JavaScript automation")
    
    if 'git' in diagnosis['missing_tools']:
        recommendations.append("🔧 Install Git for version control")
    
    # Based on environment
    if platform.system() == 'Windows':
        recommendations.append("🪟 Consider using Windows Package Manager (winget) for easier installations")
    
    # Based on current capabilities
    if 'python' in diagnosis['available_tools']:
        recommendations.append("🐍 Python environment is ready for development")
    
    for recommendation in recommendations:
        print(f"   {recommendation}")
    
    return recommendations

def main():
    """Main autonomous system demonstration"""
    print("🤖 AZ INTERFACE AUTONOMOUS SYSTEM DEMONSTRATION")
    print("=" * 60)
    print("This system demonstrates the capabilities you described:")
    print("• Self-diagnosis of environment")
    print("• Automatic assessment of missing components")
    print("• Attempted auto-installation of dependencies")
    print("• Workflow adaptation based on available tools")
    print("• Intelligent recommendations for optimization")
    print("=" * 60)
    
    # Step 1: Diagnose
    diagnosis = diagnose_environment()
    
    # Step 2: Attempt auto-installation
    installation_results = auto_install_missing_tools(diagnosis)
    
    # Step 3: Adapt workflow
    adaptations = adapt_workflow(diagnosis, installation_results)
    
    # Step 4: Generate recommendations
    recommendations = generate_recommendations(diagnosis, installation_results, adaptations)
    
    # Step 5: Generate final report
    final_report = {
        'diagnosis': diagnosis,
        'installation_results': installation_results,
        'adaptations': adaptations,
        'recommendations': recommendations,
        'system_status': 'autonomous_analysis_complete'
    }
    
    # Save report
    with open('autonomous_demo_report.json', 'w') as f:
        json.dump(final_report, f, indent=2, default=str)
    
    print("\n" + "=" * 60)
    print("📊 AUTONOMOUS SYSTEM DEMONSTRATION COMPLETE")
    print(f"✅ Available tools: {len(diagnosis['available_tools'])}")
    print(f"❌ Missing tools: {len(diagnosis['missing_tools'])}")
    print(f"🚀 Installation attempts: {len(installation_results['attempted'])}")
    print(f"✅ Successful installations: {len(installation_results['successful'])}")
    print(f"💡 Recommendations generated: {len(recommendations)}")
    print(f"📄 Full report saved to: autonomous_demo_report.json")
    print("=" * 60)
    
    print("\n🎯 This demonstrates the autonomous capabilities you described:")
    print("• The system can diagnose its environment")
    print("• It can identify missing programs")
    print("• It attempts to install missing components")
    print("• It adapts its workflow based on available tools")
    print("• It provides intelligent recommendations")
    print("• It generates comprehensive reports")
    
    print("\n🚀 This is exactly what a true autonomous system should do!")

if __name__ == "__main__":
    main()
