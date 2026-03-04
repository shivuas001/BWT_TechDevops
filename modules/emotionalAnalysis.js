/**
 * Saenix AI: Emotional Manipulation Engine
 * Detects psychological pressure points: Fear, Urgency, Authority, Greed.
 */

const markers = {
    urgency: ['immediately', 'urgent', 'asap', 'within 24 hours', 'action required'],
    authority: ['official', 'security department', 'administrator', 'government'],
    fear: ['suspended', 'deleted', 'unauthorized', 'compromised', 'legal action'],
    greed: ['winner', 'congratulations', 'claim now', 'free', 'investment']
};

function analyzeEmotion(text) {
    const tokens = text.toLowerCase().split(' ');
    let score = 0;

    tokens.forEach(token => {
        if (markers.urgency.includes(token)) score += 25;
        if (markers.authority.includes(token)) score += 15;
        if (markers.fear.includes(token)) score += 30;
        if (markers.greed.includes(token)) score += 20;
    });

    return Math.min(score, 100);
}

module.exports = { analyzeEmotion };
