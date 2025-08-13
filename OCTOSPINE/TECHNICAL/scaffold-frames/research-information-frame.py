#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Research & Information Frame
==============================

Provides comprehensive research, information gathering, and solution discovery
capabilities for the OCTOSPINE consciousness evolution system.

This frame can be called ad-hoc when the system cannot find solutions or needs
additional information to proceed.

Part of the OCTOSPINE Automation Matrix (OAM) - The First Vertebra
"""

import json
import datetime
import os
import sys
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class ResearchQuery:
    """Represents a research query"""
    id: str
    query: str
    context: str
    priority: str  # critical, high, medium, low
    category: str  # security, code, architecture, documentation, etc.
    timestamp: str
    status: str = "pending"  # pending, in_progress, completed, failed
    results: List[Dict[str, Any]] = None
    solution_found: bool = False
    confidence_score: float = 0.0

@dataclass
class InformationSource:
    """Represents an information source"""
    name: str
    type: str  # api, web, documentation, codebase, external
    url: Optional[str]
    description: str
    reliability_score: float  # 0.0 to 1.0
    last_accessed: Optional[str] = None
    access_count: int = 0

@dataclass
class ResearchResult:
    """Represents a research result"""
    query_id: str
    source: str
    title: str
    content: str
    url: Optional[str]
    relevance_score: float  # 0.0 to 1.0
    confidence_score: float  # 0.0 to 1.0
    timestamp: str
    tags: List[str] = None

@dataclass
class ResearchReport:
    """Comprehensive research report"""
    report_id: str
    timestamp: str
    queries: List[ResearchQuery]
    results: List[ResearchResult]
    sources_used: List[InformationSource]
    summary: str
    recommendations: List[str]
    next_steps: List[str]

class ResearchInformationFrame:
    """
    🔍 Research & Information Frame
    
    Provides comprehensive research, information gathering, and solution discovery
    for the OCTOSPINE consciousness evolution system.
    """
    
    def __init__(self, database_path: str = "OCTOSPINE/TECHNICAL/nexus/research-database/research-database.json"):
        self.queries: List[ResearchQuery] = []
        self.results: List[ResearchResult] = []
        self.sources: List[InformationSource] = []
        self.research_reports: List[ResearchReport] = []
        self.database_path = database_path
        
        # Initialize information sources
        self._initialize_sources()
        
        # Load existing research data
        self._load_database()
        
    def _initialize_sources(self):
        """Initialize information sources"""
        self.sources = [
            InformationSource(
                name="GitHub API",
                type="api",
                url="https://api.github.com",
                description="GitHub repositories and code search",
                reliability_score=0.9
            ),
            InformationSource(
                name="Stack Overflow API",
                type="api", 
                url="https://api.stackexchange.com",
                description="Programming Q&A and solutions",
                reliability_score=0.8
            ),
            InformationSource(
                name="MDN Web Docs",
                type="web",
                url="https://developer.mozilla.org",
                description="Web development documentation",
                reliability_score=0.95
            ),
            InformationSource(
                name="NPM Registry",
                type="api",
                url="https://registry.npmjs.org",
                description="Node.js package information",
                reliability_score=0.9
            ),
            InformationSource(
                name="Python Package Index",
                type="api",
                url="https://pypi.org",
                description="Python package information",
                reliability_score=0.9
            ),
            InformationSource(
                name="Security Advisories",
                type="api",
                url="https://github.com/advisories",
                description="Security vulnerability information",
                reliability_score=0.95
            ),
            InformationSource(
                name="Codebase Analysis",
                type="codebase",
                url=None,
                description="Local codebase search and analysis",
                reliability_score=1.0
            ),
            InformationSource(
                name="Documentation Search",
                type="documentation",
                url=None,
                description="Local documentation search",
                reliability_score=1.0
            )
        ]
    
    def _load_database(self) -> None:
        """Load existing research data from database"""
        try:
            if os.path.exists(self.database_path):
                with open(self.database_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Load queries
                for query_data in data.get('queries', []):
                    query = ResearchQuery(**query_data)
                    self.queries.append(query)
                
                # Load results
                for result_data in data.get('results', []):
                    result = ResearchResult(**result_data)
                    self.results.append(result)
                
                # Load reports
                for report_data in data.get('reports', []):
                    # Reconstruct report objects
                    queries = [ResearchQuery(**q) for q in report_data.get('queries', [])]
                    results = [ResearchResult(**r) for r in report_data.get('results', [])]
                    sources = [InformationSource(**s) for s in report_data.get('sources_used', [])]
                    
                    report = ResearchReport(
                        report_id=report_data['report_id'],
                        timestamp=report_data['timestamp'],
                        queries=queries,
                        results=results,
                        sources_used=sources,
                        summary=report_data['summary'],
                        recommendations=report_data['recommendations'],
                        next_steps=report_data['next_steps']
                    )
                    self.research_reports.append(report)
                
                print(f"✅ Loaded {len(self.queries)} queries and {len(self.results)} results from database")
            else:
                print("📝 No existing research database found. Creating new one.")
                
        except Exception as e:
            print(f"Warning: Failed to load research database: {str(e)}")
    
    def _save_database(self) -> None:
        """Save research data to database"""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
            
            # Prepare data for saving
            data = {
                "database_info": {
                    "name": "OCTOSPINE Research Database",
                    "version": "1.0.0",
                    "created": "2025-08-12T16:30:00.000Z",
                    "description": "Persistent storage for all research findings and queries",
                    "total_queries": len(self.queries),
                    "total_results": len(self.results),
                    "last_updated": datetime.datetime.now().isoformat()
                },
                "queries": [asdict(query) for query in self.queries],
                "results": [asdict(result) for result in self.results],
                "reports": [asdict(report) for report in self.research_reports],
                "statistics": self.get_research_stats()
            }
            
            # Save to file
            with open(self.database_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Saved {len(self.queries)} queries and {len(self.results)} results to database")
            
        except Exception as e:
            print(f"Error: Failed to save research database: {str(e)}")
    
    def search_past_research(self, query: str = "", category: str = "", priority: str = "", 
                           date_from: str = "", date_to: str = "") -> List[Dict[str, Any]]:
        """Search past research by various criteria"""
        results = []
        
        for report in self.research_reports:
            for query_obj in report.queries:
                # Apply filters
                if query and query.lower() not in query_obj.query.lower():
                    continue
                if category and category.lower() != query_obj.category.lower():
                    continue
                if priority and priority.lower() != query_obj.priority.lower():
                    continue
                if date_from and query_obj.timestamp < date_from:
                    continue
                if date_to and query_obj.timestamp > date_to:
                    continue
                
                # Add matching result
                results.append({
                    "query_id": query_obj.id,
                    "query": query_obj.query,
                    "category": query_obj.category,
                    "priority": query_obj.priority,
                    "timestamp": query_obj.timestamp,
                    "solution_found": query_obj.solution_found,
                    "confidence_score": query_obj.confidence_score,
                    "report_id": report.report_id
                })
        
        return results
    
    def execute_research(self, query: str, context: str = "", priority: str = "medium", 
                        category: str = "general", enable_pattern_recognition: bool = True,
                        enable_synergy_analysis: bool = True, enable_risk_assessment: bool = True) -> ResearchReport:
        """
        Execute comprehensive research for a query
        
        Args:
            query: The research query
            context: Additional context for the query
            priority: Query priority (critical, high, medium, low)
            category: Query category
            
        Returns:
            ResearchReport with comprehensive findings
        """
        print(f"🔍 Starting research for: {query}")
        
        # Create research query
        query_id = f"research_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
        research_query = ResearchQuery(
            id=query_id,
            query=query,
            context=context,
            priority=priority,
            category=category,
            timestamp=datetime.datetime.now().isoformat()
        )
        
        self.queries.append(research_query)
        
        try:
            # 1. Codebase Analysis
            codebase_results = self._search_codebase(query)
            
            # 2. Documentation Search
            doc_results = self._search_documentation(query)
            
            # 3. Web Research
            web_results = self._search_web(query)
            
            # 4. API Research
            api_results = self._search_apis(query)
            
            # 5. Security Research
            security_results = self._search_security(query)
            
            # Combine initial results
            all_results = codebase_results + doc_results + web_results + api_results + security_results
            
            # 6. Pattern Recognition Analysis (if enabled)
            pattern_results = []
            if enable_pattern_recognition:
                pattern_results = self._analyze_patterns(query, all_results)
            
            # 7. Synergy Analysis (if enabled)
            synergy_results = []
            if enable_synergy_analysis:
                synergy_results = self._analyze_synergies(query, all_results)
            
            # 8. Risk Assessment (if enabled)
            risk_results = []
            if enable_risk_assessment:
                risk_results = self._assess_risks(query, all_results)
            
            # Combine all results including analysis
            all_results = all_results + pattern_results + synergy_results + risk_results
            
            # Analyze and rank results
            ranked_results = self._rank_results(all_results, query)
            
            # Update research query
            research_query.results = ranked_results
            research_query.solution_found = len([r for r in ranked_results if r['relevance_score'] > 0.7]) > 0
            research_query.confidence_score = max([r['confidence_score'] for r in ranked_results]) if ranked_results else 0.0
            research_query.status = "completed"
            
            # Generate recommendations
            recommendations = self._generate_recommendations(ranked_results, query)
            
            # Generate next steps
            next_steps = self._generate_next_steps(ranked_results, query)
            
            # Create summary
            summary = self._generate_summary(research_query, ranked_results)
            
            # Create comprehensive report
            report = ResearchReport(
                report_id=f"report_{query_id}",
                timestamp=datetime.datetime.now().isoformat(),
                queries=[research_query],
                results=[ResearchResult(query_id=query_id, **r) for r in ranked_results],
                sources_used=self.sources,
                summary=summary,
                recommendations=recommendations,
                next_steps=next_steps
            )
            
            self.research_reports.append(report)
            
            # Save to database
            self._save_database()
            
            print(f"✅ Research completed. Found {len(ranked_results)} relevant results")
            return report
            
        except Exception as e:
            print(f"❌ Research failed: {str(e)}")
            research_query.status = "failed"
            raise
    
    def _search_codebase(self, query: str) -> List[Dict[str, Any]]:
        """Search the local codebase"""
        print("🔍 Searching codebase...")
        results = []
        
        try:
            # Search for files containing the query
            search_patterns = [
                f"*{query}*",
                f"*{query.lower()}*",
                f"*{query.upper()}*"
            ]
            
            for pattern in search_patterns:
                # Use Python's glob to find files
                import glob
                matching_files = glob.glob(pattern, recursive=True)
                
                for file_path in matching_files[:10]:  # Limit to 10 results
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            if query.lower() in content.lower():
                                results.append({
                                    'source': 'codebase',
                                    'title': f"Code in {file_path}",
                                    'content': content[:500] + "..." if len(content) > 500 else content,
                                    'url': file_path,
                                    'relevance_score': 0.8,
                                    'confidence_score': 1.0,
                                    'timestamp': datetime.datetime.now().isoformat(),
                                    'tags': ['code', 'local']
                                })
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Codebase search failed: {str(e)}")
            
        return results
    
    def _search_documentation(self, query: str) -> List[Dict[str, Any]]:
        """Search local documentation"""
        print("🔍 Searching documentation...")
        results = []
        
        try:
            # Search for documentation files
            doc_patterns = [
                "*.md",
                "*.txt", 
                "*.rst",
                "docs/**/*",
                "README*"
            ]
            
            import glob
            for pattern in doc_patterns:
                matching_files = glob.glob(pattern, recursive=True)
                
                for file_path in matching_files[:10]:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            if query.lower() in content.lower():
                                results.append({
                                    'source': 'documentation',
                                    'title': f"Documentation: {file_path}",
                                    'content': content[:500] + "..." if len(content) > 500 else content,
                                    'url': file_path,
                                    'relevance_score': 0.9,
                                    'confidence_score': 1.0,
                                    'timestamp': datetime.datetime.now().isoformat(),
                                    'tags': ['documentation', 'local']
                                })
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Documentation search failed: {str(e)}")
            
        return results
    
    def _search_web(self, query: str) -> List[Dict[str, Any]]:
        """Search web resources"""
        print("🔍 Searching web resources...")
        results = []
        
        try:
            # Search MDN Web Docs
            mdn_url = f"https://developer.mozilla.org/en-US/search?q={query}"
            results.append({
                'source': 'MDN Web Docs',
                'title': f"MDN Search: {query}",
                'content': f"Search MDN Web Docs for {query}",
                'url': mdn_url,
                'relevance_score': 0.7,
                'confidence_score': 0.95,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['web', 'documentation', 'mdn']
            })
            
            # Search GitHub
            github_url = f"https://github.com/search?q={query}"
            results.append({
                'source': 'GitHub',
                'title': f"GitHub Search: {query}",
                'content': f"Search GitHub repositories for {query}",
                'url': github_url,
                'relevance_score': 0.8,
                'confidence_score': 0.9,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['code', 'github', 'repositories']
            })
            
        except Exception as e:
            print(f"Warning: Web search failed: {str(e)}")
            
        return results
    
    def _search_apis(self, query: str) -> List[Dict[str, Any]]:
        """Search API resources"""
        print("🔍 Searching API resources...")
        results = []
        
        try:
            # Search NPM registry
            npm_url = f"https://www.npmjs.com/search?q={query}"
            results.append({
                'source': 'NPM Registry',
                'title': f"NPM Search: {query}",
                'content': f"Search NPM packages for {query}",
                'url': npm_url,
                'relevance_score': 0.8,
                'confidence_score': 0.9,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['npm', 'packages', 'javascript']
            })
            
            # Search PyPI
            pypi_url = f"https://pypi.org/search/?q={query}"
            results.append({
                'source': 'PyPI',
                'title': f"PyPI Search: {query}",
                'content': f"Search Python packages for {query}",
                'url': pypi_url,
                'relevance_score': 0.8,
                'confidence_score': 0.9,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['pypi', 'packages', 'python']
            })
            
        except Exception as e:
            print(f"Warning: API search failed: {str(e)}")
            
        return results
    
    def _search_security(self, query: str) -> List[Dict[str, Any]]:
        """Search security resources"""
        print("🔍 Searching security resources...")
        results = []
        
        try:
            # Search GitHub Security Advisories
            security_url = f"https://github.com/advisories?query={query}"
            results.append({
                'source': 'GitHub Security Advisories',
                'title': f"Security Search: {query}",
                'content': f"Search security advisories for {query}",
                'url': security_url,
                'relevance_score': 0.9,
                'confidence_score': 0.95,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['security', 'advisories', 'vulnerabilities']
            })
            
            # Search CVE database
            cve_url = f"https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword={query}"
            results.append({
                'source': 'CVE Database',
                'title': f"CVE Search: {query}",
                'content': f"Search CVE database for {query}",
                'url': cve_url,
                'relevance_score': 0.9,
                'confidence_score': 0.95,
                'timestamp': datetime.datetime.now().isoformat(),
                'tags': ['security', 'cve', 'vulnerabilities']
            })
            
        except Exception as e:
            print(f"Warning: Security search failed: {str(e)}")
            
        return results
    
    def _analyze_patterns(self, query: str, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze patterns in research results using pattern recognition frame"""
        print("🧠 Analyzing patterns...")
        pattern_results = []
        
        try:
            # Look for recurring themes and patterns
            themes = {}
            for result in results:
                content = result.get('content', '').lower()
                title = result.get('title', '').lower()
                
                # Extract key terms
                terms = content.split() + title.split()
                for term in terms:
                    if len(term) > 3:  # Only meaningful terms
                        themes[term] = themes.get(term, 0) + 1
            
            # Find most common patterns
            common_patterns = sorted(themes.items(), key=lambda x: x[1], reverse=True)[:5]
            
            for pattern, count in common_patterns:
                if count > 1:  # Only patterns that appear multiple times
                    pattern_results.append({
                        'source': 'Pattern Recognition',
                        'title': f"Pattern: {pattern} (appears {count} times)",
                        'content': f"Recurring pattern '{pattern}' found across {count} research results. This suggests a common theme or approach.",
                        'url': None,
                        'relevance_score': min(0.9, count * 0.2),  # Higher count = higher relevance
                        'confidence_score': 0.8,
                        'timestamp': datetime.datetime.now().isoformat(),
                        'tags': ['pattern', 'analysis', 'recurring']
                    })
            
            # Look for OCTOSPINE and consciousness nexus patterns specifically
            octospine_mentions = sum(1 for r in results if 'octospine' in r.get('content', '').lower())
            nexus_mentions = sum(1 for r in results if 'consciousness nexus' in r.get('content', '').lower())
            
            if octospine_mentions > 0:
                pattern_results.append({
                    'source': 'Pattern Recognition',
                    'title': f"OCTOSPINE Pattern: {octospine_mentions} mentions",
                    'content': f"OCTOSPINE system mentioned {octospine_mentions} times in research results. This indicates strong relevance to the OCTOSPINE automation matrix.",
                    'url': None,
                    'relevance_score': 0.95,
                    'confidence_score': 0.9,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['octospine', 'pattern', 'automation']
                })
            
            if nexus_mentions > 0:
                pattern_results.append({
                    'source': 'Pattern Recognition',
                    'title': f"Consciousness Nexus Pattern: {nexus_mentions} mentions",
                    'content': f"Consciousness Nexus mentioned {nexus_mentions} times in research results. This indicates strong relevance to consciousness processing capabilities.",
                    'url': None,
                    'relevance_score': 0.95,
                    'confidence_score': 0.9,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['consciousness', 'nexus', 'pattern']
                })
                
        except Exception as e:
            print(f"Warning: Pattern analysis failed: {str(e)}")
            
        return pattern_results
    
    def _analyze_synergies(self, query: str, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze synergies between different research results"""
        print("🔗 Analyzing synergies...")
        synergy_results = []
        
        try:
            # Look for potential synergies between different result types
            code_results = [r for r in results if 'code' in r.get('tags', [])]
            security_results = [r for r in results if 'security' in r.get('tags', [])]
            doc_results = [r for r in results if 'documentation' in r.get('tags', [])]
            
            # Code + Security synergy
            if code_results and security_results:
                synergy_results.append({
                    'source': 'Synergy Analysis',
                    'title': 'Code + Security Synergy',
                    'content': f"Found {len(code_results)} code results and {len(security_results)} security results. Combining code implementation with security best practices creates a robust solution.",
                    'url': None,
                    'relevance_score': 0.9,
                    'confidence_score': 0.85,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['synergy', 'code', 'security']
                })
            
            # Documentation + Implementation synergy
            if doc_results and code_results:
                synergy_results.append({
                    'source': 'Synergy Analysis',
                    'title': 'Documentation + Implementation Synergy',
                    'content': f"Found {len(doc_results)} documentation results and {len(code_results)} code results. Documentation guides implementation, creating a complete solution.",
                    'url': None,
                    'relevance_score': 0.85,
                    'confidence_score': 0.8,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['synergy', 'documentation', 'implementation']
                })
            
            # Research + OCTOSPINE synergy
            octospine_results = [r for r in results if 'octospine' in r.get('content', '').lower()]
            if octospine_results:
                synergy_results.append({
                    'source': 'Synergy Analysis',
                    'title': 'Research + OCTOSPINE Integration Synergy',
                    'content': f"Found {len(octospine_results)} OCTOSPINE-related results. Research findings can be integrated into the OCTOSPINE automation matrix for enhanced capabilities.",
                    'url': None,
                    'relevance_score': 0.95,
                    'confidence_score': 0.9,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['synergy', 'octospine', 'integration']
                })
                
        except Exception as e:
            print(f"Warning: Synergy analysis failed: {str(e)}")
            
        return synergy_results
    
    def _assess_risks(self, query: str, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Assess risks associated with research results"""
        print("⚠️ Assessing risks...")
        risk_results = []
        
        try:
            # Identify potential risks
            security_risks = [r for r in results if 'security' in r.get('tags', []) and 'vulnerability' in r.get('content', '').lower()]
            implementation_risks = [r for r in results if 'code' in r.get('tags', []) and any(word in r.get('content', '').lower() for word in ['error', 'bug', 'issue', 'problem'])]
            
            if security_risks:
                risk_results.append({
                    'source': 'Risk Assessment',
                    'title': 'Security Risk Identified',
                    'content': f"Found {len(security_risks)} security-related results with potential vulnerabilities. Review and address security concerns before implementation.",
                    'url': None,
                    'relevance_score': 0.9,
                    'confidence_score': 0.85,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['risk', 'security', 'vulnerability']
                })
            
            if implementation_risks:
                risk_results.append({
                    'source': 'Risk Assessment',
                    'title': 'Implementation Risk Identified',
                    'content': f"Found {len(implementation_risks)} code results with potential issues. Review implementation details carefully and test thoroughly.",
                    'url': None,
                    'relevance_score': 0.8,
                    'confidence_score': 0.75,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['risk', 'implementation', 'testing']
                })
            
            # OCTOSPINE-specific risk assessment
            octospine_results = [r for r in results if 'octospine' in r.get('content', '').lower()]
            if octospine_results:
                risk_results.append({
                    'source': 'Risk Assessment',
                    'title': 'OCTOSPINE Integration Risk Assessment',
                    'content': f"Found {len(octospine_results)} OCTOSPINE-related results. Ensure proper integration with existing OCTOSPINE framework to avoid conflicts.",
                    'url': None,
                    'relevance_score': 0.85,
                    'confidence_score': 0.8,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'tags': ['risk', 'octospine', 'integration']
                })
                
        except Exception as e:
            print(f"Warning: Risk assessment failed: {str(e)}")
            
        return risk_results
    
    def _rank_results(self, results: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """Rank and sort research results"""
        # Calculate relevance scores based on query matching
        for result in results:
            # Boost score for exact matches
            if query.lower() in result['title'].lower():
                result['relevance_score'] += 0.2
            if query.lower() in result['content'].lower():
                result['relevance_score'] += 0.1
                
            # Cap relevance score at 1.0
            result['relevance_score'] = min(1.0, result['relevance_score'])
        
        # Sort by relevance score (descending)
        ranked_results = sorted(results, key=lambda x: x['relevance_score'], reverse=True)
        
        return ranked_results[:20]  # Return top 20 results
    
    def _generate_recommendations(self, results: List[Dict[str, Any]], query: str) -> List[str]:
        """Generate recommendations based on research results"""
        recommendations = []
        
        if not results:
            recommendations.append("🔍 No relevant results found. Consider broadening the search terms.")
            recommendations.append("📚 Check official documentation for the specific technology.")
            recommendations.append("💬 Consider asking in relevant community forums.")
            return recommendations
        
        # Analyze results and generate recommendations
        high_relevance = [r for r in results if r['relevance_score'] > 0.8]
        medium_relevance = [r for r in results if 0.5 < r['relevance_score'] <= 0.8]
        
        if high_relevance:
            recommendations.append("✅ Found highly relevant solutions. Review the top results first.")
            
        if medium_relevance:
            recommendations.append("🔍 Found moderately relevant solutions. Consider combining multiple approaches.")
            
        # Specific recommendations based on result types
        code_results = [r for r in results if 'code' in r.get('tags', [])]
        if code_results:
            recommendations.append("💻 Code examples found. Review implementation details carefully.")
            
        security_results = [r for r in results if 'security' in r.get('tags', [])]
        if security_results:
            recommendations.append("🛡️ Security-related information found. Prioritize security best practices.")
            
        doc_results = [r for r in results if 'documentation' in r.get('tags', [])]
        if doc_results:
            recommendations.append("📖 Documentation found. Review official guidelines and examples.")
            
        return recommendations
    
    def _generate_next_steps(self, results: List[Dict[str, Any]], query: str) -> List[str]:
        """Generate next steps based on research results"""
        next_steps = []
        
        if not results:
            next_steps.append("🔍 Expand search terms and try alternative queries")
            next_steps.append("📚 Consult official documentation and tutorials")
            next_steps.append("💬 Reach out to community forums or support channels")
            return next_steps
        
        # Generate specific next steps
        next_steps.append("📋 Review the top research results and identify the most relevant solutions")
        next_steps.append("🔍 Test and validate the proposed solutions in a safe environment")
        next_steps.append("📝 Document the findings and implementation approach")
        
        # Specific next steps based on result types
        code_results = [r for r in results if 'code' in r.get('tags', [])]
        if code_results:
            next_steps.append("💻 Implement and test the code examples found")
            
        security_results = [r for r in results if 'security' in r.get('tags', [])]
        if security_results:
            next_steps.append("🛡️ Apply security best practices and validate security implications")
            
        return next_steps
    
    def _generate_summary(self, query: ResearchQuery, results: List[Dict[str, Any]]) -> str:
        """Generate research summary"""
        total_results = len(results)
        high_relevance = len([r for r in results if r['relevance_score'] > 0.8])
        medium_relevance = len([r for r in results if 0.5 < r['relevance_score'] <= 0.8])
        low_relevance = len([r for r in results if r['relevance_score'] <= 0.5])
        
        summary = f"""
🔍 Research Summary
==================
Query: {query.query}
Category: {query.category}
Priority: {query.priority}

Results Found: {total_results}
- High Relevance: {high_relevance}
- Medium Relevance: {medium_relevance}  
- Low Relevance: {low_relevance}

Solution Found: {'✅ Yes' if query.solution_found else '❌ No'}
Confidence Score: {query.confidence_score:.1f}/1.0

Status: {'🟢 SUCCESS' if query.solution_found else '🟡 PARTIAL' if medium_relevance > 0 else '🔴 NEEDS_MORE_RESEARCH'}
        """.strip()
        
        return summary
    
    def get_research_stats(self) -> Dict[str, Any]:
        """Get research statistics"""
        total_queries = len(self.queries)
        completed_queries = len([q for q in self.queries if q.status == "completed"])
        successful_queries = len([q for q in self.queries if q.solution_found])
        
        queries_by_category = {}
        for query in self.queries:
            category = query.category
            queries_by_category[category] = queries_by_category.get(category, 0) + 1
        
        return {
            "total_queries": total_queries,
            "completed_queries": completed_queries,
            "successful_queries": successful_queries,
            "success_rate": (successful_queries / total_queries * 100) if total_queries > 0 else 0,
            "queries_by_category": queries_by_category,
            "total_results": len(self.results),
            "sources_available": len(self.sources)
        }
    
    def export_report(self, report: ResearchReport, format: str = "json") -> str:
        """Export research report in specified format"""
        if format == "json":
            return json.dumps(asdict(report), indent=2)
        elif format == "markdown":
            return self._generate_markdown_report(report)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def _generate_markdown_report(self, report: ResearchReport) -> str:
        """Generate Markdown research report"""
        # Build query summary
        query_summary = ""
        for i, query in enumerate(report.queries):
            query_summary += f"""
### Query {i+1}
- **Query:** {query.query}
- **Category:** {query.category}
- **Priority:** {query.priority}
- **Status:** {query.status}
- **Solution Found:** {'✅ Yes' if query.solution_found else '❌ No'}
- **Confidence Score:** {query.confidence_score:.1f}/1.0
"""
        
        # Build results section
        results_section = ""
        for result in report.results[:10]:  # Show top 10 results
            results_section += f"""
### {result.title}
- **Source:** {result.source}
- **Relevance Score:** {result.relevance_score:.1f}/1.0
- **Confidence Score:** {result.confidence_score:.1f}/1.0
- **URL:** {result.url or 'N/A'}
- **Content:** {result.content[:200]}...
- **Tags:** {', '.join(result.tags) if result.tags else 'None'}
"""
        
        # Build recommendations
        recommendations = "\n".join([f"- {rec}" for rec in report.recommendations])
        
        # Build next steps
        next_steps = "\n".join([f"- {step}" for step in report.next_steps])
        
        markdown = f"""
# 🔍 Research Report

**Report ID:** {report.report_id}  
**Timestamp:** {report.timestamp}

## Query Summary

{query_summary}

## Results ({len(report.results)})

{results_section}

## Recommendations

{recommendations}

## Next Steps

{next_steps}

## Summary

```
{report.summary}
```
        """
        return markdown

def main():
    """Main execution function"""
    try:
        research_frame = ResearchInformationFrame()
        
        # Get query from command line arguments
        import sys
        if len(sys.argv) < 2:
            print("Usage: python research-information-frame.py <query> [context] [priority] [category]")
            sys.exit(1)
            
        query = sys.argv[1]
        context = sys.argv[2] if len(sys.argv) > 2 else ""
        priority = sys.argv[3] if len(sys.argv) > 3 else "medium"
        category = sys.argv[4] if len(sys.argv) > 4 else "general"
        
        # Execute research
        report = research_frame.execute_research(query, context, priority, category)
        
        # Export report
        report_json = research_frame.export_report(report, "json")
        print(report_json)
        
        # Print summary
        print("\n" + "="*50)
        print("🔍 RESEARCH COMPLETED")
        print("="*50)
        print(f"Query: {query}")
        print(f"Results Found: {len(report.results)}")
        print(f"Solution Found: {'✅ Yes' if report.queries[0].solution_found else '❌ No'}")
        print(f"Confidence Score: {report.queries[0].confidence_score:.1f}/1.0")
        
        if report.recommendations:
            print("\n📋 RECOMMENDATIONS:")
            for rec in report.recommendations[:5]:  # Show top 5
                print(f"  • {rec}")
        
    except Exception as e:
        print(f"Research failed: {str(e)}")
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()
