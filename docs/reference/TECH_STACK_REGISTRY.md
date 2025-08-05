# 🔧 AZ Interface Tech Stack Registry

## 📋 **Overview**
This registry documents all technologies, versions, dependencies, and potential conflicts across the entire AZ Interface ecosystem.

---

## 🎯 **Frontend Tech Stack**

### **Core Framework**
- **React**: `^18.2.0` (Stable - Fixed from React 19 beta)
- **React DOM**: `^18.2.0` (Stable)
- **TypeScript**: `~5.3.3` (Stable)

### **Build Tools**
- **Vite**: `^5.0.0` (Fixed from v6.2.0 for Storybook compatibility)
- **@vitejs/plugin-react**: `^4.2.1`
- **Vitest**: `^1.0.4` (Testing framework)

### **UI & Styling**
- **Tailwind CSS**: CDN version (via index.html)
- **Monaco Editor**: `0.49.0` (Code editor)
- **Arktype**: `1.0.28-alpha` (Runtime type validation)

### **AI Integration**
- **@google/genai**: `^1.10.0` (Gemini AI client)

### **Development Tools**
- **ESLint**: `^8.55.0` (Linting)
- **Prettier**: `^3.1.1` (Code formatting)
- **Husky**: `^8.0.3` (Git hooks)
- **Storybook**: `^7.6.7` (Component development)

### **Testing**
- **@testing-library/react**: `^14.1.2`
- **@testing-library/jest-dom**: `^6.1.5`
- **@testing-library/user-event**: `^14.5.1`
- **jsdom**: `^23.0.1`

---

## 🐍 **Backend Tech Stack**

### **Core Framework**
- **FastAPI**: `0.104.1` (Python web framework)
- **Uvicorn**: `0.24.0` (ASGI server)
- **Python**: `3.13.2` (Runtime)

### **Database & ORM**
- **SQLAlchemy**: `2.0.23` (ORM)
- **Alembic**: `1.13.1` (Database migrations)
- **PostgreSQL**: Via Docker (Primary database)
- **Redis**: `5.0.1` (Caching & sessions)

### **Authentication & Security**
- **python-jose**: `3.3.0` (JWT handling)
- **passlib**: `1.7.4` (Password hashing)
- **bcrypt**: `4.1.2` (Password encryption)
- **cryptography**: `41.0.8` (Cryptographic primitives)

### **Data Processing**
- **Pydantic**: `2.5.0` (Data validation)
- **python-multipart**: `0.0.6` (File uploads)
- **email-validator**: `2.1.0` (Email validation)

### **Testing**
- **pytest**: `7.4.3`
- **pytest-asyncio**: `0.21.1`
- **httpx**: `0.25.2` (HTTP client for testing)

---

## 🤖 **AI/ML Tech Stack**

### **CrewAI Framework**
- **CrewAI**: `0.28.0` (Multi-agent framework)
- **LangChain**: `0.0.350` (LLM orchestration)
- **LangChain OpenAI**: `0.0.2`
- **LangChain Anthropic**: `0.0.5`
- **LangChain Google GenAI**: `0.0.3`
- **LangChain Community**: `0.0.10`

### **Streamlit Integration**
- **Streamlit**: `1.29.0` (Web app framework)
- **streamlit-option-menu**: `0.3.6`

### **Data Science**
- **Pandas**: `2.1.4`
- **NumPy**: `1.24.3`
- **Scikit-learn**: `1.3.2`
- **Matplotlib**: `3.8.2`
- **Seaborn**: `0.13.0`

### **Machine Learning**
- **Transformers**: `4.36.2`
- **Torch**: `2.1.2`
- **Sentence Transformers**: `2.2.2`

### **Vector Database**
- **ChromaDB**: `0.4.22`
- **Milvus**: Via Docker (Vector search)

---

## 🐳 **Infrastructure & DevOps**

### **Containerization**
- **Docker**: `28.3.0` (Container platform)
- **Docker Compose**: Multi-service orchestration
- **Nginx**: `alpine` (Reverse proxy)

### **Monitoring & Logging**
- **Prometheus Client**: `0.19.0`
- **Structlog**: `23.2.0`
- **Elasticsearch**: Via Docker (Search & analytics)

### **Task Queue**
- **Celery**: `5.3.4` (Distributed task queue)
- **Flower**: `2.0.1` (Celery monitoring)

### **Web Scraping & Automation**
- **BeautifulSoup4**: `4.12.2`
- **Selenium**: `4.15.2`
- **Playwright**: `1.40.0`

### **Image Processing**
- **Pillow**: `10.1.0`
- **OpenCV**: `4.8.1.78`

---

## 🔌 **Integration Services**

### **N8N Workflow Automation**
- **N8N**: Via Docker (Workflow automation)
- **WebSocket Support**: `12.0`

### **Graph & Network Analysis**
- **NetworkX**: `3.2.1`

### **Async Support**
- **aiohttp**: `3.9.1`
- **asyncio-mqtt**: `0.16.1`
- **aiofiles**: `23.2.1`

---

## 📊 **Version Conflicts & Issues**

### **🔴 CRITICAL CONFLICTS**

#### **1. Vite Version Conflict (RESOLVED)**
- **Issue**: Vite 6.2.0 incompatible with Storybook 7.6.7
- **Resolution**: Downgraded to Vite 5.0.0
- **Status**: ✅ FIXED

#### **2. React Version Conflict (RESOLVED)**
- **Issue**: React 19 beta causing TypeScript errors
- **Resolution**: Downgraded to React 18.2.0 stable
- **Status**: ✅ FIXED

#### **3. LangChain Version Conflicts (IDENTIFIED)**
- **Issue**: Multiple langchain packages with different versions
- **Impact**: Potential import errors and API incompatibilities
- **Status**: ⚠️ MONITORING

### **🔧 KNOWN FAULTS & FIXES (FROM INTERNAL DOCS)**

#### **1. YAML Parsing Error: "List item found without a parent container" (RESOLVED)**
- **Issue**: Fragile `parseYamlLike` function in `services/dataParsers.ts`
- **Root Cause**: Parser failed to create parent arrays before processing list items
- **Solution**: Implemented robust stack-based parser with lookahead mechanism
- **Status**: ✅ FIXED

#### **2. Module Initialization Error: "does not provide an export named 'RawData'" (RESOLVED)**
- **Issue**: Circular dependency between `constants.tsx` and `services/dataParsers.ts`
- **Root Cause**: Module initialization race condition
- **Solution**: Refactored to co-locate data in `constants.tsx`, simplified `dataParsers.ts`
- **Status**: ✅ FIXED

### **🟡 MEDIUM PRIORITY ISSUES**

#### **1. Python Package Conflicts**
- **Issue**: Some packages may have version mismatches
- **Impact**: Runtime errors and import failures
- **Status**: 🔍 INVESTIGATING

#### **2. Docker Service Dependencies**
- **Issue**: Complex multi-service dependencies
- **Impact**: Service startup failures
- **Status**: 🔍 INVESTIGATING

### **🟢 RESOLVED ISSUES**

#### **1. Directory Structure (RESOLVED)**
- **Issue**: Files scattered in wrong locations
- **Resolution**: Proper src/ directory structure
- **Status**: ✅ FIXED

#### **2. Import Path Issues (RESOLVED)**
- **Issue**: Broken import paths after reorganization
- **Resolution**: Updated all relative imports
- **Status**: ✅ FIXED

---

## 🏗️ **Architecture Silos**

### **Frontend Silo**
```
React 18.2.0 + TypeScript 5.3.3 + Vite 5.0.0
├── UI Components (95+ TSX files)
├── Services Layer (35+ service files)
├── State Management (Context API)
└── Build System (Vite + ESLint + Prettier)
```

### **Backend Silo**
```
FastAPI 0.104.1 + Python 3.13.2 + SQLAlchemy 2.0.23
├── API Endpoints
├── Database Layer (PostgreSQL + Redis)
├── Authentication (JWT + bcrypt)
└── Background Tasks (Celery)
```

### **AI/ML Silo**
```
CrewAI 0.28.0 + LangChain 0.0.350 + Transformers 4.36.2
├── Multi-Agent Framework
├── LLM Orchestration
├── Vector Database (ChromaDB + Milvus)
└── Model Serving
```

### **Infrastructure Silo**
```
Docker 28.3.0 + Nginx + Monitoring Stack
├── Container Orchestration
├── Reverse Proxy
├── Monitoring (Prometheus + Elasticsearch)
└── Task Queue (Celery + Flower)
```

---

## 🔍 **Dependency Analysis**

### **Frontend Dependencies**
- **Total Packages**: 45+ dependencies
- **Peer Dependencies**: 15+ (including React ecosystem)
- **Dev Dependencies**: 30+ (build tools, testing, linting)

### **Backend Dependencies**
- **Total Packages**: 20+ dependencies
- **Core Framework**: FastAPI + Uvicorn
- **Database**: SQLAlchemy + Alembic
- **Security**: JWT + bcrypt + cryptography

### **AI/ML Dependencies**
- **Total Packages**: 40+ dependencies
- **Framework**: CrewAI + LangChain
- **Models**: Transformers + Torch
- **Data Processing**: Pandas + NumPy + Scikit-learn

---

## 🚀 **Deployment Matrix**

### **Development Environment**
- **Node.js**: 24.5.0
- **npm**: 11.5.1
- **Python**: 3.13.2
- **Docker**: 28.3.0

### **Production Environment**
- **Frontend**: Nginx + Vite build
- **Backend**: FastAPI + Uvicorn
- **Database**: PostgreSQL + Redis
- **AI Services**: CrewAI + LangChain
- **Monitoring**: Prometheus + Elasticsearch

---

## 📈 **Health Metrics**

### **Code Quality**
- **TypeScript Files**: 95+
- **Python Files**: 20+
- **Test Coverage**: TBD
- **Linting**: ESLint + Prettier configured

### **Performance**
- **Build Time**: TBD
- **Bundle Size**: TBD
- **Runtime Performance**: TBD

### **Security**
- **Dependency Vulnerabilities**: TBD
- **Authentication**: JWT + bcrypt
- **API Security**: FastAPI security features

---

## 🔄 **Update Strategy**

### **Frontend Updates**
1. **React**: Stay on 18.2.0 until 19 is stable
2. **Vite**: Monitor for Storybook compatibility
3. **TypeScript**: Regular updates within 5.x range

### **Backend Updates**
1. **FastAPI**: Regular updates
2. **Python**: Stay on 3.13.x
3. **Database**: PostgreSQL latest LTS

### **AI/ML Updates**
1. **CrewAI**: Monitor for breaking changes
2. **LangChain**: Coordinate updates across packages
3. **Models**: Regular security updates

---

## 📝 **Maintenance Notes**

### **Regular Tasks**
- [ ] Weekly dependency updates
- [ ] Monthly security audits
- [ ] Quarterly version compatibility checks
- [ ] Annual architecture review

### **Monitoring**
- [ ] Build success rates
- [ ] Test pass rates
- [ ] Runtime performance
- [ ] Security vulnerabilities

### **AI Agent Resources**
- **Navigation Guide**: `docs/AI_NAVIGATION_GUIDE.md` - Complete AI navigation system
- **Known Faults**: `internal/Known-faults-fixes.md` - Common issues and solutions
- **Continuance Log**: `consciousness/CONTINUANCE_LOG.md` - Context and relationship tracking
- **Backlog Management**: `docs/reference/BACKLOG_MANAGEMENT.md` - Current priorities and tasks

---

*Last Updated: August 3, 2025*
*Registry Version: 1.0.0* 