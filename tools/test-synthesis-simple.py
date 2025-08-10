#!/usr/bin/env python3
"""
Simple test to isolate synthesis analysis issue
"""

import sys
import importlib.util

# Import the synthesis analyzer
spec = importlib.util.spec_from_file_location("autonomous_system_v3", "autonomous-system-v3.py")
autonomous_system_v3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(autonomous_system_v3)

def test_synthesis():
    """Test synthesis analysis with safe data"""
    print("🧪 Testing Synthesis Analysis")
    
    # Create safe test data
    test_data = {
        'capabilities': {
            'can_write_files': True,
            'can_read_files': False,
            'can_install_packages': True,
            'can_make_http_requests': True,
            'can_monitor_system': True,
            'can_access_network': True
        },
        'tools': ['python', 'pip', 'node', 'npm'],
        'reports': []
    }
    
    try:
        # Initialize analyzer
        analyzer = autonomous_system_v3.SynthesisAnalyzer()
        
        # Test each method individually
        print("\n1. Testing synergies...")
        synergies = analyzer.analyze_system_synergies(
            test_data['capabilities'], 
            test_data['tools'], 
            test_data['reports']
        )
        print(f"✅ Synergies: {len(synergies)} found")
        
        print("\n2. Testing low hanging fruit...")
        low_hanging_fruit = analyzer.identify_low_hanging_fruit(
            test_data['capabilities'], 
            test_data['tools']
        )
        print(f"✅ Low hanging fruit: {len(low_hanging_fruit)} found")
        
        print("\n3. Testing risks and blockers...")
        risks, blockers = analyzer.assess_risks_and_blockers(
            test_data['capabilities'], 
            test_data['tools']
        )
        print(f"✅ Risks: {len(risks)}, Blockers: {len(blockers)}")
        
        print("\n4. Testing orphans...")
        orphans = analyzer.find_orphans_and_unused_capabilities(
            test_data['capabilities'], 
            test_data['tools']
        )
        print(f"✅ Orphans: {len(orphans)} found")
        
        print("\n5. Testing potential loops...")
        potential_loops = analyzer.detect_potential_endless_loops(
            test_data['capabilities'], 
            test_data['tools']
        )
        print(f"✅ Potential loops: {len(potential_loops)} found")
        
        print("\n6. Testing opportunities...")
        opportunities = analyzer.identify_opportunities(
            test_data['capabilities'], 
            test_data['tools'], 
            test_data['reports']
        )
        print(f"✅ Opportunities: {len(opportunities)} found")
        
        print("\n7. Testing report generation...")
        synthesis_report = analyzer.generate_synthesis_report()
        print(f"✅ Report generated: {synthesis_report['summary']}")
        
        print("\n🎉 All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_synthesis()
    sys.exit(0 if success else 1)
