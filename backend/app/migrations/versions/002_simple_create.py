"""Simple database creation for AZ Interface
Revision ID: 002
Revises: 
Create Date: 2025-08-08 15:30:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

revision = '002'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create enums
    consciousness_level = sa.Enum('awareness', 'understanding', 'integration', 'mastery', 'transcendence', name='consciousnesslevel')
    workflow_status = sa.Enum('draft', 'active', 'paused', 'completed', 'archived', name='workflowstatus')
    task_priority = sa.Enum('low', 'medium', 'high', 'critical', name='taskpriority')
    task_status = sa.Enum('pending', 'in_progress', 'blocked', 'completed', 'cancelled', name='taskstatus')
    integration_type = sa.Enum('api', 'webhook', 'database', 'file_system', 'messaging', name='integrationtype')
    
    # Create enum types
    consciousness_level.create(op.get_bind())
    workflow_status.create(op.get_bind())
    task_priority.create(op.get_bind())
    task_status.create(op.get_bind())
    integration_type.create(op.get_bind())
    
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_admin', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('consciousness_level', sa.Enum('awareness', 'understanding', 'integration', 'mastery', 'transcendence', name='consciousnesslevel'), nullable=True),
        sa.Column('evolution_score', sa.Float(), nullable=True),
        sa.Column('last_evolution_check', sa.DateTime(), nullable=True),
        sa.Column('preferences', sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    
    # Create workflows table
    op.create_table('workflows',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('draft', 'active', 'paused', 'completed', 'archived', name='workflowstatus'), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('template_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('configuration', sa.JSON(), nullable=True),
        sa.Column('workflow_metadata', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_workflows_name'), 'workflows', ['name'], unique=False)
    
    # Create tasks table
    op.create_table('tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'in_progress', 'blocked', 'completed', 'cancelled', name='taskstatus'), nullable=True),
        sa.Column('priority', sa.Enum('low', 'medium', 'high', 'critical', name='taskpriority'), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('workflow_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('estimated_hours', sa.Float(), nullable=True),
        sa.Column('actual_hours', sa.Float(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('task_metadata', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['workflow_id'], ['workflows.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tasks_title'), 'tasks', ['title'], unique=False)
    
    # Create subtasks table
    op.create_table('subtasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'in_progress', 'blocked', 'completed', 'cancelled', name='taskstatus'), nullable=True),
        sa.Column('parent_task_id', sa.Integer(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['parent_task_id'], ['tasks.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subtasks_title'), 'subtasks', ['title'], unique=False)
    
    # Create workflow_steps table
    op.create_table('workflow_steps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workflow_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('step_type', sa.String(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('configuration', sa.JSON(), nullable=True),
        sa.Column('is_completed', sa.Boolean(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['workflow_id'], ['workflows.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_workflow_steps_name'), 'workflow_steps', ['name'], unique=False)
    
    # Create user_sessions table
    op.create_table('user_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('session_token', sa.String(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('last_activity', sa.DateTime(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('user_agent', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_sessions_session_token'), 'user_sessions', ['session_token'], unique=True)
    
    # Create consciousness_logs table
    op.create_table('consciousness_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('level', sa.Enum('awareness', 'understanding', 'integration', 'mastery', 'transcendence', name='consciousnesslevel'), nullable=True),
        sa.Column('score_change', sa.Float(), nullable=True),
        sa.Column('activity_type', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('consciousness_metadata', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_consciousness_logs_activity_type'), 'consciousness_logs', ['activity_type'], unique=False)
    
    # Create templates table
    op.create_table('templates',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('version', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('usage_count', sa.Integer(), nullable=True),
        sa.Column('last_used', sa.DateTime(), nullable=True),
        sa.Column('configuration', sa.JSON(), nullable=True),
        sa.Column('template_metadata', sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_templates_category'), 'templates', ['category'], unique=False)
    op.create_index(op.f('ix_templates_name'), 'templates', ['name'], unique=False)
    
    # Create template_executions table
    op.create_table('template_executions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('template_id', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('input_data', sa.JSON(), nullable=True),
        sa.Column('output_data', sa.JSON(), nullable=True),
        sa.Column('execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('success', sa.Boolean(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('session_id', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create analytics_events table
    op.create_table('analytics_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('event_type', sa.String(), nullable=True),
        sa.Column('event_name', sa.String(), nullable=True),
        sa.Column('session_id', sa.String(), nullable=True),
        sa.Column('page_url', sa.String(), nullable=True),
        sa.Column('user_agent', sa.String(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('properties', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analytics_events_event_name'), 'analytics_events', ['event_name'], unique=False)
    op.create_index(op.f('ix_analytics_events_event_type'), 'analytics_events', ['event_type'], unique=False)
    
    # Create integrations table
    op.create_table('integrations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('integration_type', sa.Enum('api', 'webhook', 'database', 'file_system', 'messaging', name='integrationtype'), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('configuration', sa.JSON(), nullable=True),
        sa.Column('credentials', sa.JSON(), nullable=True),
        sa.Column('last_sync', sa.DateTime(), nullable=True),
        sa.Column('sync_status', sa.String(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_integrations_name'), 'integrations', ['name'], unique=False)
    
    # Create system_logs table
    op.create_table('system_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('level', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('log_metadata', sa.JSON(), nullable=True),
        sa.Column('request_id', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_system_logs_level'), 'system_logs', ['level'], unique=False)
    op.create_index(op.f('ix_system_logs_source'), 'system_logs', ['source'], unique=False)
    
    # Create api_keys table
    op.create_table('api_keys',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('key_hash', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('last_used', sa.DateTime(), nullable=True),
        sa.Column('permissions', sa.JSON(), nullable=True),
        sa.Column('rate_limit', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_api_keys_key_hash'), 'api_keys', ['key_hash'], unique=True)
    op.create_index(op.f('ix_api_keys_name'), 'api_keys', ['name'], unique=False)
    
    # Create task_logs table
    op.create_table('task_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(), nullable=True),
        sa.Column('old_value', sa.Text(), nullable=True),
        sa.Column('new_value', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('task_log_metadata', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_task_logs_action'), 'task_logs', ['action'], unique=False)
    
    # Create notifications table
    op.create_table('notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('notification_type', sa.String(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('action_url', sa.String(), nullable=True),
        sa.Column('notification_metadata', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_notification_type'), 'notifications', ['notification_type'], unique=False)
    op.create_index(op.f('ix_notifications_title'), 'notifications', ['title'], unique=False)
    
    # Create backups table
    op.create_table('backups',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('backup_type', sa.String(), nullable=True),
        sa.Column('file_path', sa.String(), nullable=True),
        sa.Column('file_size_bytes', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('backup_metadata', sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_backups_backup_type'), 'backups', ['backup_type'], unique=False)
    op.create_index(op.f('ix_backups_name'), 'backups', ['name'], unique=False)

def downgrade():
    # Drop tables
    op.drop_index(op.f('ix_backups_name'), table_name='backups')
    op.drop_index(op.f('ix_backups_backup_type'), table_name='backups')
    op.drop_table('backups')
    
    op.drop_index(op.f('ix_notifications_title'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_notification_type'), table_name='notifications')
    op.drop_table('notifications')
    
    op.drop_index(op.f('ix_task_logs_action'), table_name='task_logs')
    op.drop_table('task_logs')
    
    op.drop_index(op.f('ix_api_keys_name'), table_name='api_keys')
    op.drop_index(op.f('ix_api_keys_key_hash'), table_name='api_keys')
    op.drop_table('api_keys')
    
    op.drop_index(op.f('ix_system_logs_source'), table_name='system_logs')
    op.drop_index(op.f('ix_system_logs_level'), table_name='system_logs')
    op.drop_table('system_logs')
    
    op.drop_index(op.f('ix_integrations_name'), table_name='integrations')
    op.drop_table('integrations')
    
    op.drop_index(op.f('ix_analytics_events_event_type'), table_name='analytics_events')
    op.drop_index(op.f('ix_analytics_events_event_name'), table_name='analytics_events')
    op.drop_table('analytics_events')
    
    op.drop_table('template_executions')
    
    op.drop_index(op.f('ix_templates_name'), table_name='templates')
    op.drop_index(op.f('ix_templates_category'), table_name='templates')
    op.drop_table('templates')
    
    op.drop_index(op.f('ix_consciousness_logs_activity_type'), table_name='consciousness_logs')
    op.drop_table('consciousness_logs')
    
    op.drop_index(op.f('ix_user_sessions_session_token'), table_name='user_sessions')
    op.drop_table('user_sessions')
    
    op.drop_index(op.f('ix_workflow_steps_name'), table_name='workflow_steps')
    op.drop_table('workflow_steps')
    
    op.drop_index(op.f('ix_subtasks_title'), table_name='subtasks')
    op.drop_table('subtasks')
    
    op.drop_index(op.f('ix_tasks_title'), table_name='tasks')
    op.drop_table('tasks')
    
    op.drop_index(op.f('ix_workflows_name'), table_name='workflows')
    op.drop_table('workflows')
    
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    
    # Drop enums
    sa.Enum(name='consciousnesslevel').drop(op.get_bind())
    sa.Enum(name='workflowstatus').drop(op.get_bind())
    sa.Enum(name='taskpriority').drop(op.get_bind())
    sa.Enum(name='taskstatus').drop(op.get_bind())
    sa.Enum(name='integrationtype').drop(op.get_bind())
