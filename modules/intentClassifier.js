/**
 * Saenix AI: Intent Classification Engine
 * Categorizes the core objective of the attacker.
 */

const intents = {
    CREDENTIAL_HARVESTING: [/login/i, /password/i, /verify/i, /account/i],
    FINANCIAL_EXTRACTION: [/payment/i, /bank/i, /transfer/i, /invoice/i],
    MALWARE_DISTRIBUTION: [/download/i, /attachment/i, /update/i]
};

function classifyIntent(text) {
    for (const [intent, patterns] of Object.entries(intents)) {
        if (patterns.some(p => p.test(text))) return intent;
    }
    return "UNKNOWN_NEUTRAL";
}

module.exports = { classifyIntent };
