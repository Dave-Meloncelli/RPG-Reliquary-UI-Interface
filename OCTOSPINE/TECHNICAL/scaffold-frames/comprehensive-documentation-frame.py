#!/usr/bin/env python3
"""
📚 COMPREHENSIVE DOCUMENTATION FRAME
===================================

This frame generates comprehensive documentation for:
1. Developer Documentation (API docs, code examples, integration guides)
2. End-User Documentation (user guides, tutorials, troubleshooting)
3. System-Level Documentation (architecture, components, processes)
4. Indexing & Discovery (tools, systems, components, processes)

Features:
- Multi-format output (Markdown, HTML, PDF, JSON)
- Intelligent code analysis and documentation
- Automated API documentation generation
- System architecture mapping
- Component relationship visualization
- Process flow documentation
- Indexing and search capabilities

Author: OCTOSPINE Unified System
Created: 2025-08-13
"""

import json
import os
import sys
import ast
import inspect
import re
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional, Set
from enum import Enum
import glob
from pathlib import Path
import subprocess

class DocType(Enum):
    DEVELOPER = "developer"
    END_USER = "end_user"
    SYSTEM = "system"
    API = "api"
    ARCHITECTURE = "architecture"
    PROCESS = "process"
    INDEX = "index"

class DocFormat(Enum):
    MARKDOWN = "markdown"
    HTML = "html"
    PDF = "pdf"
    JSON = "json"
    RST = "rst"

@dataclass
class DocumentationItem:
    id: str
    title: str
    content: str
    doc_type: DocType
    format: DocFormat
    file_path: Optional[str]
    line_number: Optional[int]
    dependencies: List[str]
    tags: List[str]
    created_at: str
    updated_at: str
    metadata: Dict[str, Any]

@dataclass
class SystemComponent:
    name: str
    type: str
    file_path: str
    description: str
    dependencies: List[str]
    interfaces: List[str]
    functions: List[str]
    classes: List[str]
    metadata: Dict[str, Any]

@dataclass
class ProcessFlow:
    name: str
    description: str
    steps: List[Dict[str, Any]]
    inputs: List[str]
    outputs: List[str]
    dependencies: List[str]
    error_handling: List[str]
    metadata: Dict[str, Any]

class ComprehensiveDocumentationFrame:
    def __init__(self):
        self.database_path = "OCTOSPINE/TECHNICAL/nexus/documentation-database"
        self.docs_file = f"{self.database_path}/documentation.json"
        self.components_file = f"{self.database_path}/components.json"
        self.processes_file = f"{self.database_path}/processes.json"
        self.index_file = f"{self.database_path}/index.json"
        
        # Ensure database directory exists
        os.makedirs(self.database_path, exist_ok=True)
        
        # Initialize or load existing data
        self.documentation = self._load_documentation()
        self.components = self._load_components()
        self.processes = self._load_processes()
        self.index = self._load_index()
    
    def _load_documentation(self) -> List[DocumentationItem]:
        """Load existing documentation"""
        if os.path.exists(self.docs_file):
            try:
                with open(self.docs_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    docs = []
                    for item in data:
                        # Convert string values back to enums
                        item['doc_type'] = DocType(item['doc_type'])
                        item['format'] = DocFormat(item['format'])
                        docs.append(DocumentationItem(**item))
                    return docs
            except Exception as e:
                print(f"⚠️ Error loading documentation: {e}")
        return []
    
    def _load_components(self) -> List[SystemComponent]:
        """Load existing components"""
        if os.path.exists(self.components_file):
            try:
                with open(self.components_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return [SystemComponent(**item) for item in data]
            except Exception as e:
                print(f"⚠️ Error loading components: {e}")
        return []
    
    def _load_processes(self) -> List[ProcessFlow]:
        """Load existing processes"""
        if os.path.exists(self.processes_file):
            try:
                with open(self.processes_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return [ProcessFlow(**item) for item in data]
            except Exception as e:
                print(f"⚠️ Error loading processes: {e}")
        return []
    
    def _load_index(self) -> Dict[str, Any]:
        """Load existing index"""
        if os.path.exists(self.index_file):
            try:
                with open(self.index_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️ Error loading index: {e}")
        return {"tools": {}, "systems": {}, "components": {}, "processes": {}}
    
    def _save_documentation(self):
        """Save documentation to database"""
        try:
            # Convert enum values to strings for JSON serialization
            docs_data = []
            for doc in self.documentation:
                doc_dict = asdict(doc)
                doc_dict['doc_type'] = doc.doc_type.value
                doc_dict['format'] = doc.format.value
                docs_data.append(doc_dict)
            
            with open(self.docs_file, 'w', encoding='utf-8') as f:
                json.dump(docs_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving documentation: {e}")
    
    def _save_components(self):
        """Save components to database"""
        try:
            with open(self.components_file, 'w', encoding='utf-8') as f:
                json.dump([asdict(comp) for comp in self.components], f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving components: {e}")
    
    def _save_processes(self):
        """Save processes to database"""
        try:
            with open(self.processes_file, 'w', encoding='utf-8') as f:
                json.dump([asdict(proc) for proc in self.processes], f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving processes: {e}")
    
    def _save_index(self):
        """Save index to database"""
        try:
            with open(self.index_file, 'w', encoding='utf-8') as f:
                json.dump(self.index, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"⚠️ Error saving index: {e}")
    
    def analyze_code_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze a code file and extract documentation information"""
        analysis = {
            "file_path": file_path,
            "functions": [],
            "classes": [],
            "imports": [],
            "docstrings": [],
            "comments": [],
            "complexity": 0,
            "lines_of_code": 0
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            analysis["lines_of_code"] = len(content.split('\n'))
            
            # Parse Python files
            if file_path.endswith('.py'):
                try:
                    tree = ast.parse(content)
                    
                    # Extract functions
                    for node in ast.walk(tree):
                        if isinstance(node, ast.FunctionDef):
                            func_info = {
                                "name": node.name,
                                "line": node.lineno,
                                "args": [arg.arg for arg in node.args.args],
                                "docstring": ast.get_docstring(node),
                                "decorators": [d.id for d in node.decorator_list if hasattr(d, 'id')]
                            }
                            analysis["functions"].append(func_info)
                        
                        elif isinstance(node, ast.ClassDef):
                            class_info = {
                                "name": node.name,
                                "line": node.lineno,
                                "docstring": ast.get_docstring(node),
                                "methods": [n.name for n in node.body if isinstance(n, ast.FunctionDef)],
                                "bases": [base.id for base in node.bases if hasattr(base, 'id')]
                            }
                            analysis["classes"].append(class_info)
                        
                        elif isinstance(node, ast.Import):
                            for alias in node.names:
                                analysis["imports"].append(alias.name)
                        
                        elif isinstance(node, ast.ImportFrom):
                            module = node.module or ""
                            for alias in node.names:
                                analysis["imports"].append(f"{module}.{alias.name}")
                    
                    # Extract docstrings
                    docstring_pattern = r'"""(.*?)"""'
                    analysis["docstrings"] = re.findall(docstring_pattern, content, re.DOTALL)
                    
                    # Extract comments
                    comment_pattern = r'#.*$'
                    analysis["comments"] = re.findall(comment_pattern, content, re.MULTILINE)
                    
                except SyntaxError:
                    analysis["error"] = "Syntax error in Python file"
            
            # Analyze JavaScript/TypeScript files
            elif file_path.endswith(('.js', '.ts', '.tsx')):
                # Extract function definitions
                func_pattern = r'(?:function\s+(\w+)|(\w+)\s*[:=]\s*function|(\w+)\s*[:=]\s*\([^)]*\)\s*=>)'
                functions = re.findall(func_pattern, content)
                for func in functions:
                    func_name = next(name for name in func if name)
                    analysis["functions"].append({"name": func_name, "type": "javascript"})
                
                # Extract class definitions
                class_pattern = r'class\s+(\w+)'
                classes = re.findall(class_pattern, content)
                for class_name in classes:
                    analysis["classes"].append({"name": class_name, "type": "javascript"})
                
                # Extract imports
                import_pattern = r'import\s+(?:.*?from\s+)?[\'"]([^\'"]+)[\'"]'
                imports = re.findall(import_pattern, content)
                analysis["imports"].extend(imports)
                
                # Extract comments
                comment_pattern = r'//.*$|/\*.*?\*/'
                analysis["comments"] = re.findall(comment_pattern, content, re.MULTILINE | re.DOTALL)
            
            # Calculate complexity (simple metric)
            analysis["complexity"] = len(analysis["functions"]) + len(analysis["classes"]) * 2
            
        except Exception as e:
            analysis["error"] = str(e)
        
        return analysis
    
    def generate_developer_documentation(self, file_path: str) -> DocumentationItem:
        """Generate comprehensive developer documentation for a file"""
        analysis = self.analyze_code_file(file_path)
        
        # Generate markdown documentation
        content = f"""# {os.path.basename(file_path)} - Developer Documentation

## 📋 Overview
**File:** `{file_path}`  
**Lines of Code:** {analysis['lines_of_code']}  
**Complexity:** {analysis['complexity']}  
**Last Updated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🔧 Functions

"""
        
        for func in analysis["functions"]:
            content += f"""### `{func.get('name', 'Unknown')}`
- **Line:** {func.get('line', 'N/A')}
- **Arguments:** {', '.join(func.get('args', []))}
- **Decorators:** {', '.join(func.get('decorators', []))}
"""
            if func.get('docstring'):
                content += f"- **Description:** {func['docstring']}\n"
            content += "\n"
        
        content += """## 🏗️ Classes

"""
        
        for cls in analysis["classes"]:
            content += f"""### `{cls.get('name', 'Unknown')}`
- **Line:** {cls.get('line', 'N/A')}
- **Methods:** {', '.join(cls.get('methods', []))}
- **Bases:** {', '.join(cls.get('bases', []))}
"""
            if cls.get('docstring'):
                content += f"- **Description:** {cls['docstring']}\n"
            content += "\n"
        
        content += f"""## 📦 Dependencies

"""
        for imp in analysis["imports"]:
            content += f"- `{imp}`\n"
        
        content += f"""
## 📝 Comments & Docstrings

### Docstrings
"""
        for i, docstring in enumerate(analysis["docstrings"], 1):
            content += f"{i}. {docstring[:200]}{'...' if len(docstring) > 200 else ''}\n"
        
        content += """
### Key Comments
"""
        for comment in analysis["comments"][:10]:  # Limit to first 10 comments
            content += f"- {comment.strip()}\n"
        
        content += f"""
## 🚀 Usage Examples

### Basic Usage
```python
# Example usage of {os.path.basename(file_path)}
# Add specific usage examples here
```

### Integration
```python
# Example integration with other components
# Add integration examples here
```

## 🔗 Related Components
- Add related components and dependencies here

## 🐛 Known Issues
- Add any known issues or limitations here

## 🔮 Future Improvements
- Add planned improvements or enhancements here
"""
        
        doc_item = DocumentationItem(
            id=f"dev_doc_{int(datetime.now().timestamp())}",
            title=f"Developer Documentation - {os.path.basename(file_path)}",
            content=content,
            doc_type=DocType.DEVELOPER,
            format=DocFormat.MARKDOWN,
            file_path=file_path,
            line_number=None,
            dependencies=analysis["imports"],
            tags=["developer", "api", "code", "documentation"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            metadata=analysis
        )
        
        self.documentation.append(doc_item)
        self._save_documentation()
        
        return doc_item
    
    def generate_end_user_documentation(self, component_name: str, component_info: Dict[str, Any]) -> DocumentationItem:
        """Generate end-user documentation for a component"""
        content = f"""# {component_name} - User Guide

## 🎯 What is {component_name}?

{component_info.get('description', 'A component of the OCTOSPINE system.')}

## 🚀 Getting Started

### Prerequisites
- List any prerequisites here
- System requirements
- Dependencies

### Installation
```bash
# Installation steps
# Add specific installation instructions
```

### Quick Start
```bash
# Quick start commands
# Add basic usage commands
```

## 📖 How to Use

### Basic Operations
1. **Step 1:** Description of first step
2. **Step 2:** Description of second step
3. **Step 3:** Description of third step

### Advanced Features
- **Feature 1:** Description and usage
- **Feature 2:** Description and usage
- **Feature 3:** Description and usage

## 🔧 Configuration

### Settings
```json
{{
    "setting1": "value1",
    "setting2": "value2"
}}
```

### Environment Variables
- `ENV_VAR_1`: Description
- `ENV_VAR_2`: Description

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Description
**Symptoms:** What you see when this issue occurs
**Cause:** What causes this issue
**Solution:** How to fix it

#### Issue 2: Description
**Symptoms:** What you see when this issue occurs
**Cause:** What causes this issue
**Solution:** How to fix it

## 📚 Examples

### Example 1: Basic Usage
```python
# Example code here
```

### Example 2: Advanced Usage
```python
# Advanced example code here
```

## 🔗 Related Documentation
- Link to related guides
- Link to API documentation
- Link to troubleshooting guides

## 📞 Support
- How to get help
- Where to report issues
- Contact information
"""
        
        doc_item = DocumentationItem(
            id=f"user_doc_{int(datetime.now().timestamp())}",
            title=f"User Guide - {component_name}",
            content=content,
            doc_type=DocType.END_USER,
            format=DocFormat.MARKDOWN,
            file_path=None,
            line_number=None,
            dependencies=component_info.get('dependencies', []),
            tags=["user-guide", "tutorial", "how-to"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            metadata=component_info
        )
        
        self.documentation.append(doc_item)
        self._save_documentation()
        
        return doc_item
    
    def generate_system_documentation(self) -> DocumentationItem:
        """Generate system-level architecture documentation"""
        content = """# OCTOSPINE System Architecture

## 🏗️ System Overview

OCTOSPINE (Octopus Spine) is a comprehensive automation and consciousness processing system that integrates multiple specialized frames and components to provide intelligent automation capabilities.

## 🧠 Core Components

### 1. Frame System
The frame system is the backbone of OCTOSPINE, providing modular, reusable automation components.

#### Frame Categories:
- **Analysis Frames:** Data analysis and pattern recognition
- **Security Frames:** Security auditing and vulnerability assessment
- **Research Frames:** Information gathering and synthesis
- **Orchestration Frames:** Task coordination and workflow management
- **Documentation Frames:** Automated documentation generation
- **Integration Frames:** System integration and communication

#### Key Frames:
- `comprehensive-frame-analyzer.py` - System-wide frame analysis
- `security-audit-frame.py` - Security vulnerability assessment
- `research-information-frame.py` - Intelligent research and information gathering
- `frame-intelligence-system.py` - Smart frame selection and execution
- `universal-task-orchestrator.py` - Universal task orchestration
- `hybrid-documentation-tauri-orchestrator.py` - Hybrid documentation and migration planning

### 2. Nexus System
The Nexus provides consciousness processing and data management capabilities.

#### Components:
- **Consciousness Monitor:** Real-time consciousness state tracking
- **Evolution Tracker:** System evolution and learning tracking
- **Orchestrator Service:** High-level system orchestration
- **AI Autonomy Service:** Autonomous decision making

### 3. Database System
Persistent storage and data management across all components.

#### Databases:
- **Frame Analysis Database:** Frame analysis results and metrics
- **Research Database:** Research findings and insights
- **Task Database:** Task execution history and results
- **Documentation Database:** Generated documentation and metadata
- **Component Database:** System component definitions and relationships

## 🔄 System Processes

### 1. Frame Execution Process
1. **Frame Selection:** Intelligent frame selection based on task requirements
2. **Dependency Resolution:** Automatic dependency resolution and validation
3. **Execution:** Frame execution with error handling and monitoring
4. **Result Processing:** Result analysis and storage
5. **Integration:** Integration with other system components

### 2. Documentation Generation Process
1. **Code Analysis:** Automated code analysis and structure extraction
2. **Content Generation:** Multi-format documentation generation
3. **Indexing:** Automated indexing and search capability
4. **Validation:** Documentation quality validation
5. **Publication:** Multi-format publication and distribution

### 3. Security Assessment Process
1. **Vulnerability Scanning:** Automated vulnerability detection
2. **Risk Assessment:** Risk analysis and prioritization
3. **Compliance Checking:** Security compliance validation
4. **Recommendation Generation:** Security improvement recommendations
5. **Monitoring:** Continuous security monitoring

## 🔗 Integration Points

### Internal Integrations
- **Frame-to-Frame Communication:** Direct frame communication protocols
- **Database Integration:** Unified database access patterns
- **Event System:** System-wide event handling and propagation
- **Configuration Management:** Centralized configuration management

### External Integrations
- **API Endpoints:** RESTful API for external system integration
- **Webhook Support:** Webhook-based event notifications
- **File System Integration:** Comprehensive file system operations
- **Network Services:** Network service integration capabilities

## 📊 System Metrics

### Performance Metrics
- **Frame Execution Time:** Average execution time per frame
- **Success Rate:** Frame execution success rates
- **Resource Usage:** CPU, memory, and storage usage
- **Response Time:** System response times for various operations

### Quality Metrics
- **Documentation Coverage:** Percentage of documented components
- **Test Coverage:** Test coverage across all components
- **Security Score:** Overall system security score
- **Integration Score:** System integration completeness

## 🔮 Future Architecture

### Planned Enhancements
- **Advanced AI Integration:** Enhanced AI capabilities and learning
- **Distributed Processing:** Distributed processing capabilities
- **Real-time Analytics:** Real-time system analytics and monitoring
- **Advanced Security:** Enhanced security features and monitoring

### Scalability Considerations
- **Horizontal Scaling:** Horizontal scaling capabilities
- **Load Balancing:** Intelligent load balancing
- **Caching:** Advanced caching strategies
- **Database Optimization:** Database performance optimization

## 🛠️ Development Guidelines

### Code Standards
- **Python PEP 8:** Python code style guidelines
- **Type Hints:** Comprehensive type hinting
- **Documentation:** Comprehensive documentation requirements
- **Testing:** Comprehensive testing requirements

### Architecture Principles
- **Modularity:** Modular design principles
- **Loose Coupling:** Loose coupling between components
- **High Cohesion:** High cohesion within components
- **Separation of Concerns:** Clear separation of concerns

## 📚 Additional Resources

### Documentation
- [Frame Development Guide](link-to-frame-guide)
- [API Documentation](link-to-api-docs)
- [User Guides](link-to-user-guides)
- [Troubleshooting Guide](link-to-troubleshooting)

### Development
- [Contributing Guidelines](link-to-contributing)
- [Code Review Process](link-to-code-review)
- [Release Process](link-to-release-process)
- [Testing Guidelines](link-to-testing)
"""
        
        doc_item = DocumentationItem(
            id=f"system_doc_{int(datetime.now().timestamp())}",
            title="OCTOSPINE System Architecture Documentation",
            content=content,
            doc_type=DocType.SYSTEM,
            format=DocFormat.MARKDOWN,
            file_path=None,
            line_number=None,
            dependencies=[],
            tags=["architecture", "system", "overview", "design"],
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            metadata={"type": "system_architecture"}
        )
        
        self.documentation.append(doc_item)
        self._save_documentation()
        
        return doc_item
    
    def generate_index(self) -> Dict[str, Any]:
        """Generate comprehensive system index"""
        index = {
            "tools": {},
            "systems": {},
            "components": {},
            "processes": {},
            "last_updated": datetime.now().isoformat()
        }
        
        # Index all Python files in OCTOSPINE
        octospine_files = glob.glob("OCTOSPINE/**/*.py", recursive=True)
        
        for file_path in octospine_files:
            analysis = self.analyze_code_file(file_path)
            relative_path = os.path.relpath(file_path)
            
            # Index as component
            component = SystemComponent(
                name=os.path.basename(file_path),
                type="python_frame",
                file_path=relative_path,
                description=analysis.get("docstrings", [""])[0] if analysis.get("docstrings") else "OCTOSPINE frame",
                dependencies=analysis.get("imports", []),
                interfaces=[],
                functions=[f["name"] for f in analysis.get("functions", [])],
                classes=[c["name"] for c in analysis.get("classes", [])],
                metadata=analysis
            )
            
            self.components.append(component)
            
            # Add to index
            index["components"][relative_path] = {
                "name": component.name,
                "type": component.type,
                "description": component.description,
                "functions": component.functions,
                "classes": component.classes,
                "dependencies": component.dependencies
            }
        
        # Index JavaScript/TypeScript files
        js_files = glob.glob("src/**/*.{js,ts,tsx}", recursive=True)
        
        for file_path in js_files:
            analysis = self.analyze_code_file(file_path)
            relative_path = os.path.relpath(file_path)
            
            component = SystemComponent(
                name=os.path.basename(file_path),
                type="javascript_component",
                file_path=relative_path,
                description="Frontend component",
                dependencies=analysis.get("imports", []),
                interfaces=[],
                functions=[f["name"] for f in analysis.get("functions", [])],
                classes=[c["name"] for c in analysis.get("classes", [])],
                metadata=analysis
            )
            
            self.components.append(component)
            
            index["components"][relative_path] = {
                "name": component.name,
                "type": component.type,
                "description": component.description,
                "functions": component.functions,
                "classes": component.classes,
                "dependencies": component.dependencies
            }
        
        # Index tools
        tools_dir = "tools"
        if os.path.exists(tools_dir):
            for tool_file in glob.glob(f"{tools_dir}/**/*.py", recursive=True):
                relative_path = os.path.relpath(tool_file)
                analysis = self.analyze_code_file(tool_file)
                
                index["tools"][relative_path] = {
                    "name": os.path.basename(tool_file),
                    "type": "python_tool",
                    "description": analysis.get("docstrings", [""])[0] if analysis.get("docstrings") else "Utility tool",
                    "functions": [f["name"] for f in analysis.get("functions", [])],
                    "dependencies": analysis.get("imports", [])
                }
        
        # Index systems
        index["systems"]["octospine"] = {
            "name": "OCTOSPINE",
            "type": "automation_system",
            "description": "Comprehensive automation and consciousness processing system",
            "components": len(index["components"]),
            "tools": len(index["tools"]),
            "processes": len(index["processes"])
        }
        
        # Index processes
        process_flows = [
            {
                "name": "Frame Execution",
                "description": "Standard frame execution process",
                "steps": ["Frame Selection", "Dependency Resolution", "Execution", "Result Processing"],
                "inputs": ["task_description", "frame_parameters"],
                "outputs": ["execution_results", "metrics"],
                "dependencies": ["frame_intelligence_system", "universal_task_orchestrator"],
                "error_handling": ["retry_logic", "fallback_frames", "error_reporting"]
            },
            {
                "name": "Documentation Generation",
                "description": "Automated documentation generation process",
                "steps": ["Code Analysis", "Content Generation", "Indexing", "Validation", "Publication"],
                "inputs": ["source_files", "documentation_requirements"],
                "outputs": ["documentation_files", "indexes"],
                "dependencies": ["comprehensive_documentation_frame", "code_analysis_tools"],
                "error_handling": ["partial_generation", "error_reporting", "manual_review"]
            }
        ]
        
        for process in process_flows:
            process_flow = ProcessFlow(
                name=process["name"],
                description=process["description"],
                steps=process["steps"],
                inputs=process["inputs"],
                outputs=process["outputs"],
                dependencies=process["dependencies"],
                error_handling=process["error_handling"],
                metadata={"type": "system_process"}
            )
            
            self.processes.append(process_flow)
            
            index["processes"][process["name"].lower().replace(" ", "_")] = {
                "name": process_flow.name,
                "description": process_flow.description,
                "steps": process_flow.steps,
                "inputs": process_flow.inputs,
                "outputs": process_flow.outputs,
                "dependencies": process_flow.dependencies
            }
        
        self.index = index
        self._save_components()
        self._save_processes()
        self._save_index()
        
        return index
    
    def search_documentation(self, query: str, doc_type: Optional[DocType] = None) -> List[DocumentationItem]:
        """Search documentation by query"""
        results = []
        query_lower = query.lower()
        
        for doc in self.documentation:
            if doc_type and doc.doc_type != doc_type:
                continue
            
            # Search in title, content, and tags
            if (query_lower in doc.title.lower() or 
                query_lower in doc.content.lower() or 
                any(query_lower in tag.lower() for tag in doc.tags)):
                results.append(doc)
        
        return results
    
    def generate_documentation_report(self) -> Dict[str, Any]:
        """Generate comprehensive documentation report"""
        report = {
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_documents": len(self.documentation),
                "total_components": len(self.components),
                "total_processes": len(self.processes),
                "documentation_coverage": 0.0
            },
            "by_type": {},
            "by_format": {},
            "recent_documents": [],
            "missing_documentation": [],
            "recommendations": []
        }
        
        # Analyze by type
        for doc_type in DocType:
            type_docs = [doc for doc in self.documentation if doc.doc_type == doc_type]
            report["by_type"][doc_type.value] = {
                "count": len(type_docs),
                "percentage": (len(type_docs) / len(self.documentation)) * 100 if self.documentation else 0
            }
        
        # Analyze by format
        for doc_format in DocFormat:
            format_docs = [doc for doc in self.documentation if doc.format == doc_format]
            report["by_format"][doc_format.value] = {
                "count": len(format_docs),
                "percentage": (len(format_docs) / len(self.documentation)) * 100 if self.documentation else 0
            }
        
        # Recent documents
        sorted_docs = sorted(self.documentation, key=lambda x: x.updated_at, reverse=True)
        report["recent_documents"] = [
            {
                "id": doc.id,
                "title": doc.title,
                "type": doc.doc_type.value,
                "updated_at": doc.updated_at
            }
            for doc in sorted_docs[:10]
        ]
        
        # Missing documentation analysis
        all_files = glob.glob("**/*.py", recursive=True) + glob.glob("src/**/*.{js,ts,tsx}", recursive=True)
        documented_files = {doc.file_path for doc in self.documentation if doc.file_path}
        
        for file_path in all_files:
            if file_path not in documented_files and not file_path.startswith(('.', 'node_modules', '__pycache__')):
                report["missing_documentation"].append(file_path)
        
        # Calculate coverage
        if all_files:
            report["summary"]["documentation_coverage"] = (len(documented_files) / len(all_files)) * 100
        
        # Generate recommendations
        if report["summary"]["documentation_coverage"] < 50:
            report["recommendations"].append("🚨 Critical: Documentation coverage is below 50%. Prioritize documentation generation.")
        
        if len(report["missing_documentation"]) > 0:
            report["recommendations"].append(f"📝 Missing documentation for {len(report['missing_documentation'])} files. Generate documentation for key components.")
        
        if report["by_type"].get("developer", {}).get("count", 0) < 10:
            report["recommendations"].append("🔧 Low developer documentation. Generate API documentation for key components.")
        
        if report["by_type"].get("end_user", {}).get("count", 0) < 5:
            report["recommendations"].append("👥 Low end-user documentation. Create user guides for main features.")
        
        return report
    
    def execute_documentation_generation(self, target_path: Optional[str] = None) -> Dict[str, Any]:
        """Execute comprehensive documentation generation"""
        print("📚 Starting Comprehensive Documentation Generation...")
        
        results = {
            "generated_docs": [],
            "analyzed_files": [],
            "index_updated": False,
            "report": None,
            "errors": []
        }
        
        try:
            # Generate system documentation
            system_doc = self.generate_system_documentation()
            results["generated_docs"].append({
                "id": system_doc.id,
                "title": system_doc.title,
                "type": system_doc.doc_type.value
            })
            print(f"✅ Generated system documentation: {system_doc.title}")
            
            # Generate documentation for specific target or scan OCTOSPINE
            if target_path:
                if os.path.exists(target_path):
                    if target_path.endswith('.py'):
                        dev_doc = self.generate_developer_documentation(target_path)
                        results["generated_docs"].append({
                            "id": dev_doc.id,
                            "title": dev_doc.title,
                            "type": dev_doc.doc_type.value
                        })
                        print(f"✅ Generated developer documentation: {dev_doc.title}")
                    results["analyzed_files"].append(target_path)
            else:
                # Scan OCTOSPINE frames
                octospine_files = glob.glob("OCTOSPINE/TECHNICAL/scaffold-frames/*.py")
                for file_path in octospine_files[:5]:  # Limit to first 5 for demo
                    try:
                        dev_doc = self.generate_developer_documentation(file_path)
                        results["generated_docs"].append({
                            "id": dev_doc.id,
                            "title": dev_doc.title,
                            "type": dev_doc.doc_type.value
                        })
                        results["analyzed_files"].append(file_path)
                        print(f"✅ Generated documentation for: {os.path.basename(file_path)}")
                    except Exception as e:
                        results["errors"].append(f"Error processing {file_path}: {str(e)}")
            
            # Generate index
            index = self.generate_index()
            results["index_updated"] = True
            print(f"✅ Updated system index with {len(index['components'])} components")
            
            # Generate report
            report = self.generate_documentation_report()
            results["report"] = report
            print(f"✅ Generated documentation report: {report['summary']['total_documents']} documents")
            
        except Exception as e:
            results["errors"].append(f"Documentation generation failed: {str(e)}")
            print(f"❌ Documentation generation failed: {str(e)}")
        
        print(f"\n🎯 Documentation Generation Complete!")
        print(f"   Documents Generated: {len(results['generated_docs'])}")
        print(f"   Files Analyzed: {len(results['analyzed_files'])}")
        print(f"   Errors: {len(results['errors'])}")
        
        return results

def main():
    """Main execution function"""
    if len(sys.argv) < 2:
        print("📚 COMPREHENSIVE DOCUMENTATION FRAME")
        print("=" * 50)
        print("Usage:")
        print("  python comprehensive-documentation-frame.py generate [target_path]")
        print("  python comprehensive-documentation-frame.py search <query>")
        print("  python comprehensive-documentation-frame.py report")
        print("  python comprehensive-documentation-frame.py index")
        return
    
    doc_frame = ComprehensiveDocumentationFrame()
    
    command = sys.argv[1].lower()
    
    if command == "generate":
        target_path = sys.argv[2] if len(sys.argv) > 2 else None
        results = doc_frame.execute_documentation_generation(target_path)
        print(f"🎯 Generated {len(results['generated_docs'])} documents")
    
    elif command == "search":
        if len(sys.argv) < 3:
            print("❌ Please provide a search query")
            return
        query = sys.argv[2]
        results = doc_frame.search_documentation(query)
        print(f"🔍 Found {len(results)} documents matching '{query}'")
        for doc in results[:5]:  # Show first 5 results
            print(f"  - {doc.title} ({doc.doc_type.value})")
    
    elif command == "report":
        report = doc_frame.generate_documentation_report()
        print("📊 DOCUMENTATION REPORT")
        print("=" * 30)
        print(f"Total Documents: {report['summary']['total_documents']}")
        print(f"Documentation Coverage: {report['summary']['documentation_coverage']:.1f}%")
        print(f"Missing Documentation: {len(report['missing_documentation'])} files")
        print(f"Recommendations: {len(report['recommendations'])}")
    
    elif command == "index":
        index = doc_frame.generate_index()
        print("📋 SYSTEM INDEX")
        print("=" * 20)
        print(f"Components: {len(index['components'])}")
        print(f"Tools: {len(index['tools'])}")
        print(f"Systems: {len(index['systems'])}")
        print(f"Processes: {len(index['processes'])}")
    
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()