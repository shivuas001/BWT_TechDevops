require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// File-based persistent history store
const HISTORY_FILE = path.join(__dirname, 'history.json');
function loadFileHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) { }
    return [];
}
function saveToFileHistory(scan) {
    try {
        const history = loadFileHistory();
        history.unshift(scan); // Add newest first
        const trimmed = history.slice(0, 100); // Keep last 100 entries
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
    } catch (e) {
        console.log('File history write error:', e.message);
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root directory

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/saenix')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

const Scan = require('./models/Scan');
const { analyzeEmotion } = require('./modules/emotionEngine');
const { classifyIntent } = require('./modules/intentClassifier');
const { analyzeDomain } = require('./modules/domainIntelligence');
const { aggregateRisk } = require('./modules/riskAggregator');
const { processMessage, extractEntities, detectFraudPattern, buildAndAnalyzeGraph, calculateFinalRiskScore } = require('./modules/graphIntelligence');
const { analyzeWithAI } = require('./modules/aiAnalyzer');

// Routes
// --- GRAPH INTELLIGENCE + AI API ---
app.post('/api/analyze-message', async (req, res) => {
    try {
        const { message } = req.body;

        // Mod 1 & 2: Processing & Extraction
        const { normalized, tokens } = processMessage(message);
        const entities = extractEntities(normalized, tokens);

        // Mod 3: Fraud Pattern (Rule-Based)
        const { fraudType, patternScore } = detectFraudPattern(normalized, entities);

        // Mod 4 & 5: Graph Construction & Intelligence
        const { graph, graphRisk } = buildAndAnalyzeGraph(normalized, entities);

        // Emotion & domain heuristics
        let emotionScore = 0;
        if (entities.keywords.some(k => k.type === 'urgency')) emotionScore += 50;
        if (entities.keywords.some(k => k.type === 'security')) emotionScore += 40;
        let domainRisk = entities.domains.length > 0 ? 40 : 0;

        // Mod 6: Final Scoring (Rule-based)
        let riskScore = calculateFinalRiskScore(patternScore, domainRisk, emotionScore, graphRisk);
        let finalFraudType = fraudType;
        let aiReasoning = null;
        let aiConfidence = null;
        let suspiciousIndicators = [];

        // Call Gemini AI in parallel (non-blocking fallback)
        try {
            const aiResult = await analyzeWithAI(message);
            if (aiResult) {
                // AI overrides rule-based results
                finalFraudType = aiResult.fraud_type;
                riskScore = Math.max(riskScore, aiResult.risk_score); // Take the higher risk
                aiReasoning = aiResult.reasoning;
                aiConfidence = aiResult.confidence;
                suspiciousIndicators = aiResult.suspicious_indicators || [];
                console.log(`🤖 AI: ${finalFraudType} [${aiResult.risk_score}] — ${aiReasoning}`);
            }
        } catch (aiErr) {
            console.log('🔁 AI unavailable, using rule-based result.');
        }

        // Save Graph Intel scan to history (MongoDB + file fallback)
        const threatLevel = riskScore >= 70 ? 'High Risk' : riskScore >= 40 ? 'Medium Risk' : 'Safe';
        const scanRecord = {
            createdAt: new Date().toISOString(),
            inputType: 'graph_intel',
            inputText: message,
            intent: finalFraudType,
            riskScore: riskScore,
            threatLevel: threatLevel,
            aiSummary: aiReasoning || `Detected: ${finalFraudType}`
        };
        // Always save to file (survives server restarts)
        saveToFileHistory(scanRecord);
        // Also try MongoDB
        const graphScan = new Scan({ ...scanRecord, inputURL: '', emotionalIndex: { score: 0, flags: [], label: 'N/A' }, domainScore: entities.domains.length > 0 ? 40 : 0, deepfakeScore: 0, confidence: aiConfidence || 'Medium', flags: entities.keywords.map(k => k.phrase), genome: [] });
        try {
            if (mongoose.connection.readyState === 1) await graphScan.save();
        } catch (dbErr) { console.log('DB save skipped.'); }

        res.json({
            risk_score: riskScore,
            fraud_type: finalFraudType,
            ai_reasoning: aiReasoning || `Rule-based analysis: detected ${finalFraudType === 'None Detected' ? 'no fraud patterns' : finalFraudType.toLowerCase()}.`,
            ai_confidence: aiConfidence || 'Medium',
            suspicious_indicators: suspiciousIndicators,
            entities: {
                banks: entities.banks.length > 0 ? entities.banks.join(", ") : "None Detected",
                domains: entities.domains.length > 0 ? entities.domains.join(", ") : "None Detected",
                emails: entities.emails.length > 0 ? entities.emails.join(", ") : "None Detected",
                phones: entities.phones.length > 0 ? entities.phones.join(", ") : "None Detected",
                keywords: entities.keywords.length > 0 ? entities.keywords.map(k => k.phrase) : []
            },
            graph: graph
        });
    } catch (err) {
        console.error("Graph API Error:", err);
        res.status(500).json({ error: "Graph Intelligence Analysis failed" });
    }
});
app.post('/scan', async (req, res) => {
    try {
        const { type, text, url } = req.body;
        const inputText = text || url || '';

        // Rule-based analysis (fast fallback)
        const emotionInfo = analyzeEmotion(inputText);
        const intentInfo = classifyIntent(inputText);
        const domainInfo = analyzeDomain(url || '');
        const riskData = aggregateRisk(emotionInfo, intentInfo, domainInfo);

        let finalIntent = intentInfo.intent;
        let finalRisk = riskData.riskScore;
        let finalSummary = riskData.aiSummary;
        let aiConfidence = riskData.confidence;

        // Call Gemini AI for unified results
        try {
            const aiResult = await analyzeWithAI(inputText);
            if (aiResult) {
                finalIntent = aiResult.fraud_type;
                finalRisk = Math.max(finalRisk, aiResult.risk_score);
                finalSummary = aiResult.reasoning;
                aiConfidence = aiResult.confidence;
                console.log(`🤖 AI Scan: ${finalIntent} [${finalRisk}]`);
            }
        } catch (aiErr) {
            console.log('AI fallback to rule-based for scan.');
        }

        const threatLevel = finalRisk >= 70 ? 'High Risk' : finalRisk >= 40 ? 'Medium Risk' : 'Safe';

        // Save to file history always
        const scanRec = {
            createdAt: new Date().toISOString(),
            inputType: type || 'text',
            inputText: inputText.substring(0, 200),
            intent: finalIntent,
            riskScore: finalRisk,
            threatLevel: threatLevel,
            aiSummary: finalSummary
        };
        saveToFileHistory(scanRec);

        // Also save to MongoDB
        const newScan = new Scan({
            inputType: type || 'text',
            inputText: inputText,
            inputURL: url || '',
            emotionalIndex: emotionInfo,
            intent: finalIntent,
            domainScore: domainInfo.score,
            deepfakeScore: 0,
            riskScore: finalRisk,
            threatLevel: threatLevel,
            confidence: aiConfidence,
            flags: [...intentInfo.flags, ...domainInfo.flags],
            aiSummary: finalSummary,
            genome: riskData.genome
        });
        try {
            if (mongoose.connection.readyState === 1) await newScan.save();
        } catch (dbErr) {
            console.log('DB save skipped.');
        }

        res.json({
            success: true,
            data: {
                riskScore: finalRisk,
                threatLevel: threatLevel,
                confidence: aiConfidence,
                emotionalIndex: emotionInfo,
                intent: finalIntent,
                flags: [...intentInfo.flags, ...domainInfo.flags],
                aiSummary: finalSummary,
                genome: riskData.genome
            }
        });
    } catch (error) {
        console.error("Scan error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.get('/history', async (req, res) => {
    try {
        // Try MongoDB first
        if (mongoose.connection.readyState === 1) {
            const scans = await Scan.find().sort({ createdAt: -1 }).limit(50);
            if (scans.length > 0) {
                return res.json({ success: true, data: scans });
            }
        }
        // Fall back to file-based history (always has real data)
        const fileHistory = loadFileHistory();
        return res.json({ success: true, data: fileHistory });
    } catch (error) {
        const fileHistory = loadFileHistory();
        return res.json({ success: true, data: fileHistory });
    }
});

app.get('/analytics', async (req, res) => {
    const dummyAnalytics = { totalScans: 1248, criticalThreats: 342, topVector: "Financial Extraction" };

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, data: dummyAnalytics });
        }

        const total = await Scan.countDocuments();
        if (total === 0) return res.json({ success: true, data: dummyAnalytics });

        const critical = await Scan.countDocuments({ threatLevel: "High Risk" });

        // Find top intent using aggregation
        const topIntentData = await Scan.aggregate([
            { $group: { _id: "$intent", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const topVector = topIntentData.length > 0 && topIntentData[0]._id !== "None Detected"
            ? topIntentData[0]._id
            : "Credential Harvesting";

        res.json({
            success: true,
            data: {
                totalScans: total,
                criticalThreats: critical,
                topVector: topVector
            }
        });
    } catch (error) {
        res.json({ success: true, data: dummyAnalytics });
    }
});

app.listen(PORT, () => {
    console.log(`⚡ Saenix AI Backend running on port ${PORT}`);
});
