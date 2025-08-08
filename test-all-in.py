#!/usr/bin/env python3
"""
Test script for All-In Analysis
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scripts.all_in_analysis import run_all_in_analysis

def main():
    print("🧪 Testing All-In Analysis")
    print("=" * 50)
    
    # Run the analysis
    result = run_all_in_analysis()
    
    if result.get('success'):
        print("✅ Analysis completed successfully!")
        print(f"📊 Summary:")
        print(f"   Total items analyzed: {result['summary']['total_items']}")
        print(f"   Critical items: {result['summary']['critical_items']}")
        print(f"   Quick wins: {result['summary']['quick_wins']}")
        print(f"   Estimated effort: {result['summary']['estimated_effort_hours']} hours")
        print(f"   Risk score: {result['summary']['risk_score']:.2f}/5")
        print(f"   Opportunity score: {result['summary']['opportunity_score']:.2f}/5")
        
        print(f"\n📄 Report saved to: {result['report_path']}")
        
        # Show immediate actions
        if result.get('critical_items_count', 0) > 0:
            print(f"\n🚨 Critical items found: {result['critical_items_count']}")
            print("   These require immediate attention!")
        
        # Show quick wins
        if result.get('quick_wins_count', 0) > 0:
            print(f"\n⚡ Quick wins available: {result['quick_wins_count']}")
            print("   These are high-impact, low-effort improvements!")
            
    else:
        print("❌ Analysis failed!")
        print(f"Error: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
