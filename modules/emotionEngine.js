const dictionaries = {
    fear: ['locked', 'suspended', 'unauthorized', 'compromised', 'penalty', 'breached', 'violation', 'terminated', 'banned'],
    urgency: ['immediately', 'urgently', '24 hours', 'final notice', 'action required', 'asap', 'expires', 'quickly', 'now', 'critical'],
    authority: ['admin', 'support', 'legal', 'official', 'compliance', 'security desk', 'ceo', 'manager', 'department', 'government'],
    reward: ['winner', 'exclusive', 'compensation', 'refund', 'selected', 'prize', 'bonus', 'claim', 'gift', 'free']
};

function analyzeEmotion(text) {
    if (!text) return { score: 0, fear: 0, urgency: 0, authority: 0, reward: 0 };

    const lowerText = text.toLowerCase();

    let fCount = 0;
    let uCount = 0;
    let aCount = 0;
    let rCount = 0;

    dictionaries.fear.forEach(word => { if (lowerText.includes(word)) fCount += 20; });
    dictionaries.urgency.forEach(word => { if (lowerText.includes(word)) uCount += 25; });
    dictionaries.authority.forEach(word => { if (lowerText.includes(word)) aCount += 15; });
    dictionaries.reward.forEach(word => { if (lowerText.includes(word)) rCount += 20; });

    // Mathematical formula from algorithm.md:
    // Base Emotion Score = (F + U * 1.5 + A + R)
    let baseScore = fCount + (uCount * 1.5) + aCount + rCount;

    // Cap score at 100
    const finalScore = Math.min(Math.round(baseScore), 100);

    return {
        score: finalScore,
        fear: Math.min(fCount * 2, 100), // Scaled for UI bars
        urgency: Math.min(uCount * 2, 100),
        authority: Math.min(aCount * 2, 100),
        reward: Math.min(rCount * 2, 100)
    };
}

module.exports = { analyzeEmotion };
