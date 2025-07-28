# AZ Interface Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for backend)
- Git

## Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Servers

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Common Issues & Fixes

### Missing API Key
- **Error**: "Gemini API key not configured"
- **Fix**: Set `GEMINI_API_KEY` in your `.env.local` file

### Missing Dependencies
- **Error**: "Cannot find module"
- **Fix**: Run `npm install` to install missing packages

### TypeScript Errors
- **Error**: Type declaration errors
- **Fix**: Ensure you have the latest TypeScript version: `npm install -g typescript`

### Backend Connection Issues
- **Error**: CORS errors or connection refused
- **Fix**: Ensure backend is running on port 8000 and frontend is on port 5173

## Project Structure

```
AZ Interface/
├── apps/                 # Application components
├── components/           # Reusable UI components
├── services/            # Business logic and API calls
├── context/             # React context providers
├── types.ts             # TypeScript type definitions
├── constants.tsx        # App configuration
├── backend/             # FastAPI backend
└── index.html           # Main HTML file
```

## Development Notes

- The app uses Vite for frontend bundling
- Tailwind CSS for styling
- React 19 with TypeScript
- FastAPI for backend API
- Error boundaries are implemented for graceful error handling
- All windows are wrapped in error boundaries to prevent app crashes

## Troubleshooting

### App Won't Start
1. Check if all dependencies are installed
2. Verify environment variables are set
3. Check console for specific error messages

### Windows Not Opening
1. Check browser console for JavaScript errors
2. Verify all app components exist in the `apps/` directory
3. Check if Error Boundary is catching errors

### API Calls Failing
1. Ensure backend is running
2. Check CORS configuration
3. Verify API endpoints are correct

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Test your changes thoroughly 