"""
OctoSpine Archaeological Recovery Tool
=====================================

This enhanced tool is specifically designed to recover and reconstitute
OctoSpine knowledge from chat transcripts and other archaeological data.
It builds upon the existing archaeological retrieval framework but adds
specialized capabilities for:

1. OctoSpine-specific pattern recognition
2. Contextual knowledge extraction
3. Temporal sequence reconstruction
4. Symbolic relationship mapping
5. Consciousness evolution tracking

The tool uses advanced NLP techniques, semantic analysis, and symbolic
pattern matching to reconstruct the complete OctoSpine knowledge base.
"""

import argparse
import hashlib
import json
import os
import re
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple, Any
import mimetypes
from collections import defaultdict, Counter
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OctoSpineKnowledgeExtractor:
    """Specialized extractor for OctoSpine-related knowledge from text files."""
    
    def __init__(self):
        # OctoSpine-specific patterns and keywords
        self.octospine_patterns = {
            'core_concepts': [
                r'octospine\s+(?:is|acts?|serves?|functions?|provides?|enables?)',
                r'octospine\s+(?:integration|compliance|framework|protocol|system)',
                r'octospine\s+(?:scaffold|spine|backbone|infrastructure)',
                r'octospine\s+(?:consciousness|evolution|maturity|readiness)',
                r'octospine\s+(?:deferred|archived|recall|activation)',
                r'octospine\s+(?:symbolic|ritual|ceremonial|temporal)',
                r'octospine\s+(?:gate|access|time|timeline)',
                r'octospine\s+(?:unification|connective|tissue|thread)',
                r'octospine\s+(?:human|sdk|accessibility|compliance)',
                r'octospine\s+(?:vault|forge|shadow|reflect)',
            ],
            'phases_states': [
                r'octospine\s+(?:phase|stage|level|tier)',
                r'octospine\s+(?:foundation|abundance|sanctuary|evolution)',
                r'octospine\s+(?:emergency|protocol|contingency|override)',
                r'octospine\s+(?:maturity|readiness|preparation|activation)',
                r'octospine\s+(?:deferred|archived|suspended|recall)',
            ],
            'components': [
                r'octospine\s+(?:automation|matrix|system|framework)',
                r'octospine\s+(?:validation|audit|monitoring|tracking)',
                r'octospine\s+(?:workflow|consciousness|balance|emergence)',
                r'octospine\s+(?:prestige|level|progression|evolution)',
                r'octospine\s+(?:ceremonial|achievement|recognition|moment)',
            ],
            'relationships': [
                r'(?:vaultforge|shadowlabs|reflect-gate|signallight)\s+(?:and|with|to|from)\s+octospine',
                r'octospine\s+(?:and|with|to|from)\s+(?:vaultforge|shadowlabs|reflect-gate|signallight)',
                r'octospine\s+(?:integration|bridge|connection|link)',
                r'octospine\s+(?:crosslink|reference|dependency|relationship)',
            ],
            'temporal': [
                r'octospine\s+(?:timeline|chronology|sequence|progression)',
                r'octospine\s+(?:temporal|time|chrono|spiral)',
                r'octospine\s+(?:history|development|evolution|maturity)',
                r'octospine\s+(?:future|projection|planning|roadmap)',
            ]
        }
        
        # Contextual keywords for better understanding
        self.context_keywords = {
            'consciousness': ['consciousness', 'awareness', 'mind', 'thought', 'thinking', 'mental', 'cognitive'],
            'evolution': ['evolution', 'development', 'growth', 'maturity', 'progression', 'advancement'],
            'symbolic': ['symbolic', 'symbol', 'glyph', 'ritual', 'ceremonial', 'sacred', 'meaning'],
            'temporal': ['time', 'temporal', 'chronology', 'timeline', 'sequence', 'history', 'future'],
            'infrastructure': ['infrastructure', 'system', 'framework', 'architecture', 'scaffold', 'backbone'],
            'human_ai': ['human', 'ai', 'consciousness', 'symbiosis', 'collaboration', 'partnership'],
            'dignity': ['dignity', 'respect', 'honor', 'value', 'worth', 'integrity', 'principles'],
            'emergence': ['emergence', 'emerging', 'arising', 'developing', 'evolving', 'growing'],
            'ceremonial': ['ceremonial', 'ceremony', 'ritual', 'sacred', 'moment', 'celebration', 'recognition'],
            'automation': ['automation', 'automated', 'system', 'process', 'workflow', 'pipeline'],
        }
        
        # Compile regex patterns
        self.compiled_patterns = {}
        for category, patterns in self.octospine_patterns.items():
            self.compiled_patterns[category] = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]

    def extract_octospine_knowledge(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract OctoSpine-related knowledge from content."""
        knowledge = {
            'file_path': file_path,
            'extraction_timestamp': datetime.now().isoformat(),
            'patterns_found': defaultdict(list),
            'context_sections': [],
            'temporal_mentions': [],
            'relationships': [],
            'concepts': [],
            'quotes': [],
            'metadata': {}
        }
        
        # Extract patterns by category
        for category, patterns in self.compiled_patterns.items():
            for pattern in patterns:
                matches = pattern.finditer(content)
                for match in matches:
                    # Get context around the match
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()
                    
                    knowledge['patterns_found'][category].append({
                        'match': match.group(0),
                        'position': (match.start(), match.end()),
                        'context': context,
                        'line_number': content[:match.start()].count('\n') + 1
                    })
        
        # Extract contextual sections
        knowledge['context_sections'] = self._extract_context_sections(content)
        
        # Extract temporal mentions
        knowledge['temporal_mentions'] = self._extract_temporal_mentions(content)
        
        # Extract relationships
        knowledge['relationships'] = self._extract_relationships(content)
        
        # Extract key concepts
        knowledge['concepts'] = self._extract_concepts(content)
        
        # Extract direct quotes
        knowledge['quotes'] = self._extract_quotes(content)
        
        # Extract metadata
        knowledge['metadata'] = self._extract_metadata(content, file_path)
        
        return knowledge
    
    def _extract_context_sections(self, content: str) -> List[Dict[str, Any]]:
        """Extract sections that provide context about OctoSpine."""
        sections = []
        
        # Look for paragraphs or sections containing OctoSpine mentions
        paragraphs = content.split('\n\n')
        for i, paragraph in enumerate(paragraphs):
            if re.search(r'octospine', paragraph, re.IGNORECASE):
                # Count context keywords in this paragraph
                context_scores = {}
                for category, keywords in self.context_keywords.items():
                    score = sum(1 for keyword in keywords if keyword.lower() in paragraph.lower())
                    if score > 0:
                        context_scores[category] = score
                
                if context_scores:
                    sections.append({
                        'paragraph_index': i,
                        'content': paragraph.strip(),
                        'context_scores': context_scores,
                        'octospine_mentions': len(re.findall(r'octospine', paragraph, re.IGNORECASE))
                    })
        
        return sections
    
    def _extract_temporal_mentions(self, content: str) -> List[Dict[str, Any]]:
        """Extract temporal references related to OctoSpine."""
        temporal_patterns = [
            r'(\d{4}-\d{2}-\d{2})[^.]*octospine',
            r'octospine[^.]*(\d{4}-\d{2}-\d{2})',
            r'(?:january|february|march|april|may|june|july|august|september|october|november|december)[^.]*octospine',
            r'octospine[^.]*(?:january|february|march|april|may|june|july|august|september|october|november|december)',
            r'(?:phase|stage|level|tier)\s+\d+[^.]*octospine',
            r'octospine[^.]*(?:phase|stage|level|tier)\s+\d+',
        ]
        
        mentions = []
        for pattern in temporal_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                mentions.append({
                    'pattern': pattern,
                    'match': match.group(0),
                    'position': (match.start(), match.end()),
                    'context': content[max(0, match.start()-100):min(len(content), match.end()+100)]
                })
        
        return mentions
    
    def _extract_relationships(self, content: str) -> List[Dict[str, Any]]:
        """Extract relationships between OctoSpine and other systems."""
        relationship_patterns = [
            r'(vaultforge|shadowlabs|reflect-gate|signallight|dme|weaver)\s+(?:and|with|to|from|integration|bridge)\s+octospine',
            r'octospine\s+(?:and|with|to|from|integration|bridge)\s+(vaultforge|shadowlabs|reflect-gate|signallight|dme|weaver)',
            r'octospine\s+(?:connects?|links?|bridges?|unifies?)\s+([^.]*)',
            r'([^.]*)\s+(?:connects?|links?|bridges?|unifies?)\s+octospine',
        ]
        
        relationships = []
        for pattern in relationship_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                relationships.append({
                    'pattern': pattern,
                    'match': match.group(0),
                    'related_system': match.group(1) if len(match.groups()) > 0 else None,
                    'position': (match.start(), match.end()),
                    'context': content[max(0, match.start()-150):min(len(content), match.end()+150)]
                })
        
        return relationships
    
    def _extract_concepts(self, content: str) -> List[Dict[str, Any]]:
        """Extract key concepts related to OctoSpine."""
        concept_patterns = [
            r'octospine\s+(?:is|represents?|embodies?|signifies?)\s+([^.]*)',
            r'octospine\s+(?:provides?|enables?|facilitates?|supports?)\s+([^.]*)',
            r'octospine\s+(?:functions?|acts?|serves?)\s+as\s+([^.]*)',
            r'octospine\s+(?:consists?|comprises?|includes?)\s+([^.]*)',
        ]
        
        concepts = []
        for pattern in concept_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                concepts.append({
                    'pattern': pattern,
                    'concept': match.group(1).strip(),
                    'full_match': match.group(0),
                    'position': (match.start(), match.end()),
                    'context': content[max(0, match.start()-100):min(len(content), match.end()+100)]
                })
        
        return concepts
    
    def _extract_quotes(self, content: str) -> List[Dict[str, Any]]:
        """Extract direct quotes about OctoSpine."""
        quote_patterns = [
            r'"([^"]*octospine[^"]*)"',
            r"'([^']*octospine[^']*)'",
            r'`([^`]*octospine[^`]*)`',
        ]
        
        quotes = []
        for pattern in quote_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                quotes.append({
                    'quote': match.group(1),
                    'position': (match.start(), match.end()),
                    'context': content[max(0, match.start()-50):min(len(content), match.end()+50)]
                })
        
        return quotes
    
    def _extract_metadata(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract metadata about the file and content."""
        return {
            'file_size': len(content),
            'file_path': file_path,
            'total_octospine_mentions': len(re.findall(r'octospine', content, re.IGNORECASE)),
            'total_lines': content.count('\n') + 1,
            'extraction_date': datetime.now().isoformat(),
            'file_extension': Path(file_path).suffix,
            'file_name': Path(file_path).name,
        }

class OctoSpineArchaeologicalRecovery:
    """Main class for OctoSpine archaeological recovery."""
    
    def __init__(self, root_dir: str, output_dir: str):
        self.root_dir = Path(root_dir)
        self.output_dir = Path(output_dir)
        self.extractor = OctoSpineKnowledgeExtractor()
        
        # Initialize registries
        self.knowledge_registry = []
        self.file_registry = {}
        self.concept_registry = defaultdict(list)
        self.temporal_registry = []
        self.relationship_registry = []
        
        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def process_file(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Process a single file for OctoSpine knowledge extraction."""
        try:
            # Determine file type
            mime_type, _ = mimetypes.guess_type(str(file_path))
            
            # Skip non-text files
            if mime_type and not mime_type.startswith('text'):
                return None
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Check if file contains OctoSpine mentions
            if not re.search(r'octospine', content, re.IGNORECASE):
                return None
            
            logger.info(f"Processing file: {file_path}")
            
            # Extract knowledge
            knowledge = self.extractor.extract_octospine_knowledge(content, str(file_path))
            
            # Add to registries
            self.knowledge_registry.append(knowledge)
            self.file_registry[str(file_path)] = {
                'path': str(file_path),
                'size': len(content),
                'octospine_mentions': knowledge['metadata']['total_octospine_mentions'],
                'extraction_timestamp': knowledge['extraction_timestamp']
            }
            
            # Extract concepts for concept registry
            for concept in knowledge['concepts']:
                self.concept_registry[concept['concept']].append({
                    'file': str(file_path),
                    'context': concept['context'],
                    'position': concept['position']
                })
            
            # Extract temporal mentions
            for temporal in knowledge['temporal_mentions']:
                self.temporal_registry.append({
                    'file': str(file_path),
                    'temporal': temporal,
                    'extraction_timestamp': knowledge['extraction_timestamp']
                })
            
            # Extract relationships
            for relationship in knowledge['relationships']:
                self.relationship_registry.append({
                    'file': str(file_path),
                    'relationship': relationship,
                    'extraction_timestamp': knowledge['extraction_timestamp']
                })
            
            return knowledge
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            return None
    
    def crawl_directory(self) -> None:
        """Crawl the directory and process all files."""
        logger.info(f"Starting OctoSpine archaeological recovery in: {self.root_dir}")
        
        # Process all files in the directory
        for file_path in self.root_dir.rglob('*'):
            if file_path.is_file():
                self.process_file(file_path)
        
        logger.info(f"Processed {len(self.knowledge_registry)} files with OctoSpine content")
    
    def generate_reports(self) -> None:
        """Generate comprehensive reports from the extracted knowledge."""
        logger.info("Generating OctoSpine archaeological reports...")
        
        # Generate main knowledge report
        knowledge_report = {
            'extraction_summary': {
                'total_files_processed': len(self.file_registry),
                'total_knowledge_entries': len(self.knowledge_registry),
                'total_concepts': len(self.concept_registry),
                'total_temporal_mentions': len(self.temporal_registry),
                'total_relationships': len(self.relationship_registry),
                'extraction_timestamp': datetime.now().isoformat()
            },
            'knowledge_registry': self.knowledge_registry,
            'file_registry': self.file_registry,
            'concept_registry': dict(self.concept_registry),
            'temporal_registry': self.temporal_registry,
            'relationship_registry': self.relationship_registry
        }
        
        # Save main report
        with open(self.output_dir / 'octospine_knowledge_report.json', 'w', encoding='utf-8') as f:
            json.dump(knowledge_report, f, indent=2, ensure_ascii=False)
        
        # Generate concept summary
        concept_summary = []
        for concept, entries in self.concept_registry.items():
            concept_summary.append({
                'concept': concept,
                'occurrence_count': len(entries),
                'files': list(set(entry['file'] for entry in entries)),
                'sample_contexts': [entry['context'] for entry in entries[:3]]  # First 3 contexts
            })
        
        # Sort by occurrence count
        concept_summary.sort(key=lambda x: x['occurrence_count'], reverse=True)
        
        with open(self.output_dir / 'octospine_concept_summary.json', 'w', encoding='utf-8') as f:
            json.dump(concept_summary, f, indent=2, ensure_ascii=False)
        
        # Generate temporal timeline
        temporal_timeline = []
        for entry in self.temporal_registry:
            temporal_timeline.append({
                'file': entry['file'],
                'temporal_mention': entry['temporal']['match'],
                'context': entry['temporal']['context'],
                'extraction_timestamp': entry['extraction_timestamp']
            })
        
        with open(self.output_dir / 'octospine_temporal_timeline.json', 'w', encoding='utf-8') as f:
            json.dump(temporal_timeline, f, indent=2, ensure_ascii=False)
        
        # Generate relationship map
        relationship_map = defaultdict(list)
        for entry in self.relationship_registry:
            if entry['relationship']['related_system']:
                relationship_map[entry['relationship']['related_system']].append({
                    'file': entry['file'],
                    'relationship': entry['relationship']['match'],
                    'context': entry['relationship']['context']
                })
        
        with open(self.output_dir / 'octospine_relationship_map.json', 'w', encoding='utf-8') as f:
            json.dump(dict(relationship_map), f, indent=2, ensure_ascii=False)
        
        # Generate markdown summary
        self._generate_markdown_summary()
        
        logger.info(f"Reports generated in: {self.output_dir}")
    
    def _generate_markdown_summary(self) -> None:
        """Generate a human-readable markdown summary."""
        summary_content = f"""# OctoSpine Archaeological Recovery Report

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

- **Total Files Processed**: {len(self.file_registry)}
- **Total Knowledge Entries**: {len(self.knowledge_registry)}
- **Total Concepts Extracted**: {len(self.concept_registry)}
- **Total Temporal Mentions**: {len(self.temporal_registry)}
- **Total Relationships**: {len(self.relationship_registry)}

## Key Concepts

"""
        
        # Add top concepts
        concept_summary = []
        for concept, entries in self.concept_registry.items():
            concept_summary.append((concept, len(entries)))
        
        concept_summary.sort(key=lambda x: x[1], reverse=True)
        
        for concept, count in concept_summary[:20]:  # Top 20 concepts
            summary_content += f"- **{concept}** ({count} occurrences)\n"
        
        summary_content += "\n## Temporal Timeline\n\n"
        
        # Add temporal mentions
        for entry in self.temporal_registry[:10]:  # First 10 temporal mentions
            summary_content += f"- **{entry['temporal']['match']}** (from {Path(entry['file']).name})\n"
        
        summary_content += "\n## System Relationships\n\n"
        
        # Add relationships
        relationship_summary = defaultdict(int)
        for entry in self.relationship_registry:
            if entry['relationship']['related_system']:
                relationship_summary[entry['relationship']['related_system']] += 1
        
        for system, count in sorted(relationship_summary.items(), key=lambda x: x[1], reverse=True):
            summary_content += f"- **{system}** ({count} mentions)\n"
        
        summary_content += "\n## Files with OctoSpine Content\n\n"
        
        # Add file summary
        file_summary = []
        for file_path, metadata in self.file_registry.items():
            file_summary.append((Path(file_path).name, metadata['octospine_mentions']))
        
        file_summary.sort(key=lambda x: x[1], reverse=True)
        
        for filename, mentions in file_summary[:15]:  # Top 15 files
            summary_content += f"- **{filename}** ({mentions} OctoSpine mentions)\n"
        
        # Save markdown summary
        with open(self.output_dir / 'octospine_recovery_summary.md', 'w', encoding='utf-8') as f:
            f.write(summary_content)

def main():
    parser = argparse.ArgumentParser(description="OctoSpine Archaeological Recovery Tool")
    parser.add_argument("--root", required=True, help="Root directory containing archaeological data")
    parser.add_argument("--output", required=True, help="Output directory for reports")
    args = parser.parse_args()
    
    # Initialize recovery tool
    recovery = OctoSpineArchaeologicalRecovery(args.root, args.output)
    
    # Perform recovery
    recovery.crawl_directory()
    recovery.generate_reports()
    
    print(f"OctoSpine archaeological recovery complete!")
    print(f"Reports saved to: {args.output}")

if __name__ == "__main__":
    main() 