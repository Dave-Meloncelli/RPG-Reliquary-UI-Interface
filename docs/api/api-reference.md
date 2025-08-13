# 🔌 OCTOSPINE API Reference

## Overview

The OCTOSPINE API provides comprehensive access to all system functionality through REST endpoints, WebSocket connections, and GraphQL queries. This reference documents all available endpoints, request/response formats, and authentication methods.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.octospine.com`
- **WebSocket**: `ws://localhost:8000/ws` (dev) / `wss://api.octospine.com/ws` (prod)

## Authentication

### API Key Authentication
```http
Authorization: Bearer YOUR_API_KEY
```

### Session Authentication
```http
Cookie: session=YOUR_SESSION_TOKEN
```

### JWT Token Authentication
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

All API responses follow a standard format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "req_123456789"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "req_123456789"
}
```

## REST API Endpoints

### System Management

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0",
    "uptime": 3600,
    "services": {
      "database": "healthy",
      "cache": "healthy",
      "queue": "healthy"
    }
  }
}
```

#### System Status
```http
GET /api/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "system": {
      "cpu_usage": 45.2,
      "memory_usage": 67.8,
      "disk_usage": 23.1,
      "network_io": {
        "bytes_sent": 1024000,
        "bytes_received": 2048000
      }
    },
    "applications": {
      "total": 15,
      "running": 12,
      "stopped": 3
    },
    "agents": {
      "total": 25,
      "active": 20,
      "idle": 5
    }
  }
}
```

#### System Configuration
```http
GET /api/config
```

**Response:**
```json
{
  "success": true,
  "data": {
    "environment": "development",
    "features": {
      "consciousness_processing": true,
      "automation_matrix": true,
      "documentation_engine": true,
      "agent_network": true
    },
    "limits": {
      "max_agents": 100,
      "max_automations": 50,
      "max_documents": 1000
    }
  }
}
```

### Task Management

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "name": "Data Processing Task",
  "description": "Process incoming data from external sources",
  "type": "data_processing",
  "priority": "high",
  "parameters": {
    "source": "api",
    "destination": "database",
    "transformations": ["clean", "validate", "enrich"]
  },
  "schedule": {
    "type": "interval",
    "value": 300
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_123456789",
    "name": "Data Processing Task",
    "status": "created",
    "created_at": "2024-01-01T00:00:00Z",
    "next_run": "2024-01-01T00:05:00Z"
  }
}
```

#### List Tasks
```http
GET /api/tasks?status=active&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_123456789",
        "name": "Data Processing Task",
        "type": "data_processing",
        "status": "running",
        "progress": 75,
        "created_at": "2024-01-01T00:00:00Z",
        "last_run": "2024-01-01T00:05:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### Get Task Details
```http
GET /api/tasks/{task_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_123456789",
    "name": "Data Processing Task",
    "description": "Process incoming data from external sources",
    "type": "data_processing",
    "status": "running",
    "priority": "high",
    "progress": 75,
    "parameters": {
      "source": "api",
      "destination": "database",
      "transformations": ["clean", "validate", "enrich"]
    },
    "schedule": {
      "type": "interval",
      "value": 300
    },
    "statistics": {
      "total_runs": 24,
      "successful_runs": 22,
      "failed_runs": 2,
      "average_duration": 45.5
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:05:00Z"
  }
}
```

#### Update Task
```http
PUT /api/tasks/{task_id}
Content-Type: application/json

{
  "name": "Updated Data Processing Task",
  "priority": "medium",
  "parameters": {
    "source": "api",
    "destination": "database",
    "transformations": ["clean", "validate", "enrich", "aggregate"]
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/{task_id}
```

### Agent Management

#### Create Agent
```http
POST /api/agents
Content-Type: application/json

{
  "name": "Data Processing Agent",
  "type": "data_processor",
  "capabilities": ["data_cleaning", "validation", "transformation"],
  "configuration": {
    "max_concurrent_tasks": 5,
    "timeout": 300,
    "retry_attempts": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "agent_123456789",
    "name": "Data Processing Agent",
    "type": "data_processor",
    "status": "active",
    "capabilities": ["data_cleaning", "validation", "transformation"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### List Agents
```http
GET /api/agents?status=active&type=data_processor
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "agent_123456789",
        "name": "Data Processing Agent",
        "type": "data_processor",
        "status": "active",
        "current_tasks": 2,
        "total_tasks_completed": 150,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### Get Agent Details
```http
GET /api/agents/{agent_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "agent_123456789",
    "name": "Data Processing Agent",
    "type": "data_processor",
    "status": "active",
    "capabilities": ["data_cleaning", "validation", "transformation"],
    "configuration": {
      "max_concurrent_tasks": 5,
      "timeout": 300,
      "retry_attempts": 3
    },
    "statistics": {
      "total_tasks_completed": 150,
      "successful_tasks": 145,
      "failed_tasks": 5,
      "average_task_duration": 45.5,
      "uptime": 86400
    },
    "current_tasks": [
      {
        "id": "task_123456789",
        "name": "Data Processing Task",
        "progress": 75
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:05:00Z"
  }
}
```

### Consciousness Management

#### Get Consciousness Status
```http
GET /api/consciousness/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "consciousness_level": 0.85,
    "memory_usage": {
      "short_term": 45.2,
      "long_term": 67.8
    },
    "learning_progress": {
      "total_patterns": 1250,
      "new_patterns_today": 15,
      "adaptation_rate": 0.92
    },
    "decision_metrics": {
      "total_decisions": 500,
      "successful_decisions": 485,
      "confidence_average": 0.88
    }
  }
}
```

#### Trigger Learning Session
```http
POST /api/consciousness/learn
Content-Type: application/json

{
  "session_type": "pattern_recognition",
  "duration": 3600,
  "focus_areas": ["data_processing", "automation_optimization"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "learn_123456789",
    "status": "started",
    "estimated_completion": "2024-01-01T01:00:00Z",
    "focus_areas": ["data_processing", "automation_optimization"]
  }
}
```

### Documentation Management

#### Generate Documentation
```http
POST /api/documentation/generate
Content-Type: application/json

{
  "type": "api_reference",
  "targets": ["services", "components", "frameworks"],
  "format": "markdown",
  "include_examples": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "doc_gen_123456789",
    "status": "processing",
    "estimated_completion": "2024-01-01T00:10:00Z",
    "targets": ["services", "components", "frameworks"]
  }
}
```

#### Get Documentation Status
```http
GET /api/documentation/status/{job_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "doc_gen_123456789",
    "status": "completed",
    "progress": 100,
    "documents_generated": 45,
    "files_processed": 120,
    "completion_time": "2024-01-01T00:08:30Z"
  }
}
```

#### Search Documentation
```http
GET /api/documentation/search?query=authentication&type=api&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "doc_123456789",
        "title": "Authentication API Reference",
        "type": "api_reference",
        "content_snippet": "Authentication methods and endpoints...",
        "relevance_score": 0.95,
        "last_updated": "2024-01-01T00:00:00Z"
      }
    ],
    "total_results": 15,
    "search_time": 0.045
  }
}
```

### Automation Management

#### Create Automation
```http
POST /api/automations
Content-Type: application/json

{
  "name": "Data Pipeline Automation",
  "description": "Automated data processing pipeline",
  "triggers": [
    {
      "type": "schedule",
      "value": "0 */6 * * *"
    },
    {
      "type": "event",
      "value": "data_source.updated"
    }
  ],
  "steps": [
    {
      "name": "data_extraction",
      "type": "extract",
      "parameters": {
        "source": "api",
        "endpoint": "/data/sources"
      }
    },
    {
      "name": "data_processing",
      "type": "transform",
      "parameters": {
        "operations": ["clean", "validate", "enrich"]
      }
    },
    {
      "name": "data_storage",
      "type": "store",
      "parameters": {
        "destination": "database",
        "table": "processed_data"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "auto_123456789",
    "name": "Data Pipeline Automation",
    "status": "active",
    "triggers": [
      {
        "type": "schedule",
        "value": "0 */6 * * *",
        "next_trigger": "2024-01-01T06:00:00Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### List Automations
```http
GET /api/automations?status=active&type=data_processing
```

**Response:**
```json
{
  "success": true,
  "data": {
    "automations": [
      {
        "id": "auto_123456789",
        "name": "Data Pipeline Automation",
        "type": "data_processing",
        "status": "active",
        "last_run": "2024-01-01T00:00:00Z",
        "next_run": "2024-01-01T06:00:00Z",
        "success_rate": 0.95
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### Monitoring and Analytics

#### Get System Metrics
```http
GET /api/metrics/system?period=1h&interval=5m
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "1h",
    "interval": "5m",
    "metrics": {
      "cpu_usage": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 45.2},
        {"timestamp": "2024-01-01T00:05:00Z", "value": 47.8}
      ],
      "memory_usage": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 67.8},
        {"timestamp": "2024-01-01T00:05:00Z", "value": 68.2}
      ],
      "disk_usage": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 23.1},
        {"timestamp": "2024-01-01T00:05:00Z", "value": 23.1}
      ]
    }
  }
}
```

#### Get Application Metrics
```http
GET /api/metrics/applications?app_id=app_123&period=24h
```

**Response:**
```json
{
  "success": true,
  "data": {
    "app_id": "app_123",
    "period": "24h",
    "metrics": {
      "response_time": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 125.5},
        {"timestamp": "2024-01-01T01:00:00Z", "value": 118.2}
      ],
      "throughput": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 150},
        {"timestamp": "2024-01-01T01:00:00Z", "value": 165}
      ],
      "error_rate": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 0.02},
        {"timestamp": "2024-01-01T01:00:00Z", "value": 0.01}
      ]
    }
  }
}
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = function() {
  console.log('Connected to OCTOSPINE WebSocket');
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Event Types

#### System Status Updates
```json
{
  "type": "system.status",
  "data": {
    "timestamp": "2024-01-01T00:00:00Z",
    "status": "healthy",
    "metrics": {
      "cpu_usage": 45.2,
      "memory_usage": 67.8,
      "disk_usage": 23.1
    }
  }
}
```

#### Task Progress Updates
```json
{
  "type": "task.progress",
  "data": {
    "task_id": "task_123456789",
    "progress": 75,
    "status": "running",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Alert Notifications
```json
{
  "type": "alert.new",
  "data": {
    "alert_id": "alert_123456789",
    "severity": "warning",
    "message": "High CPU usage detected",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Log Entry Updates
```json
{
  "type": "log.entry",
  "data": {
    "level": "info",
    "message": "Task completed successfully",
    "timestamp": "2024-01-01T00:00:00Z",
    "context": {
      "task_id": "task_123456789",
      "agent_id": "agent_123456789"
    }
  }
}
```

### Subscribing to Events
```javascript
// Subscribe to system status updates
ws.send(JSON.stringify({
  "action": "subscribe",
  "events": ["system.status"]
}));

// Subscribe to specific task updates
ws.send(JSON.stringify({
  "action": "subscribe",
  "events": ["task.progress"],
  "filters": {
    "task_id": "task_123456789"
  }
}));
```

## GraphQL API

### Endpoint
```
POST /api/graphql
```

### Schema Overview

#### Query Types
```graphql
type Query {
  # System queries
  system: System
  health: HealthStatus
  
  # Task queries
  tasks(filter: TaskFilter): [Task]
  task(id: ID!): Task
  
  # Agent queries
  agents(filter: AgentFilter): [Agent]
  agent(id: ID!): Agent
  
  # Consciousness queries
  consciousness: ConsciousnessStatus
  
  # Documentation queries
  documentation: DocumentationStatus
  searchDocumentation(query: String!): [Document]
  
  # Automation queries
  automations(filter: AutomationFilter): [Automation]
  automation(id: ID!): Automation
  
  # Metrics queries
  metrics(type: MetricType!, period: String!): [Metric]
}
```

#### Mutation Types
```graphql
type Mutation {
  # Task mutations
  createTask(input: CreateTaskInput!): Task
  updateTask(id: ID!, input: UpdateTaskInput!): Task
  deleteTask(id: ID!): Boolean
  
  # Agent mutations
  createAgent(input: CreateAgentInput!): Agent
  updateAgent(id: ID!, input: UpdateAgentInput!): Agent
  deleteAgent(id: ID!): Boolean
  
  # Automation mutations
  createAutomation(input: CreateAutomationInput!): Automation
  updateAutomation(id: ID!, input: UpdateAutomationInput!): Automation
  deleteAutomation(id: ID!): Boolean
  
  # Consciousness mutations
  triggerLearning(input: LearningInput!): LearningSession
  
  # Documentation mutations
  generateDocumentation(input: DocumentationInput!): DocumentationJob
}
```

### Example Queries

#### Get System Status
```graphql
query GetSystemStatus {
  system {
    status
    metrics {
      cpuUsage
      memoryUsage
      diskUsage
    }
    applications {
      total
      running
      stopped
    }
  }
}
```

#### Get Tasks with Filtering
```graphql
query GetTasks($status: TaskStatus, $limit: Int) {
  tasks(filter: { status: $status, limit: $limit }) {
    id
    name
    type
    status
    progress
    createdAt
    lastRun
  }
}
```

#### Create New Task
```graphql
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    name
    status
    createdAt
  }
}
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Codes
- `INVALID_REQUEST` - Invalid request format
- `AUTHENTICATION_FAILED` - Authentication failed
- `AUTHORIZATION_DENIED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `VALIDATION_ERROR` - Input validation failed
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `INTERNAL_ERROR` - Internal server error
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable

## Rate Limiting

### Limits
- **REST API**: 1000 requests per minute per API key
- **WebSocket**: 1000 messages per minute per connection
- **GraphQL**: 500 queries per minute per API key

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @octospine/api-client
```

```javascript
import { OctospineClient } from '@octospine/api-client';

const client = new OctospineClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.octospine.com'
});

// Create a task
const task = await client.tasks.create({
  name: 'Data Processing Task',
  type: 'data_processing',
  priority: 'high'
});

// Get system status
const status = await client.system.getStatus();
```

### Python
```bash
pip install octospine-api-client
```

```python
from octospine import OctospineClient

client = OctospineClient(
    api_key='your-api-key',
    base_url='https://api.octospine.com'
)

# Create a task
task = client.tasks.create(
    name='Data Processing Task',
    type='data_processing',
    priority='high'
)

# Get system status
status = client.system.get_status()
```

## Support

### Documentation
- **API Reference**: This document
- **SDK Documentation**: Available in each SDK repository
- **Examples**: Code examples and tutorials
- **Changelog**: API version history

### Support Channels
- **Email**: api-support@octospine.com
- **Documentation**: https://docs.octospine.com/api
- **Community**: https://community.octospine.com
- **Status Page**: https://status.octospine.com

---

**For the latest API updates and breaking changes, please refer to our API changelog and migration guides.**
