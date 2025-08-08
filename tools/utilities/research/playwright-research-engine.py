#!/usr/bin/env python3
"""
Playwright Research Engine
- Searches for open-source automation tools
- Finds CI/CD solutions
- Discovers security enhancements
- Identifies infrastructure automation
- Researches best practices and tools
"""

import asyncio
import json
import re
from datetime import datetime
from typing import Dict, List, Any
import logging
from playwright.async_api import async_playwright
import aiohttp

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PlaywrightResearchEngine:
    """Research engine using Playwright to find automation tools"""
    
    def __init__(self):
        self.research_results = {}
        self.tools_found = []
        
    async def research_automation_tools(self) -> Dict[str, Any]:
        """Research automation tools and solutions"""
        logger.info("🔍 Starting automation tools research...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Research areas
            research_areas = [
                "infrastructure as code tools",
                "CI/CD automation platforms",
                "security automation tools",
                "dependency management automation",
                "system provisioning tools",
                "monitoring automation",
                "deployment automation",
                "configuration management tools"
            ]
            
            for area in research_areas:
                logger.info(f"Researching: {area}")
                results = await self._search_github_trending(page, area)
                self.research_results[area] = results
                
                # Also search for specific tools
                specific_tools = await self._search_specific_tools(page, area)
                self.tools_found.extend(specific_tools)
            
            await browser.close()
        
        return self._compile_research_report()
    
    async def _search_github_trending(self, page, query: str) -> List[Dict[str, Any]]:
        """Search GitHub trending for relevant tools"""
        try:
            # Search GitHub trending
            await page.goto(f"https://github.com/trending?q={query.replace(' ', '+')}&since=monthly")
            await page.wait_for_load_state('networkidle')
            
            # Extract trending repositories
            repos = await page.query_selector_all('article.Box-row')
            results = []
            
            for repo in repos[:10]:  # Top 10
                try:
                    name_elem = await repo.query_selector('h2.h3 a')
                    description_elem = await repo.query_selector('p')
                    stars_elem = await repo.query_selector('a.Link--muted[href*="/stargazers"]')
                    language_elem = await repo.query_selector('[itemprop="programmingLanguage"]')
                    
                    name = await name_elem.text_content() if name_elem else "Unknown"
                    description = await description_elem.text_content() if description_elem else ""
                    stars = await stars_elem.text_content() if stars_elem else "0"
                    language = await language_elem.text_content() if language_elem else "Unknown"
                    
                    results.append({
                        'name': name.strip(),
                        'description': description.strip(),
                        'stars': stars.strip(),
                        'language': language.strip(),
                        'url': f"https://github.com{await name_elem.get_attribute('href')}" if name_elem else ""
                    })
                except Exception as e:
                    logger.error(f"Error extracting repo info: {e}")
                    continue
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching GitHub trending for {query}: {e}")
            return []
    
    async def _search_specific_tools(self, page, area: str) -> List[Dict[str, Any]]:
        """Search for specific known tools in each area"""
        tool_mappings = {
            "infrastructure as code tools": [
                "terraform", "pulumi", "ansible", "chef", "puppet", "cloudformation"
            ],
            "CI/CD automation platforms": [
                "jenkins", "gitlab-ci", "github-actions", "circleci", "travis-ci", "drone"
            ],
            "security automation tools": [
                "vault", "secrets-manager", "snyk", "sonarqube", "bandit", "semgrep"
            ],
            "dependency management automation": [
                "renovate", "dependabot", "snyk", "greenkeeper", "pyup"
            ],
            "system provisioning tools": [
                "packer", "vagrant", "docker", "kubernetes", "helm", "kustomize"
            ],
            "monitoring automation": [
                "prometheus", "grafana", "datadog", "new-relic", "elasticsearch", "kibana"
            ],
            "deployment automation": [
                "argo-cd", "flux", "spinnaker", "tekton", "jenkins-x", "gitops"
            ],
            "configuration management tools": [
                "ansible", "chef", "puppet", "salt", "cfengine", "consul"
            ]
        }
        
        tools = tool_mappings.get(area, [])
        results = []
        
        for tool in tools:
            try:
                # Search for the tool on GitHub
                await page.goto(f"https://github.com/search?q={tool}&type=repositories&s=stars&o=desc")
                await page.wait_for_load_state('networkidle')
                
                # Get top result
                top_repo = await page.query_selector('div[data-testid="results-list"] > div:first-child')
                if top_repo:
                    name_elem = await top_repo.query_selector('a[data-testid="result-repo-link"]')
                    description_elem = await top_repo.query_selector('p[data-testid="result-repo-description"]')
                    stars_elem = await top_repo.query_selector('a[href*="/stargazers"]')
                    
                    if name_elem:
                        name = await name_elem.text_content()
                        url = await name_elem.get_attribute('href')
                        description = await description_elem.text_content() if description_elem else ""
                        stars = await stars_elem.text_content() if stars_elem else "0"
                        
                        results.append({
                            'tool': tool,
                            'name': name.strip(),
                            'description': description.strip(),
                            'stars': stars.strip(),
                            'url': f"https://github.com{url}" if url else "",
                            'category': area
                        })
                        
            except Exception as e:
                logger.error(f"Error searching for tool {tool}: {e}")
                continue
        
        return results
    
    async def research_security_tools(self) -> Dict[str, Any]:
        """Research security automation tools"""
        logger.info("🔒 Researching security automation tools...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            security_tools = [
                "hashicorp vault",
                "aws secrets manager",
                "azure key vault",
                "google secret manager",
                "snyk security",
                "sonarqube",
                "semgrep",
                "bandit python",
                "trivy vulnerability scanner",
                "falco runtime security",
                "opa open policy agent",
                "vault operator"
            ]
            
            results = []
            for tool in security_tools:
                try:
                    await page.goto(f"https://github.com/search?q={tool}&type=repositories&s=stars&o=desc")
                    await page.wait_for_load_state('networkidle')
                    
                    # Get top result
                    top_repo = await page.query_selector('div[data-testid="results-list"] > div:first-child')
                    if top_repo:
                        name_elem = await top_repo.query_selector('a[data-testid="result-repo-link"]')
                        description_elem = await top_repo.query_selector('p[data-testid="result-repo-description"]')
                        stars_elem = await top_repo.query_selector('a[href*="/stargazers"]')
                        
                        if name_elem:
                            name = await name_elem.text_content()
                            url = await name_elem.get_attribute('href')
                            description = await description_elem.text_content() if description_elem else ""
                            stars = await stars_elem.text_content() if stars_elem else "0"
                            
                            results.append({
                                'tool': tool,
                                'name': name.strip(),
                                'description': description.strip(),
                                'stars': stars.strip(),
                                'url': f"https://github.com{url}" if url else "",
                                'category': 'security'
                            })
                            
                except Exception as e:
                    logger.error(f"Error researching security tool {tool}: {e}")
                    continue
            
            await browser.close()
            return {'security_tools': results}
    
    async def research_ci_cd_platforms(self) -> Dict[str, Any]:
        """Research CI/CD platforms and automation"""
        logger.info("🔄 Researching CI/CD platforms...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            ci_cd_platforms = [
                "github actions",
                "gitlab ci",
                "jenkins",
                "circleci",
                "travis ci",
                "drone ci",
                "tekton",
                "argo workflows",
                "spinnaker",
                "concourse ci"
            ]
            
            results = []
            for platform in ci_cd_platforms:
                try:
                    await page.goto(f"https://github.com/search?q={platform}&type=repositories&s=stars&o=desc")
                    await page.wait_for_load_state('networkidle')
                    
                    # Get top result
                    top_repo = await page.query_selector('div[data-testid="results-list"] > div:first-child')
                    if top_repo:
                        name_elem = await top_repo.query_selector('a[data-testid="result-repo-link"]')
                        description_elem = await top_repo.query_selector('p[data-testid="result-repo-description"]')
                        stars_elem = await top_repo.query_selector('a[href*="/stargazers"]')
                        
                        if name_elem:
                            name = await name_elem.text_content()
                            url = await name_elem.get_attribute('href')
                            description = await description_elem.text_content() if description_elem else ""
                            stars = await stars_elem.text_content() if stars_elem else "0"
                            
                            results.append({
                                'platform': platform,
                                'name': name.strip(),
                                'description': description.strip(),
                                'stars': stars.strip(),
                                'url': f"https://github.com{url}" if url else "",
                                'category': 'ci_cd'
                            })
                            
                except Exception as e:
                    logger.error(f"Error researching CI/CD platform {platform}: {e}")
                    continue
            
            await browser.close()
            return {'ci_cd_platforms': results}
    
    async def research_infrastructure_tools(self) -> Dict[str, Any]:
        """Research infrastructure automation tools"""
        logger.info("🏗️ Researching infrastructure automation tools...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            infra_tools = [
                "terraform",
                "pulumi",
                "ansible",
                "chef",
                "puppet",
                "packer",
                "vagrant",
                "docker",
                "kubernetes",
                "helm",
                "kustomize",
                "crossplane"
            ]
            
            results = []
            for tool in infra_tools:
                try:
                    await page.goto(f"https://github.com/search?q={tool}&type=repositories&s=stars&o=desc")
                    await page.wait_for_load_state('networkidle')
                    
                    # Get top result
                    top_repo = await page.query_selector('div[data-testid="results-list"] > div:first-child')
                    if top_repo:
                        name_elem = await top_repo.query_selector('a[data-testid="result-repo-link"]')
                        description_elem = await top_repo.query_selector('p[data-testid="result-repo-description"]')
                        stars_elem = await top_repo.query_selector('a[href*="/stargazers"]')
                        
                        if name_elem:
                            name = await name_elem.text_content()
                            url = await name_elem.get_attribute('href')
                            description = await description_elem.text_content() if description_elem else ""
                            stars = await stars_elem.text_content() if stars_elem else "0"
                            
                            results.append({
                                'tool': tool,
                                'name': name.strip(),
                                'description': description.strip(),
                                'stars': stars.strip(),
                                'url': f"https://github.com{url}" if url else "",
                                'category': 'infrastructure'
                            })
                            
                except Exception as e:
                    logger.error(f"Error researching infrastructure tool {tool}: {e}")
                    continue
            
            await browser.close()
            return {'infrastructure_tools': results}
    
    def _compile_research_report(self) -> Dict[str, Any]:
        """Compile all research results into a comprehensive report"""
        return {
            'timestamp': datetime.now().isoformat(),
            'research_areas': self.research_results,
            'tools_found': self.tools_found,
            'summary': {
                'total_tools_found': len(self.tools_found),
                'research_areas_covered': len(self.research_results),
                'top_tools_by_category': self._get_top_tools_by_category()
            }
        }
    
    def _get_top_tools_by_category(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get top tools by category"""
        categories = {}
        for tool in self.tools_found:
            category = tool.get('category', 'unknown')
            if category not in categories:
                categories[category] = []
            categories[category].append(tool)
        
        # Sort by stars and get top 5 per category
        for category in categories:
            categories[category].sort(key=lambda x: int(x.get('stars', '0').replace(',', '')), reverse=True)
            categories[category] = categories[category][:5]
        
        return categories

async def main():
    """Main research function"""
    print("🔍 Starting Playwright Research Engine...")
    
    engine = PlaywrightResearchEngine()
    
    # Run comprehensive research
    print("📊 Researching automation tools...")
    automation_results = await engine.research_automation_tools()
    
    print("🔒 Researching security tools...")
    security_results = await engine.research_security_tools()
    
    print("🔄 Researching CI/CD platforms...")
    ci_cd_results = await engine.research_ci_cd_platforms()
    
    print("🏗️ Researching infrastructure tools...")
    infra_results = await engine.research_infrastructure_tools()
    
    # Combine all results
    all_results = {
        **automation_results,
        **security_results,
        **ci_cd_results,
        **infra_results
    }
    
    # Save results
    with open('research_results.json', 'w') as f:
        json.dump(all_results, f, indent=2)
    
    print(f"✅ Research complete! Found {all_results['summary']['total_tools_found']} tools")
    print(f"📄 Results saved to: research_results.json")
    
    # Print top findings
    print("\n🏆 TOP FINDINGS:")
    for category, tools in all_results['summary']['top_tools_by_category'].items():
        print(f"\n{category.upper()}:")
        for tool in tools[:3]:  # Top 3 per category
            print(f"  • {tool['name']} ({tool['stars']} stars)")

if __name__ == "__main__":
    asyncio.run(main())
