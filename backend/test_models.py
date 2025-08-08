#!/usr/bin/env python3
"""
Test script for enhanced database models
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models import *
from app.schemas import *
from app import crud
from datetime import datetime

def test_database_models():
    """Test the enhanced database models"""
    print("🧪 Testing Enhanced Database Models for AZ Interface")
    print("=" * 60)
    
    # Initialize database
    print("📊 Initializing database...")
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Test 1: Create a user with consciousness evolution fields
        print("\n1️⃣ Testing User Creation with Consciousness Fields")
        import time
        timestamp = int(time.time())
        user_data = UserCreate(
            username=f"testuser{timestamp}",
            email=f"test{timestamp}@example.com",
            password="testpassword123",
            consciousness_level=ConsciousnessLevel.AWARENESS,
            evolution_score=25.0,
            preferences={"theme": "dark", "notifications": True}
        )
        
        user = crud.create_user(db, user_data)
        print(f"✅ User created: {user.username} (ID: {user.id})")
        print(f"   Consciousness Level: {user.consciousness_level}")
        print(f"   Evolution Score: {user.evolution_score}")
        print(f"   Preferences: {user.preferences}")
        
        # Test 2: Create a workflow
        print("\n2️⃣ Testing Workflow Creation")
        workflow_data = WorkflowCreate(
            name="Test Workflow",
            description="A test workflow for consciousness evolution",
            template_id="consciousness_assessment",
            configuration={"steps": 5, "duration_days": 30},
            workflow_metadata={"category": "personal_development"}
        )
        
        workflow = crud.create_workflow(db, workflow_data, user.id)
        print(f"✅ Workflow created: {workflow.name} (ID: {workflow.id})")
        print(f"   Status: {workflow.status}")
        print(f"   Template ID: {workflow.template_id}")
        
        # Test 3: Create tasks with enhanced fields
        print("\n3️⃣ Testing Enhanced Task Creation")
        task_data = TaskCreate(
            title="Meditation Practice",
            description="Daily meditation for consciousness development",
            priority=TaskPriority.HIGH,
            due_date=datetime.utcnow(),
            estimated_hours=1.0,
            tags=["meditation", "consciousness", "daily"],
            task_metadata={"difficulty": "beginner", "category": "spiritual"},
            workflow_id=workflow.id
        )
        
        task = crud.create_task(db, task_data, user.id)
        print(f"✅ Task created: {task.title} (ID: {task.id})")
        print(f"   Priority: {task.priority}")
        print(f"   Status: {task.status}")
        print(f"   Tags: {task.tags}")
        print(f"   Workflow ID: {task.workflow_id}")
        
        # Test 4: Create consciousness log
        print("\n4️⃣ Testing Consciousness Log Creation")
        consciousness_data = ConsciousnessLogCreate(
            level=ConsciousnessLevel.AWARENESS,
            score_change=2.5,
            activity_type="meditation",
            description="Morning meditation session",
            duration_minutes=30,
            consciousness_metadata={"mood": "calm", "focus_level": "high"}
        )
        
        consciousness_log = crud.create_consciousness_log(db, consciousness_data, user.id)
        print(f"✅ Consciousness log created (ID: {consciousness_log.id})")
        print(f"   Level: {consciousness_log.level}")
        print(f"   Score Change: {consciousness_log.score_change}")
        print(f"   Activity Type: {consciousness_log.activity_type}")
        
        # Test 5: Check evolution progress
        print("\n5️⃣ Testing Evolution Progress")
        progress = crud.get_evolution_progress(db, user.id)
        if progress:
            print(f"✅ Evolution progress retrieved:")
            print(f"   Current Level: {progress['current_level']}")
            print(f"   Evolution Score: {progress['evolution_score']}")
            print(f"   Progress Percentage: {progress['progress_percentage']:.1f}%")
            print(f"   Next Level: {progress['next_level']}")
        
        # Test 6: Create template
        print("\n6️⃣ Testing Template Creation")
        template_data = TemplateCreate(
            id=f"meditation_template_{timestamp}",
            name="Daily Meditation Template",
            category="spiritual",
            description="Template for daily meditation practice",
            version="1.0",
            configuration={"duration": 30, "type": "mindfulness"},
            template_metadata={"difficulty": "beginner"}
        )
        
        template = crud.create_template(db, template_data)
        print(f"✅ Template created: {template.name} (ID: {template.id})")
        print(f"   Category: {template.category}")
        print(f"   Version: {template.version}")
        
        # Test 7: Create analytics event
        print("\n7️⃣ Testing Analytics Event Creation")
        analytics_data = AnalyticsEventCreate(
            event_type="user_action",
            event_name="meditation_completed",
            session_id="session_123",
            page_url="/meditation",
            user_agent="Mozilla/5.0...",
            ip_address="127.0.0.1",
            properties={"duration": 30, "completion_rate": 100}
        )
        
        analytics_event = crud.create_analytics_event(db, analytics_data, user.id)
        print(f"✅ Analytics event created (ID: {analytics_event.id})")
        print(f"   Event Type: {analytics_event.event_type}")
        print(f"   Event Name: {analytics_event.event_name}")
        
        # Test 8: Create notification
        print("\n8️⃣ Testing Notification Creation")
        notification_data = NotificationCreate(
            title="Meditation Reminder",
            message="Time for your daily meditation practice",
            notification_type="reminder",
            action_url="/meditation",
            metadata={"priority": "high"}
        )
        
        notification = crud.create_notification(db, notification_data, user.id)
        print(f"✅ Notification created (ID: {notification.id})")
        print(f"   Title: {notification.title}")
        print(f"   Type: {notification.notification_type}")
        print(f"   Is Read: {notification.is_read}")
        
        # Test 9: Get system stats
        print("\n9️⃣ Testing System Stats")
        stats = crud.get_system_stats(db)
        print(f"✅ System stats retrieved:")
        print(f"   Total Users: {stats['total_users']}")
        print(f"   Active Users: {stats['active_users']}")
        print(f"   Total Tasks: {stats['total_tasks']}")
        print(f"   Completed Tasks: {stats['completed_tasks']}")
        print(f"   Total Workflows: {stats['total_workflows']}")
        print(f"   Active Workflows: {stats['active_workflows']}")
        
        print("\n🎉 All database model tests completed successfully!")
        print("✅ Enhanced database models are working correctly")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()

if __name__ == "__main__":
    test_database_models()
