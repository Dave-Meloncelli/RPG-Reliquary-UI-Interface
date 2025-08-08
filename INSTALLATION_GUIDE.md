# 🚀 AZ Interface Installation Guide

## Quick Start (Single Machine)

### Windows
```powershell
# Run the installation script
.\install.bat

# Or start everything at once
.\start.bat
```

### Linux/Mac
```bash
# Make script executable
chmod +x install.sh

# Run installation
./install.sh
```

## Multi-Server Deployment

### Prerequisites
- PowerShell 5.1+ (Windows)
- Node.js 18+ on all servers
- Git on all servers
- Network access between servers

### Automated Deployment
```powershell
# Deploy to all servers
.\deploy.ps1

# Deploy to specific servers
.\deploy.ps1 -Servers @("server1", "server2")

# Deploy with custom repo
.\deploy.ps1 -RepoUrl "https://github.com/your-username/az-interface.git"
```

### Manual Deployment (Per Server)
```powershell
# 1. Clone repository
git clone https://github.com/your-username/az-interface.git C:\az-interface
cd C:\az-interface

# 2. Install dependencies
npm install
cd backend
npm install
cd ..

# 3. Build frontend
npm run build

# 4. Start services
.\start.bat
```

## Server Configuration

### Environment Variables
Create `.env` file in the root directory:
```env
# Backend Configuration
PORT=3001
NODE_ENV=production

# Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/az_interface

# API Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Authentication
JWT_SECRET=your_jwt_secret
```

### Port Configuration
- **Frontend**: 5173 (development) / 80 (production)
- **Backend**: 3001
- **Database**: 5432 (if using PostgreSQL)

## Service Management

### Windows Services
```powershell
# Install as Windows Service
nssm install AZInterfaceBackend "C:\az-interface\backend\node.exe" "C:\az-interface\backend\server.js"
nssm install AZInterfaceFrontend "C:\az-interface\node.exe" "C:\az-interface\vite.config.ts"

# Start services
nssm start AZInterfaceBackend
nssm start AZInterfaceFrontend
```

### Linux Systemd
```bash
# Create service files
sudo nano /etc/systemd/system/az-interface-backend.service
sudo nano /etc/systemd/system/az-interface-frontend.service

# Enable and start
sudo systemctl enable az-interface-backend
sudo systemctl enable az-interface-frontend
sudo systemctl start az-interface-backend
sudo systemctl start az-interface-frontend
```

## Load Balancer Configuration

### Nginx (Recommended)
```nginx
upstream az_interface_backend {
    server server1:3001;
    server server2:3001;
    server server3:3001;
    server server4:3001;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://az_interface_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### HAProxy
```haproxy
frontend az_interface_frontend
    bind *:80
    default_backend az_interface_backend

backend az_interface_backend
    balance roundrobin
    server server1 server1:3001 check
    server server2 server2:3001 check
    server server3 server3:3001 check
    server server4 server4:3001 check
```

## Monitoring & Health Checks

### Health Check Endpoints
- **Backend**: `http://server:3001/api/health`
- **Frontend**: `http://server:5173/`

### Monitoring Script
```powershell
# Check all servers
.\monitor.ps1 -Servers @("server1", "server2", "server3", "server4")
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Kill process
taskkill /PID <process_id> /F
```

#### Permission Issues
```powershell
# Run as administrator
Start-Process PowerShell -Verb RunAs
```

#### Node.js Version Issues
```powershell
# Check Node.js version
node --version

# Install Node.js 18+ if needed
winget install OpenJS.NodeJS
```

### Logs
- **Backend**: `backend/logs/`
- **Frontend**: Browser console
- **System**: Windows Event Viewer / Linux journalctl

## Security Considerations

### Firewall Configuration
```powershell
# Allow required ports
New-NetFirewallRule -DisplayName "AZ Interface Backend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
New-NetFirewallRule -DisplayName "AZ Interface Frontend" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
```

### SSL/TLS Setup
```bash
# Generate SSL certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Configure HTTPS in backend
```

## Backup & Recovery

### Automated Backup
```powershell
# Create backup script
.\backup.ps1 -Servers @("server1", "server2", "server3", "server4") -BackupPath "C:\backups"
```

### Restore from Backup
```powershell
# Restore script
.\restore.ps1 -Servers @("server1", "server2", "server3", "server4") -BackupPath "C:\backups\2024-01-01"
```

## Performance Optimization

### Production Build
```bash
# Optimized build
npm run build -- --mode production

# Serve with compression
npm install compression
```

### Database Optimization
```sql
-- PostgreSQL optimizations
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agents_status ON agents(status);
```

## Support

### Default Credentials
- **Username**: admin
- **Password**: password

### Contact
- **Documentation**: [GitHub Wiki](https://github.com/your-username/az-interface/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/az-interface/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/az-interface/discussions)

---

**Note**: Remember to change default passwords and API keys in production environments!
