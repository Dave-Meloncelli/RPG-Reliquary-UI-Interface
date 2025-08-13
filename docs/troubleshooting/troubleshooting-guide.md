# 🔧 OCTOSPINE Troubleshooting Guide

## Overview

This guide provides solutions for common issues you may encounter when using OCTOSPINE. Each section includes problem descriptions, diagnostic steps, and resolution procedures.

## Quick Diagnostic Commands

### System Health Check
```bash
# Check system status
python OCTOSPINE/TECHNICAL/scaffold-frames/security-audit-frame.py

# Check documentation status
python OCTOSPINE/TECHNICAL/scaffold-frames/comprehensive-documentation-frame.py report

# Check frame analysis
python OCTOSPINE/TECHNICAL/scaffold-frames/comprehensive-frame-analyzer.py
```

### Service Status
```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend
curl http://localhost:5173

# Check database
python -c "from backend.app.database import engine; print('Database OK')"
```

## Common Issues & Solutions

### 1. Application Startup Issues

#### Problem: Application Won't Start
**Symptoms:**
- Error messages during startup
- Application fails to launch
- Port conflicts

**Diagnostic Steps:**
1. Check if ports are available:
   ```bash
   netstat -an | grep :5173
   netstat -an | grep :8000
   ```

2. Check dependencies:
   ```bash
   npm list
   pip list
   ```

3. Check environment variables:
   ```bash
   echo $NODE_ENV
   echo $DATABASE_URL
   ```

**Solutions:**
1. **Port Conflicts:**
   ```bash
   # Kill processes using ports
   lsof -ti:5173 | xargs kill -9
   lsof -ti:8000 | xargs kill -9
   
   # Or change ports in configuration
   # vite.config.ts for frontend
   # backend/app/main.py for backend
   ```

2. **Missing Dependencies:**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   pip install -r requirements.txt
   ```

3. **Environment Issues:**
   ```bash
   # Copy and configure environment
   cp .env.example .env
   # Edit .env with correct values
   ```

#### Problem: Frontend Build Errors
**Symptoms:**
- TypeScript compilation errors
- Module resolution issues
- Build failures

**Diagnostic Steps:**
1. Check TypeScript configuration:
   ```bash
   npx tsc --noEmit
   ```

2. Check for missing types:
   ```bash
   npm install @types/node @types/react @types/react-dom
   ```

**Solutions:**
1. **TypeScript Errors:**
   ```bash
   # Fix type issues
   npx tsc --noEmit --skipLibCheck
   
   # Or add type assertions
   // @ts-ignore
   ```

2. **Module Resolution:**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

### 2. Backend Service Issues

#### Problem: Backend Won't Start
**Symptoms:**
- Database connection errors
- Import errors
- Service startup failures

**Diagnostic Steps:**
1. Check database connection:
   ```bash
   python -c "from backend.app.database import engine; print('DB OK')"
   ```

2. Check Python environment:
   ```bash
   python --version
   pip list | grep -E "(fastapi|uvicorn|sqlalchemy)"
   ```

**Solutions:**
1. **Database Issues:**
   ```bash
   # Initialize database
   cd backend
   python -m alembic upgrade head
   
   # Or create new database
   python -c "from backend.app.database import engine; from backend.app.models import Base; Base.metadata.create_all(bind=engine)"
   ```

2. **Python Environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate  # Windows
   
   pip install -r requirements.txt
   ```

#### Problem: API Endpoints Not Responding
**Symptoms:**
- 404 errors
- Connection refused
- Timeout errors

**Diagnostic Steps:**
1. Check if service is running:
   ```bash
   ps aux | grep uvicorn
   curl http://localhost:8000/api/health
   ```

2. Check logs:
   ```bash
   tail -f backend/app.log
   ```

**Solutions:**
1. **Service Not Running:**
   ```bash
   # Start backend service
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **CORS Issues:**
   ```python
   # Add CORS middleware in backend/app/main.py
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### 3. OCTOSPINE Framework Issues

#### Problem: Frame Execution Errors
**Symptoms:**
- Import errors in frames
- Frame execution failures
- Missing dependencies

**Diagnostic Steps:**
1. Check frame syntax:
   ```bash
   python -m py_compile OCTOSPINE/TECHNICAL/scaffold-frames/comprehensive-documentation-frame.py
   ```

2. Check frame dependencies:
   ```bash
   python -c "import sys; sys.path.append('OCTOSPINE/TECHNICAL/scaffold-frames'); from comprehensive_documentation_frame import ComprehensiveDocumentationFrame; print('Import OK')"
   ```

**Solutions:**
1. **Import Errors:**
   ```bash
   # Fix Python path
   export PYTHONPATH="${PYTHONPATH}:OCTOSPINE/TECHNICAL/scaffold-frames"
   
   # Or run from correct directory
   cd OCTOSPINE/TECHNICAL/scaffold-frames
   python comprehensive-documentation-frame.py
   ```

2. **Missing Dependencies:**
   ```bash
   # Install frame dependencies
   pip install dataclasses-json typing-extensions
   ```

#### Problem: Documentation Generation Issues
**Symptoms:**
- Documentation not generating
- JSON serialization errors
- File permission issues

**Diagnostic Steps:**
1. Check file permissions:
   ```bash
   ls -la OCTOSPINE/TECHNICAL/nexus/documentation-database/
   ```

2. Check JSON files:
   ```bash
   python -m json.tool OCTOSPINE/TECHNICAL/nexus/documentation-database/documentation.json
   ```

**Solutions:**
1. **Permission Issues:**
   ```bash
   # Fix permissions
   chmod -R 755 OCTOSPINE/TECHNICAL/nexus/
   ```

2. **JSON Corruption:**
   ```bash
   # Remove corrupted files
   rm OCTOSPINE/TECHNICAL/nexus/documentation-database/documentation.json
   # Regenerate documentation
   python OCTOSPINE/TECHNICAL/scaffold-frames/comprehensive-documentation-frame.py generate
   ```

### 4. Database Issues

#### Problem: Database Connection Errors
**Symptoms:**
- Connection timeout
- Authentication failures
- Database not found

**Diagnostic Steps:**
1. Check database status:
   ```bash
   # For SQLite
   ls -la backend/app.db
   
   # For PostgreSQL
   psql -h localhost -U username -d database_name -c "SELECT 1;"
   ```

2. Check connection string:
   ```bash
   echo $DATABASE_URL
   ```

**Solutions:**
1. **SQLite Issues:**
   ```bash
   # Recreate database
   rm backend/app.db
   cd backend
   python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
   ```

2. **PostgreSQL Issues:**
   ```bash
   # Create database
   createdb database_name
   
   # Run migrations
   cd backend
   python -m alembic upgrade head
   ```

### 5. Performance Issues

#### Problem: Slow Application Performance
**Symptoms:**
- Slow page loads
- High CPU usage
- Memory leaks

**Diagnostic Steps:**
1. Check system resources:
   ```bash
   top
   htop
   free -h
   ```

2. Check application performance:
   ```bash
   # Monitor API response times
   curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/health
   ```

**Solutions:**
1. **High CPU Usage:**
   ```bash
   # Optimize Node.js
   export NODE_OPTIONS="--max-old-space-size=4096"
   
   # Optimize Python
   export PYTHONOPTIMIZE=1
   ```

2. **Memory Issues:**
   ```bash
   # Clear caches
   npm cache clean --force
   rm -rf node_modules/.cache
   ```

### 6. Security Issues

#### Problem: Security Vulnerabilities
**Symptoms:**
- Security audit failures
- Vulnerability warnings
- Authentication issues

**Diagnostic Steps:**
1. Run security audit:
   ```bash
   npm audit
   python OCTOSPINE/TECHNICAL/scaffold-frames/security-audit-frame.py
   ```

2. Check for outdated packages:
   ```bash
   npm outdated
   pip list --outdated
   ```

**Solutions:**
1. **NPM Vulnerabilities:**
   ```bash
   # Fix vulnerabilities
   npm audit fix
   npm audit fix --force
   ```

2. **Python Vulnerabilities:**
   ```bash
   # Update packages
   pip install --upgrade package_name
   ```

### 7. Development Environment Issues

#### Problem: Development Tools Not Working
**Symptoms:**
- Hot reload not working
- TypeScript errors
- ESLint issues

**Diagnostic Steps:**
1. Check development server:
   ```bash
   # Check if Vite is running
   curl http://localhost:5173
   ```

2. Check TypeScript:
   ```bash
   npx tsc --noEmit
   ```

**Solutions:**
1. **Hot Reload Issues:**
   ```bash
   # Restart development server
   npm run dev
   ```

2. **TypeScript Issues:**
   ```bash
   # Reset TypeScript cache
   rm -rf node_modules/.cache/typescript/
   npx tsc --build --clean
   ```

## Advanced Troubleshooting

### Log Analysis

#### Check Application Logs
```bash
# Frontend logs
tail -f ~/.npm/_logs/*.log

# Backend logs
tail -f backend/app.log

# System logs
journalctl -u octospine -f
```

#### Debug Mode
```bash
# Enable debug logging
export DEBUG=*
export LOG_LEVEL=debug

# Start services in debug mode
npm run dev -- --debug
python -m uvicorn app.main:app --reload --log-level debug
```

### Network Diagnostics

#### Check Network Connectivity
```bash
# Test local connections
curl http://localhost:5173
curl http://localhost:8000/api/health

# Test external connections
curl https://api.octospine.com/api/health
```

#### Port Scanning
```bash
# Check open ports
nmap localhost -p 5173,8000,5432

# Check port usage
lsof -i :5173
lsof -i :8000
```

### Performance Profiling

#### Node.js Profiling
```bash
# Start with profiling
node --prof app.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

#### Python Profiling
```bash
# Profile Python code
python -m cProfile -o profile.prof script.py

# Analyze profile
python -c "import pstats; p = pstats.Stats('profile.prof'); p.sort_stats('cumulative').print_stats(10)"
```

## Recovery Procedures

### System Recovery
```bash
# 1. Stop all services
pkill -f "node"
pkill -f "python"

# 2. Clear caches
npm cache clean --force
rm -rf node_modules/.cache

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Restart services
npm run dev
cd backend && python -m uvicorn app.main:app --reload
```

### Data Recovery
```bash
# Backup current data
cp backend/app.db backend/app.db.backup

# Restore from backup
cp backend/app.db.backup backend/app.db

# Or recreate database
cd backend
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

## Getting Help

### Self-Service Resources
- **Documentation**: `/docs/`
- **API Reference**: `/docs/api/api-reference.md`
- **User Manual**: `/docs/end-user/user-manual.md`

### Support Channels
- **Community Forum**: https://community.octospine.com
- **GitHub Issues**: https://github.com/octospine/octospine/issues
- **Email Support**: support@octospine.com

### Diagnostic Information
When contacting support, include:
1. **System Information:**
   ```bash
   uname -a
   node --version
   python --version
   npm --version
   ```

2. **Error Logs:**
   ```bash
   # Collect recent logs
   tail -n 100 backend/app.log
   tail -n 100 ~/.npm/_logs/*.log
   ```

3. **Configuration:**
   ```bash
   # Environment variables (remove sensitive data)
   env | grep -E "(NODE|PYTHON|OCTOSPINE)"
   ```

---

**For critical issues or production problems, contact our 24/7 support team immediately.**
