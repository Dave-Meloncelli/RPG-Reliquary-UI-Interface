"""
OctoSpine Chunked Recovery Tool
===============================

A memory-efficient version of the OctoSpine archaeological recovery tool
that processes large files in chunks to avoid hanging and memory issues.
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

class OctoSpineChunkedExtractor:
    """Chunked extractor for OctoSpine-related knowledge from large files."""
    
    def __init__(self, chunk_size=50000):  # 50KB chunks
        self.chunk_size = chunk_size
        self.overlap_size = 1000  # 1KB overlap to catch patterns at chunk boundaries
        
        # Core OctoSpine patterns for chunked processing
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
        """Extract OctoSpine knowledge from a file using chunked processing."""
        try:
            file_size = os.path.getsize(file_path)
            logger.info(f"Processing {file_path} ({file_size} bytes)")
            
            # For small files, process normally
            if file_size < self.chunk_size:
                return self._extract_from_small_file(file_path)
            
            # For large files, use chunked processing
            return self._extract_from_large_file(file_path)
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return None
    
    def _extract_from_small_file(self, file_path: str) -> dict:
        """Process small files normally."""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        return self._extract_from_content(content, file_path)
    
    def _extract_from_large_file(self, file_path: str) -> dict:
        """Process large files in chunks."""
        all_patterns = []
        all_relationships = []
        all_quotes = []
        total_mentions = 0
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            chunk_num = 0
            while True:
                # Read chunk
                chunk = f.read(self.chunk_size)
                if not chunk:
                    break
                
                # Add overlap from previous chunk if not first chunk
                if chunk_num > 0:
                    chunk = self._get_overlap(file_path, f.tell() - self.chunk_size - self.overlap_size) + chunk
                
                # Process chunk
                chunk_result = self._extract_from_content(chunk, file_path, chunk_num)
                
                if chunk_result:
                    all_patterns.extend(chunk_result.get('patterns', []))
                    all_relationships.extend(chunk_result.get('relationships', []))
                    all_quotes.extend(chunk_result.get('quotes', []))
                    total_mentions += chunk_result.get('total_mentions', 0)
                
                chunk_num += 1
                logger.info(f"Processed chunk {chunk_num} of {file_path}")
        
        # Deduplicate results
        all_patterns = self._deduplicate_patterns(all_patterns)
        all_relationships = self._deduplicate_relationships(all_relationships)
        all_quotes = self._deduplicate_quotes(all_quotes)
        
        return {
            'file_path': file_path,
            'total_mentions': total_mentions,
            'patterns': all_patterns,
            'relationships': all_relationships,
            'quotes': all_quotes,
            'processing_method': 'chunked',
            'chunks_processed': chunk_num
        }
    
    def _get_overlap(self, file_path: str, position: int) -> str:
        """Get overlap text from previous chunk."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                f.seek(max(0, position))
                return f.read(self.overlap_size)
        except Exception as e:
            return ""
    
    def _extract_from_content(self, content: str, file_path: str, chunk_num: int = 0) -> dict:
        """Extract OctoSpine knowledge from content."""
        # Check if content contains OctoSpine mentions
        if not re.search(r'octospine', content, re.IGNORECASE):
            return None
        
        # Count mentions in this chunk
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
                    'position': (match.start(), match.end()),
                    'chunk': chunk_num
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
                    'context': content[max(0, match.start()-100):min(len(content), match.end()+100)],
                    'chunk': chunk_num
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
                    'context': content[max(0, match.start()-50):min(len(content), match.end()+50)],
                    'chunk': chunk_num
                })
        
        return {
            'file_path': file_path,
            'total_mentions': total_mentions,
            'patterns': patterns_found,
            'relationships': relationships,
            'quotes': quotes
        }
    
    def _deduplicate_patterns(self, patterns: list) -> list:
        """Remove duplicate patterns based on match content."""
        seen = set()
        unique_patterns = []
        for pattern in patterns:
            key = f"{pattern['match']}:{pattern['position'][0]}"
            if key not in seen:
                seen.add(key)
                unique_patterns.append(pattern)
        return unique_patterns
    
    def _deduplicate_relationships(self, relationships: list) -> list:
        """Remove duplicate relationships."""
        seen = set()
        unique_relationships = []
        for rel in relationships:
            key = f"{rel['match']}:{rel.get('chunk', 0)}"
            if key not in seen:
                seen.add(key)
                unique_relationships.append(rel)
        return unique_relationships
    
    def _deduplicate_quotes(self, quotes: list) -> list:
        """Remove duplicate quotes."""
        seen = set()
        unique_quotes = []
        for quote in quotes:
            if quote['quote'] not in seen:
                seen.add(quote['quote'])
                unique_quotes.append(quote)
        return unique_quotes

def main():
    """Main function to run chunked OctoSpine recovery."""
    import argparse
    
    parser = argparse.ArgumentParser(description='OctoSpine Chunked Recovery Tool')
    parser.add_argument('--root', required=True, help='Root directory to scan')
    parser.add_argument('--output', required=True, help='Output directory for results')
    parser.add_argument('--chunk-size', type=int, default=50000, help='Chunk size in bytes (default: 50000)')
    
    args = parser.parse_args()
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(exist_ok=True)
    
    # Initialize extractor
    extractor = OctoSpineChunkedExtractor(chunk_size=args.chunk_size)
    
    # Process files
    root_path = Path(args.root)
    results = []
    total_files = 0
    processed_files = 0
    
    logger.info(f"Starting chunked OctoSpine recovery in: {root_path}")
    
    # Get all files
    all_files = list(root_path.rglob('*'))
    total_files = len(all_files)
    
    for file_path in all_files:
        if file_path.is_file() and file_path.suffix.lower() in ['.txt', '.md']:
            try:
                result = extractor.extract_from_file(str(file_path))
                if result:
                    results.append(result)
                    processed_files += 1
                    logger.info(f"Processed {processed_files}/{total_files}: {file_path.name}")
            except Exception as e:
                logger.error(f"Error processing {file_path}: {e}")
    
    # Generate summary
    summary = {
        'generated_on': datetime.now().isoformat(),
        'total_files_processed': processed_files,
        'files_with_octospine': len([r for r in results if r['total_mentions'] > 0]),
        'total_octospine_mentions': sum(r['total_mentions'] for r in results),
        'processing_method': 'chunked',
        'chunk_size': args.chunk_size
    }
    
    # Save results
    with open(output_dir / 'octospine_chunked_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    with open(output_dir / 'octospine_chunked_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    # Generate markdown summary
    with open(output_dir / 'octospine_chunked_summary.md', 'w', encoding='utf-8') as f:
        f.write(f"# OctoSpine Chunked Recovery Report\n\n")
        f.write(f"Generated on: {summary['generated_on']}\n\n")
        f.write(f"## Summary\n\n")
        f.write(f"- **Total Files Processed**: {summary['total_files_processed']}\n")
        f.write(f"- **Files with OctoSpine Content**: {summary['files_with_octospine']}\n")
        f.write(f"- **Total OctoSpine Mentions**: {summary['total_octospine_mentions']}\n")
        f.write(f"- **Processing Method**: {summary['processing_method']}\n")
        f.write(f"- **Chunk Size**: {summary['chunk_size']} bytes\n\n")
        
        # Files with most mentions
        files_with_mentions = [r for r in results if r['total_mentions'] > 0]
        files_with_mentions.sort(key=lambda x: x['total_mentions'], reverse=True)
        
        f.write(f"## Files with OctoSpine Content\n\n")
        for result in files_with_mentions[:20]:  # Top 20
            filename = Path(result['file_path']).name
            mentions = result['total_mentions']
            f.write(f"- **{filename}** ({mentions} mentions)\n")
    
    logger.info(f"Chunked recovery complete. Results saved to {output_dir}")

if __name__ == "__main__":
    main() 