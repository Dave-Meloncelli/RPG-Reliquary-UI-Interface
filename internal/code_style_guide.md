# Agent Zero Vault - Code Style Guide

## 1. Module Imports

**Rule 1.1: All module import paths MUST be relative.**

- **Correct:** `import MyComponent from './components/MyComponent';`
- **Correct:** `import myService from '../services/myService';`
- **Incorrect:** `import MyComponent from '@/components/MyComponent';`
- **Incorrect:** `import MyComponent from 'components/MyComponent';`

**Rationale:**
Our current development and build environment is a simple ESM setup that does not have a configured path alias resolver (like Webpack's `resolve.alias` or TypeScript's `paths`). Therefore, using non-relative paths like `@/` will result in a `TypeError: Failed to resolve module specifier`. Adhering strictly to relative paths ensures 100% compatibility with our environment and prevents this recurring error.
