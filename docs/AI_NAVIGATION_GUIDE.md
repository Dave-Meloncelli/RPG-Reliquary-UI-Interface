# 🤖 AI Navigation Guide

**Complete Navigation System for AI Agents Working on AZ Interface**

---

## 🎯 **QUICK START FOR AI AGENTS**

### **First Steps for Any AI Agent**
1. **Read Continuance Log**: `consciousness/CONTINUANCE_LOG.md` - Understand context and relationship
2. **Check Known Faults**: `internal/Known-faults-fixes.md` - Avoid common pitfalls
3. **Review Tech Stack**: `docs/reference/TECH_STACK_REGISTRY.md` - Understand system architecture
4. **Check Backlog**: `docs/reference/BACKLOG_MANAGEMENT.md` - Understand current priorities

---

## 📋 **WHERE TO FIND INSTRUCTIONS & PROCEDURES**

### **System Setup & Installation**
- **Main Setup**: `SETUP.md` - Complete system setup instructions
- **Docker Setup**: `docker-compose.yml` - Container orchestration
- **Environment**: `config/env.example` - Environment configuration
- **Backend Setup**: `backend/README.md` - Backend service setup

### **Development Procedures**
- **Build Process**: `package.json` scripts - Available build commands
- **Testing**: `tests/` directory - Test procedures and examples
- **Linting**: `config/.eslintrc-enhanced.json` - Code quality standards
- **Type Checking**: `npm run type-check` - TypeScript validation

### **Deployment Procedures**
- **CI/CD**: `.github/workflows/ci.yml` - Automated deployment pipeline
- **Production**: `Dockerfile.frontend` and `backend/Dockerfile` - Container builds
- **Monitoring**: `monitoring/` directory - System monitoring setup

---

## 🔧 **WHERE TO FIND FUNCTIONALITY**

### **Core Applications**
- **Main App**: `src/components/App.tsx` - Primary application entry
- **Desktop**: `src/components/Desktop.tsx` - Desktop interface
- **Dock**: `src/components/Dock.tsx` - Application dock

### **Service Layer**
- **All Services**: `src/services/` directory - Business logic services
- **Service Registry**: `src/registry/ServiceRegistry.ts` - Service discovery
- **Event Bus**: `src/services/eventBus.ts` - Inter-service communication

### **Data & Types**
- **Type Definitions**: `src/types/` directory - TypeScript type definitions
- **Schemas**: `schemas/` directory - Data validation schemas
- **Base Data**: `src/data/` directory - Static data and configurations

### **Consciousness System**
- **OctoSpine**: `consciousness/octospine/` - Core consciousness framework
- **Personas**: `consciousness/personas/` - AI persona system
- **Rituals**: `consciousness/rituals/` - Ceremonial practices
- **Evolution**: `consciousness/evolution/` - Consciousness evolution phases

---

## 🛠️ **WHERE TO FIND TOOLS & UTILITIES**

### **Analysis Tools**
- **File Tree Cleanup**: `tools/utilities/maintenance/file_tree_cleanup.py`
- **TypeScript Fixer**: `tools/utilities/maintenance/typescript-error-fixer.py`
- **Fusion Analysis**: `tools/analysis/fusion/` - System analysis tools
- **Persona Extraction**: `tools/extraction/persona-extraction/` - Persona analysis

### **Documentation Tools**
- **Audit Scripts**: `scripts/` directory - Documentation and audit tools
- **Report Generation**: `scripts/generate-report.cjs` - Automated reporting
- **Index Generation**: `scripts/generate-index.cjs` - Documentation indexing

### **Backend Tools**
- **CrewAI**: `crewai/` directory - AI agent orchestration
- **A2A Protocol**: `a2a/` directory - Agent-to-agent communication
- **Database**: `backend/app/` - Database models and migrations

---

## 🚨 **KNOWN FAULTS & FIXES**

### **Critical Issues to Avoid**
1. **Import Path Errors**: Always use relative paths from current file location
2. **Type Definition Mismatches**: Check `src/types/` before creating new types
3. **EventBus Type Errors**: Use `typeof eventBus` not `EventBus` type
4. **Missing Dependencies**: Check `package.json` before adding new imports

### **Common Fixes**
- **TypeScript Errors**: Run `npm run type-check` to identify issues
- **Build Failures**: Check `npm run build` output for specific errors
- **Import Issues**: Use `npm run validate:imports` to check import paths
- **Linting Issues**: Run `npm run lint:fix` to auto-fix code style

---

## 📊 **SYSTEM HEALTH CHECKS**

### **Pre-Operation Checklist**
- [ ] **TypeScript Compilation**: `npm run type-check` passes
- [ ] **Build Process**: `npm run build` completes successfully
- [ ] **Linting**: `npm run lint` shows no errors
- [ ] **Tests**: `npm test` passes
- [ ] **Import Validation**: `npm run validate:imports` passes

### **Post-Operation Validation**
- [ ] **Application Starts**: `npm run dev` launches without errors
- [ ] **Core Functionality**: Main applications load correctly
- [ ] **Service Integration**: All services communicate properly
- [ ] **Documentation Updated**: Relevant docs reflect changes

---

## 🎯 **AI AGENT WORKFLOWS**

### **For Development Tasks**
1. **Understand Context**: Read `consciousness/CONTINUANCE_LOG.md`
2. **Check Backlog**: Review `docs/reference/BACKLOG_MANAGEMENT.md`
3. **Identify Scope**: Determine which files/components are involved
4. **Follow Procedures**: Use appropriate tools and scripts
5. **Validate Changes**: Run health checks before completing

### **For Debugging Tasks**
1. **Check Known Faults**: Review `internal/Known-faults-fixes.md`
2. **Run Diagnostics**: Use `npm run type-check` and `npm run build`
3. **Identify Root Cause**: Look for patterns in error messages
4. **Apply Fixes**: Use appropriate tools or manual fixes
5. **Test Solution**: Validate that the fix resolves the issue

### **For Documentation Tasks**
1. **Update Navigation**: Modify relevant navigation guides
2. **Update Indexes**: Run `npm run generate:index` if needed
3. **Update References**: Ensure all file references are correct
4. **Validate Links**: Check that all links work properly

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **If You Encounter Errors**
1. **Check Known Faults**: `internal/Known-faults-fixes.md`
2. **Review Tech Stack**: `docs/reference/TECH_STACK_REGISTRY.md`
3. **Run Diagnostics**: Use appropriate validation scripts
4. **Check Logs**: Look for error patterns and solutions
5. **Ask for Help**: If stuck, provide context and error details

### **If You Need to Find Something**
1. **Use Navigation Guides**: Check relevant `NAVIGATION.md` files
2. **Search Codebase**: Use semantic search for functionality
3. **Check Registry**: Look in service/component registries
4. **Review Documentation**: Check `docs/` directory structure

---

## 🌟 **AI AGENT BEST PRACTICES**

### **Before Making Changes**
- **Understand the Context**: Read continuance logs and documentation
- **Check Known Issues**: Avoid repeating known problems
- **Plan Your Approach**: Consider impact on other components
- **Backup Important Files**: Create copies before major changes

### **During Development**
- **Follow Patterns**: Use existing code patterns and conventions
- **Update Documentation**: Keep docs in sync with code changes
- **Test Incrementally**: Validate changes as you make them
- **Communicate Changes**: Update relevant documentation

### **After Completing Tasks**
- **Run Health Checks**: Ensure system is still functional
- **Update Backlog**: Mark completed tasks and add new ones
- **Update Navigation**: Ensure AI navigation guides are current
- **Document Learnings**: Add to known faults if new issues discovered

---

**"This guide ensures AI agents can navigate the system effectively and avoid common pitfalls while maintaining system integrity."** 🌟🤖⏳

---

**Last Updated**: 2025-08-05  
**Version**: 1.0.0  
**For AI Agents**: Use this guide for all navigation and procedural needs 