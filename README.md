# HerGuide 💜

> **Empowering women with seamless access to essential everyday resources, support networks, and verified guidance — all from one trusted place.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-HerGuide_on_Render-C2185B?style=for-the-badge&logo=render&logoColor=white)](https://herguide.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Jasmeetcodes%2FHerGuide-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jasmeetcodes/HerGuide)

---

## 📌 Problem Statement

Critical resources for women — including emergency helplines, legal advisory, maternal healthcare, cyber harassment reporting, and mental health counseling — are often scattered across disparate government portals, NGO websites, and forums. In times of stress or urgency, finding trusted, context-specific help quickly is overwhelming and frustrating.

---

## 💡 Solution

**HerGuide** is a lightweight, accessible web application designed to eliminate this friction. It centralizes verified resources into an intuitive, mobile-first interface featuring:
- A persistent **Emergency Quick Help** strip with direct tap-to-call links.
- A **Categorized Resource Directory** with real-time search and filtering.
- A **Save & Revisit** system to bookmark vital links locally without requiring an account.
- An **AI Resource Assistant powered by Google Gemini** that empathetically understands natural-language requests and routes users to official services.

---

## ✨ Key Features

1. **🆘 Sticky Emergency Quick Help Banner**  
   Always visible at the top of the viewport with one-click tap-to-call numbers for the National Emergency Helpline (112), Women's Helpline (181), Women in Distress (1091), and Cyber Crime Helpline (1930).

2. **📚 Verified Resource Directory**  
   Categorized database covering Safety & Crisis, Health & Wellbeing, Legal Aid, Career & Education, and Mental Wellness. Supports instant client-side keyword search and category pill filtering.

3. **❤️ Local Bookmarking (Save & Revisit)**  
   Zero-barrier personal resource saving powered by browser `localStorage`. No login or database required — resources remain saved across refreshes.

4. **🤖 AI Resource Assistant (Powered by Gemini)**  
   Integrated with Google's `gemini-3.6-flash` via the official `@google/genai` SDK. Built with system-level guardrails: provides practical pointers, avoids medical/legal claims, and prioritizes emergency services during critical situations.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3 (Modern Flexbox & Grid, mobile-responsive), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **AI Integration:** Google Gemini API (`@google/genai` SDK, model: `gemini-3.6-flash`)
- **Data Store:** JSON flat file (`data/resources.json`)
- **Environment Management:** `dotenv`
- **Deployment Platform:** Render

---

## 📁 Project Structure

```
HerGuide/
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusions (.env, node_modules)
├── package.json          # Node dependencies & project metadata
├── package-lock.json     # Dependency lockfile
├── server.js             # Express backend, static serving & /api/ask route
├── README.md             # Project documentation
├── data/
│   └── resources.json    # Centralized curated resources dataset
└── public/
    ├── index.html        # Single-page HTML layout
    ├── style.css         # Styling, themes, and responsive design
    └── script.js         # Client-side search, bookmarks & AI chat
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Jasmeetcodes/HerGuide.git
cd HerGuide
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` template into a new `.env` file:
```bash
cp .env.example .env
```
Open `.env` and insert your Gemini API key:
```env
# HerGuide environment configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

### 4. Run the Server
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 Live Links

- **Live Demo:** [https://herguide.onrender.com](https://herguide.onrender.com)
- **GitHub Repository:** [https://github.com/Jasmeetcodes/HerGuide](https://github.com/Jasmeetcodes/HerGuide)

---

## 🔮 Future Improvements

- **Multilingual Support:** Dynamic language switching (Hindi, Bengali, Tamil, etc.) powered by Gemini.
- **Location-Based Triage:** Geo-aware filtering to display localized shelters, legal aid clinics, and hospitals.
- **Offline PWA Support:** Service worker integration enabling offline access to emergency contacts and saved resources.
- **Resource Verification Submissions:** Crowdsourced NGO and community submission portal with admin verification workflows.

---

*Built with care for hackathon impact.*
