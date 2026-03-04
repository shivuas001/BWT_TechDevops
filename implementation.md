# 🏆 SAENIX AI – MASTER EXECUTION ROADMAP

---

# 1️⃣ PRODUCT VISION

## Product Name:

Saenix AI

## Tagline:

Intercept Before Impact.

## Core Idea:

A Psychological Threat Intelligence Engine that detects fraud before action is taken.

## Core Differentiation:

Most systems detect malicious content.
Saenix AI detects manipulation intent.

---

# 2️⃣ FINAL ARCHITECTURE OVERVIEW

```
Frontend (HTML/CSS/JS)
        ↓
Node.js + Express API
        ↓
Detection Modules
        ↓
Risk Aggregator (Saenix Threat Genome)
        ↓
MongoDB Storage
        ↓
JSON Response
        ↓
Animated UI Update
```

---

# 3️⃣ PRE-HACKATHON ROADMAP (CRITICAL)

Goal: Enter hackathon 70% ready.

---

## PHASE A – UI COMPLETION

### Step 1 – Landing Page

* Hero section
* CTA
* Dashboard preview mock
* Smooth transition

### Step 2 – Dashboard Layout

Three columns:

* Sidebar
* Main Scan Panel
* Right Risk Intelligence Panel

### Step 3 – Scan Page

Must include:

* Text input
* URL input
* Video upload
* Analyze button
* AI core animation placeholder
* 4 detection module cards
* Risk gauge
* Emotional bars
* Saenix Threat Genome
* Intent classification badge
* Explanation panel

### Step 4 – Mock API Integration

Use static JSON.
Make entire UI dynamic.

Test:

* Risk gauge animation
* Emotional bars
* Sequential module activation
* Badge update
* Explanation rendering

Frontend must be production-level.

---

## PHASE B – BACKEND STRUCTURE SETUP

Create:

* server.js
* routes folder
* modules folder
* models folder
* controllers folder

Install:

* express
* cors
* mongoose

Create empty endpoints:

* POST /scan
* GET /history

---

## PHASE C – ALGORITHM DESIGN DOCUMENT

Prepare clearly:

### Emotional Categories

* Fear
* Urgency
* Authority
* Reward bait

### Intent Categories

* Credential Harvesting
* Financial Extraction
* Data Theft
* Social Engineering

### Domain Checks

* IP-based URL
* Suspicious TLD
* Domain similarity
* Subdomain abuse

### Risk Weighting

Emotional = 50%
Domain = 30%
Deepfake = 20%

Lock this before hackathon.

---

# 4️⃣ HACKATHON EXECUTION PLAN (4–6 HOURS)

---

# ⏱ HOUR 0–1 → Infrastructure

* Setup Express
* Connect MongoDB
* Create Scan schema
* Test DB connection
* Setup POST /scan
* Setup GET /history

Without DB working, nothing works.

---

# ⏱ HOUR 1–3 → Emotional + Intent Engine

## Emotional Engine

Steps:

* Normalize text
* Tokenize words
* Count category keywords
* Compute percentage score

Return:

* emotional_index
* emotional_score

---

## Intent Classifier

Rule-based mapping:

* OTP/password → Credential Harvesting
* Bank/payment + urgency → Financial Extraction
* Personal data request → Data Theft

Return:

* intent
* flags

Test thoroughly.

---

# ⏱ HOUR 3–4 → Domain Intelligence Engine

If URL exists:

* Check numeric IP pattern
* Check suspicious TLD
* Count subdomains
* Compare similarity with known brands

Return:

* domain_score
* flags

---

# ⏱ HOUR 4–5 → Deepfake Confidence Module

If video uploaded:

* Generate anomaly score
* Return deepfake_score
* Add explanation line

Keep simple.

---

# ⏱ HOUR 5–6 → Risk Aggregator + Integration

Compute:

Final Risk Score =
(Emotional × 0.5) +
(Domain × 0.3) +
(Deepfake × 0.2)

Classify:

* 0–30 Safe
* 31–60 Suspicious
* 61–100 High Risk

Generate:

* threatLevel
* confidence
* ai_summary

Save result in MongoDB.

Return JSON.

Connect frontend.

Test full flow.

---

# 5️⃣ MODULE BREAKDOWN

---

## Emotional Manipulation Engine

Input: Text
Output:

* fear
* urgency
* authority
* reward
* emotional_score

Logic:
Keyword frequency + weighted normalization.

---

## Intent Classification Engine

Input: Text
Output:

* intent label
* explanation flag

Logic:
Pattern detection + rule matching.

---

## Domain Intelligence Engine

Input: URL
Output:

* domain_score
* domain_flags

Logic:
Regex + string comparison.

---

## Deepfake Module

Input: Video
Output:

* deepfake_score

Logic:
Simulated anomaly value.

---

## Risk Aggregator

Input:

* emotional_score
* domain_score
* deepfake_score

Output:

* risk_score
* threat_level
* confidence
* ai_summary

---

# 6️⃣ DATABASE DESIGN

Collection: scans

Fields:

* inputType
* inputText
* inputURL
* emotionalIndex
* intent
* domainScore
* deepfakeScore
* riskScore
* threatLevel
* confidence
* flags
* aiSummary
* createdAt

Used for:

* History page
* Analytics page

---

# 7️⃣ COMPLETE SYSTEM FLOW

1. User inputs message.
2. Click Analyze.
3. Frontend sends POST /scan.
4. Backend processes modules.
5. Risk Aggregator calculates final score.
6. Save scan to MongoDB.
7. Backend returns JSON.
8. Frontend animates:

   * AI core
   * Module cards
   * Risk gauge
   * Emotional bars
9. User views result.
10. History updated.

---

# 8️⃣ DEMO STRATEGY

### Step 1 – Start on landing page.

Say:
“Saenix AI intercepts fraud before impact.”

### Step 2 – Enter dashboard.

Paste phishing message.

### Step 3 – Click Analyze.

Pause while animation runs.

### Step 4 – Explain:

* Emotional spike
* Intent classification
* Threat Genome breakdown
* Risk gauge

### Step 5 – Open History.

Show stored record.

### Step 6 – Conclude.

2–3 minute clean demo.

---

# 9️⃣ RISK MITIGATION

If time is running out:

Priority order:

1. Emotional Engine
2. Intent Classification
3. Risk Aggregator
4. Save to DB
5. Domain Engine
6. Deepfake Module

Deepfake can remain simulated.

Never sacrifice stability for complexity.

---

# 🔟 WHY THIS ROADMAP CAN WIN

Because it is:

* Focused
* Differentiated
* Psychological-based
* Real-time
* Persisted
* Explainable
* Cleanly executed
* Visually impressive
* Realistic for 4–6 hours

Most teams will overbuild.
You will execute strategically.

---

# 11️⃣ DETAILED EXECUTION PHASES

## 🔵 PHASE 0 – STRATEGIC LOCK (1–2 Hours)
**Objective:** Eliminate confusion before building.

**Deliverables:**
* Final product name: Saenix AI
* Final tagline: Intercept Before Impact
* Feature scope frozen
* Risk weights frozen
* API response format frozen
* Folder structure decided

**🔒 Final Feature Scope**
*Core Engines:*
* Emotional Manipulation Engine
* Intent Classification Engine
* Domain Intelligence Engine
* Deepfake Confidence Module (Simulated)
* Risk Aggregator (Saenix Threat Genome)

*System Features:*
* Risk Gauge
* Emotional Index Bars
* Threat Classification Badge
* Explainable AI Summary
* MongoDB History Storage
* Analytics Page
*No additional modules.*

---

## 🟢 PHASE 1 – FRONTEND DEVELOPMENT (Pre-Hackathon)
**Goal:** UI must be 100% complete and dynamic before hackathon.

**🔹 Phase 1A – Layout Foundation**
Tasks:
* Create index.html
* Create style.css
* Create script.js
* Setup layout grid:
  * Navbar
  * Sidebar
  * Main Scan Panel
  * Right Risk Panel
**Outcome:** Basic dashboard visible.

**🔹 Phase 1B – Landing + Navigation**
Tasks:
* Build Hero section
* Add CTA button
* JS to hide landing and show dashboard
* Sidebar navigation logic (show/hide sections)
**Outcome:** Full navigation works without reload.

**🔹 Phase 1C – Scan Page UI (Core)**
Tasks:
* Add Text input area
* Add URL input
* Add Video upload field
* Add Analyze button
* Add AI core animation placeholder
* Add 4 module cards
* Add Risk Gauge
* Add Emotional Index bars
* Add Threat Genome section
* Add Intent badge
* Add Explanation panel
**Outcome:** Full UI present but static.

**🔹 Phase 1D – Animation Layer**
Tasks:
* Add button loading state
* Add AI core pulse animation
* Add sequential module activation
* Add animated risk count-up
* Add emotional bar growth animation
* Add fade-in flags
* Add smooth transitions
**Outcome:** WOW effect works with mock data.

**🔹 Phase 1E – Mock Data Binding**
*Create mock JSON in script.js.*
Tasks:
* Bind emotional bars to mock data
* Bind risk gauge to mock data
* Bind intent badge
* Bind Threat Genome
* Bind explanation
**Outcome:** Frontend behaves like real system.

**🔹 Phase 1F – History + Analytics UI**
Tasks:
* Create History table
* Create dummy scan entries
* Create Analytics charts (basic)
* Add modal for scan details
**Outcome:** System looks persistent and enterprise-grade.

---

## 🟡 PHASE 2 – BACKEND STRUCTURE SETUP (Pre-Hackathon)
**Goal:** No structural coding during hackathon.

**🔹 Phase 2A – Server Setup**
* `npm init`
* Install express
* Install cors
* Install mongoose
* Create:
  * server.js
  * routes folder
  * modules folder
  * models folder

**🔹 Phase 2B – MongoDB Schema**
Create Scan schema:
Fields:
* inputText
* inputURL
* emotionalIndex
* intent
* domainScore
* deepfakeScore
* riskScore
* threatLevel
* confidence
* flags
* aiSummary
* createdAt
*Do not implement detection logic yet.*

**🔹 Phase 2C – API Skeleton**
Create:
* `POST /scan`
* `GET /history`
*Return static JSON for now.*

---

## 🔴 PHASE 3 – HACKATHON EXECUTION (4–6 Hours)

**⏱ HOUR 0–1 → Infrastructure Stabilization**
Tasks:
* Connect MongoDB
* Test DB connection
* Test POST /scan
* Test GET /history
* Confirm frontend connects to backend
**Milestone:** Backend responds to frontend successfully.

**⏱ HOUR 1–2.5 → Emotional Manipulation Engine**
Steps:
* Normalize text
* Tokenize words
* Count keyword frequency
* Compute: fear, urgency, authority, reward
* Normalize score
**Return:** emotional_index, emotional_score
*Test with phishing example.*

**⏱ HOUR 2.5–3.5 → Intent Classification**
Implement rule mapping:
If contains:
* otp/password → Credential Harvesting
* bank + urgent → Financial Extraction
* personal details → Data Theft
**Return:** intent, flags
*Test carefully.*

**⏱ HOUR 3.5–4.5 → Domain Intelligence**
If URL present:
* Regex detect IP
* Check suspicious TLD
* Check similarity to trusted brands
* Count subdomains
* Compute domain_score.

**⏱ HOUR 4.5–5 → Deepfake Confidence**
If video present:
* Generate anomaly %
* Return deepfake_score
*Keep simple.*

**⏱ HOUR 5–6 → Aggregator + Save + Full Integration**
Compute:
* Final Risk = (Emotional × 0.5) + (Domain × 0.3) + (Deepfake × 0.2)
Determine:
* threatLevel
* confidence
* ai_summary
*Save scan to MongoDB. Return JSON. Test full UI animation flow.*

---

## 🔵 PHASE 4 – FINAL POLISH (Last 20 Minutes)
**Checklist:**
* ✔ Risk gauge animates smoothly
* ✔ Emotional bars animate
* ✔ Intent badge shows correctly
* ✔ Explanation readable
* ✔ History updates
* ✔ No console errors
* ✔ Backend stable
* ✔ Demo input prepared

---

## 🔷 PHASE 5 – DEMO EXECUTION PLAN
* Open landing.
* Say product vision.
* Enter dashboard.
* Paste phishing email.
* Click Analyze.
* Pause during animation.
* Explain:
  * Emotional spike
  * Intent detection
  * Threat Genome
  * Risk level
* Show History.
* Conclude.
*Total time: 2–3 minutes.*

---

## 🔶 PHASE 6 – RISK PRIORITIZATION
*If time reduces:*
Priority:
1. Emotional Engine
2. Intent Classification
3. Risk Aggregator
4. DB Save
5. Domain Engine
6. Deepfake
*Deepfake is optional.*

---

## 🏆 WHY THIS PHASE PLAN WORKS
Because it:
* Separates frontend and backend clearly
* Avoids building UI during hackathon
* Protects infrastructure first
* Builds intelligence modules in logical order
* Leaves time for polish
* Avoids feature creep

---

# NEW ROADMAP: Saenix AI — Message Fraud Detection System (Phase 2 Graph Intelligence)

## System Objective
Build a system that analyzes **SMS or email messages**, detects fraud patterns, and visualizes the relationships between entities using a **graph-based investigation model**.

The system must:
* detect phishing patterns
* extract entities from messages
* build a relationship graph
* analyze graph connections
* calculate fraud risk
* visually explain the detection

---

## Overall System Architecture

```text
User Message Input
        ↓
Message Processing Engine
        ↓
Entity Extraction Engine
        ↓
Fraud Pattern Detection
        ↓
Graph Construction Engine
        ↓
Graph Intelligence Analysis
        ↓
Risk Scoring Engine
        ↓
Graph Visualization API
        ↓
Frontend Dashboard
```

---

## Module 1 — Message Processing Engine
**Purpose:** Prepare raw messages for analysis.

**Step 1 — Normalization:**
Convert to lowercase, remove punctuation, normalize spacing.

**Step 2 — Tokenization:**
Split the text into tokens by spaces.

---

## Module 2 — Entity Extraction Engine
**Purpose:** Identify important entities inside the message.

* **Banks:** Matched against known lists (`SBI`, `HDFC`, `ICICI`, `AXIS`, `PAYPAL`).
* **Domains:** Extracted via Regex (`https?:\/\/[^\s]+`).
* **Emails:** Extracted via Regex (`[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`).
* **Keywords:**
  * Urgency (`urgent`, `immediately`, `verify now`, `act now`)
  * Security (`blocked`, `suspended`, `locked`, `security alert`)
  * OTP (`otp`, `verification code`)

---

## Module 3 — Fraud Pattern Detection
**Purpose:** Identify scam types based on extracted entities.

* **Bank Phishing:** BANK + DOMAIN + VERIFY keyword detected.
* **OTP Theft:** OTP keyword + "send".
* **Payment Scam:** "payment" + "urgent".

---

## Module 4 — Graph Construction Engine
**Purpose:** Builds the entity relationship graph to explain how entities relate to each other.

**Node Types:** `MESSAGE`, `BANK`, `DOMAIN`, `EMAIL`, `PHONE`, `KEYWORD`

**Edge Types:**
* `MESSAGE` → `BANK` (mentions)
* `MESSAGE` → `DOMAIN` (contains link)
* `MESSAGE` → `EMAIL` (contact)
* `MESSAGE` → `KEYWORD` (contains)
* `DOMAIN` → `BANK` (impersonates)

---

## Module 5 — Graph Intelligence Analysis
**Purpose:** The graph itself is analyzed for suspicious topological patterns.

* **Brand Impersonation (+40 Risk):** DOMAIN contains BANK name but is not the official domain.
* **Urgency Manipulation (+20 Risk):** Message node is connected to an urgency keyword node.
* **Suspicious Domain (+30 Risk):** TLD is in a suspicious list (`.xyz`, `.ru`, `.top`, `.tk`).

---

## Module 6 — Risk Scoring Engine
**Purpose:** Combine multiple signals.

**Formula:**
`final_risk = (0.35 * pattern_score) + (0.25 * domain_risk) + (0.20 * emotion_score) + (0.20 * graph_risk)`

**Risk Classification:**
* `< 30`: SAFE
* `30–60`: SUSPICIOUS
* `> 60`: HIGH FRAUD

---

## Graph API Design
`POST /api/analyze-message`

**Response Structure JSON:**
* `risk_score` (Int)
* `fraud_type` (String)
* `entities` (Object mapping)
* `graph` (Object containing `nodes` array and `edges` array)

---

## Graph Visualization Layer
* **Recommended Library:** Cytoscape.js
* **Layout:** Force-directed layout
* **Node Colors:** Red (suspicious), Blue (normal), Yellow (keyword).
* **Edge Styles:** Red (impersonates), Gray (mentions), Blue (contains).

---

## Updated Frontend Dashboard Components Requirements
1. Message input panel
2. Pipeline visualization (Text Processing → Entity Extraction → Fraud Pattern Detection → Graph Construction → Graph Intelligence → Risk Scoring)
3. Graph investigation view
4. Risk score display
5. Fraud explanation panel
