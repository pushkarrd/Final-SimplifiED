# SimplifiED - AI-Powered Learning Assistant

> Making education accessible for everyone, one lecture at a time.

SimplifiED is an educational tool that helps students, especially those with dyslexia, by converting live lecture transcriptions into multiple accessible formats using local AI.

## 🎯 Key Features

- **🎤 Live Audio Recording**: Real-time speech-to-text transcription
- **📱 Mobile Responsive**: Fully optimized for iOS & Android (48px+ touch targets)
- **🌍 Multi-Language Support**: English, Hindi, and Kannada
- **♿ Dyslexic User Mode**: OpenDyslexic font for better readability
- **🎨 Dark/Light Theme**: Eye-friendly interface
- **📚 Multiple Output Formats**:
  - **Simple Text**: Dyslexia-friendly simplified version
  - **Detailed Steps**: Step-by-step breakdown of concepts
  - **Mind Map**: Hierarchical visual structure
  - **Summary**: Concise key points
- **🤖 Local AI Processing**: Uses Ollama with llama3.2:3b (no API keys needed!)
- **☁️ Firebase Integration**: Save and retrieve lectures
- **⚡ Works on All Devices**: Desktop, tablet, and mobile (iOS/Android)

## 🚀 Quick Start

### One-Command Start (Windows)

```powershell
.\start.ps1
```

This will automatically:
1. Start Ollama service
2. Start Python backend (port 8000)
3. Start React frontend (port 5174)

### Manual Start

**Backend:**
```powershell
cd backend-python
python -m uvicorn main:app --port 8000
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

**Access:** http://localhost:5174

## 📁 Project Structure

```
simplifiED/
├── backend-python/          # FastAPI backend with Ollama
│   ├── main.py              # API endpoints & AI processing
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment template
│   └── serviceAccountKey.json  # Firebase credentials (not in repo)
│
├── frontend/                # React frontend with Vite
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # UI components
│   │   │   └── lecture/     # Lecture-specific components
│   │   ├── pages/           # Main pages
│   │   │   ├── Landing.jsx  # Landing page with team section
│   │   │   ├── Dashboard.jsx # User dashboard with dyslexic toggle
│   │   │   └── LecturePage.jsx # Recording & processing
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── services/        # API & Firebase services
│   │   └── firebase.js      # Firebase config
│   ├── public/              # Static assets
│   └── package.json
│
├── docs/                    # Documentation
│   ├── README.md            # Full documentation
│   ├── QUICKSTART.md        # Quick start guide
│   ├── AUDIO_TRANSCRIPTION_SETUP.md
│   ├── MIGRATION_COMPLETE.md
│   ├── MULTILANGUAGE_FEATURE.md
│   ├── OLLAMA_PERFORMANCE_OPTIMIZATION.md
│   └── TTS_FEATURE.md
│
├── .gitignore               # Git ignore rules
├── start.ps1                # PowerShell startup script
└── start.bat                # Batch startup script
```

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool
- **Tailwind CSS 4.1.17** - Styling
- **Framer Motion** - Animations
- **Firebase SDK** - Authentication & Database
- **Web Speech API** - Speech recognition
- **Lucide React** - Icons

### Backend
- **Python 3.13** - Programming language
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Ollama** - Local LLM (llama3.2:3b - 2GB)
- **Firebase Admin SDK** - Backend authentication

### Fonts
- **Geom** - Default sans-serif font
- **OpenDyslexic** - Dyslexic mode font

## 📚 Documentation

Full documentation is available in the `/docs` folder:

- **[README.md](docs/README.md)** - Complete setup & usage guide
- **[QUICKSTART.md](docs/QUICKSTART.md)** - Fast setup in 3 steps
- **[RESPONSIVE_DESIGN.md](docs/RESPONSIVE_DESIGN.md)** - Mobile optimization guide ⭐ **NEW**
- **[AUDIO_TRANSCRIPTION_SETUP.md](docs/AUDIO_TRANSCRIPTION_SETUP.md)** - Audio processing details
- **[MIGRATION_COMPLETE.md](docs/MIGRATION_COMPLETE.md)** - Groq to Ollama migration
- **[TTS_FEATURE.md](docs/TTS_FEATURE.md)** - Text-to-Speech implementation
- **[MULTILANGUAGE_FEATURE.md](docs/MULTILANGUAGE_FEATURE.md)** - Multi-language support
- **[OLLAMA_PERFORMANCE_OPTIMIZATION.md](docs/OLLAMA_PERFORMANCE_OPTIMIZATION.md)** - Performance tuning
- **[MULTILANGUAGE_FEATURE.md](docs/MULTILANGUAGE_FEATURE.md)** - Multi-language implementation
- **[OLLAMA_PERFORMANCE_OPTIMIZATION.md](docs/OLLAMA_PERFORMANCE_OPTIMIZATION.md)** - Performance tuning
- **[TTS_FEATURE.md](docs/TTS_FEATURE.md)** - Text-to-speech feature

## 🔐 Prerequisites

1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **Python** (v3.9+) - [Download](https://www.python.org/)
3. **Ollama** - [Download](https://ollama.com/download)
4. **Firebase Account** - [Create](https://firebase.google.com/)

### Install Dependencies

**Backend:**
```powershell
cd backend-python
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
npm install
```

**Ollama Model:**
```powershell
ollama pull llama3.2:3b
```

## 🔧 Configuration

### 1. Firebase Setup

**Backend:** Place `serviceAccountKey.json` in `backend-python/`

**Frontend:** Update `frontend/src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ...
};
```

### 2. Environment Variables (Optional)

Create `backend-python/.env`:
```env
OLLAMA_MODEL=llama3.2:3b
```

## 👥 Team

### Code Lunatics

- **Pushkar R Deshpande** - Team Lead & Frontend Developer
  - 3rd Sem EIE, BIT
  - Frontend Development & UI/UX Design
  - [LinkedIn](https://www.linkedin.com/in/pushkar-r-deshpande-510177334) | [Instagram](https://www.instagram.com/pushkar__deshpande)

- **Hemsagar B C** - Backend Developer
  - 3rd Sem EIE, BIT
  - Backend Architecture & API Development
  - [LinkedIn](https://www.linkedin.com/in/hemsagar-b-c-b2610a318) | [Instagram](https://www.instagram.com/hemsagar_36)

- **VS Kiran** - Developer
  - 3rd Sem EIE, BIT
  - Frontend Development
  - [LinkedIn](https://www.linkedin.com/in/vs-kiran-16b178394)

- **Anurag** - Developer
  - 3rd Sem, NITK
  - Backend Development

## 📄 License

© 2025 Code Lunatics Team. All rights reserved.

## 🙏 Acknowledgments

- **Ollama** for local LLM capabilities
- **Meta** for the llama3.2 model
- **Firebase** for backend services
- **FastAPI** & **React** teams

---

Built with ❤️ to make learning accessible for everyone
