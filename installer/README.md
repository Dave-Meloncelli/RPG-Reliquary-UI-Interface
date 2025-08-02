# 🪟 Windows Installer & Version Conflict Resolution

## 📋 **VERSION CONFLICT REMEDIATION**

### **Critical Issues Fixed**

1. **React 19 Beta → React 18.2.0 Stable**
   - Eliminates TypeScript compilation errors
   - Improves library compatibility
   - Provides stable production environment

2. **LangChain Version Conflicts**
   - Updated to compatible versions
   - Fixed CrewAI integration issues
   - Resolved import errors

3. **Non-existent A2A Packages**
   - Removed fake package dependencies
   - Implemented custom A2A protocol
   - Fixed Docker build failures

4. **TypeScript Version Conflicts**
   - Downgraded to stable 5.3.3
   - Improved React type compatibility
   - Reduced compilation errors

### **Quick Fix Commands**

```bash
# Fix React version conflicts
npm install react@^18.2.0 react-dom@^18.2.0

# Fix TypeScript version
npm install typescript@~5.3.3

# Update Python dependencies
pip install -r backend/requirements.txt --upgrade
pip install -r crewai/requirements.txt --upgrade
pip install -r a2a/requirements.txt --upgrade

# Remove non-existent packages from A2A
# (Already fixed in requirements.txt)
```

## 🪟 **Windows Wizard Installer**

### **Features**

- **Wizard-Style Configuration**: Step-by-step setup process
- **API Key Management**: Secure input for all AI service keys
- **Security Configuration**: JWT secrets, database passwords
- **Storage Setup**: Configurable data directories
- **Docker Integration**: Automatic Docker Compose setup
- **Windows Integration**: Start menu, desktop icons, file associations

### **Installation Steps**

1. **Prerequisites Check**
   - Windows 10/11 (64-bit)
   - Docker Desktop installed and running
   - 8GB RAM minimum (16GB recommended)
   - 20GB free disk space

2. **Download & Run**
   ```bash
   # Download the installer
   AgentZeroSetup.exe
   
   # Run as Administrator
   Right-click → Run as Administrator
   ```

3. **Wizard Configuration**
   - **API Keys**: Enter OpenAI, Gemini, Anthropic, Chutes.ai keys
   - **Security**: Set JWT secret, database passwords
   - **Storage**: Configure data directories
   - **Docker**: Set resource limits and GPU support

4. **Automatic Setup**
   - Creates `.env` file with user configuration
   - Generates start/stop scripts
   - Sets up Windows integration
   - Configures file associations

### **Post-Installation**

```bash
# Start the platform
Start Menu → Agent Zero → Agent Zero Interface
# OR
Desktop → Agent Zero Interface

# Manual start/stop
C:\Program Files\AgentZero\
├── start-agent-zero.bat    # Start services
├── stop-agent-zero.bat     # Stop services
└── uninstall-agent-zero.bat # Complete uninstall
```

### **Access URLs**

After installation, access the platform at:

- **Main Interface**: http://localhost:3000
- **CrewAI Dashboard**: http://localhost:8500
- **n8n Workflows**: http://localhost:5678
- **Grafana Monitoring**: http://localhost:3001
- **Portainer**: http://localhost:9000
- **Adminer (DB)**: http://localhost:8080
- **Redis Commander**: http://localhost:8081

## 🔧 **Building the Installer**

### **Prerequisites**

1. **Inno Setup**: Download from https://jrsoftware.org/isinfo.php
2. **Node.js Build**: Run `npm run build` first
3. **Docker Files**: Ensure all Docker files are present

### **Build Process**

```bash
# 1. Build the application
npm run build

# 2. Build the installer
cd installer
build-installer.bat

# 3. Find the installer
output/AgentZeroSetup.exe
```

### **Customization**

Edit `AgentZeroInstaller.iss` to customize:

- **Application Name/Version**: Update branding
- **Installation Paths**: Change default directories
- **Wizard Pages**: Add/remove configuration steps
- **File Associations**: Custom file types
- **Registry Keys**: Windows integration

## 📁 **Storage Requirements**

### **Default Directories**

```
C:\ProgramData\AgentZero\
├── data\           # Application data
├── personas\       # Agent personas
├── schemas\        # Database schemas
└── logs\          # Application logs

C:\Program Files\AgentZero\
├── backend\        # Backend application
├── crewai\         # CrewAI service
├── a2a\           # A2A protocol
├── monitoring\    # Monitoring stack
└── scripts\       # Utility scripts
```

### **Docker Volumes**

```yaml
# Persistent data storage
volumes:
  agent_zero_data:      # Main application data
  postgres_data:        # Database files
  redis_data:          # Cache data
  milvus_data:         # Vector database
  ollama_data:         # LLM models
  shared_models:       # Shared AI models
  backup_data:         # Backup files
```

### **Space Requirements**

- **Minimum**: 20GB free space
- **Recommended**: 50GB+ for models and data
- **Models**: 10-30GB for AI models
- **Database**: 5-10GB for data storage
- **Logs**: 1-5GB for application logs

## 🔒 **Security Configuration**

### **Generated Security**

The installer automatically generates:

- **JWT Secret**: 32+ character random string
- **Database Passwords**: Secure PostgreSQL/Redis passwords
- **Service Passwords**: Grafana, n8n admin passwords
- **API Keys**: Encrypted storage of AI service keys

### **Security Best Practices**

1. **Change Default Passwords**: Update after first login
2. **Secure API Keys**: Use environment variables
3. **Network Security**: Configure firewalls
4. **Regular Updates**: Keep Docker images updated
5. **Backup Strategy**: Regular data backups

## 🚀 **Troubleshooting**

### **Common Issues**

1. **Docker Not Running**
   ```bash
   # Start Docker Desktop
   # Check Docker status
   docker --version
   docker-compose --version
   ```

2. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -an | findstr :3000
   netstat -an | findstr :8000
   ```

3. **Permission Issues**
   ```bash
   # Run as Administrator
   # Check folder permissions
   icacls "C:\ProgramData\AgentZero" /grant Users:F
   ```

4. **Service Startup Failures**
   ```bash
   # Check logs
   docker-compose logs
   docker-compose logs agent-zero-api
   ```

### **Support**

- **GitHub Issues**: https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface/issues
- **Documentation**: See README.md and SETUP.md
- **Logs**: Check `C:\ProgramData\AgentZero\logs\`

## 📊 **Performance Optimization**

### **Resource Allocation**

- **Memory**: 8GB minimum, 16GB+ recommended
- **CPU**: 4 cores minimum, 8+ cores recommended
- **Storage**: SSD recommended for better performance
- **Network**: Stable internet for AI API calls

### **Docker Resource Limits**

```yaml
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
    reservations:
      memory: 1G
      cpus: '0.5'
```

### **Monitoring**

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Portainer**: http://localhost:9000
- **Jaeger**: http://localhost:16686 