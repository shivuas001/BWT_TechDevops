require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

        // Save Graph Intel scan to history
        const threatLevel = riskScore >= 70 ? 'High Risk' : riskScore >= 40 ? 'Medium Risk' : 'Safe';
        const graphScan = new Scan({
            inputType: 'graph_intel',
            inputText: message,
            inputURL: '',
            emotionalIndex: { score: 0, flags: [], label: 'N/A' },
            intent: finalFraudType,
            domainScore: entities.domains.length > 0 ? 40 : 0,
            deepfakeScore: 0,
            riskScore: riskScore,
            threatLevel: threatLevel,
            confidence: aiConfidence || 'Medium',
            flags: entities.keywords.map(k => k.phrase),
            aiSummary: aiReasoning || `Detected: ${finalFraudType}`,
            genome: []
        });
        try {
            if (mongoose.connection.readyState === 1) {
                await graphScan.save();
            }
        } catch (dbErr) {
            console.log('DB save skipped (No Mongo connection)');
        }

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

        const emotionInfo = analyzeEmotion(text || "");
        const intentInfo = classifyIntent(text || "");
        const domainInfo = analyzeDomain(url || "");

        const riskData = aggregateRisk(emotionInfo, intentInfo, domainInfo);

        const newScan = new Scan({
            inputType: type || 'text',
            inputText: text || "",
            inputURL: url || "",
            emotionalIndex: emotionInfo,
            intent: intentInfo.intent,
            domainScore: domainInfo.score,
            deepfakeScore: 0,
            riskScore: riskData.riskScore,
            threatLevel: riskData.threatLevel,
            confidence: riskData.confidence,
            flags: [...intentInfo.flags, ...domainInfo.flags],
            aiSummary: riskData.aiSummary,
            genome: riskData.genome
        });

        // Save to DB only if connected, otherwise just return the data so demo works
        try {
            if (mongoose.connection.readyState === 1) {
                await newScan.save();
            }
        } catch (dbErr) {
            console.log("DB save skipped (No Mongo connection)");
        }

        res.json({
            success: true,
            data: {
                riskScore: riskData.riskScore,
                threatLevel: riskData.threatLevel,
                confidence: riskData.confidence,
                emotionalIndex: emotionInfo,
                intent: intentInfo.intent,
                flags: [...intentInfo.flags, ...domainInfo.flags],
                aiSummary: riskData.aiSummary,
                genome: riskData.genome
            }
        });
    } catch (error) {
        console.error("Scan error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.get('/history', async (req, res) => {
    const dummyData = [
        { createdAt: '2026-03-04T00:32:10Z', inputType: 'text', inputText: 'URGENT SECURITY ALERT: Admin, your corporate email account has been compromised...', intent: 'Credential Harvesting', riskScore: 92, threatLevel: 'High Risk' },
        { createdAt: '2026-03-03T23:15:00Z', inputType: 'text', inputText: 'Congratulations, you have been selected as the exclusive winner...', intent: 'Financial Extraction', riskScore: 85, threatLevel: 'High Risk' },
        { createdAt: '2026-03-03T18:45:20Z', inputType: 'text', inputText: 'Hey team, just a quick reminder that the Q3 marketing meeting has been moved...', intent: 'None Detected', riskScore: 12, threatLevel: 'Safe' }
    ];

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, data: dummyData });
        }
        const scans = await Scan.find().sort({ createdAt: -1 }).limit(10);
        if (scans.length === 0) return res.json({ success: true, data: dummyData });
        res.json({ success: true, data: scans });
    } catch (error) {
        res.json({ success: true, data: dummyData });
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
