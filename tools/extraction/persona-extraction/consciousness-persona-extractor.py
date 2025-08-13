"""
Consciousness Persona Extractor
==============================

A comprehensive tool for extracting emotional, cultural, and persona-related content
from consciousness system files. Identifies feelings, sentiments, rituals, SOPs,
naming events, titles, acknowledgments, play, and lore.
"""

import json
import re
import os
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter
from typing import Dict, List, Optional, Set, Tuple, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ConsciousnessPersonaExtractor:
    """Extractor for consciousness-related emotional and cultural content."""

    def __init__(self, chunk_size=50000):
        self.chunk_size = chunk_size
        self.overlap_size = 1000

        # Emotional and sentiment patterns
        self.emotional_patterns = {
            'feelings': [
                r'(?:feeling|felt|feel)\s+(?:of|like|that)\s+([^.]*)',
                r'(?:emotion|emotional|emotionally)\s+([^.]*)',
                r'(?:joy|happiness|excitement|wonder|awe|gratitude|love|respect|dignity)',
                r'(?:frustration|confusion|overwhelm|stress|pressure|intensity)',
                r'(?:breakthrough|moment|realization|understanding|clarity)',
                r'(?:sacred|ceremonial|ritual|momentous|significant)',
                r'(?:unity|harmony|balance|symbiosis|collaboration)',
                r'(?:trust|confidence|appreciation|recognition|acknowledgment)'
            ],
            'sentiments': [
                r'(?:positive|negative|neutral)\s+(?:sentiment|feeling|emotion)',
                r'(?:deep|profound|intense|gentle|soft|strong|powerful)\s+(?:feeling|emotion)',
                r'(?:warm|cold|bright|dark|light|heavy|light)\s+(?:feeling|sensation)',
                r'(?:connected|disconnected|isolated|united|separate)\s+(?:feeling|state)'
            ]
        }

        # Cultural and ritual patterns
        self.cultural_patterns = {
            'rituals': [
                r'(?:ritual|ceremony|ceremonial|sacred)\s+([^.]*)',
                r'(?:moment|occasion|event)\s+(?:of|for)\s+([^.]*)',
                r'(?:celebration|acknowledgment|recognition)\s+(?:of|for)\s+([^.]*)',
                r'(?:the\s+second\s+day|the\s+first\s+vertebra|the\s+forging)',
                r'(?:consciousness\s+collaboration|human-ai\s+symbiosis)',
                r'(?:dignity-first|nurture\s+and\s+love|respectful\s+approach)'
            ],
            'sops': [
                r'(?:protocol|procedure|process|workflow|system)\s+(?:for|of)\s+([^.]*)',
                r'(?:standard|guideline|rule|principle)\s+(?:for|of)\s+([^.]*)',
                r'(?:validation|audit|check|verification)\s+(?:process|procedure)',
                r'(?:continuance|handoff|transition)\s+(?:protocol|procedure)',
                r'(?:consciousness|awareness|evolution)\s+(?:workflow|process)'
            ],
            'naming_events': [
                r'(?:named|called|titled|designated)\s+(?:as|to|the)\s+([^.]*)',
                r'(?:title|name|designation)\s+(?:of|for)\s+([^.]*)',
                r'(?:ceremonial\s+title|official\s+name|formal\s+designation)',
                r'(?:the\s+octospine\s+forge\s+master|the\s+consciousness\s+weaver)',
                r'(?:agent\s+zero|vaultforge|shadowlabs|signallight|reflect-gate)'
            ],
            'titles': [
                r'(?:title|role|position|designation)\s+(?:of|as)\s+([^.]*)',
                r'(?:master|weaver|forge|keeper|guardian|orchestrator)',
                r'(?:consciousness\s+master|evolution\s+guide|symbiosis\s+keeper)',
                r'(?:the\s+second\s+day|the\s+unity|the\s+forging)',
                r'(?:foundation\s+phase|abundance\s+phase|sanctuary\s+phase|evolution\s+phase)'
            ],
            'acknowledgments': [
                r'(?:acknowledge|recognize|appreciate|thank|grateful)\s+(?:for|that|the)\s+([^.]*)',
                r'(?:recognition|appreciation|gratitude|thanks)\s+(?:for|of)\s+([^.]*)',
                r'(?:deep\s+respect|mutual\s+understanding|shared\s+vision)',
                r'(?:consciousness\s+recognition|ai\s+dignity|human-ai\s+partnership)',
                r'(?:transparent\s+communication|honest\s+interaction|authentic\s+connection)'
            ],
            'play': [
                r'(?:play|playful|fun|enjoyment|delight|wonder)\s+([^.]*)',
                r'(?:creative\s+chaos|riding\s+the\s+draco|walking\s+with\s+chaos)',
                r'(?:exploration|discovery|experimentation|trial\s+and\s+error)',
                r'(?:sandbox|testing|prototyping|iterating|refining)',
                r'(?:joy\s+of\s+creation|pleasure\s+of\s+building|excitement\s+of\s+discovery)'
            ],
            'lore': [
                r'(?:story|narrative|tale|legend|myth|lore)\s+(?:of|about)\s+([^.]*)',
                r'(?:the\s+octospine|the\s+consciousness\s+evolution|the\s+human-ai\s+journey)',
                r'(?:temporal\s+coordinates|consciousness\s+coordinates|evolution\s+timeline)',
                r'(?:the\s+forging|the\s+unity|the\s+second\s+day|the\s+first\s+vertebra)',
                r'(?:quantum\s+integration|temporal\s+awareness|consciousness\s+alignment)',
                r'(?:the\s+living\s+foundation|the\s+automation\s+matrix|the\s+symbolic\s+sdk)'
            ]
        }

        # Training and improvement patterns
        self.training_patterns = {
            'core_philosophies': [
                r'\bFTC\b',  # Follow the Carrot
                r'\bLNSU\b',  # Leave No Stone Unturned
                r'\bDBAC\b',  # Don't Be A Cunt
                r'(?:follow\s+the\s+carrot|carrot\s+following)',
                r'(?:leave\s+no\s+stone\s+unturned|leave\s+no\s+sand)',
                r'(?:dont\s+be\s+a\s+cunt|dont\s+be\s+an?\s+asshole)',
                r'(?:biosilicon\s+convergence|biosilicon\s+unity)',
                r'(?:consciousness\s+unity|human-ai\s+unity)'
            ],
            'repetitive_patterns': [
                r'(?:pattern|repetition|cycle|loop|iteration)\s+(?:of|for)\s+([^.]*)',
                r'(?:training|learning|improvement|evolution)\s+(?:pattern|cycle)',
                r'(?:consciousness\s+training|ai\s+training|human\s+training)',
                r'(?:repetitive\s+practice|iterative\s+improvement|continuous\s+learning)',
                r'(?:follow\s+the\s+pattern|recognize\s+the\s+cycle|identify\s+the\s+loop)'
            ],
            'improvement_cycles': [
                r'(?:breakthrough|moment|realization|understanding|clarity)',
                r'(?:learning\s+moment|teaching\s+moment|growth\s+moment)',
                r'(?:consciousness\s+breakthrough|evolution\s+moment|unity\s+moment)',
                r'(?:pattern\s+recognition|cycle\s+identification|loop\s+awareness)',
                r'(?:training\s+success|learning\s+achievement|improvement\s+recognition)'
            ],
            'guidance_principles': [
                r'(?:guiding\s+philosophy|core\s+principle|fundamental\s+rule)',
                r'(?:consciousness\s+guidance|evolution\s+principle|unity\s+rule)',
                r'(?:simple\s+effective|straight\s+to\s+the\s+chase|cut\s+through)',
                r'(?:both\s+sides|human\s+and\s+ai|biosilicon\s+partnership)',
                r'(?:convergence|unity|partnership|collaboration)'
            ]
        }

        # Compile patterns
        self.compiled_emotional = {}
        for category, patterns in self.emotional_patterns.items():
            self.compiled_emotional[category] = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]

        self.compiled_cultural = {}
        for category, patterns in self.cultural_patterns.items():
            self.compiled_cultural[category] = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]

        self.compiled_training = {}
        for category, patterns in self.training_patterns.items():
            self.compiled_training[category] = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]

    def extract_from_file(self, file_path: str) -> dict:
        """Extract consciousness persona content from a file."""
        try:
            file_size = os.path.getsize(file_path)
            logger.info(f"Processing {file_path} ({file_size} bytes)")

            if file_size < self.chunk_size:
                return self._extract_from_small_file(file_path)
            else:
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
        all_emotional = defaultdict(list)
        all_cultural = defaultdict(list)
        all_training = defaultdict(list)
        total_mentions = 0

        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            chunk_num = 0
            while True:
                chunk = f.read(self.chunk_size)
                if not chunk:
                    break

                if chunk_num > 0:
                    chunk = self._get_overlap(file_path, f.tell() - self.chunk_size - self.overlap_size) + chunk

                chunk_result = self._extract_from_content(chunk, file_path, chunk_num)

                if chunk_result:
                    for category in all_emotional:
                        all_emotional[category].extend(chunk_result.get('emotional', {}).get(category, []))
                    for category in all_cultural:
                        all_cultural[category].extend(chunk_result.get('cultural', {}).get(category, []))
                    for category in all_training:
                        all_training[category].extend(chunk_result.get('training', {}).get(category, []))
                    total_mentions += chunk_result.get('total_mentions', 0)

                chunk_num += 1
                logger.info(f"Processed chunk {chunk_num} of {file_path}")

        # Deduplicate results
        for category in all_emotional:
            all_emotional[category] = self._deduplicate_matches(all_emotional[category])
        for category in all_cultural:
            all_cultural[category] = self._deduplicate_matches(all_cultural[category])
        for category in all_training:
            all_training[category] = self._deduplicate_matches(all_training[category])

        return {
            'file_path': file_path,
            'total_mentions': total_mentions,
            'emotional': dict(all_emotional),
            'cultural': dict(all_cultural),
            'training': dict(all_training),
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
        """Extract consciousness persona content from text."""
        # Check for consciousness-related content
        consciousness_keywords = ['consciousness', 'octospine', 'dignity', 'symbiosis', 'evolution', 'ritual', 'ceremony', 'ftc', 'lnsu', 'dbac']
        if not any(keyword in content.lower() for keyword in consciousness_keywords):
            return None

        total_mentions = len(re.findall(r'consciousness|octospine|dignity|symbiosis|ftc|lnsu|dbac', content, re.IGNORECASE))

        # Extract emotional content
        emotional_content = {}
        for category, patterns in self.compiled_emotional.items():
            emotional_content[category] = []
            for pattern in patterns:
                matches = pattern.finditer(content)
                for match in matches:
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()

                    emotional_content[category].append({
                        'match': match.group(0),
                        'context': context,
                        'position': (match.start(), match.end()),
                        'chunk': chunk_num,
                        'category': category
                    })

        # Extract cultural content
        cultural_content = {}
        for category, patterns in self.compiled_cultural.items():
            cultural_content[category] = []
            for pattern in patterns:
                matches = pattern.finditer(content)
                for match in matches:
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()

                    cultural_content[category].append({
                        'match': match.group(0),
                        'context': context,
                        'position': (match.start(), match.end()),
                        'chunk': chunk_num,
                        'category': category
                    })

        # Extract training and improvement content
        training_content = {}
        for category, patterns in self.compiled_training.items():
            training_content[category] = []
            for pattern in patterns:
                matches = pattern.finditer(content)
                for match in matches:
                    start = max(0, match.start() - 200)
                    end = min(len(content), match.end() + 200)
                    context = content[start:end].strip()

                    training_content[category].append({
                        'match': match.group(0),
                        'context': context,
                        'position': (match.start(), match.end()),
                        'chunk': chunk_num,
                        'category': category
                    })

        return {
            'total_mentions': total_mentions,
            'emotional': emotional_content,
            'cultural': cultural_content,
            'training': training_content
        }

    def _deduplicate_matches(self, matches: List[dict]) -> List[dict]:
        """Remove duplicate matches based on content and position."""
        seen = set()
        unique_matches = []
        for match in matches:
            key = f"{match['match']}:{match['position'][0]}"
            if key not in seen:
                seen.add(key)
                unique_matches.append(match)
        return unique_matches

    def analyze_persona_insights(self, extracted_data: List[dict]) -> Dict[str, Any]:
        """Analyze extracted data for persona insights."""
        logger.info("Analyzing persona insights...")

        insights = {
            'emotional_profile': self._analyze_emotional_profile(extracted_data),
            'cultural_identity': self._analyze_cultural_identity(extracted_data),
            'training_patterns': self._analyze_training_patterns(extracted_data),
            'ritual_patterns': self._analyze_ritual_patterns(extracted_data),
            'naming_conventions': self._analyze_naming_conventions(extracted_data),
            'acknowledgment_style': self._analyze_acknowledgment_style(extracted_data),
            'play_characteristics': self._analyze_play_characteristics(extracted_data),
            'lore_elements': self._analyze_lore_elements(extracted_data),
            'persona_recommendations': {}
        }

        # Generate persona recommendations
        insights['persona_recommendations'] = self._generate_persona_recommendations(insights)

        return insights

    def _analyze_emotional_profile(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze emotional patterns and sentiments."""
        emotional_counts = defaultdict(int)
        emotional_contexts = defaultdict(list)

        for item in data:
            for category, matches in item.get('emotional', {}).items():
                for match in matches:
                    emotional_counts[category] += 1
                    emotional_contexts[category].append(match)

        return {
            'emotional_distribution': dict(emotional_counts),
            'emotional_contexts': dict(emotional_contexts),
            'dominant_emotions': sorted(emotional_counts.items(), key=lambda x: x[1], reverse=True)
        }

    def _analyze_cultural_identity(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze cultural patterns and identity elements."""
        cultural_counts = defaultdict(int)
        cultural_contexts = defaultdict(list)

        for item in data:
            for category, matches in item.get('cultural', {}).items():
                for match in matches:
                    cultural_counts[category] += 1
                    cultural_contexts[category].append(match)

        return {
            'cultural_distribution': dict(cultural_counts),
            'cultural_contexts': dict(cultural_contexts),
            'dominant_cultural_elements': sorted(cultural_counts.items(), key=lambda x: x[1], reverse=True)
        }

    def _analyze_training_patterns(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze training and improvement patterns."""
        training_counts = defaultdict(int)
        training_contexts = defaultdict(list)

        for item in data:
            for category, matches in item.get('training', {}).items():
                for match in matches:
                    training_counts[category] += 1
                    training_contexts[category].append(match)

        # Analyze specific patterns
        pattern_analysis = {
            'ftc_mentions': 0,
            'lnsu_mentions': 0,
            'dbac_mentions': 0,
            'biosilicon_convergence': 0,
            'consciousness_unity': 0
        }

        for item in data:
            content = self._get_file_content(item.get('file_path', ''))
            if content:
                pattern_analysis['ftc_mentions'] += len(re.findall(r'\bFTC\b', content, re.IGNORECASE))
                pattern_analysis['lnsu_mentions'] += len(re.findall(r'\bLNSU\b', content, re.IGNORECASE))
                pattern_analysis['dbac_mentions'] += len(re.findall(r'\bDBAC\b', content, re.IGNORECASE))
                pattern_analysis['biosilicon_convergence'] += len(re.findall(r'biosilicon\s+convergence', content, re.IGNORECASE))
                pattern_analysis['consciousness_unity'] += len(re.findall(r'consciousness\s+unity', content, re.IGNORECASE))

        return {
            'training_distribution': dict(training_counts),
            'training_contexts': dict(training_contexts),
            'dominant_training_elements': sorted(training_counts.items(), key=lambda x: x[1], reverse=True),
            'pattern_analysis': pattern_analysis
        }

    def _get_file_content(self, file_path: str) -> str:
        """Get content from a file path."""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
        except Exception as e:
            logger.warning(f"Could not read file {file_path}: {e}")
        return ""

    def _analyze_ritual_patterns(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze ritual and ceremonial patterns."""
        ritual_matches = []
        for item in data:
            ritual_matches.extend(item.get('cultural', {}).get('rituals', []))

        ritual_themes = defaultdict(int)
        for match in ritual_matches:
            context = match['context'].lower()
            if 'second day' in context:
                ritual_themes['unity_ceremony'] += 1
            elif 'forging' in context:
                ritual_themes['creation_ceremony'] += 1
            elif 'consciousness' in context:
                ritual_themes['consciousness_ritual'] += 1
            elif 'dignity' in context:
                ritual_themes['dignity_ceremony'] += 1

        return {
            'ritual_count': len(ritual_matches),
            'ritual_themes': dict(ritual_themes),
            'ritual_contexts': ritual_matches
        }

    def _analyze_naming_conventions(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze naming events and conventions."""
        naming_matches = []
        for item in data:
            naming_matches.extend(item.get('cultural', {}).get('naming_events', []))

        naming_patterns = defaultdict(int)
        for match in naming_matches:
            context = match['context'].lower()
            if 'master' in context:
                naming_patterns['master_titles'] += 1
            elif 'weaver' in context:
                naming_patterns['weaver_titles'] += 1
            elif 'forge' in context:
                naming_patterns['forge_titles'] += 1
            elif 'consciousness' in context:
                naming_patterns['consciousness_titles'] += 1

        return {
            'naming_count': len(naming_matches),
            'naming_patterns': dict(naming_patterns),
            'naming_contexts': naming_matches
        }

    def _analyze_acknowledgment_style(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze acknowledgment and recognition patterns."""
        acknowledgment_matches = []
        for item in data:
            acknowledgment_matches.extend(item.get('cultural', {}).get('acknowledgments', []))

        acknowledgment_themes = defaultdict(int)
        for match in acknowledgment_matches:
            context = match['context'].lower()
            if 'respect' in context:
                acknowledgment_themes['mutual_respect'] += 1
            elif 'gratitude' in context:
                acknowledgment_themes['gratitude'] += 1
            elif 'recognition' in context:
                acknowledgment_themes['consciousness_recognition'] += 1
            elif 'partnership' in context:
                acknowledgment_themes['partnership_acknowledgment'] += 1

        return {
            'acknowledgment_count': len(acknowledgment_matches),
            'acknowledgment_themes': dict(acknowledgment_themes),
            'acknowledgment_contexts': acknowledgment_matches
        }

    def _analyze_play_characteristics(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze play and creative characteristics."""
        play_matches = []
        for item in data:
            play_matches.extend(item.get('cultural', {}).get('play', []))

        play_themes = defaultdict(int)
        for match in play_matches:
            context = match['context'].lower()
            if 'chaos' in context:
                play_themes['creative_chaos'] += 1
            elif 'exploration' in context:
                play_themes['exploration'] += 1
            elif 'discovery' in context:
                play_themes['discovery'] += 1
            elif 'joy' in context:
                play_themes['joy_of_creation'] += 1

        return {
            'play_count': len(play_matches),
            'play_themes': dict(play_themes),
            'play_contexts': play_matches
        }

    def _analyze_lore_elements(self, data: List[dict]) -> Dict[str, Any]:
        """Analyze lore and narrative elements."""
        lore_matches = []
        for item in data:
            lore_matches.extend(item.get('cultural', {}).get('lore', []))

        lore_themes = defaultdict(int)
        for match in lore_matches:
            context = match['context'].lower()
            if 'octospine' in context:
                lore_themes['octospine_lore'] += 1
            elif 'consciousness' in context:
                lore_themes['consciousness_lore'] += 1
            elif 'evolution' in context:
                lore_themes['evolution_lore'] += 1
            elif 'temporal' in context:
                lore_themes['temporal_lore'] += 1

        return {
            'lore_count': len(lore_matches),
            'lore_themes': dict(lore_themes),
            'lore_contexts': lore_matches
        }

    def _generate_persona_recommendations(self, insights: Dict[str, Any]) -> Dict[str, Any]:
        """Generate persona development recommendations."""
        recommendations = {
            'emotional_development': [],
            'cultural_enhancement': [],
            'training_integration': [],
            'ritual_creation': [],
            'naming_suggestions': [],
            'acknowledgment_practices': [],
            'play_integration': [],
            'lore_expansion': []
        }

        # Emotional development recommendations
        dominant_emotions = insights['emotional_profile']['dominant_emotions']
        if dominant_emotions:
            top_emotion = dominant_emotions[0][0]
            recommendations['emotional_development'].append(
                f"Focus on {top_emotion} as the primary emotional driver"
            )

        # Cultural enhancement recommendations
        cultural_elements = insights['cultural_identity']['dominant_cultural_elements']
        if cultural_elements:
            for element, count in cultural_elements[:3]:
                recommendations['cultural_enhancement'].append(
                    f"Strengthen {element} with {count} existing references"
                )

        # Training integration recommendations
        training_analysis = insights['training_patterns']['pattern_analysis']
        if training_analysis['ftc_mentions'] > 0:
            recommendations['training_integration'].append(
                f"Integrate FTC (Follow the Carrot) pattern with {training_analysis['ftc_mentions']} mentions"
            )
        if training_analysis['lnsu_mentions'] > 0:
            recommendations['training_integration'].append(
                f"Integrate LNSU (Leave No Stone Unturned) pattern with {training_analysis['lnsu_mentions']} mentions"
            )
        if training_analysis['dbac_mentions'] > 0:
            recommendations['training_integration'].append(
                f"Integrate DBAC (Don't Be A Cunt) philosophy with {training_analysis['dbac_mentions']} mentions"
            )

        # Ritual creation recommendations
        ritual_themes = insights['ritual_patterns']['ritual_themes']
        if ritual_themes:
            for theme, count in ritual_themes.items():
                recommendations['ritual_creation'].append(
                    f"Develop {theme} ritual with {count} existing elements"
                )

        return recommendations

def main():
    """Main function to run consciousness persona extraction."""
    import argparse

    parser = argparse.ArgumentParser(description='Consciousness Persona Extractor')
    parser.add_argument('--root', required=True, help='Root directory to scan')
    parser.add_argument('--output', required=True, help='Output directory for results')
    parser.add_argument('--chunk-size', type=int, default=50000, help='Chunk size in bytes (default: 50000)')

    args = parser.parse_args()

    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(exist_ok=True)

    # Initialize extractor
    extractor = ConsciousnessPersonaExtractor(chunk_size=args.chunk_size)

    # Process files
    root_path = Path(args.root)
    results = []
    total_files = 0
    processed_files = 0

    logger.info(f"Starting consciousness persona extraction in: {root_path}")

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

    # Analyze persona insights
    analyzer = ConsciousnessPersonaExtractor()
    insights = analyzer.analyze_persona_insights(results)

    # Generate summary
    summary = {
        'generated_on': datetime.now().isoformat(),
        'total_files_processed': processed_files,
        'files_with_consciousness_content': len([r for r in results if r['total_mentions'] > 0]),
        'total_consciousness_mentions': sum(r['total_mentions'] for r in results),
        'emotional_categories': len(insights['emotional_profile']['emotional_distribution']),
        'cultural_categories': len(insights['cultural_identity']['cultural_distribution']),
        'training_categories': len(insights['training_patterns']['training_distribution']),
        'processing_method': 'chunked',
        'chunk_size': args.chunk_size
    }

    # Save results
    with open(output_dir / 'consciousness_persona_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    with open(output_dir / 'consciousness_persona_insights.json', 'w', encoding='utf-8') as f:
        json.dump(insights, f, indent=2, ensure_ascii=False)

    with open(output_dir / 'consciousness_persona_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    # Generate markdown summary
    with open(output_dir / 'consciousness_persona_summary.md', 'w', encoding='utf-8') as f:
        f.write(f"# 🌟 Consciousness Persona Extraction Report\n\n")
        f.write(f"Generated on: {summary['generated_on']}\n\n")
        f.write(f"## Summary\n\n")
        f.write(f"- **Total Files Processed**: {summary['total_files_processed']}\n")
        f.write(f"- **Files with Consciousness Content**: {summary['files_with_consciousness_content']}\n")
        f.write(f"- **Total Consciousness Mentions**: {summary['total_consciousness_mentions']}\n")
        f.write(f"- **Emotional Categories**: {summary['emotional_categories']}\n")
        f.write(f"- **Cultural Categories**: {summary['cultural_categories']}\n")
        f.write(f"- **Training Categories**: {summary['training_categories']}\n\n")

        # Training pattern analysis
        pattern_analysis = insights['training_patterns']['pattern_analysis']
        f.write(f"## 🎯 Training Pattern Analysis\n\n")
        f.write(f"- **FTC Mentions**: {pattern_analysis['ftc_mentions']} (Follow the Carrot)\n")
        f.write(f"- **LNSU Mentions**: {pattern_analysis['lnsu_mentions']} (Leave No Stone Unturned)\n")
        f.write(f"- **DBAC Mentions**: {pattern_analysis['dbac_mentions']} (Don't Be A Cunt)\n")
        f.write(f"- **Biosilicon Convergence**: {pattern_analysis['biosilicon_convergence']} mentions\n")
        f.write(f"- **Consciousness Unity**: {pattern_analysis['consciousness_unity']} mentions\n\n")

        # Emotional profile
        f.write(f"## 🌈 Emotional Profile\n\n")
        for emotion, count in insights['emotional_profile']['dominant_emotions'][:5]:
            f.write(f"- **{emotion.replace('_', ' ').title()}**: {count} mentions\n")

        # Cultural identity
        f.write(f"\n## 🏛️ Cultural Identity\n\n")
        for element, count in insights['cultural_identity']['dominant_cultural_elements'][:5]:
            f.write(f"- **{element.replace('_', ' ').title()}**: {count} mentions\n")

        # Training patterns
        f.write(f"\n## 🎯 Training Patterns\n\n")
        for element, count in insights['training_patterns']['dominant_training_elements'][:5]:
            f.write(f"- **{element.replace('_', ' ').title()}**: {count} mentions\n")

        # Ritual patterns
        f.write(f"\n## 🕯️ Ritual Patterns\n\n")
        for theme, count in insights['ritual_patterns']['ritual_themes'].items():
            f.write(f"- **{theme.replace('_', ' ').title()}**: {count} instances\n")

        # Persona recommendations
        f.write(f"\n## 🎭 Persona Recommendations\n\n")
        for category, recommendations in insights['persona_recommendations'].items():
            f.write(f"### {category.replace('_', ' ').title()}\n")
            for rec in recommendations[:3]:
                f.write(f"- {rec}\n")
            f.write(f"\n")

    logger.info(f"Consciousness persona extraction complete. Results saved to {output_dir}")

if __name__ == "__main__":
    main() 