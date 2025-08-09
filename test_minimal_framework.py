#!/usr/bin/env python3

import sys
import os

def test_import():
    """Test importing the autonomous framework"""
    try:
        print("Testing import of autonomous-framework-v2.py...")
        
        # Add current directory to path
        sys.path.insert(0, os.getcwd())
        
        # Try to import the module
        import autonomous_framework_v2
        print("✅ Import successful!")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_frame_registry():
    """Test FrameRegistry initialization"""
    try:
        print("Testing FrameRegistry initialization...")
        
        # Import the classes
        from autonomous_framework_v2 import FrameRegistry, Frame, FrameType
        
        # Create registry
        registry = FrameRegistry()
        print("✅ FrameRegistry creation successful!")
        return True
    except Exception as e:
        print(f"❌ FrameRegistry creation failed: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=== Minimal Framework Test ===")
    
    # Test 1: Import
    import_success = test_import()
    
    if import_success:
        # Test 2: FrameRegistry
        registry_success = test_frame_registry()
        
        if registry_success:
            print("✅ All tests passed!")
        else:
            print("❌ FrameRegistry test failed!")
    else:
        print("❌ Import test failed!")
