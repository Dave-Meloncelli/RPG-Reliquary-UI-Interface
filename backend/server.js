const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Simple mock authentication
    if (username === 'admin' && password === 'password') {
        res.json({
            access_token: 'mock-jwt-token-' + Date.now(),
            token_type: 'Bearer',
            expires_in: 3600
        });
    } else {
        res.status(401).json({
            error: 'Invalid credentials'
        });
    }
});

app.get('/api/users/me', (req, res) => {
    // Mock user data
    res.json({
        id: 1,
        username: 'admin',
        email: 'admin@az-interface.com',
        is_active: true,
        is_admin: true
    });
});

// Mock data endpoints for apps
app.get('/api/agents', (req, res) => {
    res.json([
        {
            id: 'agent-1',
            name: 'The Architect',
            status: 'active',
            capabilities: ['system-design', 'architecture']
        },
        {
            id: 'agent-2',
            name: 'The Curator',
            status: 'active',
            capabilities: ['content-management', 'organization']
        }
    ]);
});

app.get('/api/personas', (req, res) => {
    res.json([
        {
            id: 'persona-1',
            name: 'Aeon Indexwell',
            description: 'Knowledge indexer and organizer',
            status: 'active'
        },
        {
            id: 'persona-2',
            name: 'The Weaver',
            description: 'Pattern recognition specialist',
            status: 'active'
        }
    ]);
});

app.get('/api/system/status', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Mock workflow endpoints
app.get('/api/workflows', (req, res) => {
    res.json([
        {
            id: 'workflow-1',
            name: 'Content Ingestion',
            status: 'active',
            steps: ['scan', 'process', 'index']
        },
        {
            id: 'workflow-2',
            name: 'Agent Coordination',
            status: 'active',
            steps: ['assign', 'execute', 'monitor']
        }
    ]);
});

// Mock RPG data
app.get('/api/rpg/books', (req, res) => {
    res.json([
        {
            id: 'book-1',
            title: 'Dungeons & Dragons Player\'s Handbook',
            condition: 'Good',
            estimatedValue: 25.00
        },
        {
            id: 'book-2',
            title: 'Pathfinder Core Rulebook',
            condition: 'Excellent',
            estimatedValue: 35.00
        }
    ]);
});

// Mock social media data
app.get('/api/social/posts', (req, res) => {
    res.json([
        {
            id: 'post-1',
            platform: 'twitter',
            content: 'Exploring consciousness evolution through technology',
            engagement: 150
        },
        {
            id: 'post-2',
            platform: 'linkedin',
            content: 'Building the future of AI-human collaboration',
            engagement: 89
        }
    ]);
});

// Catch all handler - send back React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AZ Interface Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

module.exports = app;
