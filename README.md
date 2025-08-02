# 🤖 AZ Interface - Enterprise AI Agent Platform

**Complete Multi-Agent AI Platform with Agent Zero, CrewAI, A2A Protocol, and n8n Integration**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Agent Zero](https://img.shields.io/badge/Agent--Zero-Integrated-green.svg)](https://github.com/agent0ai/agent-zero)
[![CrewAI](https://img.shields.io/badge/CrewAI-Integrated-orange.svg)](https://github.com/crewAIInc/crewAI)
[![A2A Protocol](https://img.shields.io/badge/A2A--Protocol-Integrated-purple.svg)](https://github.com/a2aproject)
[![n8n](https://img.shields.io/badge/n8n-Integrated-red.svg)](https://n8n.io/)

## 🎯 **Overview**

AZ Interface is a comprehensive enterprise-grade AI agent platform that integrates:

- **🤖 Agent Zero**: Core AI intelligence and RPG-style agent management
- **👥 CrewAI**: Multi-agent collaboration and task orchestration
- **🔗 A2A Protocol**: Agent-to-agent communication and interoperability
- **⚡ n8n**: Workflow automation and integration hub
- **📊 Monitoring**: Complete observability stack (Prometheus, Grafana, Jaeger)
- **🛡️ Security**: Enterprise-grade security and authentication
- **💾 Database**: PostgreSQL with comprehensive schema
- **🚀 Scalability**: Docker-based microservices architecture

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    AZ Interface Platform                    │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React) │ Backend (FastAPI) │ CrewAI │ A2A Gateway │
├─────────────────────────────────────────────────────────────┤
│  n8n Workflows    │ Ollama LLM        │ Milvus │ PostgreSQL  │
├─────────────────────────────────────────────────────────────┤
│  Prometheus       │ Grafana           │ Jaeger │ Elasticsearch│
└─────────────────────────────────────────────────────────────┘
```

## 🚀 **Quick Start**

### Prerequisites

- **Docker & Docker Compose** (v2.0+)
- **Git** (latest version)
- **8GB+ RAM** (16GB recommended)
- **50GB+ disk space**
- **NVIDIA GPU** (optional, for Ollama acceleration)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/az-interface.git
cd az-interface
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Security
SECRET_KEY=your_super_secret_jwt_key_here
POSTGRES_PASSWORD=your_secure_password_here
REDIS_PASSWORD=your_redis_password_here

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Monitoring
GRAFANA_PASSWORD=your_grafana_admin_password_here

# n8n
N8N_USER=admin
N8N_PASSWORD=your_n8n_password_here
```

### 3. Start the Platform

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Services

| Service | URL | Default Credentials |
|---------|-----|-------------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:8000 | - |
| **CrewAI UI** | http://localhost:8500 | - |
| **n8n** | http://localhost:5678 | admin / your_password |
| **Grafana** | http://localhost:3001 | admin / your_password |
| **Portainer** | http://localhost:9000 | - |
| **MailHog** | http://localhost:8025 | - |
| **Adminer** | http://localhost:8080 | - |

## 🔧 **Service Architecture**

### **Agent Zero Core Services**
- **agent-zero-api**: FastAPI backend with authentication, task management
- **agent-zero-ui**: React frontend with desktop-like interface
- **PostgreSQL**: Primary database with comprehensive schema
- **Redis**: Caching and session management

### **CrewAI Multi-Agent Framework**
- **crewai-core**: Main CrewAI service with Streamlit UI
- **crewai-worker**: Scalable worker nodes for task processing
- **Ollama**: Local LLM for agent interactions
- **Milvus**: Vector database for agent memory

### **A2A Protocol Services**
- **a2a-gateway**: Agent-to-agent communication gateway
- **a2a-registry**: Agent registry and discovery service
- **Certificate Management**: Secure inter-agent communication

### **n8n Workflow Automation**
- **n8n**: Workflow automation hub
- **Workflow Integration**: Seamless integration with all services
- **Webhook Support**: Real-time event processing

### **Monitoring & Observability**
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Jaeger**: Distributed tracing
- **Elasticsearch + Kibana**: Log aggregation

## 📊 **Database Schema**

The platform includes a comprehensive PostgreSQL schema with:

- **Users & Authentication**: Secure user management
- **CrewAI Tables**: Agent, crew, and task management
- **A2A Protocol**: Node registry and message tracking
- **n8n Integration**: Workflow mapping and execution logs
- **Performance Metrics**: System and agent performance tracking

## 🔐 **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API protection and abuse prevention
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive data validation
- **Security Headers**: XSS, CSRF, and other protections
- **Container Security**: Non-root users and minimal privileges

## 📈 **Monitoring & Metrics**

### **Available Dashboards**
- **System Overview**: Overall platform health
- **Agent Performance**: CrewAI agent metrics
- **A2A Communication**: Protocol message tracking
- **n8n Workflows**: Automation execution metrics
- **Database Performance**: PostgreSQL query analysis
- **Container Resources**: Docker resource utilization

### **Key Metrics**
- Agent task completion rates
- A2A message delivery success
- n8n workflow execution times
- API response times and error rates
- Database query performance
- System resource utilization

## 🔄 **Workflow Integration**

### **n8n + CrewAI Integration**
```javascript
// Example n8n workflow node
{
  "node_type": "HTTP Request",
  "method": "POST",
  "url": "http://crewai-core:8501/api/crews/execute",
  "body": {
    "crew_id": "marketing-crew",
    "task": "Create social media content for new product"
  }
}
```

### **A2A Protocol Integration**
```python
# Example A2A message
{
  "source_node": "az-interface-gateway",
  "target_node": "external-agent",
  "message_type": "task_request",
  "payload": {
    "task_id": "analyze-market-data",
    "parameters": {...}
  }
}
```

## 🚀 **Deployment Options**

### **Development**
```bash
# Start with development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### **Production**
```bash
# Start with production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Scaling**
```bash
# Scale CrewAI workers
docker-compose up -d --scale crewai-worker=5

# Scale backend API
docker-compose up -d --scale agent-zero-api=3
```

## 🛠️ **Development**

### **Adding New Agents**
1. Create agent configuration in `crewai/agents/`
2. Define agent capabilities and tools
3. Add to CrewAI crew configuration
4. Test with n8n workflow integration

### **Creating n8n Workflows**
1. Access n8n at http://localhost:5678
2. Create new workflow
3. Add HTTP Request nodes for service integration
4. Configure webhooks for real-time triggers

### **A2A Protocol Extension**
1. Register new node in A2A registry
2. Implement protocol handlers
3. Configure message routing
4. Test inter-agent communication

## 📚 **API Documentation**

### **Agent Zero API**
- **Base URL**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Authentication**: JWT Bearer tokens

### **CrewAI API**
- **Base URL**: http://localhost:8501
- **UI**: http://localhost:8500
- **Authentication**: API key or session-based

### **A2A Protocol**
- **Gateway**: http://localhost:5001
- **Registry**: http://localhost:5003
- **Inspector**: http://localhost:5002

## 🔍 **Troubleshooting**

### **Common Issues**

**Service Won't Start**
```bash
# Check logs
docker-compose logs [service-name]

# Check resource usage
docker stats

# Restart specific service
docker-compose restart [service-name]
```

**Database Connection Issues**
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready -U az_user

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

**Memory Issues**
```bash
# Check memory usage
docker stats

# Adjust memory limits in docker-compose.yml
# Increase system swap if needed
```

### **Performance Optimization**

1. **Resource Allocation**: Adjust CPU/memory limits in docker-compose.yml
2. **Database Tuning**: Optimize PostgreSQL configuration
3. **Caching**: Configure Redis for optimal performance
4. **Monitoring**: Use Grafana dashboards to identify bottlenecks

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **[Agent Zero](https://github.com/agent0ai/agent-zero)** - Core AI intelligence framework
- **[CrewAI](https://github.com/crewAIInc/crewAI)** - Multi-agent collaboration framework
- **[A2A Protocol](https://github.com/a2aproject)** - Agent-to-agent communication protocol
- **[n8n](https://n8n.io/)** - Workflow automation platform
- **[Ollama](https://ollama.ai/)** - Local LLM runtime
- **[Milvus](https://milvus.io/)** - Vector database

## 📞 **Support**

- **Documentation**: [Wiki](https://github.com/your-username/az-interface/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/az-interface/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/az-interface/discussions)
- **Email**: support@az-interface.com

---

**Built with ❤️ for the AI community**
