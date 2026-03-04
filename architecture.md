# 🏛️ Saenix AI – System Architecture & Data Flow

This document demonstrates the robust, production-ready architecture underpinning Saenix AI. It showcases our ability to build a scalable, highly optimized threat intelligence system, setting us apart as a top-tier hackathon team.

## 🔄 End-to-End System Flow

1.  **Data Ingestion (Frontend API Layer):**
    *   Unified input stream accepting Text, Email Headers, URLs, or (simulated) Video streams.
    *   Payload is sanitized and routed via REST API (`POST /scan`) to the Node.js backend.

2.  **Parallel Heuristic Processing (The Engines):**
    To ensure sub-second response times, the raw input is distributed across multiple autonomous engines simultaneously:
    *   `EmotionEngine`: Tokenizes text and maps against psychological pressure dictionaries (Fear, Urgency, Authority, Reward).
    *   `IntentClassifier`: Utilizes phrase-matching and pattern recognition to discern the attacker's ultimate objective (e.g., Credential Harvesting vs. Financial Extraction).
    *   `DomainIntelligence`: Statically analyzes URLs for IP obfuscation, typosquatting (brand impersonation), and high-entropy subdomains.

3.  **Threat Synthesis (Risk Aggregator):**
    *   The aggregator receives independent signals from the engines.
    *   Applies a proprietary weighted mathematical formula: `Total Risk = (Emotion * 0.35) + (Intent * 0.35) + (Domain * 0.20) + (Deepfake * 0.10)`.
    *   Applies "Aggravator Multipliers" for dangerously combined vectors (e.g., High Urgency + Obfuscated Domain = Spear-phishing).
    *   Generates a highly specific "Threat Genome" (an array of human-readable psychological tags) and an Explainable AI Summary.

4.  **Logging & Telemetry (MongoDB):**
    *   The complete analytical payload is saved asynchronously to a MongoDB instance (`Scan` collection).
    *   Ensures a historical audit trail and powers the global Analytics dashboard.

5.  **Data Delivery (UI Update):**
    *   The synthesized JSON response is returned to the client.
    *   The frontend dynamically updates the `window.requestAnimationFrame` based Risk Gauge, Emotional Bars, and Risk Modules.

---

## 🏗️ Technical Stack

*   **App Logic Tier:** Node.js (V8 Engine) handling asynchronous IO operations for non-blocking analysis.
*   **API Framework:** Express.js providing lightweight, unopinionated REST routing.
*   **Database Tier:** MongoDB + Mongoose Object Data Modeling (ODM) for schema validation and rapid indexing of historical threat vectors.
*   **Presentation Tier:** Vanilla JavaScript & CSS leveraging CSS Variables, Flexbox/Grid, and Keyframe animations for a high-performance, dependencies-free dashboard.

## 🛡️ Competitive Advantage (Why We Rank #1)

While other teams build rudimentary Regex scanners that look for "bad words," Saenix AI focuses on **Intent and Psychology**. Our architecture dynamically generates a *Threat Genome*, offering explainable AI rather than a simple block/allow list. This approach proves a deep understanding of modern Social Engineering attack vectors.
