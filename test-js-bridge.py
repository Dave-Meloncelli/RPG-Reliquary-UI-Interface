#!/usr/bin/env python3
"""
Test script to verify JavaScript bridge functionality
"""

import json
import tempfile
import subprocess
import os
import pathlib
import urllib.parse

def test_js_bridge():
    """Test the JavaScript bridge with the system audit frame"""
    
    # Create a mock context
    context_data = {
        'input_data': {'test': True},
        'parameters': {'recursive': True, 'validate_hub': True},
        'previous_results': {},
        'entry_point': 'performFullAudit'
    }
    
    # Create temporary context file
    context_file = tempfile.mktemp(suffix='.json')
    with open(context_file, 'w', encoding='utf-8') as f:
        json.dump(context_data, f)
    
    try:
        # Execute JS with context file
        abs_file_path = str(pathlib.Path('scripts/system-audit.js').resolve())
        
        # Convert Windows path to file:// URL for ES modules
        if os.name == 'nt':  # Windows
            file_url = f"file:///{abs_file_path.replace(':', '|').replace('\\', '/')}"
        else:
            file_url = f"file://{abs_file_path}"
        
        # Use proper path escaping for the context file
        context_file_escaped = context_file.replace('\\', '\\\\')
        
        cmd = [
            'node', '-e',
            f'''
            import("{file_url}").then(module => {{
                const fs = require("fs");
                const context = JSON.parse(fs.readFileSync("{context_file_escaped}", "utf8"));
                const result = module[context.entry_point](context);
                console.log(JSON.stringify({{success: true, result}}));
            }}).catch(error => {{
                console.log(JSON.stringify({{success: false, error: error.message}}));
            }});
            '''
        ]
        
        print("Executing JavaScript bridge test...")
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', cwd=os.getcwd())
        
        print(f"Return code: {result.returncode}")
        print(f"STDOUT length: {len(result.stdout)}")
        print(f"STDERR: {result.stderr}")
        
        if result.returncode != 0:
            print(f"❌ JavaScript execution failed: {result.stderr}")
            return False
        
        # Parse JSON response
        stdout_lines = result.stdout.strip().split('\n')
        json_response = None
        
        # Look for JSON in the last few lines
        for line in reversed(stdout_lines[-10:]):
            line = line.strip()
            if line.startswith('{') and line.endswith('}'):
                try:
                    json_response = json.loads(line)
                    break
                except json.JSONDecodeError:
                    continue
        
        if json_response is None:
            print("❌ No JSON response found in JavaScript output")
            return False
        
        print(f"✅ JSON response parsed successfully")
        print(f"Response keys: {list(json_response.keys())}")
        
        # Check if we have the expected success criteria
        if 'audit_complete' in json_response and 'hub_validated' in json_response:
            print(f"✅ Success criteria found: audit_complete={json_response['audit_complete']}, hub_validated={json_response['hub_validated']}")
            return True
        else:
            print(f"❌ Missing success criteria in response")
            print(f"Available keys: {list(json_response.keys())}")
            return False
            
    finally:
        # Cleanup temporary file
        if os.path.exists(context_file):
            os.unlink(context_file)

if __name__ == "__main__":
    print("🧪 Testing JavaScript Bridge Fix")
    print("=" * 50)
    
    success = test_js_bridge()
    
    if success:
        print("\n✅ JavaScript bridge test PASSED")
        print("The fix should work in the autonomous framework")
    else:
        print("\n❌ JavaScript bridge test FAILED")
        print("The fix needs further investigation")
