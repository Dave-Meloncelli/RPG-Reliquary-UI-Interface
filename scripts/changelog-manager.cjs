#!/usr/bin/env node

/**
 * AZ Interface - Changelog Manager
 * 
 * This system manages automated changelog generation and version control:
 * - Conventional commit parsing
 * - Automatic changelog generation
 * - Version bumping
 * - Release notes
 * - Change categorization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ChangelogManager {
  constructor() {
    this.rootDir = process.cwd();
    this.changelogPath = path.join(this.rootDir, 'CHANGELOG.md');
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      conventionalCommits: true,
      categories: {
        'feat': { title: '🚀 Features', emoji: '🚀' },
        'fix': { title: '🐛 Bug Fixes', emoji: '🐛' },
        'docs': { title: '📚 Documentation', emoji: '📚' },
        'style': { title: '💅 Styles', emoji: '💅' },
        'refactor': { title: '♻️ Refactoring', emoji: '♻️' },
        'perf': { title: '⚡ Performance', emoji: '⚡' },
        'test': { title: '🧪 Tests', emoji: '🧪' },
        'chore': { title: '🔧 Chores', emoji: '🔧' },
        'ci': { title: '👷 CI/CD', emoji: '👷' },
        'build': { title: '📦 Build', emoji: '📦' },
        'revert': { title: '⏪ Reverts', emoji: '⏪' },
        'security': { title: '🔒 Security', emoji: '🔒' }
      },
      breakingChangeKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
      issuePattern: /#(\d+)/g,
      versionPattern: /^v?(\d+\.\d+\.\d+)$/
    };
  }

  async generateChangelog() {
    console.log('📝 Generating changelog...');
    
    try {
      const commits = await this.getCommits();
      const releases = this.parseCommits(commits);
      const changelog = this.formatChangelog(releases);
      
      fs.writeFileSync(this.changelogPath, changelog);
      console.log('✅ Changelog generated successfully');
      
      return changelog;
    } catch (error) {
      console.error('❌ Failed to generate changelog:', error.message);
      throw error;
    }
  }

  async getCommits() {
    try {
      // Get all commits since the last tag, or all commits if no tags
      const result = execSync('git log --pretty=format:"%H|%s|%b|%an|%ad" --date=short', { 
        encoding: 'utf8',
        cwd: this.rootDir 
      });
      
      return result.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, subject, body, author, date] = line.split('|');
          return { hash, subject, body, author, date };
        });
    } catch (error) {
      console.warn('⚠️ Could not get git commits:', error.message);
      return [];
    }
  }

  parseCommits(commits) {
    const releases = new Map();
    let currentVersion = 'Unreleased';
    
    releases.set(currentVersion, {
      version: currentVersion,
      date: new Date().toISOString().split('T')[0],
      changes: new Map(),
      breakingChanges: [],
      authors: new Set(),
      issues: new Set()
    });

    for (const commit of commits) {
      const parsed = this.parseCommit(commit);
      if (!parsed) continue;

      const release = releases.get(currentVersion);
      
      // Add to appropriate category
      if (!release.changes.has(parsed.type)) {
        release.changes.set(parsed.type, []);
      }
      release.changes.get(parsed.type).push(parsed);
      
      // Track breaking changes
      if (parsed.breaking) {
        release.breakingChanges.push(parsed);
      }
      
      // Track authors
      release.authors.add(commit.author);
      
      // Track issues
      if (parsed.issues.length > 0) {
        parsed.issues.forEach(issue => release.issues.add(issue));
      }
      
      // Check for version tags
      if (this.isVersionCommit(commit.subject)) {
        const version = this.extractVersion(commit.subject);
        if (version && version !== currentVersion) {
          currentVersion = version;
          releases.set(currentVersion, {
            version: currentVersion,
            date: commit.date,
            changes: new Map(),
            breakingChanges: [],
            authors: new Set(),
            issues: new Set()
          });
        }
      }
    }

    return releases;
  }

  parseCommit(commit) {
    const { subject, body, hash } = commit;
    
    // Parse conventional commit
    const conventionalMatch = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
    if (!conventionalMatch) {
      return null;
    }

    const [, type, scope, description] = conventionalMatch;
    const category = this.config.categories[type];
    
    if (!category) {
      return null;
    }

    // Check for breaking changes
    const breaking = this.config.breakingChangeKeywords.some(keyword => 
      subject.includes(keyword) || (body && body.includes(keyword))
    );

    // Extract issues
    const issues = [];
    const issueMatches = subject.match(this.config.issuePattern) || [];
    issueMatches.forEach(match => issues.push(match));

    return {
      type,
      scope,
      description,
      breaking,
      issues,
      hash: hash.substring(0, 8),
      category
    };
  }

  isVersionCommit(subject) {
    return this.config.versionPattern.test(subject);
  }

  extractVersion(subject) {
    const match = subject.match(this.config.versionPattern);
    return match ? match[1] : null;
  }

  formatChangelog(releases) {
    let changelog = `# 📋 Changelog

All notable changes to AZ Interface will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

`;

    for (const [version, release] of releases) {
      changelog += this.formatRelease(release);
    }

    return changelog;
  }

  formatRelease(release) {
    let section = `## [${release.version}] - ${release.date}\n\n`;

    // Breaking changes first
    if (release.breakingChanges.length > 0) {
      section += '### ⚠️ Breaking Changes\n\n';
      for (const change of release.breakingChanges) {
        section += `- **${change.scope || 'general'}**: ${change.description}\n`;
      }
      section += '\n';
    }

    // Changes by category
    for (const [type, changes] of release.changes) {
      if (changes.length === 0) continue;
      
      const category = this.config.categories[type];
      section += `### ${category.emoji} ${category.title}\n\n`;
      
      for (const change of changes) {
        let line = `- ${change.description}`;
        
        if (change.scope) {
          line = `- **${change.scope}**: ${change.description}`;
        }
        
        if (change.issues.length > 0) {
          line += ` (${change.issues.join(', ')})`;
        }
        
        section += line + '\n';
      }
      section += '\n';
    }

    // Contributors
    if (release.authors.size > 0) {
      section += '### 👥 Contributors\n\n';
      const authors = Array.from(release.authors).sort();
      section += authors.map(author => `- ${author}`).join('\n') + '\n\n';
    }

    // Issues
    if (release.issues.size > 0) {
      section += '### 🔗 Issues\n\n';
      const issues = Array.from(release.issues).sort((a, b) => parseInt(a) - parseInt(b));
      section += issues.map(issue => `- #${issue}`).join('\n') + '\n\n';
    }

    section += '---\n\n';
    return section;
  }

  async bumpVersion(type = 'patch') {
    console.log(`📈 Bumping version (${type})...`);
    
    try {
      const currentVersion = await this.getCurrentVersion();
      const newVersion = this.calculateNewVersion(currentVersion, type);
      
      // Update package.json
      const packagePath = path.join(this.rootDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageJson.version = newVersion;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      
      // Create git tag
      execSync(`git tag v${newVersion}`, { cwd: this.rootDir });
      
      console.log(`✅ Version bumped to ${newVersion}`);
      return newVersion;
    } catch (error) {
      console.error('❌ Failed to bump version:', error.message);
      throw error;
    }
  }

  async getCurrentVersion() {
    try {
      const packagePath = path.join(this.rootDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      return '0.0.0';
    }
  }

  calculateNewVersion(currentVersion, type) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  async createRelease(version, title, description) {
    console.log(`🎉 Creating release ${version}...`);
    
    try {
      // Generate release notes
      const releaseNotes = await this.generateReleaseNotes(version);
      
      // Create release file
      const releasePath = path.join(this.rootDir, `RELEASE_${version}.md`);
      const releaseContent = `# 🎉 Release ${version}: ${title}

${description}

## 📋 Release Notes

${releaseNotes}

## 🚀 Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🔗 Links

- [Documentation](README.md)
- [Changelog](CHANGELOG.md)
- [Issues](https://github.com/davem/az-interface/issues)

---

*Released on ${new Date().toLocaleDateString()}*
`;

      fs.writeFileSync(releasePath, releaseContent);
      console.log(`✅ Release created: ${releasePath}`);
      
      return releaseContent;
    } catch (error) {
      console.error('❌ Failed to create release:', error.message);
      throw error;
    }
  }

  async generateReleaseNotes(version) {
    try {
      const changelog = fs.readFileSync(this.changelogPath, 'utf8');
      const versionMatch = changelog.match(new RegExp(`## \\[${version}\\]([\\s\\S]*?)(?=## \\[|$)`));
      
      if (versionMatch) {
        return versionMatch[1].trim();
      }
      
      return 'No release notes available for this version.';
    } catch (error) {
      return 'Release notes could not be generated.';
    }
  }

  async getChangeSummary(since = 'HEAD~10') {
    try {
      const result = execSync(`git log --pretty=format:"%s" ${since}..HEAD`, { 
        encoding: 'utf8',
        cwd: this.rootDir 
      });
      
      const commits = result.split('\n').filter(line => line.trim());
      const summary = {
        total: commits.length,
        byType: {},
        breakingChanges: 0,
        authors: new Set()
      };

      for (const commit of commits) {
        const parsed = this.parseCommit({ subject: commit, body: '', hash: '', author: '', date: '' });
        if (parsed) {
          summary.byType[parsed.type] = (summary.byType[parsed.type] || 0) + 1;
          if (parsed.breaking) summary.breakingChanges++;
        }
      }

      return summary;
    } catch (error) {
      console.warn('⚠️ Could not get change summary:', error.message);
      return { total: 0, byType: {}, breakingChanges: 0, authors: new Set() };
    }
  }
}

// CLI interface
if (require.main === module) {
  const manager = new ChangelogManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'generate':
      manager.generateChangelog().catch(console.error);
      break;
    case 'bump':
      const type = process.argv[3] || 'patch';
      manager.bumpVersion(type).catch(console.error);
      break;
    case 'release':
      const version = process.argv[3];
      const title = process.argv[4] || 'Release';
      const description = process.argv[5] || 'New release';
      if (version) {
        manager.createRelease(version, title, description).catch(console.error);
      } else {
        console.error('❌ Version required for release command');
      }
      break;
    case 'summary':
      const since = process.argv[3] || 'HEAD~10';
      manager.getChangeSummary(since).then(console.log).catch(console.error);
      break;
    default:
      console.log(`
📋 AZ Interface Changelog Manager

Usage:
  node scripts/changelog-manager.js <command> [options]

Commands:
  generate                    Generate changelog from git commits
  bump [major|minor|patch]    Bump version and create git tag
  release <version> [title]   Create release notes for version
  summary [since]             Get change summary since commit

Examples:
  node scripts/changelog-manager.js generate
  node scripts/changelog-manager.js bump minor
  node scripts/changelog-manager.js release 1.2.0 "New Features"
  node scripts/changelog-manager.js summary HEAD~5
`);
  }
}

module.exports = ChangelogManager; 