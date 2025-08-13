# 🔗 OCTOSPINE Integration Guide

## Overview

This guide covers how to integrate OCTOSPINE with external systems, services, and applications. OCTOSPINE provides multiple integration points and protocols for seamless connectivity.

## Integration Methods

### 1. REST API Integration
- **Base URL**: `https://api.octospine.com`
- **Authentication**: API Key, JWT, or Session-based
- **Format**: JSON
- **Rate Limits**: 1000 requests/minute

### 2. WebSocket Integration
- **Endpoint**: `wss://api.octospine.com/ws`
- **Protocol**: JSON over WebSocket
- **Real-time**: System events and updates
- **Rate Limits**: 1000 messages/minute

### 3. GraphQL Integration
- **Endpoint**: `https://api.octospine.com/graphql`
- **Schema**: Comprehensive type system
- **Flexible**: Single endpoint for all queries
- **Rate Limits**: 500 queries/minute

## Quick Start

### 1. Get API Key
```bash
# Register at https://octospine.com/register
# Generate API key in dashboard
```

### 2. Test Connection
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.octospine.com/api/health
```

### 3. Basic Integration
```javascript
const client = new OctospineClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.octospine.com'
});

// Test connection
const health = await client.system.getHealth();
console.log('System status:', health.status);
```

## Common Integration Patterns

### Data Pipeline Integration
```javascript
// Create data processing pipeline
const pipeline = await client.pipelines.create({
  name: 'External Data Pipeline',
  source: {
    type: 'api',
    endpoint: 'https://your-api.com/data',
    authentication: {
      type: 'bearer',
      token: 'your-external-api-token'
    }
  },
  transformations: [
    { type: 'clean', parameters: { removeNulls: true } },
    { type: 'validate', parameters: { schema: 'your-schema' } },
    { type: 'enrich', parameters: { enrichments: ['geolocation'] } }
  ],
  destination: {
    type: 'database',
    table: 'processed_data'
  }
});
```

### Real-time Monitoring
```javascript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://api.octospine.com/ws');

ws.onopen = () => {
  // Subscribe to system events
  ws.send(JSON.stringify({
    action: 'subscribe',
    events: ['system.status', 'task.progress', 'alert.new']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'system.status':
      updateSystemDashboard(data.data);
      break;
    case 'task.progress':
      updateTaskProgress(data.data);
      break;
    case 'alert.new':
      showAlert(data.data);
      break;
  }
};
```

### Automation Integration
```javascript
// Create automation triggered by external events
const automation = await client.automations.create({
  name: 'External Event Handler',
  triggers: [
    {
      type: 'webhook',
      endpoint: '/webhooks/external-event',
      method: 'POST'
    }
  ],
  steps: [
    {
      name: 'process_event',
      type: 'transform',
      parameters: {
        mapping: {
          'external_id': 'internal_id',
          'event_type': 'task_type',
          'data': 'parameters'
        }
      }
    },
    {
      name: 'create_task',
      type: 'task',
      parameters: {
        template: 'data_processing',
        variables: '{{process_event.output}}'
      }
    }
  ]
});
```

## Service-Specific Integrations

### Database Integration
```javascript
// Connect to external database
const dbConnection = await client.integrations.create({
  type: 'database',
  name: 'External Database',
  configuration: {
    type: 'postgresql',
    host: 'your-db-host.com',
    port: 5432,
    database: 'your_database',
    username: 'your_username',
    password: 'your_password'
  }
});

// Create data sync task
const syncTask = await client.tasks.create({
  name: 'Database Sync',
  type: 'data_sync',
  parameters: {
    source: {
      type: 'database',
      connection_id: dbConnection.id,
      query: 'SELECT * FROM external_table'
    },
    destination: {
      type: 'octospine_database',
      table: 'synced_data'
    },
    schedule: {
      type: 'interval',
      value: 3600 // Every hour
    }
  }
});
```

### Cloud Service Integration
```javascript
// AWS S3 Integration
const s3Integration = await client.integrations.create({
  type: 'cloud_storage',
  name: 'AWS S3',
  configuration: {
    provider: 'aws',
    region: 'us-east-1',
    bucket: 'your-bucket',
    access_key: 'your-access-key',
    secret_key: 'your-secret-key'
  }
});

// File processing automation
const fileProcessor = await client.automations.create({
  name: 'S3 File Processor',
  triggers: [
    {
      type: 'cloud_event',
      integration_id: s3Integration.id,
      event: 'object_created'
    }
  ],
  steps: [
    {
      name: 'download_file',
      type: 'cloud_download',
      parameters: {
        integration_id: s3Integration.id,
        path: '{{trigger.object_key}}'
      }
    },
    {
      name: 'process_file',
      type: 'file_processing',
      parameters: {
        operations: ['parse', 'validate', 'transform']
      }
    },
    {
      name: 'store_results',
      type: 'database_store',
      parameters: {
        table: 'processed_files',
        data: '{{process_file.output}}'
      }
    }
  ]
});
```

### API Integration
```javascript
// External API integration
const apiIntegration = await client.integrations.create({
  type: 'api',
  name: 'External Service API',
  configuration: {
    base_url: 'https://api.external-service.com',
    authentication: {
      type: 'oauth2',
      client_id: 'your-client-id',
      client_secret: 'your-client-secret',
      token_url: 'https://api.external-service.com/oauth/token'
    }
  }
});

// API data processing
const apiProcessor = await client.tasks.create({
  name: 'External API Data Processor',
  type: 'api_processing',
  parameters: {
    integration_id: apiIntegration.id,
    endpoint: '/data/endpoint',
    method: 'GET',
    processing: {
      transformations: ['clean', 'enrich', 'validate'],
      mapping: {
        'external_field': 'internal_field',
        'external_id': 'reference_id'
      }
    },
    schedule: {
      type: 'cron',
      value: '0 */6 * * *' // Every 6 hours
    }
  }
});
```

## Webhook Integration

### Incoming Webhooks
```javascript
// Create webhook endpoint
const webhook = await client.webhooks.create({
  name: 'External System Webhook',
  endpoint: '/webhooks/external-system',
  events: ['task.completed', 'automation.triggered'],
  authentication: {
    type: 'hmac',
    secret: 'your-webhook-secret'
  }
});

// Handle webhook in your system
app.post('/webhooks/external-system', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-octospine-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, 'your-webhook-secret');
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook data
  const { event, data } = req.body;
  
  switch(event) {
    case 'task.completed':
      handleTaskCompletion(data);
      break;
    case 'automation.triggered':
      handleAutomationTrigger(data);
      break;
  }
  
  res.json({ success: true });
});
```

### Outgoing Webhooks
```javascript
// Configure outgoing webhook
const outgoingWebhook = await client.webhooks.create({
  name: 'Notify External System',
  type: 'outgoing',
  url: 'https://your-system.com/webhooks/octospine',
  events: ['task.completed', 'alert.new'],
  headers: {
    'Authorization': 'Bearer your-external-system-token'
  }
});
```

## Authentication & Security

### API Key Authentication
```javascript
const client = new OctospineClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.octospine.com'
});
```

### JWT Authentication
```javascript
const client = new OctospineClient({
  jwtToken: 'your-jwt-token',
  baseUrl: 'https://api.octospine.com'
});
```

### OAuth2 Integration
```javascript
const client = new OctospineClient({
  oauth2: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    tokenUrl: 'https://api.octospine.com/oauth/token'
  },
  baseUrl: 'https://api.octospine.com'
});
```

## Error Handling

### Retry Logic
```javascript
const client = new OctospineClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.octospine.com',
  retry: {
    attempts: 3,
    backoff: 'exponential',
    maxDelay: 5000
  }
});
```

### Error Handling
```javascript
try {
  const result = await client.tasks.create(taskData);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limiting
    await delay(error.retryAfter * 1000);
    return retry();
  } else if (error.code === 'AUTHENTICATION_FAILED') {
    // Handle authentication issues
    await refreshToken();
    return retry();
  } else {
    // Handle other errors
    console.error('Integration error:', error);
  }
}
```

## Best Practices

### 1. Connection Management
- Use connection pooling for database integrations
- Implement exponential backoff for retries
- Monitor connection health

### 2. Data Handling
- Validate all incoming data
- Implement proper error handling
- Use data transformation pipelines

### 3. Security
- Store credentials securely
- Use HTTPS for all communications
- Implement proper authentication

### 4. Monitoring
- Monitor integration health
- Set up alerts for failures
- Track performance metrics

## Troubleshooting

### Common Issues

#### Connection Timeouts
```javascript
// Increase timeout settings
const client = new OctospineClient({
  apiKey: 'your-api-key',
  timeout: 30000, // 30 seconds
  baseUrl: 'https://api.octospine.com'
});
```

#### Rate Limiting
```javascript
// Implement rate limiting handling
client.on('rateLimit', (info) => {
  console.log(`Rate limited. Retry after ${info.retryAfter} seconds`);
  setTimeout(() => retry(), info.retryAfter * 1000);
});
```

#### Authentication Issues
```javascript
// Handle token refresh
client.on('authError', async () => {
  await refreshToken();
  client.setAuthToken(newToken);
});
```

## Support

### Documentation
- **API Reference**: `/docs/api/api-reference.md`
- **SDK Documentation**: Available in each SDK repository
- **Examples**: Code examples and tutorials

### Support Channels
- **Email**: integration-support@octospine.com
- **Documentation**: https://docs.octospine.com/integration
- **Community**: https://community.octospine.com
- **Status Page**: https://status.octospine.com

---

**For advanced integration scenarios and custom solutions, contact our integration team.**
