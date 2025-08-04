#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Automated Changelog Generator
 * Integrates with conventional commits and audit pipeline
 */

class ChangelogGenerator {
  constructor() {
    this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    this.version = this.getCurrentVersion();
  }

  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version;
    } catch (error) {
      console.error('Error reading package.json:', error.message);
      return '0.0.0';
    }
  }

  getGitCommits(since = null) {
    try {
      let command = 'git log --pretty=format:"%H|%s|%b|%an|%ad" --date=short';
      if (since) {
        command += ` --since="${since}"`;
      }
      const output = execSync(command, { encoding: 'utf8' });
      return output.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('Error getting git commits:', error.message);
      return [];
    }
  }

  parseConventionalCommit(commitLine) {
    const [hash, subject, body, author, date] = commitLine.split('|');
    
    // Parse conventional commit format
    const conventionalRegex = /^([a-z]+)(?:\(([\w\-]+)\))?: (.+)$/;
    const match = subject.match(conventionalRegex);
    
    if (!match) {
      return {
        type: 'chore',
        scope: null,
        description: subject,
        hash,
        body,
        author,
        date,
        breaking: false
      };
    }

    const [, type, scope, description] = match;
    const breaking = description.includes('BREAKING CHANGE') || body.includes('BREAKING CHANGE');
    
    return {
      type,
      scope,
      description: description.replace('BREAKING CHANGE:', '').trim(),
      hash,
      body,
      author,
      date,
      breaking
    };
  }

  categorizeCommits(commits) {
    const categories = {
      feat: [],
      fix: [],
      docs: [],
      style: [],
      refactor: [],
      perf: [],
      test: [],
      build: [],
      ci: [],
      chore: [],
      revert: [],
      security: [],
      deps: []
    };

    commits.forEach(commit => {
      const parsed = this.parseConventionalCommit(commit);
      const type = parsed.type;
      
      if (categories[type]) {
        categories[type].push(parsed);
      } else {
        categories.chore.push(parsed);
      }
    });

    return categories;
  }

  generateChangelogSection(categories) {
    const sections = [];
    
    // Define section order and labels
    const sectionOrder = [
      { key: 'feat', label: 'Added' },
      { key: 'fix', label: 'Fixed' },
      { key: 'security', label: 'Security' },
      { key: 'perf', label: 'Performance' },
      { key: 'refactor', label: 'Changed' },
      { key: 'docs', label: 'Documentation' },
      { key: 'style', label: 'Style' },
      { key: 'test', label: 'Testing' },
      { key: 'build', label: 'Build' },
      { key: 'ci', label: 'CI/CD' },
      { key: 'deps', label: 'Dependencies' },
      { key: 'revert', label: 'Reverted' },
      { key: 'chore', label: 'Chores' }
    ];

    sectionOrder.forEach(({ key, label }) => {
      const commits = categories[key];
      if (commits && commits.length > 0) {
        sections.push(`### ${label}`);
        commits.forEach(commit => {
          const scope = commit.scope ? `**${commit.scope}:** ` : '';
          const breaking = commit.breaking ? ' **BREAKING CHANGE**' : '';
          sections.push(`- ${scope}${commit.description}${breaking}`);
        });
        sections.push('');
      }
    });

    return sections.join('\n');
  }

  updateChangelog() {
    try {
      // Get commits since last version
      const commits = this.getGitCommits();
      const categorized = this.categorizeCommits(commits);
      
      // Read existing changelog
      let changelog = fs.readFileSync(this.changelogPath, 'utf8');
      
      // Generate new section
      const newSection = this.generateChangelogSection(categorized);
      
      // Insert new section after [Unreleased]
      const unreleasedIndex = changelog.indexOf('## [Unreleased]');
      if (unreleasedIndex !== -1) {
        const beforeUnreleased = changelog.substring(0, unreleasedIndex);
        const afterUnreleased = changelog.substring(unreleasedIndex);
        
        const updatedChangelog = `${beforeUnreleased}## [Unreleased]

${newSection}${afterUnreleased}`;
        
        fs.writeFileSync(this.changelogPath, updatedChangelog);
        console.log('✅ Changelog updated successfully');
      } else {
        console.error('❌ Could not find [Unreleased] section in changelog');
      }
    } catch (error) {
      console.error('❌ Error updating changelog:', error.message);
    }
  }

  createRelease(version) {
    try {
      // Update package.json version
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.version = version;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Create git tag
      execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
      
      // Update changelog
      let changelog = fs.readFileSync(this.changelogPath, 'utf8');
      changelog = changelog.replace('## [Unreleased]', `## [${version}] - ${new Date().toISOString().split('T')[0]}`);
      fs.writeFileSync(this.changelogPath, changelog);

      console.log(`✅ Release v${version} created successfully`);
    } catch (error) {
      console.error('❌ Error creating release:', error.message);
    }
  }
}

// CLI Interface
const generator = new ChangelogGenerator();

const command = process.argv[2];
const version = process.argv[3];

switch (command) {
  case 'update':
    generator.updateChangelog();
    break;
  case 'release':
    if (!version) {
      console.error('❌ Please provide a version number');
      process.exit(1);
    }
    generator.createRelease(version);
    break;
  default:
    console.log(`
Changelog Generator

Usage:
  node scripts/generate-changelog.cjs update    - Update changelog with recent commits
  node scripts/generate-changelog.cjs release <version> - Create a new release

Examples:
  node scripts/generate-changelog.cjs update
  node scripts/generate-changelog.cjs release 1.0.0
`);
} 