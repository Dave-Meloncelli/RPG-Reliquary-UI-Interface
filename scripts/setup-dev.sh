#!/bin/bash

# AZ Interface Development Setup Script
# This script sets up the development environment for the AZ Interface project

set -e

echo "🚀 Setting up AZ Interface development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8+ first."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f2)
    if [ "$PYTHON_VERSION" -lt 8 ]; then
        print_error "Python 3.8+ is required. Current version: $(python3 --version)"
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed."
        exit 1
    fi
    
    print_success "All system requirements met!"
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Install npm dependencies
    npm ci
    
    # Install additional development tools
    npm install -g @commitlint/cli @commitlint/config-conventional
    
    print_success "Frontend dependencies installed!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    if [ ! -d "backend" ]; then
        print_error "backend directory not found."
        exit 1
    fi
    
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Install development dependencies
    pip install black isort flake8 mypy bandit safety pytest pytest-cov
    
    cd ..
    
    print_success "Backend setup complete!"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Install husky
    npm run prepare
    
    # Make hooks executable
    chmod +x .husky/pre-commit
    chmod +x .husky/commit-msg
    
    print_success "Git hooks configured!"
}

# Create environment files
setup_environment() {
    print_status "Setting up environment configuration..."
    
    # Create .env.local if it doesn't exist
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# AZ Interface Environment Configuration

# Backend Configuration
DATABASE_URL=sqlite:///./app.db
REDIS_URL=redis://localhost:6379
SECRET_KEY=$(openssl rand -hex 32)

# Frontend Configuration
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# AI Integration (handled securely on backend)
GEMINI_API_KEY=your-gemini-api-key-here

# Production Settings
NODE_ENV=development
LOG_LEVEL=INFO
RATE_LIMIT_PER_MINUTE=100
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Development Settings
DEBUG=true
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
        print_success "Created .env.local file"
    else
        print_warning ".env.local already exists. Please review and update as needed."
    fi
    
    # Create backend .env if it doesn't exist
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Backend Environment Configuration

# Database
DATABASE_URL=sqlite:///./app.db

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys (keep secure)
GEMINI_API_KEY=your-gemini-api-key-here

# Logging
LOG_LEVEL=INFO
DEBUG=true

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_WINDOW=60
EOF
        print_success "Created backend/.env file"
    else
        print_warning "backend/.env already exists. Please review and update as needed."
    fi
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    cd backend
    source venv/bin/activate
    
    # Initialize database
    python -c "from app.database import init_db; init_db()"
    
    cd ..
    
    print_success "Database initialized!"
}

# Run initial tests
run_tests() {
    print_status "Running initial tests..."
    
    # Frontend tests
    print_status "Running frontend tests..."
    npm run test -- --run
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    source venv/bin/activate
    pytest tests/ -v
    cd ..
    
    print_success "All tests passed!"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup complete! Here's what to do next:"
    echo ""
    echo "1. Update your API keys in .env.local and backend/.env"
    echo "2. Start the development servers:"
    echo "   Terminal 1: npm run dev"
    echo "   Terminal 2: cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload"
    echo ""
    echo "3. Open http://localhost:5173 in your browser"
    echo ""
    echo "4. Available commands:"
    echo "   - npm run test          # Run tests"
    echo "   - npm run lint          # Run linting"
    echo "   - npm run format        # Format code"
    echo "   - npm run type-check    # Type checking"
    echo ""
    echo "5. Git workflow:"
    echo "   - Make changes"
    echo "   - git add ."
    echo "   - git commit -m 'feat: your commit message'"
    echo ""
    echo "Happy coding! 🚀"
}

# Main execution
main() {
    echo "AZ Interface Development Setup"
    echo "=============================="
    echo ""
    
    check_requirements
    setup_frontend
    setup_backend
    setup_git_hooks
    setup_environment
    init_database
    run_tests
    show_next_steps
}

# Run main function
main "$@" 