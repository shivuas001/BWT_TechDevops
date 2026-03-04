const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Mock AI Intelligence Routes
app.post('/api/analyze', (req, res) => {
    const { text } = req.body;

    // Simulate Saenix AI Processing
    const score = Math.floor(Math.random() * 100);
    const summary = score > 70
        ? "CRITICAL: Psychological manipulation detected. High urgency and authority spoofing."
        : "LOW RISK: Standard communication patterns detected.";

    res.json({
        threatScore: score,
        summary: summary,
        engines: {
            emotional: Math.floor(Math.random() * 100),
            intent: Math.floor(Math.random() * 100),
            domain: Math.floor(Math.random() * 100)
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `Saenix AI Intelligence Server Running at http://localhost:${PORT}`);
    console.log(`Intercepting Threats in Real-Time...`);
});
