const intents = {
    credentialHarvesting: ['verify your account', 'update login', 'confirm password', 'reset password', 'verify identity', 'login to continue', 'security alert', 'unusual activity'],
    financialExtraction: ['unpaid invoice', 'tax refund due', 'wire transfer', 'payment required', 'send funds', 'account past due', 'billing error', 'subscription expired'],
    malwareDelivery: ['review attached document', 'download receipt', 'open attachment', 'install update', 'attached file', 'document shared']
};

function classifyIntent(text) {
    if (!text) return { intent: "None Detected", flags: [] };

    const lowerText = text.toLowerCase();
    let detectedIntent = "None Detected";
    let flags = [];

    // Check Credential Harvesting (Highest Risk)
    if (intents.credentialHarvesting.some(phrase => lowerText.includes(phrase))) {
        detectedIntent = "Credential Harvesting";
        flags.push("[Auth Bypass Attempt]");
    }
    // Check Financial Extraction
    else if (intents.financialExtraction.some(phrase => lowerText.includes(phrase))) {
        detectedIntent = "Financial Extraction";
        flags.push("[Financial Extraction Request]");
    }
    // Check Malware Delivery
    else if (intents.malwareDelivery.some(phrase => lowerText.includes(phrase))) {
        detectedIntent = "Malware Delivery";
        flags.push("[Suspicious Attachment/Link Hook]");
    }

    return {
        intent: detectedIntent,
        flags: flags
    };
}

module.exports = { classifyIntent };
