# GastroCare Sync

## Overview
GastroCare Sync is a specialized health management application designed for patients managing **Gastroparesis** (delayed stomach emptying), with specific protocols for patients who are also **immunosuppressed** (e.g., transplant recipients).

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Recharts
- **Build Tool**: Vite
- **AI Integration**: Google GenAI SDK (@google/genai)
- **Optional Backend**: Python (FastAPI) for serving the application.

## Prerequisites
- **Node.js**: v16+ (Required for building the frontend)
- **Python**: v3.9+ (Optional, for serving via Python)

## Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/jamiekretzschmar/gastrocare.git
   cd gastrocare
   npm install
   ```

2. **Configure API Key**
   Create a `.env` file in the root directory:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

### Option A: Node.js (Recommended for Development)
Use Vite's development server for hot-reloading.
```bash
npm run dev
```

### Option B: Python (Production/Serving Mode)
If you wish to serve the application using Python (FastAPI):

1. **Build the Frontend**
   First, compile the React app to static files.
   ```bash
   npm run build
   ```
   This creates a `dist/` directory.

2. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Python Server**
   ```bash
   python main.py
   ```
   The app will be available at `http://localhost:8000`.

## Key Features
- **Flare-Up Mode**: Emergency toggle for "Rescue Diet".
- **Safety Warnings**: Alerts for high fat (>10g) or fiber (>3g).
- **Upright Timer**: Physics-based timer for post-meal gravity drainage.
- **AI Assistant**: Context-aware dietary advice using Gemini 2.5 Flash.

## Medical Disclaimer
This application is designed for educational and self-management purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.