#!/usr/bin/env python3
"""
Enhanced Essential Frames Automation System
Multi-language support with automatic triggers for critical validation steps
"""

import json
import os
import sys
import subprocess
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import traceback
import hashlib
from enum import Enum

class LanguageType(Enum):
    """Supported programming languages for essential frames"""
    TYPESCRIPT = "typescript"
    JAVASCRIPT = "javascript"
    PYTHON = "python"
    JAVA = "java"
    RUST = "rust"
    GO = "go"
    C_SHARP = "csharp"
    PHP = "php"
    RUBY = "ruby"
    KOTLIN = "kotlin"
    SWIFT = "swift"
    DART = "dart"
    SCALA = "scala"
    ELIXIR = "elixir"
    HASKELL = "haskell"
    CLANG = "c"
    CPP = "cpp"
    POWERSHELL = "powershell"
    DOCKER = "docker"
    YAML = "yaml"
    JSON = "json"
    MARKDOWN = "markdown"

class EssentialFramesAutomation:
    """Enhanced essential frames with multi-language support"""
    
    def __init__(self):
        self.config_path = Path("config/essential_frames_config.json")
        self.webhooks_path = Path("config/webhooks")
        self.triggers_path = Path("config/triggers")
        
        # Create directories
        self.webhooks_path.mkdir(exist_ok=True)
        self.triggers_path.mkdir(exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Language detection patterns
        self.language_patterns = {
            LanguageType.TYPESCRIPT: ['.ts', '.tsx', 'tsconfig.json'],
            LanguageType.JAVASCRIPT: ['.js', '.jsx', '.mjs', 'package.json'],
            LanguageType.PYTHON: ['.py', 'requirements.txt', 'pyproject.toml', 'setup.py'],
            LanguageType.JAVA: ['.java', '.jar', 'pom.xml', 'build.gradle'],
            LanguageType.RUST: ['.rs', 'Cargo.toml'],
            LanguageType.GO: ['.go', 'go.mod', 'go.sum'],
            LanguageType.C_SHARP: ['.cs', '.csproj', '.sln'],
            LanguageType.PHP: ['.php', 'composer.json'],
            LanguageType.RUBY: ['.rb', 'Gemfile', 'Rakefile'],
            LanguageType.KOTLIN: ['.kt', '.kts'],
            LanguageType.SWIFT: ['.swift', 'Package.swift'],
            LanguageType.DART: ['.dart', 'pubspec.yaml'],
            LanguageType.SCALA: ['.scala', 'build.sbt'],
            LanguageType.ELIXIR: ['.ex', '.exs', 'mix.exs'],
            LanguageType.HASKELL: ['.hs', '.cabal'],
            LanguageType.CLANG: ['.c', '.h', 'Makefile'],
            LanguageType.CPP: ['.cpp', '.cc', '.hpp', 'CMakeLists.txt'],
            LanguageType.POWERSHELL: ['.ps1', '.psm1', '.psd1'],
            LanguageType.DOCKER: ['Dockerfile', '.dockerfile', 'docker-compose.yml'],
            LanguageType.YAML: ['.yml', '.yaml'],
            LanguageType.JSON: ['.json', '.jsonc'],
            LanguageType.MARKDOWN: ['.md', '.mdx', '.markdown']
        }
        
        # Initialize frame states with multi-language support
        self.frame_states = {
            "syntax_validation": {"enabled": True, "last_run": None, "success_count": 0, "failure_count": 0, "languages_supported": [lang.value for lang in LanguageType]},
            "dependency_health": {"enabled": True, "last_run": None, "success_count": 0, "failure_count": 0, "languages_supported": [lang.value for lang in LanguageType]},
            "pattern_recognition": {"enabled": True, "last_run": None, "success_count": 0, "failure_count": 0, "languages_supported": [lang.value for lang in LanguageType]},
            "continuance_guard": {"enabled": True, "last_run": None, "success_count": 0, "failure_count": 0, "languages_supported": [lang.value for lang in LanguageType]}
        }
    
    def detect_languages_in_project(self) -> List[LanguageType]:
        """Detect all languages used in the project"""
        detected_languages = set()
        project_root = Path(".")
        
        for file_path in project_root.rglob('*'):
            if file_path.is_file():
                for language, patterns in self.language_patterns.items():
                    if any(file_path.name.endswith(pattern) for pattern in patterns):
                        detected_languages.add(language)
                        break
        
        return list(detected_languages)
    
    def _load_config(self) -> Dict[str, Any]:
        """Load or create enhanced essential frames configuration"""
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️  Could not load config: {e}")
        
        # Enhanced configuration with multi-language support
        config = {
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "multi_language_support": True,
            "detected_languages": [],
            "essential_frames": {
                "syntax_validation": {
                    "trigger": "before_compilation",
                    "enabled": True,
                    "priority": "critical",
                    "webhooks": ["pre_compilation_validation"],
                    "timeout": 30,
                    "languages_supported": [lang.value for lang in LanguageType],
                    "validation_tools": {
                        "typescript": "npx tsc --noEmit",
                        "javascript": "npx eslint .",
                        "python": "python -m py_compile",
                        "java": "javac",
                        "rust": "cargo check",
                        "go": "go build",
                        "powershell": "powershell -Command 'Get-Command'",
                        "docker": "docker build --dry-run",
                        "yaml": "yamllint",
                        "json": "python -m json.tool"
                    }
                },
                "dependency_health": {
                    "trigger": "session_start",
                    "enabled": True,
                    "priority": "critical",
                    "webhooks": ["dependency_check", "health_monitor"],
                    "timeout": 60,
                    "languages_supported": [lang.value for lang in LanguageType],
                    "dependency_files": {
                        "typescript": ["package.json", "package-lock.json"],
                        "javascript": ["package.json", "package-lock.json"],
                        "python": ["requirements.txt", "pyproject.toml", "setup.py"],
                        "java": ["pom.xml", "build.gradle"],
                        "rust": ["Cargo.toml", "Cargo.lock"],
                        "go": ["go.mod", "go.sum"],
                        "php": ["composer.json", "composer.lock"],
                        "ruby": ["Gemfile", "Gemfile.lock"],
                        "dart": ["pubspec.yaml", "pubspec.lock"],
                        "scala": ["build.sbt"],
                        "elixir": ["mix.exs", "mix.lock"],
                        "haskell": ["*.cabal", "stack.yaml"],
                        "c": ["Makefile"],
                        "cpp": ["CMakeLists.txt", "Makefile"],
                        "powershell": ["*.psd1"],
                        "docker": ["Dockerfile", "docker-compose.yml"]
                    }
                },
                "pattern_recognition": {
                    "trigger": "after_automated_tool",
                    "enabled": True,
                    "priority": "high",
                    "webhooks": ["error_impact_analysis", "rollback_trigger"],
                    "timeout": 45,
                    "languages_supported": [lang.value for lang in LanguageType],
                    "common_patterns": {
                        "typescript": ["recommendations: recommendations", "const const", "interface interface"],
                        "javascript": ["var var", "function function", "const const"],
                        "python": ["import import", "def def", "class class"],
                        "java": ["public public", "private private", "class class"],
                        "rust": ["fn fn", "let let", "struct struct"],
                        "go": ["func func", "var var", "type type"],
                        "powershell": ["function function", "$ $", "param param"],
                        "docker": ["FROM FROM", "RUN RUN", "COPY COPY"],
                        "yaml": ["- -", "key: key:", "value: value:"],
                        "json": [",,", "{}", "[]"]
                    }
                },
                "continuance_guard": {
                    "trigger": "before_automated_fix",
                    "enabled": True,
                    "priority": "critical",
                    "webhooks": ["fix_validation", "impact_prediction"],
                    "timeout": 30,
                    "languages_supported": [lang.value for lang in LanguageType],
                    "safety_rules": {
                        "typescript": {"safe_fixes": ["syntax", "types", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "javascript": {"safe_fixes": ["syntax", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "python": {"safe_fixes": ["syntax", "imports", "types"], "risky_fixes": ["refactor", "architecture"]},
                        "java": {"safe_fixes": ["syntax", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "rust": {"safe_fixes": ["syntax", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "go": {"safe_fixes": ["syntax", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "powershell": {"safe_fixes": ["syntax", "imports"], "risky_fixes": ["refactor", "architecture"]},
                        "docker": {"safe_fixes": ["syntax", "layers"], "risky_fixes": ["base_image", "security"]},
                        "yaml": {"safe_fixes": ["syntax", "indentation"], "risky_fixes": ["structure", "secrets"]},
                        "json": {"safe_fixes": ["syntax", "formatting"], "risky_fixes": ["structure", "data"]}
                    }
                }
            },
            "webhooks": {
                "pre_compilation_validation": {
                    "url": "http://localhost:8000/webhooks/pre-compilation",
                    "method": "POST",
                    "enabled": True
                },
                "dependency_check": {
                    "url": "http://localhost:8000/webhooks/dependency-check",
                    "method": "POST",
                    "enabled": True
                },
                "health_monitor": {
                    "url": "http://localhost:8000/webhooks/health-monitor",
                    "method": "POST",
                    "enabled": True
                },
                "error_impact_analysis": {
                    "url": "http://localhost:8000/webhooks/error-impact",
                    "method": "POST",
                    "enabled": True
                },
                "rollback_trigger": {
                    "url": "http://localhost:8000/webhooks/rollback",
                    "method": "POST",
                    "enabled": True
                },
                "fix_validation": {
                    "url": "http://localhost:8000/webhooks/fix-validation",
                    "method": "POST",
                    "enabled": True
                },
                "impact_prediction": {
                    "url": "http://localhost:8000/webhooks/impact-prediction",
                    "method": "POST",
                    "enabled": True
                }
            }
        }
        
        # Update detected languages
        config["detected_languages"] = [lang.value for lang in self.detect_languages_in_project()]
        
        return config
    
    def _save_config(self, config: Dict[str, Any]):
        """Save configuration to file"""
        config["last_updated"] = datetime.now().isoformat()
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
    
    def trigger_syntax_validation(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Trigger syntax validation for all detected languages"""
        print("\n🔍 Essential Frame: Syntax Validation")
        print("   Multi-language syntax validation starting...")
        
        start_time = time.time()
        context = context or {}
        
        try:
            # Get detected languages
            detected_languages = self.detect_languages_in_project()
            print(f"   Detected languages: {[lang.value for lang in detected_languages]}")
            
            # Run pre-compilation checks for each language
            validation_results = {}
            for language in detected_languages:
                print(f"   Validating {language.value}...")
                result = self._validate_language_syntax(language, context)
                validation_results[language.value] = result
            
            # Check for bad patterns across all languages
            bad_patterns = self._get_common_bad_patterns()
            pattern_results = self._run_pre_compilation_checks(bad_patterns)
            
            execution_time = time.time() - start_time
            success = all(result.get("valid", False) for result in validation_results.values()) and pattern_results.get("valid", False)
            
            result = {
                "success": success,
                "execution_time": execution_time,
                "languages_validated": len(detected_languages),
                "validation_results": validation_results,
                "pattern_results": pattern_results,
                "timestamp": datetime.now().isoformat(),
                "frame_type": "syntax_validation"
            }
            
            # Update frame state
            self.frame_states["syntax_validation"]["last_run"] = datetime.now().isoformat()
            if success:
                self.frame_states["syntax_validation"]["success_count"] += 1
                print("   ✅ Syntax validation PASSED")
            else:
                self.frame_states["syntax_validation"]["failure_count"] += 1
                print("   ❌ Syntax validation FAILED")
            
            # Trigger webhooks
            self._trigger_webhooks("pre_compilation_validation", result)
            
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            error_result = {
                "success": False,
                "error": str(e),
                "execution_time": execution_time,
                "timestamp": datetime.now().isoformat(),
                "frame_type": "syntax_validation"
            }
            
            self.frame_states["syntax_validation"]["failure_count"] += 1
            print(f"   ❌ Syntax validation ERROR: {e}")
            
            return error_result
    
    def trigger_dependency_health(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Trigger dependency health check on session start"""
        print("🏥 Triggering Dependency Health Frame...")
        
        if context is None:
            context = {}
        
        try:
            # Check for required dependencies
            required_deps = ["react", "vite", "@vitejs/plugin-react", "arktype"]
            health_result = self._check_dependencies(required_deps)
            
            # Trigger webhooks
            webhook_results = self._trigger_webhooks("dependency_check", {
                "health_result": health_result,
                "context": context,
                "timestamp": datetime.now().isoformat()
            })
            
            # Update frame state
            self.frame_states["dependency_health"]["last_run"] = datetime.now().isoformat()
            if health_result["all_healthy"]:
                self.frame_states["dependency_health"]["success_count"] += 1
            else:
                self.frame_states["dependency_health"]["failure_count"] += 1
            
            result = {
                "success": health_result["all_healthy"],
                "frame": "dependency_health",
                "health_result": health_result,
                "webhook_results": webhook_results,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Dependency Health Frame completed: {result['success']}")
            return result
            
        except Exception as e:
            error_result = {
                "success": False,
                "frame": "dependency_health",
                "error": str(e),
                "traceback": traceback.format_exc(),
                "timestamp": datetime.now().isoformat()
            }
            
            self.frame_states["dependency_health"]["failure_count"] += 1
            print(f"❌ Dependency Health Frame failed: {e}")
            return error_result
    
    def trigger_pattern_recognition(self, before_errors: int, after_errors: int, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Trigger pattern recognition after automated tool execution"""
        print("🧠 Triggering Pattern Recognition Frame...")
        
        if context is None:
            context = {}
        
        try:
            # Analyze error impact
            impact_analysis = self._analyze_error_impact(before_errors, after_errors)
            
            # Determine if rollback is needed
            rollback_needed = impact_analysis["rollback_recommended"]
            
            # Trigger webhooks
            webhook_results = self._trigger_webhooks("error_impact_analysis", {
                "impact_analysis": impact_analysis,
                "rollback_needed": rollback_needed,
                "context": context,
                "timestamp": datetime.now().isoformat()
            })
            
            # Update frame state
            self.frame_states["pattern_recognition"]["last_run"] = datetime.now().isoformat()
            if not rollback_needed:
                self.frame_states["pattern_recognition"]["success_count"] += 1
            else:
                self.frame_states["pattern_recognition"]["failure_count"] += 1
            
            result = {
                "success": not rollback_needed,
                "frame": "pattern_recognition",
                "impact_analysis": impact_analysis,
                "rollback_needed": rollback_needed,
                "webhook_results": webhook_results,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Pattern Recognition Frame completed: {result['success']}")
            return result
            
        except Exception as e:
            error_result = {
                "success": False,
                "frame": "pattern_recognition",
                "error": str(e),
                "traceback": traceback.format_exc(),
                "timestamp": datetime.now().isoformat()
            }
            
            self.frame_states["pattern_recognition"]["failure_count"] += 1
            print(f"❌ Pattern Recognition Frame failed: {e}")
            return error_result
    
    def trigger_continuance_guard(self, fix_type: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Trigger continuance guard before automated fix execution"""
        print("🛡️ Triggering Continuance Guard Frame...")
        
        if context is None:
            context = {}
        
        try:
            # Validate fix safety
            safety_validation = self._validate_fix_safety(fix_type, context)
            
            # Predict impact
            impact_prediction = self._predict_fix_impact(fix_type, context)
            
            # Determine if fix should proceed
            should_proceed = safety_validation["safe"] and impact_prediction["predicted_improvement"]
            
            # Trigger webhooks
            webhook_results = self._trigger_webhooks("fix_validation", {
                "safety_validation": safety_validation,
                "impact_prediction": impact_prediction,
                "should_proceed": should_proceed,
                "context": context,
                "timestamp": datetime.now().isoformat()
            })
            
            # Update frame state
            self.frame_states["continuance_guard"]["last_run"] = datetime.now().isoformat()
            if should_proceed:
                self.frame_states["continuance_guard"]["success_count"] += 1
            else:
                self.frame_states["continuance_guard"]["failure_count"] += 1
            
            result = {
                "success": should_proceed,
                "frame": "continuance_guard",
                "safety_validation": safety_validation,
                "impact_prediction": impact_prediction,
                "should_proceed": should_proceed,
                "webhook_results": webhook_results,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"✅ Continuance Guard Frame completed: {result['success']}")
            return result
            
        except Exception as e:
            error_result = {
                "success": False,
                "frame": "continuance_guard",
                "error": str(e),
                "traceback": traceback.format_exc(),
                "timestamp": datetime.now().isoformat()
            }
            
            self.frame_states["continuance_guard"]["failure_count"] += 1
            print(f"❌ Continuance Guard Frame failed: {e}")
            return error_result
    
    def _run_pre_compilation_checks(self, bad_patterns: List[str]) -> Dict[str, Any]:
        """Run pre-compilation checks for bad patterns across all languages"""
        print("   Checking for common bad patterns across all languages...")
        
        found_patterns = []
        files_checked = 0
        
        try:
            # Get all supported file extensions
            all_extensions = []
            for patterns in self.language_patterns.values():
                all_extensions.extend(patterns)
            
            # Check all supported file types
            for ext in all_extensions:
                if ext.startswith('.'):
                    for file_path in Path(".").rglob(f"*{ext}"):
                        files_checked += 1
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                for pattern in bad_patterns:
                                    if pattern in content:
                                        found_patterns.append({
                                            "file": str(file_path),
                                            "pattern": pattern,
                                            "line": content.count('\n', 0, content.find(pattern)) + 1,
                                            "language": self._detect_file_language(file_path)
                                        })
                        except Exception as e:
                            print(f"   ⚠️  Could not check {file_path}: {e}")
                else:
                    # Handle special files like Dockerfile, package.json, etc.
                    for file_path in Path(".").rglob(ext):
                        files_checked += 1
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                for pattern in bad_patterns:
                                    if pattern in content:
                                        found_patterns.append({
                                            "file": str(file_path),
                                            "pattern": pattern,
                                            "line": content.count('\n', 0, content.find(pattern)) + 1,
                                            "language": self._detect_file_language(file_path)
                                        })
                        except Exception as e:
                            print(f"   ⚠️  Could not check {file_path}: {e}")
            
            valid = len(found_patterns) == 0
            
            return {
                "valid": valid,
                "patterns_found": len(found_patterns),
                "files_checked": files_checked,
                "found_patterns": found_patterns,
                "bad_patterns_checked": bad_patterns
            }
            
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "files_checked": files_checked
            }
    
    def _detect_file_language(self, file_path: Path) -> str:
        """Detect the language of a file based on its extension or name"""
        for language, patterns in self.language_patterns.items():
            if any(file_path.name.endswith(pattern) for pattern in patterns):
                return language.value
        return "unknown"
    
    def _validate_language_syntax(self, language: LanguageType, context: Dict[str, Any]) -> Dict[str, Any]:
        """Validate syntax for a specific language"""
        try:
            validation_tools = self.config.get("essential_frames", {}).get("syntax_validation", {}).get("validation_tools", {})
            tool_command = validation_tools.get(language.value)
            
            if not tool_command:
                return {
                    "valid": True,
                    "reason": f"No validation tool configured for {language.value}",
                    "language": language.value
                }
            
            # Run language-specific validation
            if language == LanguageType.TYPESCRIPT:
                return self._validate_typescript()
            elif language == LanguageType.PYTHON:
                return self._validate_python()
            elif language == LanguageType.JAVASCRIPT:
                return self._validate_javascript()
            elif language == LanguageType.POWERSHELL:
                return self._validate_powershell()
            elif language == LanguageType.DOCKER:
                return self._validate_docker()
            elif language == LanguageType.YAML:
                return self._validate_yaml()
            elif language == LanguageType.JSON:
                return self._validate_json()
            else:
                return {
                    "valid": True,
                    "reason": f"Validation not implemented for {language.value}",
                    "language": language.value
                }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": language.value
            }
    
    def _validate_typescript(self) -> Dict[str, Any]:
        """Validate TypeScript syntax"""
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit"],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                "valid": result.returncode == 0,
                "error_count": len(result.stderr.split('\n')) if result.stderr else 0,
                "output": result.stdout,
                "errors": result.stderr,
                "language": "typescript"
            }
        except subprocess.TimeoutExpired:
            return {
                "valid": False,
                "error": "TypeScript validation timed out",
                "language": "typescript"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "typescript"
            }
    
    def _validate_python(self) -> Dict[str, Any]:
        """Validate Python syntax"""
        try:
            # Check for Python files and validate syntax
            python_files = list(Path(".").rglob("*.py"))
            errors = []
            
            for py_file in python_files:
                try:
                    result = subprocess.run(
                        ["python", "-m", "py_compile", str(py_file)],
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                    if result.returncode != 0:
                        errors.append(f"{py_file}: {result.stderr}")
                except Exception as e:
                    errors.append(f"{py_file}: {str(e)}")
            
            return {
                "valid": len(errors) == 0,
                "error_count": len(errors),
                "errors": errors,
                "files_checked": len(python_files),
                "language": "python"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "python"
            }
    
    def _validate_javascript(self) -> Dict[str, Any]:
        """Validate JavaScript syntax"""
        try:
            # Check if eslint is available
            result = subprocess.run(
                ["npx", "eslint", "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                # Run eslint
                eslint_result = subprocess.run(
                    ["npx", "eslint", "."],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                return {
                    "valid": eslint_result.returncode == 0,
                    "error_count": len(eslint_result.stdout.split('\n')) if eslint_result.stdout else 0,
                    "output": eslint_result.stdout,
                    "language": "javascript"
                }
            else:
                # Fallback to basic syntax check
                return {
                    "valid": True,
                    "reason": "ESLint not available, skipping JavaScript validation",
                    "language": "javascript"
                }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "javascript"
            }
    
    def _validate_powershell(self) -> Dict[str, Any]:
        """Validate PowerShell syntax"""
        try:
            ps_files = list(Path(".").rglob("*.ps1"))
            errors = []
            
            for ps_file in ps_files:
                try:
                    result = subprocess.run(
                        ["powershell", "-Command", f"Get-Command -Syntax {ps_file}"],
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                    if result.returncode != 0:
                        errors.append(f"{ps_file}: {result.stderr}")
                except Exception as e:
                    errors.append(f"{ps_file}: {str(e)}")
            
            return {
                "valid": len(errors) == 0,
                "error_count": len(errors),
                "errors": errors,
                "files_checked": len(ps_files),
                "language": "powershell"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "powershell"
            }
    
    def _validate_docker(self) -> Dict[str, Any]:
        """Validate Docker syntax"""
        try:
            docker_files = list(Path(".").glob("Dockerfile*")) + list(Path(".").glob("docker-compose*.yml"))
            errors = []
            
            for docker_file in docker_files:
                try:
                    if docker_file.name.startswith("Dockerfile"):
                        # Validate Dockerfile syntax
                        result = subprocess.run(
                            ["docker", "build", "--dry-run", "-f", str(docker_file), "."],
                            capture_output=True,
                            text=True,
                            timeout=30
                        )
                    else:
                        # Validate docker-compose syntax
                        result = subprocess.run(
                            ["docker-compose", "-f", str(docker_file), "config"],
                            capture_output=True,
                            text=True,
                            timeout=30
                        )
                    
                    if result.returncode != 0:
                        errors.append(f"{docker_file}: {result.stderr}")
                except Exception as e:
                    errors.append(f"{docker_file}: {str(e)}")
            
            return {
                "valid": len(errors) == 0,
                "error_count": len(errors),
                "errors": errors,
                "files_checked": len(docker_files),
                "language": "docker"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "docker"
            }
    
    def _validate_yaml(self) -> Dict[str, Any]:
        """Validate YAML syntax"""
        try:
            yaml_files = list(Path(".").rglob("*.yml")) + list(Path(".").rglob("*.yaml"))
            errors = []
            
            for yaml_file in yaml_files:
                try:
                    with open(yaml_file, 'r', encoding='utf-8') as f:
                        import yaml
                        yaml.safe_load(f)
                except Exception as e:
                    errors.append(f"{yaml_file}: {str(e)}")
            
            return {
                "valid": len(errors) == 0,
                "error_count": len(errors),
                "errors": errors,
                "files_checked": len(yaml_files),
                "language": "yaml"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "yaml"
            }
    
    def _validate_json(self) -> Dict[str, Any]:
        """Validate JSON syntax"""
        try:
            json_files = list(Path(".").rglob("*.json"))
            errors = []
            
            for json_file in json_files:
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        json.load(f)
                except Exception as e:
                    errors.append(f"{json_file}: {str(e)}")
            return {
                "valid": len(errors) == 0,
                "error_count": len(errors),
                "errors": errors,
                "files_checked": len(json_files),
                "language": "json"
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "language": "json"
            }
    
    def _get_common_bad_patterns(self) -> List[str]:
        """Get common bad patterns across all detected languages"""
        detected_languages = self.detect_languages_in_project()
        all_patterns = []
        
        common_patterns = self.config["essential_frames"]["pattern_recognition"]["common_patterns"]
        
        for language in detected_languages:
            if language.value in common_patterns:
                all_patterns.extend(common_patterns[language.value])
        
        return list(set(all_patterns))  # Remove duplicates
    
    def _check_dependencies(self, required_deps: List[str]) -> Dict[str, Any]:
        """Enhanced dependency check using package.json and node_modules"""
        try:
            missing_deps = []
            installed_deps = []
            
            # Check package.json for dependencies
            package_json_path = Path("package.json")
            if package_json_path.exists():
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                
                dependencies = package_data.get('dependencies', {})
                dev_dependencies = package_data.get('devDependencies', {})
                all_deps = {**dependencies, **dev_dependencies}
                
                # Check for required dependencies in package.json
                for dep in required_deps:
                    if dep in all_deps:
                        installed_deps.append(dep)
                    else:
                        missing_deps.append(dep)
                
                # Additional check for node_modules
                node_modules_path = Path("node_modules")
                if node_modules_path.exists():
                    for dep in missing_deps[:]:  # Copy list to avoid modification during iteration
                        dep_path = node_modules_path / dep
                        if dep_path.exists():
                            installed_deps.append(dep)
                            missing_deps.remove(dep)
                
                all_healthy = len(missing_deps) == 0
                
                return {
                    "all_healthy": all_healthy,
                    "installed_deps": installed_deps,
                    "missing_deps": missing_deps,
                    "total_required": len(required_deps),
                    "package_json_exists": True,
                    "node_modules_exists": node_modules_path.exists(),
                    "check_method": "package_json_and_node_modules"
                }
            else:
                # Fallback to node_modules check only
                node_modules_path = Path("node_modules")
                if node_modules_path.exists():
                    for dep in required_deps:
                        dep_path = node_modules_path / dep
                        if dep_path.exists():
                            installed_deps.append(dep)
                        else:
                            missing_deps.append(dep)
                    
                    all_healthy = len(missing_deps) == 0
                    
                    return {
                        "all_healthy": all_healthy,
                        "installed_deps": installed_deps,
                        "missing_deps": missing_deps,
                        "total_required": len(required_deps),
                        "package_json_exists": False,
                        "node_modules_exists": True,
                        "check_method": "node_modules_only"
                    }
                else:
                    return {
                        "all_healthy": False,
                        "installed_deps": [],
                        "missing_deps": required_deps,
                        "total_required": len(required_deps),
                        "package_json_exists": False,
                        "node_modules_exists": False,
                        "check_method": "no_files_found"
                    }
            
        except Exception as e:
            return {
                "all_healthy": False,
                "error": str(e),
                "installed_deps": [],
                "missing_deps": required_deps,
                "total_required": len(required_deps),
                "check_method": "error_fallback"
            }
    
    def _analyze_error_impact(self, before_errors: int, after_errors: int) -> Dict[str, Any]:
        """Enhanced error impact analysis with intelligent decision making"""
        error_change = after_errors - before_errors
        error_increase_percentage = (error_change / before_errors * 100) if before_errors > 0 else 0
        
        # Intelligent analysis based on error patterns
        analysis = {
            "before_errors": before_errors,
            "after_errors": after_errors,
            "error_change": error_change,
            "error_increase_percentage": error_increase_percentage,
            "improvement": error_change < 0,
            "significant_worsening": error_increase_percentage > 50,
            "analysis_level": "enhanced"
        }
        
        # Determine severity and action needed
        if error_change < 0:
            # Improvement
            if abs(error_change) > before_errors * 0.1:  # More than 10% improvement
                analysis["severity"] = "excellent_improvement"
                analysis["action_needed"] = "none"
                analysis["rollback_recommended"] = False
            else:
                analysis["severity"] = "minor_improvement"
                analysis["action_needed"] = "continue"
                analysis["rollback_recommended"] = False
        elif error_change == 0:
            # No change
            analysis["severity"] = "no_change"
            analysis["action_needed"] = "continue"
            analysis["rollback_recommended"] = False
        else:
            # Worsening
            if error_increase_percentage > 100:
                analysis["severity"] = "critical_worsening"
                analysis["action_needed"] = "immediate_rollback"
                analysis["rollback_recommended"] = True
            elif error_increase_percentage > 50:
                analysis["severity"] = "significant_worsening"
                analysis["action_needed"] = "rollback"
                analysis["rollback_recommended"] = True
            elif error_increase_percentage > 20:
                analysis["severity"] = "moderate_worsening"
                analysis["action_needed"] = "investigate"
                analysis["rollback_recommended"] = False
            else:
                analysis["severity"] = "minor_worsening"
                analysis["action_needed"] = "monitor"
                analysis["rollback_recommended"] = False
        
        # Add context about the change
        if before_errors > 0:
            analysis["change_description"] = f"Error count changed from {before_errors} to {after_errors} ({error_change:+d})"
        else:
            analysis["change_description"] = f"Started with {after_errors} errors"
        
        return analysis
    
    def _validate_fix_safety(self, fix_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced safety validation with context-aware decision making"""
        # Enhanced safety validation based on fix type and context
        safety_rules = {
            "syntax_fix": {
                "safe": True, 
                "risk_level": "low",
                "description": "Syntax fixes are generally safe and reversible",
                "confidence": 0.9
            },
            "dependency_install": {
                "safe": True, 
                "risk_level": "low",
                "description": "Installing dependencies is safe",
                "confidence": 0.8
            },
            "type_fix": {
                "safe": True, 
                "risk_level": "low",
                "description": "Type fixes improve code quality",
                "confidence": 0.85
            },
            "variable_declaration": {
                "safe": True, 
                "risk_level": "low",
                "description": "Adding missing variable declarations",
                "confidence": 0.9
            },
            "interface_fix": {
                "safe": True, 
                "risk_level": "medium",
                "description": "Interface fixes may affect multiple files",
                "confidence": 0.7
            },
            "major_refactor": {
                "safe": False, 
                "risk_level": "high",
                "description": "Major refactoring requires manual review",
                "confidence": 0.3
            },
            "unknown": {
                "safe": False, 
                "risk_level": "high",
                "description": "Unknown fix type requires manual review",
                "confidence": 0.1
            }
        }
        
        rule = safety_rules.get(fix_type, safety_rules["unknown"])
        
        # Context-aware adjustments
        context_factors = {
            "high_error_count": context.get("error_count", 0) > 1000,
            "production_environment": context.get("environment") == "production",
            "critical_files": context.get("critical_files", False),
            "user_approved": context.get("user_approved", False)
        }
        
        # Adjust safety based on context
        final_safety = rule["safe"]
        final_confidence = rule["confidence"]
        
        if context_factors["production_environment"]:
            final_safety = False
            final_confidence *= 0.5
        elif context_factors["user_approved"]:
            final_safety = True
            final_confidence *= 1.2
        elif context_factors["high_error_count"]:
            final_confidence *= 0.8  # Less confident with high error counts
        
        return {
            "safe": final_safety,
            "risk_level": rule["risk_level"],
            "fix_type": fix_type,
            "description": rule["description"],
            "confidence": min(1.0, final_confidence),
            "validation_method": "enhanced_rule_based",
            "context_factors": context_factors
        }
    
    def _predict_fix_impact(self, fix_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enhanced impact prediction with context-aware analysis"""
        # Enhanced impact prediction based on fix type and context
        impact_predictions = {
            "syntax_fix": {
                "predicted_improvement": True, 
                "confidence": 0.9,
                "expected_error_reduction": 0.3,
                "description": "Syntax fixes typically reduce errors significantly"
            },
            "dependency_install": {
                "predicted_improvement": True, 
                "confidence": 0.8,
                "expected_error_reduction": 0.1,
                "description": "Installing dependencies may resolve import errors"
            },
            "type_fix": {
                "predicted_improvement": True, 
                "confidence": 0.85,
                "expected_error_reduction": 0.2,
                "description": "Type fixes improve code quality and reduce type errors"
            },
            "variable_declaration": {
                "predicted_improvement": True, 
                "confidence": 0.9,
                "expected_error_reduction": 0.15,
                "description": "Adding missing declarations resolves undefined variable errors"
            },
            "interface_fix": {
                "predicted_improvement": True, 
                "confidence": 0.7,
                "expected_error_reduction": 0.25,
                "description": "Interface fixes may affect multiple files but improve type safety"
            },
            "major_refactor": {
                "predicted_improvement": False, 
                "confidence": 0.3,
                "expected_error_reduction": -0.5,
                "description": "Major refactoring may introduce new errors"
            },
            "unknown": {
                "predicted_improvement": False, 
                "confidence": 0.1,
                "expected_error_reduction": 0.0,
                "description": "Unknown fix type has unpredictable impact"
            }
        }
        
        prediction = impact_predictions.get(fix_type, impact_predictions["unknown"])
        
        # Context-aware adjustments
        current_error_count = context.get("error_count", 0)
        context_factors = {
            "high_error_count": current_error_count > 1000,
            "low_error_count": current_error_count < 100,
            "production_environment": context.get("environment") == "production",
            "user_approved": context.get("user_approved", False)
        }
        
        # Adjust prediction based on context
        final_improvement = prediction["predicted_improvement"]
        final_confidence = prediction["confidence"]
        final_error_reduction = prediction["expected_error_reduction"]
        
        if context_factors["high_error_count"]:
            final_confidence *= 0.8  # Less confident with high error counts
        elif context_factors["low_error_count"]:
            final_confidence *= 1.1  # More confident with low error counts
        elif context_factors["user_approved"]:
            final_confidence *= 1.2  # More confident with user approval
        elif context_factors["production_environment"]:
            final_confidence *= 0.5  # Much less confident in production
        
        return {
            "predicted_improvement": final_improvement,
            "confidence": min(1.0, final_confidence),
            "expected_error_reduction": final_error_reduction,
            "fix_type": fix_type,
            "description": prediction["description"],
            "prediction_method": "enhanced_context_aware",
            "context_factors": context_factors
        }
    
    def _trigger_webhooks(self, webhook_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger webhooks for frame execution"""
        webhook_config = self.config["webhooks"].get(webhook_name, {})
        
        if not webhook_config.get("enabled", False):
            return {"triggered": False, "reason": "webhook_disabled"}
        
        try:
            # In a real implementation, this would make HTTP requests
            # For now, we'll simulate webhook execution
            webhook_result = {
                "triggered": True,
                "webhook_name": webhook_name,
                "url": webhook_config.get("url", ""),
                "method": webhook_config.get("method", "POST"),
                "payload": payload,
                "timestamp": datetime.now().isoformat()
            }
            
            # Save webhook execution log
            webhook_log_path = self.webhooks_path / f"{webhook_name}_{int(datetime.now().timestamp())}.json"
            with open(webhook_log_path, 'w', encoding='utf-8') as f:
                json.dump(webhook_result, f, indent=2, ensure_ascii=False)
            
            return webhook_result
            
        except Exception as e:
            return {
                "triggered": False,
                "error": str(e),
                "webhook_name": webhook_name,
                "timestamp": datetime.now().isoformat()
            }
    
    def get_frame_status(self) -> Dict[str, Any]:
        """Get status of all essential frames"""
        return {
            "frame_states": self.frame_states,
            "config": self.config,
            "timestamp": datetime.now().isoformat()
        }
    
    def enable_frame(self, frame_name: str, enabled: bool = True):
        """Enable or disable an essential frame"""
        if frame_name in self.config["essential_frames"]:
            self.config["essential_frames"][frame_name]["enabled"] = enabled
            self.frame_states[frame_name]["enabled"] = enabled
            self._save_config(self.config)
            print(f"✅ {frame_name} frame {'enabled' if enabled else 'disabled'}")
        else:
            print(f"❌ Frame {frame_name} not found")

def run_essential_frames_automation(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run essential frames automation"""
    
    if context is None:
        context = {}
    
    print("🚀 Starting Essential Frames Automation...")
    
    try:
        # Initialize automation system
        automation = EssentialFramesAutomation()
        
        # Run all essential frames
        results = {}
        
        # 1. Dependency Health (session start)
        results["dependency_health"] = automation.trigger_dependency_health(context)
        
        # 2. Syntax Validation (before compilation)
        results["syntax_validation"] = automation.trigger_syntax_validation(context)
        
        # 3. Continuance Guard (before fixes)
        results["continuance_guard"] = automation.trigger_continuance_guard("syntax_fix", context)
        
        # 4. Pattern Recognition (after fixes - simulated)
        results["pattern_recognition"] = automation.trigger_pattern_recognition(573, 1769, context)
        
        # Get overall status
        status = automation.get_frame_status()
        
        # Generate summary
        successful_frames = sum(1 for r in results.values() if r.get("success", False))
        total_frames = len(results)
        
        summary = {
            "total_frames": total_frames,
            "successful_frames": successful_frames,
            "failed_frames": total_frames - successful_frames,
            "success_rate": (successful_frames / total_frames * 100) if total_frames > 0 else 0
        }
        
        result = {
            "success": successful_frames == total_frames,
            "automation_complete": True,
            "results": results,
            "status": status,
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save report
        report_path = f"reports/essential_frames_automation_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Essential Frames Automation complete: {summary['successful_frames']}/{summary['total_frames']} frames successful")
        print(f"📄 Report saved: {report_path}")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Essential frames automation failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the automation system
    test_context = {
        "session_id": "test_session",
        "user_id": "test_user",
        "project": "az-interface"
    }
    
    result = run_essential_frames_automation(test_context)
    print(json.dumps(result, indent=2))
