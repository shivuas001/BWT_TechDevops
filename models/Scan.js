const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    inputType: {
        type: String,
        enum: ['text', 'url', 'video'],
        required: true
    },
    inputText: String,
    inputURL: String,
    emotionalIndex: {
        fear: Number,
        urgency: Number,
        authority: Number,
        reward: Number,
        score: Number
    },
    intent: String,
    domainScore: Number,
    deepfakeScore: Number,
    riskScore: Number,
    threatLevel: String,
    confidence: Number,
    flags: [String],
    aiSummary: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Scan', ScanSchema);
