# AZ Interface

A sophisticated desktop-style interface built with React, TypeScript, and Vite, featuring a modular application architecture with AI integration capabilities.

## 🚀 Features

- **Desktop-like Interface**: Window management system with drag, resize, minimize, and maximize functionality
- **Modular App Architecture**: 30+ specialized applications for different tasks
- **AI Integration**: Gemini API integration for terminal commands and image generation
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Tailwind CSS with custom styling and animations
- **Backend API**: FastAPI backend with health checks and task management

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Context API** for state management
- **Error Boundaries** for crash prevention

### Backend Stack
- **FastAPI** for API endpoints
- **Python 3.8+** with async support
- **CORS** configured for frontend integration
- **Pydantic** for data validation

### Key Components
- **Window Manager**: Handles window lifecycle and positioning
- **App Registry**: Centralized app definitions and routing
- **Service Layer**: Business logic and external API integration
- **Event Bus**: Inter-app communication system

## 📦 Applications

The interface includes 30+ specialized applications:

### Core Applications
- **Terminal**: AI-powered command interface
- **Image Generator**: AI image generation
- **Notepad**: Text editing
- **Vault Explorer**: File and content search

### AI & Agent Management
- **Agent Network**: AI agent monitoring and control
- **Persona Viewer**: Agent profile management
- **Council Chamber**: Multi-agent deliberation system
- **Symposium**: Agent collaboration platform

### Operations & Infrastructure
- **Operations Console**: System monitoring and control
- **Infrastructure**: Docker and PM2 process management
- **Diagnostics**: System health and performance monitoring
- **Backup & Recovery**: Data protection and restoration

### Development Tools
- **System Editor**: Code editing with file explorer
- **Codebase**: Git integration and webhook management
- **Technomancer's Forge**: Technology monitoring and updates

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for backend)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dave-Meloncelli/Daves_NewTest.git
   cd Daves_NewTest
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Environment setup**
   ```bash
   # Create environment file
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start backend
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Backend configuration
BACKEND_URL=http://localhost:8000
```

### API Keys
- **Gemini API**: Required for terminal commands and image generation
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🏃‍♂️ Development

### Project Structure
```
AZ Interface/
├── apps/                 # Application components
├── components/           # Reusable UI components
├── services/            # Business logic and API calls
├── context/             # React context providers
├── types.ts             # TypeScript type definitions
├── constants.tsx        # App configuration
├── backend/             # FastAPI backend
├── index.html           # Main HTML file
└── vite.config.ts       # Vite configuration
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Adding New Applications
1. Create your app component in `apps/`
2. Add app definition to `constants.tsx`
3. Add icon to `components/icons.tsx`
4. Update types in `types.ts` if needed

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Check if all dependencies are installed: `npm install`
- Verify environment variables are set
- Check browser console for specific errors

**Windows not opening**
- Check browser console for JavaScript errors
- Verify all app components exist in `apps/` directory
- Check if Error Boundary is catching errors

**API calls failing**
- Ensure backend is running on port 8000
- Check CORS configuration
- Verify API endpoints are correct

**Missing API key**
- Set `GEMINI_API_KEY` in your `.env.local` file
- App will show helpful error messages if key is missing

## 🔒 Security

- API keys are stored in environment variables (never in code)
- Comprehensive `.gitignore` prevents sensitive files from being committed
- CORS is properly configured for development
- Error boundaries prevent sensitive information leakage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add proper TypeScript types
5. Include error handling
6. Test your changes thoroughly
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Backend powered by [FastAPI](https://fastapi.tiangolo.com/)
- AI integration via [Google Gemini](https://ai.google.dev/)

## 📞 Support

For support and questions:
- Check the [SETUP.md](SETUP.md) file for detailed setup instructions
- Review the troubleshooting section above
- Open an issue on GitHub for bugs or feature requests
