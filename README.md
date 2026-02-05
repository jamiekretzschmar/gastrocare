# GastroCare Sync

## Overview
GastroCare Sync is a specialized health management application designed for patients managing **Gastroparesis** (delayed stomach emptying), with specific protocols for patients who are also **immunosuppressed** (e.g., transplant recipients).

It bridges the gap between daily symptom management and clinical safety protocols, integrating guidelines from **Hamilton Health Sciences** and standard motility clinic best practices to help patients avoid flare-ups and hospitalizations.

## Key Features

### 1. Clinical Management Dashboard
- **"Flare-Up" Mode**: A global emergency toggle that instantly switches the entire app (Meal Plans, Recipes, and Advice) from a "Maintenance Diet" (Solids) to a "Rescue Diet" (Liquids/Purees) to rest the stomach.
- **Macro Safety Warnings**: Real-time alerts when logging meals if Fat exceeds 10g (slows emptying) or Fiber exceeds 3g (bezoar risk).
- **Hydration Tracker**: Tracks fluid intake with reminders, critical for patients who cannot consume large volumes at once.

### 2. Motility Tools
- **Upright Timer**: A dedicated physics-based timer enforcing the 60-120 minute "gravity drain" period after eating, preventing patients from lying down too soon.
- **Symptom & Stool Tracking**: Logs Bristol Stool Scale, medication timing (Prokinetics), and correlates symptom severity with post-meal activity (Walking vs. Lying Down).
- **Analytics**: Visualizes data to help patients identify their specific trigger foods and lifestyle mistakes.

### 3. Education & Guidelines
- **Interactive Anatomy**: SVG diagrams explaining the mechanical failure of the stomach (Vagus nerve damage, Pyloric valve spasm).
- **The "Sieve" Metaphor**: Visual demonstrations of why the "Small Particle Diet" is physically necessary for a paralyzed stomach.
- **Hamilton Health Guide**: Integrated directory for Hamilton Health Sciences Motility clinics, including referral fax numbers and location details.

### 4. AI Assistant
- **Context-Aware Dietitian**: Powered by Google's **Gemini 2.5 Flash** model. It is pre-prompted with the patient's specific medical context (Gastroparesis + Immunosuppressed) to provide safe food advice (e.g., rejecting raw salads due to bacteria risk).

## Tech Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Visualization**: Recharts
- **AI Integration**: Google GenAI SDK (@google/genai)

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gastrocare-sync.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory. You need a Google Gemini API key to use the AI Assistant features.
   ```
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

## Medical Disclaimer
This application is designed for educational and self-management purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
