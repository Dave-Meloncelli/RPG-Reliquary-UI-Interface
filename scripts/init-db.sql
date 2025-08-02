-- AZ Interface Database Initialization Script
-- This script sets up all necessary databases and tables for the complete stack

-- Create databases
CREATE DATABASE az_interface;
CREATE DATABASE n8n;
CREATE DATABASE a2a_registry;

-- Connect to az_interface database
\c az_interface;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ===== AGENT ZERO TABLES =====

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_superuser BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API keys
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== CREWAI TABLES =====

-- CrewAI agents
CREATE TABLE crewai_agents (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    goal TEXT,
    backstory TEXT,
    tools JSONB DEFAULT '[]',
    verbose BOOLEAN DEFAULT false,
    allow_delegation BOOLEAN DEFAULT true,
    max_iterations INTEGER DEFAULT 3,
    memory_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CrewAI crews
CREATE TABLE crewai_crews (
    id SERIAL PRIMARY KEY,
    crew_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    agents JSONB NOT NULL,
    tasks JSONB DEFAULT '[]',
    process VARCHAR(50) DEFAULT 'sequential',
    verbose BOOLEAN DEFAULT false,
    memory_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CrewAI tasks
CREATE TABLE crewai_tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    expected_output TEXT,
    agent_id VARCHAR(100) REFERENCES crewai_agents(agent_id),
    crew_id VARCHAR(100) REFERENCES crewai_crews(crew_id),
    status VARCHAR(50) DEFAULT 'pending',
    result TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- CrewAI execution logs
CREATE TABLE crewai_executions (
    id SERIAL PRIMARY KEY,
    execution_id VARCHAR(100) UNIQUE NOT NULL,
    crew_id VARCHAR(100) REFERENCES crewai_crews(crew_id),
    status VARCHAR(50) DEFAULT 'running',
    result TEXT,
    error_message TEXT,
    execution_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ===== A2A PROTOCOL TABLES =====

-- A2A nodes
CREATE TABLE a2a_nodes (
    id SERIAL PRIMARY KEY,
    node_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    node_type VARCHAR(50) NOT NULL,
    capabilities JSONB DEFAULT '[]',
    endpoint_url VARCHAR(255),
    public_key TEXT,
    is_active BOOLEAN DEFAULT true,
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A2A connections
CREATE TABLE a2a_connections (
    id SERIAL PRIMARY KEY,
    connection_id VARCHAR(100) UNIQUE NOT NULL,
    source_node_id VARCHAR(100) REFERENCES a2a_nodes(node_id),
    target_node_id VARCHAR(100) REFERENCES a2a_nodes(node_id),
    connection_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A2A messages
CREATE TABLE a2a_messages (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(100) UNIQUE NOT NULL,
    source_node_id VARCHAR(100) REFERENCES a2a_nodes(node_id),
    target_node_id VARCHAR(100) REFERENCES a2a_nodes(node_id),
    message_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A2A protocols
CREATE TABLE a2a_protocols (
    id SERIAL PRIMARY KEY,
    protocol_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    schema JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== N8N INTEGRATION TABLES =====

-- n8n workflow mappings
CREATE TABLE n8n_workflow_mappings (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL,
    agent_zero_integration BOOLEAN DEFAULT false,
    crewai_integration BOOLEAN DEFAULT false,
    a2a_integration BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- n8n execution logs
CREATE TABLE n8n_executions (
    id SERIAL PRIMARY KEY,
    execution_id VARCHAR(100) UNIQUE NOT NULL,
    workflow_id VARCHAR(100) REFERENCES n8n_workflow_mappings(workflow_id),
    status VARCHAR(50) DEFAULT 'running',
    result JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ===== MONITORING & METRICS TABLES =====

-- Performance metrics
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(20),
    tags JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent performance
CREATE TABLE agent_performance (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    success_rate DECIMAL(5,4),
    avg_execution_time_ms INTEGER,
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    last_execution TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====

-- Performance indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

-- CrewAI indexes
CREATE INDEX idx_crewai_agents_agent_id ON crewai_agents(agent_id);
CREATE INDEX idx_crewai_crews_crew_id ON crewai_crews(crew_id);
CREATE INDEX idx_crewai_tasks_status ON crewai_tasks(status);
CREATE INDEX idx_crewai_executions_status ON crewai_executions(status);

-- A2A indexes
CREATE INDEX idx_a2a_nodes_node_id ON a2a_nodes(node_id);
CREATE INDEX idx_a2a_nodes_node_type ON a2a_nodes(node_type);
CREATE INDEX idx_a2a_connections_source ON a2a_connections(source_node_id);
CREATE INDEX idx_a2a_connections_target ON a2a_connections(target_node_id);
CREATE INDEX idx_a2a_messages_status ON a2a_messages(status);
CREATE INDEX idx_a2a_messages_created_at ON a2a_messages(created_at);

-- n8n indexes
CREATE INDEX idx_n8n_workflow_mappings_workflow_id ON n8n_workflow_mappings(workflow_id);
CREATE INDEX idx_n8n_executions_status ON n8n_executions(status);

-- Metrics indexes
CREATE INDEX idx_performance_metrics_service ON performance_metrics(service_name);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX idx_agent_performance_agent_id ON agent_performance(agent_id);

-- ===== TRIGGERS =====

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crewai_agents_updated_at BEFORE UPDATE ON crewai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crewai_crews_updated_at BEFORE UPDATE ON crewai_crews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_a2a_nodes_updated_at BEFORE UPDATE ON a2a_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_a2a_connections_updated_at BEFORE UPDATE ON a2a_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_n8n_workflow_mappings_updated_at BEFORE UPDATE ON n8n_workflow_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_performance_updated_at BEFORE UPDATE ON agent_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INITIAL DATA =====

-- Create default admin user (password: admin123 - change in production!)
INSERT INTO users (username, email, hashed_password, is_superuser) 
VALUES ('admin', 'admin@az-interface.local', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8KqG', true);

-- Create default A2A node for this instance
INSERT INTO a2a_nodes (node_id, name, description, node_type, capabilities) 
VALUES ('az-interface-gateway', 'AZ Interface Gateway', 'Main gateway for AZ Interface', 'gateway', '["messaging", "routing", "authentication"]');

-- Create default CrewAI agent
INSERT INTO crewai_agents (agent_id, name, role, goal, backstory) 
VALUES ('default-agent', 'Default Agent', 'General Purpose Agent', 'Assist with various tasks', 'A versatile AI agent capable of handling multiple types of tasks');

-- ===== GRANTS =====

-- Grant permissions to application user
GRANT ALL PRIVILEGES ON DATABASE az_interface TO az_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO az_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO az_user;

-- Grant permissions to n8n user
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8n_user;
GRANT ALL PRIVILEGES ON DATABASE a2a_registry TO az_user; 