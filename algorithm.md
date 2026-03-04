# Saenix AI: Threat Genome Framework Algorithm

## Overview
The core of Saenix AI is the **Threat Genome Framework**, a multi-vector scoring system that evaluates digital communications based on psychological markers rather than just technical indicators.

## 1. Emotional Manipulation Vector ($V_E$)
The system parses text using Natural Language Processing (NLP) to detect specific emotional pressure points:
- **Fear/Urgency** ($U$): Detection of time-sensitive demands or threats of account suspension.
- **Authority** ($A$): Implied trust through the use of official-sounding titles or brand names.
- **Greed/Reward** ($G$): Offers of unexpected financial gain or exclusivity.

$$V_E = \omega_u U + \omega_a A + \omega_g G$$
*Where $\omega$ represents gravity weights assigned by the intelligence engine.*

## 2. Intent Classification Vector ($V_I$)
Heuristic analysis classifies the sender's ultimate goal:
- **Credential Harvesting:** Detection of login patterns and spoofed forms.
- **Financial Extraction:** Recognition of requests for PII or wire transfers.
- **Action Triggers:** Detection of calls to action (downloads, redirects).

## 3. Domain Intelligence Vector ($V_D$)
Static and dynamic URL analysis:
- **Typosquatting Score:** Distance analysis between the source and legitimate entity domains.
- **TLD Risk:** Evaluation of top-level domain reputation.
- **SSL/Metadata:** Checking for obfuscated certificates or suspicious hosting origins.

## 4. Final Threat Score ($S$)
The Risk Aggregator synthesizes the individual vectors into a final score (0-100):

$$S = \text{Aggregator}(V_E, V_I, V_D)$$

- **0-30 (Low Risk):** Verified Legitimate.
- **31-70 (Caution):** Anomalies Detected. User warned.
- **71-100 (Critical):** High-Confidence Threat. Neutralization recommended.

---
*Saenix AI Intelligence Tier*
