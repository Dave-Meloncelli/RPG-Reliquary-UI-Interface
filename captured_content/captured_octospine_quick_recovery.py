"""
OctoSpine Quick Recovery Tool
============================

A more efficient version of the OctoSpine archaeological recovery tool
that processes files in smaller batches and provides better progress tracking.
"""

import json
import re
import os
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OctoSpineQuickExtractor:
    """Quick extractor for OctoSpine-related knowledge."""
    
    def __init__(self):
        # Simplified patterns for quick extraction
        self.octospine_patterns = [
            r'octospine\s+(?:is|acts?|serves?|functions?|provides?|enables?)\s+([^.]*)',
            r'octospine\s+(?:integration|compliance|framework|protocol|system)',
            r'octospine\s+(?:scaffold|spine|backbone|infrastructure)',
            r'octospine\s+(?:consciousness|evolution|maturity|readiness)',
            r'octospine\s+(?:deferred|archived|recall|activation)',
            r'octospine\s+(?:symbolic|ritual|ceremonial|temporal)',
            r'octospine\s+(?:gate|access|time|timeline)',
            r'octospine\s+(?:unification|connective|tissue|thread)',
            r'octospine\s+(?:human|sdk|accessibility|compliance)',
            r'octospine\s+(?:vault|forge|shadow|reflect)',
            r'octospine\s+(?:automation|matrix|system|framework)',
            r'octospine\s+(?:validation|audit|monitoring|tracking)',
            r'octospine\s+(?:workflow|consciousness|balance|emergence)',
            r'octospine\s+(?:prestige|level|progression|evolution)',
            r'octospine\s+(?:ceremonial|achievement|recognition|moment)',
        ]
        
        # Compile patterns
        self.compiled_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in self.octospine_patterns]
    
    def extract_from_file(self, file_path: str) -> dict:
        """Extract OctoSpine knowledge from a single file."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Check if file contains OctoSpine mentions
            if not re.search(r'octospine', content, re.IGNORECASE):
                return None
            
            # Count total mentions
            total_mentions = len(re.findall(r'octospine', content, re.IGNORECASE))
            
            # Extract patterns
            patterns_found = []
            for pattern in self.compiled_patterns:
                matches = pattern.finditer(content)
                for match in matches:
                    # Get context around the match
                    start = max(0, match.start() - 150)
                    end = min(len(content), match.end() + 150)
                    context = content[start:end].strip()
                    
                    patterns_found.append({
                        'pattern': pattern.pattern,
                        'match': match.group(0),
                        'context': context,
                        'position': (match.start(), match.end())
                    })
            
            # Extract relationships
            relationships = []
            relationship_patterns = [
                r'(vaultforge|shadowlabs|reflect-gate|signallight|dme|weaver)\s+(?:and|with|to|from)\s+octospine',
                r'octospine\s+(?:and|with|to|from)\s+(vaultforge|shadowlabs|reflect-gate|signallight|dme|weaver)',
            ]
            
            for pattern in relationship_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    relationships.append({
                        'match': match.group(0),
                        'related_system': match.group(1) if len(match.groups()) > 0 else None,
                        'context': content[max(0, match.start()-100):min(len(content), match.end()+100)]
                    })
            
            # Extract quotes
            quotes = []
            quote_patterns = [
                r'"([^"]*octospine[^"]*)"',
                r"'([^']*octospine[^']*)'",
            ]
            
            for pattern in quote_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    quotes.append({
                        'quote': match.group(1),
                        'context': content[max(0, match.start()-50):min(len(content), match.end()+50)]
                    })
            
            return {
                'file_path': file_path,
                'file_name': Path(file_path).name,
                'total_octospine_mentions': total_mentions,
                'patterns_found': patterns_found,
                'relationships': relationships,
                'quotes': quotes,
                'file_size': len(content),
                'extraction_timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return None

def main():
    """Main function for quick OctoSpine recovery."""
    data_dir = Path("Data")
    output_dir = Path("octospine_quick_output")
    output_dir.mkdir(exist_ok=True)
    
    extractor = OctoSpineQuickExtractor()
    results = []
    
    # Get all text files
    text_files = []
    for ext in ['.txt', '.md']:
        text_files.extend(data_dir.glob(f"*{ext}"))
    
    logger.info(f"Found {len(text_files)} text files to process")
    
    # Process files
    for i, file_path in enumerate(text_files, 1):
        logger.info(f"Processing {i}/{len(text_files)}: {file_path.name}")
        
        result = extractor.extract_from_file(str(file_path))
        if result:
            results.append(result)
            logger.info(f"  Found {result['total_octospine_mentions']} OctoSpine mentions")
    
    # Generate summary
    summary = {
        'extraction_summary': {
            'total_files_processed': len(text_files),
            'files_with_octospine': len(results),
            'total_octospine_mentions': sum(r['total_octospine_mentions'] for r in results),
            'extraction_timestamp': datetime.now().isoformat()
        },
        'files': results
    }
    
    # Save results
    with open(output_dir / 'octospine_quick_results.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    # Generate markdown summary
    markdown_content = f"""# OctoSpine Quick Recovery Report

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

- **Total Files Processed**: {len(text_files)}
- **Files with OctoSpine Content**: {len(results)}
- **Total OctoSpine Mentions**: {sum(r['total_octospine_mentions'] for r in results)}

## Files with OctoSpine Content

"""
    
    # Sort by number of mentions
    sorted_results = sorted(results, key=lambda x: x['total_octospine_mentions'], reverse=True)
    
    for result in sorted_results:
        markdown_content += f"- **{result['file_name']}** ({result['total_octospine_mentions']} mentions)\n"
    
    markdown_content += "\n## Key Quotes\n\n"
    
    # Add some key quotes
    all_quotes = []
    for result in results:
        all_quotes.extend(result['quotes'])
    
    for quote in all_quotes[:10]:  # First 10 quotes
        markdown_content += f"- \"{quote['quote']}\"\n"
    
    markdown_content += "\n## System Relationships\n\n"
    
    # Add relationships
    all_relationships = []
    for result in results:
        all_relationships.extend(result['relationships'])
    
    relationship_counts = defaultdict(int)
    for rel in all_relationships:
        if rel['related_system']:
            relationship_counts[rel['related_system']] += 1
    
    for system, count in sorted(relationship_counts.items(), key=lambda x: x[1], reverse=True):
        markdown_content += f"- **{system}** ({count} mentions)\n"
    
    # Save markdown
    with open(output_dir / 'octospine_quick_summary.md', 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    logger.info(f"Quick recovery complete! Results saved to {output_dir}")
    print(f"\nOctoSpine Quick Recovery Complete!")
    print(f"Processed {len(text_files)} files")
    print(f"Found OctoSpine content in {len(results)} files")
    print(f"Total OctoSpine mentions: {sum(r['total_octospine_mentions'] for r in results)}")
    print(f"Results saved to: {output_dir}")

if __name__ == "__main__":
    main() 