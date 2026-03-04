/**
 * Saenix AI: Risk Aggregator
 * Synthesizes vector scores into a final threat probability.
 */

function calculateFinalRisk(emotional, intent, domain) {
    // Weighted aggregation logic
    const score = (emotional * 0.4) + (intent * 0.3) + (domain * 0.3);

    return {
        score: Math.round(score),
        level: score > 75 ? 'CRITICAL' : score > 40 ? 'CAUTION' : 'SECURE',
        timestamp: new Date().toISOString()
    };
}

module.exports = { calculateFinalRisk };
