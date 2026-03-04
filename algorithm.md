# 🧠 Saenix AI – Core Algorithm Theory

This document outlines the theoretical logic, scoring formulas, and mathematical weights behind Saenix AI's threat detection engines. We will use this blueprint during the hackathon implementation phase to build out the deep logic.

## 1. The Risk Aggregator Equation (The Core Math)

The final Saenix Risk Score is a weighted average of four distinct engines. It is not a simple addition; it heavily penalizes combined vectors (e.g., Fear + Urgent + Suspicious URL).

**Formula:**
`Total Risk = (Emotion * 0.35) + (Intent * 0.35) + (Domain * 0.20) + (Deepfake * 0.10)`

**Aggravator Multiplier:** 
If `Emotion > 75` AND `Domain > 50`, then `Total Risk = Total Risk * 1.25` (Capped at 100). 
*Why? Because high urgency linked to a shady domain is the textbook definition of a spear-phishing attack.*

---

## 2. Emotional Manipulation Engine (NLP Heuristics)

Instead of traditional ML sentiment analysis (which looks for "happy/sad"), we look for **Psychological Pressure Points**.

### Sub-Vectors:
*   **Fear/Anxiety ($F$):** Keywords: *locked, suspended, unauthorized, compromised, penalty*.
*   **Urgency ($U$):** Keywords: *immediately, urgently, 24 hours, final notice, action required*.
*   **Authority ($A$):** Keywords: *admin, support, legal, official, compliance, security desk*.
*   **Reward/Greed ($R$):** Keywords: *winner, exclusive, compensation, refund, selected*.

### Scoring Logic:
1. Text is tokenized and matched against dictionaries for F, U, A, and R.
2. Each match adds points to its specific sub-vector.
3. `Base Emotion Score = (F + U * 1.5 + A + R)` 
*(Urgency is weighted 1.5x because it is the most common catalyst for fraud).*
4. Sub-vectors are mapped onto the 0-100 gauge.

---

## 3. Intent Classification Engine (Pattern Recognition)

This engine doesn't ask "Is this bad?" It asks "What do they want?"

### Core Intent Categories:
1.  **Credential Harvesting:** Looking for variations of "verify your account", "update login", "confirm password". (Highest Risk).
2.  **Financial Extraction:** "Unpaid invoice", "tax refund due", "wire transfer instructions". (High Risk).
3.  **Malware Delivery:** "Review attached document", "download receipt". (High Risk).
4.  **None Detected:** Routine communications. (Low Risk).

### Scoring Logic:
*   Matches against intent phrases trigger classification.
*   Certain intents carry automatic base scores: 
    *   *Credential Harvesting* immediately contributes a minimum of 80 to the Intent Score.
    *   *Financial Extraction* contributes 75.

---

## 4. Domain Intelligence Engine (Static Analysis)

Analyzes URLs extracted from the raw text.

### Red Flags:
*   **Suspicious TLD:** Matches `.xyz`, `.top`, `.online`, `.click`. (+40 points)
*   **IP Address URL:** e.g., `http://192.168.1.1/login`. (+50 points)
*   **Typosquatting/Homoglyphs:** Analyzes Levenshtein distance against top brands (e.g., `paypa1.com`, `g00gle.com`). (+60 points)
*   **Excessive Subdomains:** e.g., `login.auth.security.paypal.update.com`. (+30 points)

### Scoring Logic:
Points are summed up and capped at 100. If an IP address is used, it often automatically pushes the domain score to critical limits.

---

## 5. Saenix Threat Genome (Data Labeling)

The Threat Genome is the specific "DNA sequence" of the attack, generated dynamically for the UI.

**Example Sequence Generation:**
*   If `Urgency > 80`, add tag: `[Hyper-Urgency Trigger]`
*   If `Domain is IP`, add tag: `[Obfuscated Origin]`
*   If `Intent == Credential Harvesting`, add tag: `[Auth Bypass Attempt]`

The resulting Genome is a human-readable, highly technical breakdown of the psychological components of the detected threat.
