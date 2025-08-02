import streamlit as st
import fastapi
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import asyncio
import logging
import os
from datetime import datetime
from typing import Dict, Any, List
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app for API endpoints
api_app = FastAPI(title="CrewAI API", version="1.0.0")

# Health check endpoint
@api_app.get("/health")
async def health_check():
    """Health check endpoint for Docker healthcheck"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "crewai-core",
        "version": "1.0.0"
    }

# CrewAI API endpoints
@api_app.get("/api/agents")
async def list_agents():
    """List available agents"""
    return {
        "agents": [
            {"id": "agent-1", "name": "Researcher", "status": "available"},
            {"id": "agent-2", "name": "Writer", "status": "available"},
            {"id": "agent-3", "name": "Reviewer", "status": "available"}
        ]
    }

@api_app.post("/api/crews")
async def create_crew(crew_data: Dict[str, Any]):
    """Create a new crew"""
    return {
        "crew_id": f"crew-{datetime.utcnow().timestamp()}",
        "name": crew_data.get("name", "New Crew"),
        "agents": crew_data.get("agents", []),
        "status": "created"
    }

@api_app.post("/api/tasks")
async def create_task(task_data: Dict[str, Any]):
    """Create a new task"""
    return {
        "task_id": f"task-{datetime.utcnow().timestamp()}",
        "title": task_data.get("title", "New Task"),
        "description": task_data.get("description", ""),
        "status": "pending"
    }

# Streamlit UI
def main():
    st.set_page_config(
        page_title="CrewAI Dashboard",
        page_icon="🤖",
        layout="wide"
    )
    
    st.title("🤖 CrewAI Multi-Agent Framework")
    st.markdown("---")
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Dashboard", "Agents", "Crews", "Tasks", "Executions", "Settings"]
    )
    
    if page == "Dashboard":
        show_dashboard()
    elif page == "Agents":
        show_agents()
    elif page == "Crews":
        show_crews()
    elif page == "Tasks":
        show_tasks()
    elif page == "Executions":
        show_executions()
    elif page == "Settings":
        show_settings()

def show_dashboard():
    st.header("📊 Dashboard")
    
    # Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Active Agents", "12", "+2")
    with col2:
        st.metric("Running Crews", "3", "+1")
    with col3:
        st.metric("Completed Tasks", "156", "+23")
    with col4:
        st.metric("Success Rate", "94%", "+2%")
    
    # Recent Activity
    st.subheader("Recent Activity")
    activities = [
        {"time": "2 min ago", "action": "Task completed", "details": "Research on AI trends"},
        {"time": "5 min ago", "action": "Crew started", "details": "Content creation crew"},
        {"time": "10 min ago", "action": "Agent joined", "details": "Researcher agent online"}
    ]
    
    for activity in activities:
        st.write(f"**{activity['time']}** - {activity['action']}: {activity['details']}")

def show_agents():
    st.header("🤖 Agents")
    
    # Agent list
    agents = [
        {"id": "agent-1", "name": "Researcher", "status": "available", "capabilities": ["research", "analysis"]},
        {"id": "agent-2", "name": "Writer", "status": "busy", "capabilities": ["writing", "editing"]},
        {"id": "agent-3", "name": "Reviewer", "status": "available", "capabilities": ["review", "quality"]}
    ]
    
    for agent in agents:
        with st.expander(f"{agent['name']} ({agent['status']})"):
            st.write(f"**ID:** {agent['id']}")
            st.write(f"**Capabilities:** {', '.join(agent['capabilities'])}")
            
            if st.button(f"Manage {agent['name']}", key=agent['id']):
                st.info(f"Managing {agent['name']}...")

def show_crews():
    st.header("👥 Crews")
    
    # Create new crew
    with st.expander("Create New Crew"):
        crew_name = st.text_input("Crew Name")
        selected_agents = st.multiselect(
            "Select Agents",
            ["Researcher", "Writer", "Reviewer", "Analyst"]
        )
        
        if st.button("Create Crew"):
            if crew_name and selected_agents:
                st.success(f"Crew '{crew_name}' created with {len(selected_agents)} agents!")
            else:
                st.error("Please provide crew name and select agents")

def show_tasks():
    st.header("📋 Tasks")
    
    # Create new task
    with st.expander("Create New Task"):
        task_title = st.text_input("Task Title")
        task_description = st.text_area("Task Description")
        task_priority = st.selectbox("Priority", ["Low", "Medium", "High"])
        
        if st.button("Create Task"):
            if task_title and task_description:
                st.success(f"Task '{task_title}' created!")
            else:
                st.error("Please provide task title and description")

def show_executions():
    st.header("⚡ Executions")
    
    # Execution history
    executions = [
        {"id": "exec-1", "crew": "Content Crew", "task": "Blog Post", "status": "completed", "duration": "5m 23s"},
        {"id": "exec-2", "crew": "Research Crew", "task": "Market Analysis", "status": "running", "duration": "2m 15s"},
        {"id": "exec-3", "crew": "Review Crew", "task": "Code Review", "status": "failed", "duration": "1m 45s"}
    ]
    
    for execution in executions:
        status_color = {
            "completed": "green",
            "running": "blue",
            "failed": "red"
        }.get(execution["status"], "gray")
        
        st.write(f"**{execution['crew']}** - {execution['task']} ({execution['status']}) - {execution['duration']}")

def show_settings():
    st.header("⚙️ Settings")
    
    # API Configuration
    st.subheader("API Configuration")
    openai_key = st.text_input("OpenAI API Key", type="password")
    anthropic_key = st.text_input("Anthropic API Key", type="password")
    
    # Model Settings
    st.subheader("Model Settings")
    default_model = st.selectbox("Default Model", ["gpt-4", "gpt-3.5-turbo", "claude-3"])
    max_tokens = st.slider("Max Tokens", 100, 4000, 2000)
    
    if st.button("Save Settings"):
        st.success("Settings saved!")

if __name__ == "__main__":
    # Start FastAPI server in background
    config = uvicorn.Config(api_app, host="0.0.0.0", port=8501, log_level="info")
    server = uvicorn.Server(config)
    
    # Run FastAPI server in background thread
    import threading
    server_thread = threading.Thread(target=server.run, daemon=True)
    server_thread.start()
    
    # Run Streamlit app
    main() 