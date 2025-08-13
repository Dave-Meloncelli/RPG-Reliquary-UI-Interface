#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Existence Check Frame
========================

Automatically checks if implementations, features, or components already exist
before building new ones. Prevents duplication and ensures efficient resource usage.

Part of the OCTOSPINE Automation Matrix (OAM) - The First Vertebra
"""

import json
import datetime
import os
import sys
import glob
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict

@dataclass
class ExistenceCheck:
    """Represents an existence check result"""
    id: str
    query: str
    category: str  # code, documentation, configuration, service, etc.
    timestamp: str
    exists: bool
    locations: List[str]
    confidence_score: float
    recommendations: List[str]
    alternative_suggestions: List[str]

@dataclass
class ExistenceReport:
    """Comprehensive existence check report"""
    report_id: str
    timestamp: str
    checks: List[ExistenceCheck]
    summary: str
    build_recommendation: str  # "build_new", "use_existing", "enhance_existing", "skip"
    priority: str  # critical, high, medium, low

class ExistenceCheckFrame:
    """
    🔍 Existence Check Frame
    
    Automatically checks if implementations already exist before building new ones.
    Prevents duplication and ensures efficient resource usage.
    """
    
    def __init__(self, database_path: str = "OCTOSPINE/TECHNICAL/nexus/existence-database/existence-database.json"):
        self.checks: List[ExistenceCheck] = []
        self.database_path = database_path
        
        # Load existing check data
        self._load_database()
        
    def _load_database(self) -> None:
        """Load existing check data from database"""
        try:
            if os.path.exists(self.database_path):
                with open(self.database_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Load checks
                for check_data in data.get('checks', []):
                    check = ExistenceCheck(**check_data)
                    self.checks.append(check)
                    
                print(f"✅ Loaded {len(self.checks)} existence checks from database")
            else:
                print("📝 No existing check database found. Creating new one.")
                
        except Exception as e:
            print(f"Warning: Failed to load existence database: {str(e)}")
    
    def _save_database(self) -> None:
        """Save check data to database"""
        try:
            os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
            
            data = {
                "database_info": {
                    "name": "OCTOSPINE Existence Check Database",
                    "version": "1.0.0",
                    "created": "2025-08-12T17:00:00.000Z",
                    "description": "Persistent storage for all existence checks",
                    "total_checks": len(self.checks),
                    "last_updated": datetime.datetime.now().isoformat()
                },
                "checks": [asdict(check) for check in self.checks]
            }
            
            with open(self.database_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Saved {len(self.checks)} existence checks to database")
            
        except Exception as e:
            print(f"Error: Failed to save existence database: {str(e)}")
    
    def check_existence(self, query: str, category: str = "general") -> ExistenceCheck:
        """
        Check if something already exists
        
        Args:
            query: What to check for existence
            category: Category of the item (code, documentation, service, etc.)
            
        Returns:
            ExistenceCheck with comprehensive results
        """
        print(f"🔍 Checking existence for: {query}")
        
        check_id = f"check_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Perform comprehensive existence check
        exists, locations, confidence = self._perform_existence_search(query, category)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(exists, locations, query, category)
        
        # Generate alternative suggestions
        alternatives = self._generate_alternatives(query, category)
        
        # Create existence check
        check = ExistenceCheck(
            id=check_id,
            query=query,
            category=category,
            timestamp=datetime.datetime.now().isoformat(),
            exists=exists,
            locations=locations,
            confidence_score=confidence,
            recommendations=recommendations,
            alternative_suggestions=alternatives
        )
        
        self.checks.append(check)
        self._save_database()
        
        return check
    
    def _perform_existence_search(self, query: str, category: str) -> Tuple[bool, List[str], float]:
        """Perform comprehensive existence search"""
        locations = []
        confidence = 0.0
        
        try:
            # 1. Code search
            if category in ["code", "service", "component", "general"]:
                code_locations = self._search_code(query)
                locations.extend(code_locations)
                if code_locations:
                    confidence += 0.4
            
            # 2. Documentation search
            if category in ["documentation", "guide", "manual", "general"]:
                doc_locations = self._search_documentation(query)
                locations.extend(doc_locations)
                if doc_locations:
                    confidence += 0.3
            
            # 3. Configuration search
            if category in ["configuration", "config", "settings", "general"]:
                config_locations = self._search_configuration(query)
                locations.extend(config_locations)
                if config_locations:
                    confidence += 0.2
            
            # 4. Service search
            if category in ["service", "api", "endpoint", "general"]:
                service_locations = self._search_services(query)
                locations.extend(service_locations)
                if service_locations:
                    confidence += 0.3
            
            # 5. Frame search
            if category in ["frame", "automation", "tool", "general"]:
                frame_locations = self._search_frames(query)
                locations.extend(frame_locations)
                if frame_locations:
                    confidence += 0.4
            
            # 6. Database search (check past existence checks)
            db_locations = self._search_database(query)
            locations.extend(db_locations)
            if db_locations:
                confidence += 0.2
            
            # Remove duplicates and calculate final confidence
            locations = list(set(locations))
            confidence = min(1.0, confidence)
            
            exists = len(locations) > 0
            
        except Exception as e:
            print(f"Warning: Existence search failed: {str(e)}")
            exists = False
            confidence = 0.0
        
        return exists, locations, confidence
    
    def _search_code(self, query: str) -> List[str]:
        """Search for code implementations"""
        locations = []
        
        try:
            # Search in common code directories
            code_patterns = [
                "src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx",
                "backend/**/*.py", "backend/**/*.js",
                "tools/**/*.py", "tools/**/*.js",
                "scripts/**/*.py", "scripts/**/*.js"
            ]
            
            for pattern in code_patterns:
                files = glob.glob(pattern, recursive=True)
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read().lower()
                            if query.lower() in content:
                                locations.append(f"Code: {file_path}")
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Code search failed: {str(e)}")
            
        return locations
    
    def _search_documentation(self, query: str) -> List[str]:
        """Search for documentation"""
        locations = []
        
        try:
            # Search in documentation directories
            doc_patterns = [
                "docs/**/*.md", "docs/**/*.txt",
                "*.md", "*.txt", "README*"
            ]
            
            for pattern in doc_patterns:
                files = glob.glob(pattern, recursive=True)
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read().lower()
                            if query.lower() in content:
                                locations.append(f"Documentation: {file_path}")
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Documentation search failed: {str(e)}")
            
        return locations
    
    def _search_configuration(self, query: str) -> List[str]:
        """Search for configuration files"""
        locations = []
        
        try:
            # Search in configuration directories
            config_patterns = [
                "config/**/*.json", "config/**/*.yml", "config/**/*.yaml",
                "*.config.*", "*.conf.*", "package.json", "tsconfig.json"
            ]
            
            for pattern in config_patterns:
                files = glob.glob(pattern, recursive=True)
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read().lower()
                            if query.lower() in content:
                                locations.append(f"Configuration: {file_path}")
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Configuration search failed: {str(e)}")
            
        return locations
    
    def _search_services(self, query: str) -> List[str]:
        """Search for services"""
        locations = []
        
        try:
            # Search in service directories
            service_patterns = [
                "src/services/**/*.ts", "src/services/**/*.js",
                "backend/**/*.py", "services/**/*.py", "services/**/*.js"
            ]
            
            for pattern in service_patterns:
                files = glob.glob(pattern, recursive=True)
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read().lower()
                            if query.lower() in content:
                                locations.append(f"Service: {file_path}")
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Service search failed: {str(e)}")
            
        return locations
    
    def _search_frames(self, query: str) -> List[str]:
        """Search for existing frames"""
        locations = []
        
        try:
            # Search in frame directories
            frame_patterns = [
                "OCTOSPINE/TECHNICAL/scaffold-frames/**/*.py",
                "scripts/frames/**/*.py",
                "tools/**/*.py"
            ]
            
            for pattern in frame_patterns:
                files = glob.glob(pattern, recursive=True)
                for file_path in files:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read().lower()
                            if query.lower() in content:
                                locations.append(f"Frame: {file_path}")
                    except Exception:
                        continue
                        
        except Exception as e:
            print(f"Warning: Frame search failed: {str(e)}")
            
        return locations
    
    def _search_database(self, query: str) -> List[str]:
        """Search past existence checks"""
        locations = []
        
        try:
            for check in self.checks:
                if query.lower() in check.query.lower():
                    locations.append(f"Previous Check: {check.query} (exists: {check.exists})")
                    
        except Exception as e:
            print(f"Warning: Database search failed: {str(e)}")
            
        return locations
    
    def _generate_recommendations(self, exists: bool, locations: List[str], query: str, category: str) -> List[str]:
        """Generate recommendations based on existence check"""
        recommendations = []
        
        if exists:
            recommendations.append(f"✅ Found existing implementation(s) for '{query}'")
            recommendations.append(f"📁 Locations: {', '.join(locations[:3])}")  # Show first 3
            recommendations.append("🔍 Review existing implementation before building new")
            recommendations.append("🔄 Consider enhancing existing implementation instead")
            
            if len(locations) > 3:
                recommendations.append(f"📋 ... and {len(locations) - 3} more locations")
        else:
            recommendations.append(f"🆕 No existing implementation found for '{query}'")
            recommendations.append("✅ Safe to proceed with new implementation")
            recommendations.append("📝 Consider documenting the new implementation")
            
        # Category-specific recommendations
        if category == "code":
            recommendations.append("💻 Check for similar patterns in existing codebase")
        elif category == "service":
            recommendations.append("🔗 Ensure new service integrates with existing architecture")
        elif category == "frame":
            recommendations.append("🧠 Consider how new frame integrates with existing automation matrix")
            
        return recommendations
    
    def _generate_alternatives(self, query: str, category: str) -> List[str]:
        """Generate alternative suggestions"""
        alternatives = []
        
        # Generate variations of the query
        variations = [
            query.replace(" ", "_"),
            query.replace(" ", "-"),
            query.lower(),
            query.upper(),
            query.title()
        ]
        
        for variation in variations:
            if variation != query:
                alternatives.append(f"Try searching for: {variation}")
        
        # Category-specific alternatives
        if category == "code":
            alternatives.append("Check for similar functionality in existing services")
            alternatives.append("Look for design patterns that could be reused")
        elif category == "service":
            alternatives.append("Check if existing services can be extended")
            alternatives.append("Look for similar APIs or endpoints")
        elif category == "frame":
            alternatives.append("Check if existing frames can be enhanced")
            alternatives.append("Look for similar automation patterns")
            
        return alternatives
    
    def generate_build_recommendation(self, check: ExistenceCheck) -> str:
        """Generate build recommendation based on existence check"""
        if not check.exists:
            return "build_new"
        elif check.confidence_score < 0.5:
            return "build_new"  # Low confidence in existing implementation
        elif check.confidence_score < 0.8:
            return "enhance_existing"  # Medium confidence - enhance existing
        else:
            return "use_existing"  # High confidence - use existing
    
    def get_existence_stats(self) -> Dict[str, Any]:
        """Get existence check statistics"""
        total_checks = len(self.checks)
        existing_items = len([c for c in self.checks if c.exists])
        non_existing_items = total_checks - existing_items
        
        categories = {}
        for check in self.checks:
            category = check.category
            categories[category] = categories.get(category, 0) + 1
        
        return {
            "total_checks": total_checks,
            "existing_items": existing_items,
            "non_existing_items": non_existing_items,
            "existence_rate": (existing_items / total_checks * 100) if total_checks > 0 else 0,
            "categories": categories
        }

def main():
    """Main execution function"""
    try:
        existence_frame = ExistenceCheckFrame()
        
        # Get query from command line arguments
        if len(sys.argv) < 2:
            print("Usage: python existence-check-frame.py <query> [category]")
            sys.exit(1)
            
        query = sys.argv[1]
        category = sys.argv[2] if len(sys.argv) > 2 else "general"
        
        # Perform existence check
        check = existence_frame.check_existence(query, category)
        
        # Generate build recommendation
        build_rec = existence_frame.generate_build_recommendation(check)
        
        # Print results
        print("\n" + "="*60)
        print("🔍 EXISTENCE CHECK RESULTS")
        print("="*60)
        print(f"Query: {check.query}")
        print(f"Category: {check.category}")
        print(f"Exists: {'✅ Yes' if check.exists else '❌ No'}")
        print(f"Confidence: {check.confidence_score:.1f}/1.0")
        print(f"Build Recommendation: {build_rec.upper()}")
        
        if check.locations:
            print(f"\n📁 Found in:")
            for location in check.locations[:5]:  # Show first 5
                print(f"  • {location}")
            if len(check.locations) > 5:
                print(f"  • ... and {len(check.locations) - 5} more")
        
        print(f"\n📋 RECOMMENDATIONS:")
        for rec in check.recommendations:
            print(f"  • {rec}")
        
        if check.alternative_suggestions:
            print(f"\n💡 ALTERNATIVES:")
            for alt in check.alternative_suggestions[:3]:  # Show first 3
                print(f"  • {alt}")
        
        # Export as JSON
        check_json = json.dumps(asdict(check), indent=2)
        print(f"\n📄 JSON Result:")
        print(check_json)
        
    except Exception as e:
        print(f"Existence check failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
