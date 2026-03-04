/**
 * AI Analyzer Module — Powered by Google Gemini Flash
 * Sends the raw message to Gemini AI and returns structured fraud classification.
 * Falls back gracefully to null if the API key is missing or the call fails.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
let model = null;

if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini AI Analyzer initialized');
} else {
    console.log('⚠️  GEMINI_API_KEY not found — AI analysis disabled');
}

const SYSTEM_PROMPT = `You are an expert cybersecurity AI specializing in SMS and email fraud detection.
Analyze the given message and return a JSON object with the following fields:
- fraud_type: One of "Bank Phishing", "OTP Scam", "Account Takeover Scam", "Smishing Campaign", "Payment Scam", "Brand Impersonation", "Developer Alert Scam", "Job Scam", "Lottery Scam", "None Detected"
- risk_score: Integer from 0 to 100 (0=safe, 100=extremely dangerous)
- confidence: One of "High", "Medium", "Low"
- reasoning: A single sentence explaining WHY this is or isn't fraud. Be specific about the fraud technique used.
- detected_brands: Array of brand names mentioned or impersonated (e.g. ["HDFC", "Amazon"])
- suspicious_indicators: Array of specific red flags (e.g. ["Urgency trigger", "Suspicious URL", "OTP request"])

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanation outside the JSON.`;

async function analyzeWithAI(message) {
    if (!model) {
        return null; // AI not available, caller should use rule-based result
    }

    try {
        const prompt = `${SYSTEM_PROMPT}\n\nMessage to analyze:\n"${message}"`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Clean up response in case Gemini wraps in markdown
        const cleaned = responseText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```$/i, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            fraud_type: parsed.fraud_type || 'None Detected',
            risk_score: Math.min(100, Math.max(0, parseInt(parsed.risk_score) || 0)),
            confidence: parsed.confidence || 'Medium',
            reasoning: parsed.reasoning || 'Analysis complete.',
            detected_brands: parsed.detected_brands || [],
            suspicious_indicators: parsed.suspicious_indicators || []
        };
    } catch (err) {
        console.error('Gemini AI Error:', err.message);
        return null; // Return null so caller falls back to rule-based
    }
}

module.exports = { analyzeWithAI };
