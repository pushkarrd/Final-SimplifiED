# 🧠 SimplifiED – AI-Powered Learning Assistant  
### Making education accessible for students with dyslexia, one lecture at a time.

> **SimplifiED** is an AI-powered accessibility-first learning assistant that helps students with **dyslexia and learning difficulties** understand classroom lectures by converting live audio into **simplified, structured, and dyslexia-friendly learning formats** — in real time and with complete privacy.

---

## 📌 Problem Statement

Dyslexia is a **neurodevelopmental learning disorder** that affects a student’s ability to **read, write, process, and comprehend text**, despite normal intelligence.

🔹 **1 in 10 students globally** experience dyslexia or related learning difficulties.  
🔹 Yet, most educational systems still rely on **text-heavy notes, fast-paced lectures, and single-format teaching**.

### 🚧 Challenges Faced by Dyslexic Students
- Difficulty reading long and dense text
- Slower language processing during live lectures
- No real-time support tailored for dyslexia
- Limited accessibility beyond font changes
- Academic disadvantage despite strong conceptual ability

---

## 💡 Our Solution

**SimplifiED** bridges this gap by transforming **live classroom lectures** into **multiple dyslexia-accessible formats**, allowing students to learn **in the way that suits their cognitive needs best**.

✔ Real-time processing  
✔ Dyslexia-first design  
✔ Multi-language support  
✔ Local AI (no data leakage)  

---

## 🎯 Key Features

### 🎤 Live Lecture Processing
- Real-time **speech-to-text transcription**
- Instantly converts spoken lectures into readable content

### 📚 Multiple Accessible Learning Formats
From a single lecture, SimplifiED generates:
- **Simple Text** – Dyslexia-friendly simplified explanations  
- **Detailed Steps** – Step-by-step breakdown of concepts  
- **Summary** – Concise key takeaways  
- **Mind Map** – Hierarchical structure for visual understanding  

### ♿ Dyslexia-Friendly Design
- **OpenDyslexic font** for better readability  
- Clean spacing and reduced cognitive load  
- Designed specifically for dyslexic users, not adapted later

### 🌍 Multi-Language Support
- English  
- Hindi  
- Kannada  

### 🎨 User-Friendly Interface
- Dark & Light themes (eye-friendly)
- Fully mobile responsive (48px+ touch targets)
- Works seamlessly on **desktop, tablet, and mobile**

### 🤖 Local AI Processing (Privacy-First)
- Uses **Ollama with LLaMA 3.2 (3B)**
- No API keys required
- No user data sent to third-party servers

### ☁️ Firebase Integration
- Secure authentication
- Save and retrieve lecture sessions

---

## 🏗️ How It Works (High-Level Architecture)

1. **Lecture Audio Input**  
   Live audio is captured directly from the browser

2. **Speech-to-Text Conversion**  
   Web Speech API converts speech into text

3. **Local AI Processing**  
   Ollama (LLaMA 3.2) processes text to generate:
   - Simplified explanations  
   - Step-by-step breakdowns  
   - Summaries  
   - Mind maps  

4. **Accessible Frontend Display**  
   Output is rendered using dyslexia-friendly UI principles

5. **Data Storage (Optional)**  
   Lectures are securely stored using Firebase

---

## 🛠️ Technology Stack

### Frontend
- **React 19** – UI development  
- **Vite** – Fast build tool  
- **Tailwind CSS** – Responsive styling  
- **Framer Motion** – Animations  
- **Firebase SDK** – Authentication & storage  
- **Web Speech API** – Speech recognition  
- **Lucide React** – Icons  

### Backend
- **Python 3**  
- **FastAPI** – Backend framework  
- **Uvicorn** – ASGI server  
- **Ollama** – Local LLM runtime  
- **LLaMA 3.2 (3B)** – AI model  
- **Firebase Admin SDK** – Secure backend access  

### Accessibility & Fonts
- **OpenDyslexic** – Dyslexia-friendly font  
- **Geom** – Default UI font  

---

## 🚀 Quick Start

### One-Command Start (Windows)
```powershell
.\start.ps1
