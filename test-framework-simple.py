#!/usr/bin/env python3
"""
Simple test script for autonomous framework
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from autonomous_framework_v2 import AutonomousFramework
    
    print("✅ Successfully imported AutonomousFramework")
    
    # Create framework instance
    framework = AutonomousFramework()
    print("✅ Successfully created framework instance")
    
    # List available scaffolds
    scaffolds = framework.list_available_scaffolds()
    print(f"✅ Found {len(scaffolds)} available scaffolds")
    
    for scaffold in scaffolds:
        print(f"  - {scaffold['id']}: {scaffold['name']}")
    
    # Check if websocket_implementation scaffold exists
    websocket_scaffold = None
    for scaffold in scaffolds:
        if scaffold['id'] == 'websocket_implementation':
            websocket_scaffold = scaffold
            break
    
    if websocket_scaffold:
        print(f"✅ Found websocket_implementation scaffold")
        print(f"   Description: {websocket_scaffold['description']}")
        print(f"   Stages: {websocket_scaffold['stages']}")
    else:
        print("❌ websocket_implementation scaffold not found")
    
    print("✅ Framework test completed successfully")
    
except Exception as e:
    print(f"❌ Framework test failed: {str(e)}")
    import traceback
    traceback.print_exc()
