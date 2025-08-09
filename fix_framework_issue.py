#!/usr/bin/env python3

import re

def fix_framework_file():
    """Fix any frame_type references in the autonomous framework"""
    
    file_path = 'autonomous-framework-v2.py'
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for frame_type references
    frame_type_pattern = r'frame_type\s*='
    matches = re.findall(frame_type_pattern, content)
    
    if matches:
        print(f"Found {len(matches)} frame_type references:")
        for match in matches:
            print(f"  - {match}")
        
        # Replace frame_type with type
        fixed_content = re.sub(frame_type_pattern, 'type =', content)
        
        # Write the fixed content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print("✅ Fixed frame_type references!")
        return True
    else:
        print("✅ No frame_type references found!")
        return False

def check_file_encoding():
    """Check if there are any encoding issues"""
    
    file_path = 'autonomous-framework-v2.py'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        print("✅ File encoding is UTF-8 and readable!")
        return True
    except UnicodeDecodeError as e:
        print(f"❌ Encoding issue: {e}")
        return False

def check_syntax():
    """Check Python syntax"""
    
    file_path = 'autonomous-framework-v2.py'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try to compile
        compile(content, file_path, 'exec')
        print("✅ Syntax is valid!")
        return True
    except SyntaxError as e:
        print(f"❌ Syntax error: {e}")
        return False

if __name__ == "__main__":
    print("=== Framework Issue Fixer ===")
    
    # Check encoding
    encoding_ok = check_file_encoding()
    
    # Check syntax
    syntax_ok = check_syntax()
    
    # Fix frame_type references
    fixed = fix_framework_file()
    
    if encoding_ok and syntax_ok:
        print("✅ Framework file appears to be valid!")
    else:
        print("❌ Framework file has issues!")
