/**
 * Module 1 & 2: Message Processing and Entity Extraction Engine
 * Parses raw text messages, normalizes them, and extracts key entities
 * like Banks, Domains, Emails, and Keywords (Urgency, Security, OTP).
 */

const KNOWN_BANKS = ['sbi', 'hdfc', 'icici', 'axis', 'paypal'];
const URGENCY_KEYWORDS = ['urgent', 'immediately', 'verify now', 'act now', 'penalty'];
const SECURITY_KEYWORDS = ['blocked', 'suspended', 'locked', 'security alert', 'compromised'];
const OTP_KEYWORDS = ['otp', 'verification code'];

function processMessage(message) {
    if (!message) return { text: '', tokens: [] };

    // Step 1: Normalization (lowercase, remove punctuation, normalize spacing)
    const normalized = message.toLowerCase()
        .replace(/[^\w\s:/\.-]/gi, ' ') // Keep basic URLs chars, remove other punctuation
        .replace(/\s+/g, ' ')
        .trim();

    // Step 2: Tokenization
    const tokens = normalized.split(' ');

    return {
        normalized,
        tokens
    };
}

function extractEntities(normalizedMessage, tokens) {
    const entities = {
        banks: [],
        domains: [],
        emails: [],
        keywords: []
    };

    // 1. Extract Banks (Token Matching)
    tokens.forEach(token => {
        if (KNOWN_BANKS.includes(token)) {
            if (!entities.banks.includes(token.toUpperCase())) {
                entities.banks.push(token.toUpperCase());
            }
        }
    });

    // 2. Extract Domains (Regex)
    const domainRegex = /https?:\/\/[^\s]+/g;
    const domainsFound = normalizedMessage.match(domainRegex);
    if (domainsFound) {
        // Simple extraction to just get the domain/URL string
        entities.domains = [...new Set(domainsFound)];
    }

    // 3. Extract Emails (Regex)
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g;
    const emailsFound = normalizedMessage.match(emailRegex);
    if (emailsFound) {
        entities.emails = [...new Set(emailsFound)];
    }

    // 4. Extract Phones (Regex)
    const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const phonesFound = normalizedMessage.match(phoneRegex);
    if (phonesFound) {
        entities.phones = [...new Set(phonesFound)];
    } else {
        entities.phones = [];
    }

    // 5. Extract Keywords (Substring matching for phrases)
    URGENCY_KEYWORDS.forEach(kw => {
        if (normalizedMessage.includes(kw)) entities.keywords.push({ phrase: kw, type: 'urgency' });
    });

    SECURITY_KEYWORDS.forEach(kw => {
        if (normalizedMessage.includes(kw)) entities.keywords.push({ phrase: kw, type: 'security' });
    });

    OTP_KEYWORDS.forEach(kw => {
        if (normalizedMessage.includes(kw)) entities.keywords.push({ phrase: kw, type: 'otp' });
    });

    return entities;
}

/**
 * Module 3: Fraud Pattern Detection
 * Identifies scam types based on extracted entities
 */
function detectFraudPattern(normalizedMessage, entities) {
    let fraudType = "None Detected";
    let patternScore = 0;

    const hasBank = entities.banks && entities.banks.length > 0;
    const hasDomain = entities.domains && entities.domains.length > 0;
    const hasPhone = entities.phones && entities.phones.length > 0;
    const hasVerifyKeyword = entities.keywords && entities.keywords.some(kw => kw.phrase === 'verify now' || kw.phrase.includes('verify'));
    const hasUrgency = entities.keywords && entities.keywords.some(kw => kw.type === 'urgency');
    const hasOTPKeyword = entities.keywords && entities.keywords.some(kw => kw.type === 'otp');
    const hasSecurityKeyword = entities.keywords && entities.keywords.some(kw => kw.type === 'security');
    const hasCredentials = normalizedMessage.includes('credentials') || normalizedMessage.includes('account');

    // 1. Bank Phishing
    if (hasBank && hasDomain && (hasVerifyKeyword || normalizedMessage.includes('verify'))) {
        fraudType = "Bank Phishing";
        patternScore = 90;
    }
    // 2. OTP Theft
    else if (hasOTPKeyword && normalizedMessage.includes('send')) {
        fraudType = "OTP Scam";
        patternScore = 85;
    }
    // 3. Payment Scam
    else if (normalizedMessage.includes('payment') && hasUrgency) {
        fraudType = "Payment Scam";
        patternScore = 80;
    }
    // 4. Smishing (SMS Phishing)
    else if (hasPhone && hasUrgency && hasDomain) {
        fraudType = "Smishing Campaign";
        patternScore = 85;
    }
    // 5. Account Takeover / Corporate Phishing
    else if (hasSecurityKeyword && hasUrgency && (hasVerifyKeyword || hasCredentials || normalizedMessage.includes('verify'))) {
        fraudType = "Account Takeover Scam";
        patternScore = 88;
    }

    return { fraudType, patternScore };
}

/**
 * Module 4 & 5: Graph Construction Engine & Graph Intelligence
 * Builds the Node/Edge relationship graph and analyzes it for risk
 */
const SUSPICIOUS_TLDS = ['.xyz', '.ru', '.top', '.tk', '.click'];

function buildAndAnalyzeGraph(normalizedMessage, entities) {
    const nodes = [];
    const edges = [];
    let graphRisk = 0;

    // Base Node
    nodes.push({ data: { id: 'message', label: 'PAYLOAD', type: 'message' } });

    // Ensure entities exist to prevent crashes
    entities.banks = entities.banks || [];
    entities.domains = entities.domains || [];
    entities.emails = entities.emails || [];
    entities.phones = entities.phones || [];
    entities.keywords = entities.keywords || [];

    // Origin Node (Sender Simulation)
    let originLabel = "Unknown Origin";
    if (entities.emails.length > 0) originLabel = "Email Source";
    else if (entities.phones.length > 0) originLabel = "Telecom Gateway";
    else if (entities.domains.length > 0) originLabel = "Web Gateway";

    nodes.push({ data: { id: 'origin', label: originLabel, type: 'sender' } });
    edges.push({ data: { id: 'e_origin_msg', source: 'origin', target: 'message', label: 'transmitted', type: 'transmitted' } });

    // Banks
    let bankNodeId = null;
    entities.banks.forEach((bank, idx) => {
        const id = `bank_${idx}`;
        bankNodeId = id; // Store for impersonation check
        nodes.push({ data: { id, label: bank, type: 'bank' } });
        edges.push({ data: { id: `e_msg_${id}`, source: 'message', target: id, label: 'mentions brand', type: 'mentions' } });
    });

    // Domains
    entities.domains.forEach((domainStr, idx) => {
        const id = `domain_${idx}`;
        nodes.push({ data: { id, label: domainStr, type: 'domain' } });
        edges.push({ data: { id: `e_msg_${id}`, source: 'message', target: id, label: 'contains link', type: 'contains' } });

        // Intelligence: Brand Impersonation Check (+40 Risk)
        if (entities.banks.length > 0) {
            const bankName = entities.banks[0].toLowerCase();
            if (domainStr.toLowerCase().includes(bankName) && !domainStr.toLowerCase().includes(`${bankName}.com`)) { // Simple heuristic
                edges.push({ data: { id: `e_imp_${id}`, source: id, target: bankNodeId, label: 'impersonates', type: 'impersonates' } });
                graphRisk += 40;
            }
        }

        // Intelligence: Suspicious TLD (+30 Risk)
        if (SUSPICIOUS_TLDS.some(tld => domainStr.toLowerCase().endsWith(tld))) {
            graphRisk += 30;
        }
    });

    // Emails
    entities.emails.forEach((emailStr, idx) => {
        const id = `email_${idx}`;
        nodes.push({ data: { id, label: emailStr, type: 'email' } });
        edges.push({ data: { id: `e_msg_${id}`, source: 'message', target: id, label: 'reply-to', type: 'contact' } });
    });

    // Phones
    entities.phones.forEach((phoneStr, idx) => {
        const id = `phone_${idx}`;
        nodes.push({ data: { id, label: phoneStr, type: 'phone' } });
        edges.push({ data: { id: `e_msg_${id}`, source: 'message', target: id, label: 'call request', type: 'contact' } });
    });

    // Keywords
    entities.keywords.forEach((kwObj, idx) => {
        const id = `keyword_${idx}`;
        nodes.push({ data: { id, label: kwObj.phrase.toUpperCase(), type: 'keyword' } });
        edges.push({ data: { id: `e_msg_${id}`, source: 'message', target: id, label: 'trigger phrase', type: 'contains' } });

        // Intelligence: Urgency Manipulation Check (+20 Risk)
        if (kwObj.type === 'urgency') {
            graphRisk += 20;
        }
    });

    // Always add a "Threat Vector" node if risk is detected so graph looks complete
    if (graphRisk > 20 || entities.domains.length > 0 || entities.phones.length > 0) {
        nodes.push({ data: { id: 'threat_vector', label: 'THREAT VECTOR', type: 'threat' } });
        edges.push({ data: { id: 'e_msg_threat', source: 'threat_vector', target: 'message', label: 'analyzed', type: 'contains' } });
    }

    return {
        graph: { nodes, edges },
        graphRisk
    };
}

/**
 * Module 6: Risk Scoring Engine
 * Combines signals to generate the final 0-100 risk score
 */
function calculateFinalRiskScore(patternScore, domainRiskScore, emotionScore, graphRisk) {
    // Formula: (0.35 * pattern_score) + (0.25 * domain_risk) + (0.20 * emotion_score) + (0.20 * graph_risk)
    const rawScore = (0.35 * patternScore) + (0.25 * domainRiskScore) + (0.20 * emotionScore) + (0.20 * graphRisk);

    // Cap at 100
    return Math.min(Math.round(rawScore), 100);
}

module.exports = {
    processMessage,
    extractEntities,
    detectFraudPattern,
    buildAndAnalyzeGraph,
    calculateFinalRiskScore
};
