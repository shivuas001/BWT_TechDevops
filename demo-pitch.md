# 🎤 Saenix AI – Hackathon Pitch & Demo Flow

This document is your master cheat sheet for the hackathon judging round. It contains the exact narrative to use when pitching, and the "Golden Path" text payloads to paste into the scanner to guarantee a perfect live demo.

---

## 1. ⏱️ The 3-Minute Pitch Outline

**Slide 1: The Problem (0:00 - 0:45)**
*   "Phishing and social engineering cost billions annually. But current security tools are failing because they look for *technical* signatures—like known bad code or blacklisted domains."
*   "But modern attacks don't use bad code. They use *psychology*. They manipulate humans using fear, urgency, and authority."

**Slide 2: The Solution (0:45 - 1:30)**
*   "Introducing Saenix AI: A Psychological Threat Intelligence Engine."
*   "Unlike static scanners, Saenix intercepts the *intent* of the message before action is taken."
*   "It breaks down communication into a 'Threat Genome'—analyzing Emotional Manipulation, Intent, and Domain Integrity to generate a unified Risk Score."

**Slide 3: The Demo (1:30 - 2:30)**
*   *(See Golden Path Demo Script below)*
*   "Let me show you how it spots a spear-phishing attack that bypassing Google Workspace."

**Slide 4: The Impact & Future (2:30 - 3:00)**
*   "Saenix provides explainable AI for the end-user. It doesn't just say 'Blocked.' It explains *why* the message is dangerous so users learn."
*   "Future roadmap includes deep browser integration and real-time deepfake video heuristics."

---

## 2. 🛡️ The "Golden Path" Demo Script

During the demo, do not type randomly. Copy and paste these exact payloads to trigger the specific engines perfectly. 

### Test Case 1: The "Critical Threat" (Spear-Phishing)
*   **Goal:** Trigger the Warning Badge, max out Fear/Urgency bars, and classify as Credential Harvesting.
*   **Select Tab:** Text/Email
*   **Paste this Payload:**
> "URGENT SECURITY ALERT: Admin, your corporate email account has been compromised and is scheduled for immediate suspension in 2 hours. To avoid permanent lock, verify your credentials immediately at our secure portal or face penalty."
*   **Paste URL:** `http://login.auth.secure-update.online/verify`
*   **Action:** Hit "Analyze Threat Intent".
*   **Talking Point:** "Notice how Saenix didn't just flag the URL. It mapped the extreme Urgency and Authority manipulation tactics to classify this as an imminent Credential Harvesting attack."

### Test Case 2: The "Medium Risk" (Financial Scam)
*   **Goal:** Trigger moderate risk, high Reward/Greed bars, and classify as Financial Extraction.
*   **Select Tab:** Text/Email
*   **Paste this Payload:**
> "Congratulations, you have been selected as the exclusive winner of our customer compensation fund. Please review the attached wire instructions to claim your $5,000 refund today."
*   **Paste URL:** `http://claim-refund.click/dashboard`
*   **Action:** Hit "Analyze Threat Intent".
*   **Talking Point:** "Here, the engine detects zero Fear, but maxes out the Reward metric, correctly classifying the intent as Financial Extraction."

### Test Case 3: The "Safe Communication"
*   **Goal:** Prove the system doesn't generate false positives on normal business text.
*   **Select Tab:** Text/Email
*   **Paste this Payload:**
> "Hey team, just a quick reminder that the Q3 marketing meeting has been moved to Thursday at 2 PM. Please review the attached slide deck when you have a moment."
*   **Paste URL:** `https://calendar.google.com/event`
*   **Action:** Hit "Analyze Threat Intent".
*   **Talking Point:** "Finally, on a standard internal email, Saenix accurately scores a near-zero threat level, ensuring business continuity without alert fatigue."
