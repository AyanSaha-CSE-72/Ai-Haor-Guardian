# 🌊 global-wetland-guardian
### *Satellite-Assisted Wetland Intelligence & AI Early Warning Dashboard*
**Category:** AI • Climate Resilience • Wetland Monitoring • Early Warning Systems

<p align="center">
  <img src="https://img.shields.io/badge/AI%20Model-Gemini%20%7C%20LLM-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Wetland%20Insight-Weather%20%7C%20Fish%20%7C%20Storm-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/Interactive%20Map-Google%20Maps-green?style=for-the-badge">
</p>

---

## 📝 Abstract
This project presents **global-wetland-guardian**, a wetland-focused intelligence dashboard built to support fishers, local communities, and researchers working in haor, river basin, delta, and coastal regions. The system combines a **country-and-location selector**, **Gemini-powered wetland analysis**, **AI chat assistance**, and **interactive map previews** to generate location-specific guidance for weather, fish activity, and storm risk.

Rather than relying on generic static warnings, the application turns a selected place into a structured AI query and produces a practical response for local decision-making. The dashboard is designed as a modern web application with dark mode support, multilingual UI, and shareable safety outputs.

---

## 🔍 Introduction
Wetland communities often depend on rapidly changing environmental conditions. A small shift in weather, wind, water movement, or storm behavior can strongly affect fishing safety and daily planning.

AI Haor Guardian is built to make this information easier to access. The app helps users:

- Select a country and a wetland, city, or regional location
- View the selected place on an embedded map
- Ask the AI system for weather, fish, and storm insights
- Generate fisherman-facing safety alerts
- Chat with an AI assistant about wetland-related questions

The project follows a research-style presentation so it can be used for academic showcases, hackathons, and climate-tech demonstrations.

---

## 🎯 Problem Statement
Many local users in wetland and coastal regions face the following challenges:

- Forecasts are too broad and not location-specific
- Fishing safety guidance is often manual or delayed
- Users cannot quickly interpret climate risk for their exact area
- There is limited support for multilingual and mobile-friendly advisory tools

**Goal:** build an AI-powered dashboard that converts a selected wetland location into actionable, location-aware guidance.

---

## 🧪 Research Methodology

### **1. Location Selection Layer**
- Country auto-detection and manual country typing
- Region/location selection from mapped wetland areas when available
- Fallback free-text location input for custom places

### **2. AI Inference Layer**
- Gemini-based wetland insight generation
- Location-aware prompts for weather prediction, fish insight, and storm alert outputs
- Conversational AI support for follow-up questions

### **3. User Advisory Layer**
- Fisherman alert generation
- PDF export of advisory content
- Copy/share support for quick distribution

### **4. Visualization Layer**
- Embedded Google Maps preview of the selected location
- Clean dashboard cards and structured insight panels
- Dark/light theme presentation

---

## 🏗 System Architecture

```
                 ┌──────────────────────────────┐
                 │ Country / Location Selector  │
                 └──────────────┬───────────────┘
                                │
                     ┌──────────▼──────────┐
                     │   Google Maps View   │
                     └──────────┬──────────┘
                                │
              ┌─────────────────▼─────────────────┐
              │        Gemini AI Services         │
              └──────────┬────────────┬───────────┘
                         │            │
          ┌──────────────▼───┐  ┌────▼────────────┐
          │ Wetland Insights  │  │ AI Chat Support │
          │ Weather / Fish /  │  │                │
          │ Storm Analysis    │  └────────────────┘
          └──────────────┬────┘
                         │
               ┌─────────▼─────────┐
               │ Alert & PDF Output │
               └─────────┬─────────┘
                         │
               ┌─────────▼─────────┐
               │ Interactive Dashboard│
               └─────────────────────┘
```

---

## 📊 Key Results
The app is designed to generate structured AI outputs for three main advisory domains:

| Output Type | Purpose |
|------------|---------|
| Weather Prediction | Summarizes local conditions and risk level |
| Fish Insight | Highlights likely fish activity and useful zones |
| Storm Alert AI | Provides storm-related safety guidance |
| Fisherman Advisory | Generates a readable alert for local users |

Because the system uses live AI generation, the content adapts to the selected location rather than relying on one fixed template.

---

## ⭐ Features
- ✔ **Country + Wetland / Location Selector**
- ✔ **Gemini-Powered Weather, Fish, and Storm Insights**
- ✔ **Interactive Map Preview for Selected Place**
- ✔ **AI Chat Assistant for Wetland Questions**
- ✔ **Fisherman Alert Generation**
- ✔ **PDF Export and Share Support**
- ✔ **Multilingual UI Support**
- ✔ **Dark Mode Friendly Design**
- ✔ **Modern React + TypeScript Interface**

---

## 🖼️ Project Gallery

Below is the gallery layout.

<p align="center">
  <img width="400" height="400" alt="project screenshot 1" src="https://github.com/user-attachments/assets/f8ae5d4f-c27a-4341-a4cd-7b8451266971" />
  <img width="400" height="400" alt="project screenshot 2" src="https://github.com/user-attachments/assets/6571ce1b-0714-499e-ae77-ef120069fe55" />
</p>

<p align="center">
  <img width="400" height="500" alt="project screenshot 3" src="https://github.com/user-attachments/assets/78b57b99-c417-4ce0-a6b4-a8438953e1be" />
  <img width="400" height="300" alt="project screenshot 4" src="https://github.com/user-attachments/assets/c45505b0-2566-4f0a-9be7-7ed4fa199ac9" />
</p>

---

## 🧰 Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI Integration:** Gemini API via `@google/genai`
- **Routing:** React Router
- **Utilities:** `lucide-react`, `jspdf`

---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create an environment file
Create a `.env.local` file in the project root and add one of these keys:

```bash
GEMINI_API_KEY=your_api_key_here
```

or

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3. Run the project
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 📌 How It Works
1. Open the dashboard or map page.
2. Select a country and wetland/location.
3. The app builds a location-aware prompt for Gemini.
4. The AI service returns weather, fish, and storm insight.
5. Users can review, copy, share, or export the advisory.

---

## 📈 Future Work
- District-level micro-risk mapping
- Direct SMS or WhatsApp alert integration
- Offline advisory mode for low-connectivity regions
- More satellite and weather data sources
- Community reporting and verification layer

---

## 🏁 Conclusion
AI Haor Guardian demonstrates how AI can be applied to wetland and coastal decision support. By combining location selection, map visualization, and Gemini-powered advisory generation, the project provides an accessible way to understand weather, fish activity, and storm risk in a chosen area.

The system is especially useful for research demos, climate-resilience prototypes, and public-facing wetland intelligence dashboards.

---

## 🖊️ Citation
**global-wetland-guardian (2026). Satellite-Assisted Wetland Intelligence & AI Early Warning Dashboard for Wetland and Coastal Regions.**

---
 