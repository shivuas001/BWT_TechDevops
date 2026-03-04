function aggregateRisk(emotionMap, intentMap, domainMap) {
    // Math from algorithm.md:
    // Total Risk = (Emotion * 0.35) + (Intent * 0.35) + (Domain * 0.20) + (Deepfake * 0.10)

    let intentBaseScore = 0;
    if (intentMap.intent === "Credential Harvesting") intentBaseScore = 80;
    else if (intentMap.intent === "Financial Extraction") intentBaseScore = 75;
    else if (intentMap.intent === "Malware Delivery") intentBaseScore = 70;

    // Deepfake is 0 for this phase
    let baseRisk = (emotionMap.score * 0.35) + (intentBaseScore * 0.35) + (domainMap.score * 0.20) + (0 * 0.10);

    // Aggravator Multiplier
    if (emotionMap.score > 75 && domainMap.score > 50) {
        baseRisk = baseRisk * 1.25;
    }

    const finalRisk = Math.min(Math.round(baseRisk), 100);

    // Determine Threat Level
    let threatLevel = "Safe";
    if (finalRisk > 60) threatLevel = "High Risk";
    else if (finalRisk > 30) threatLevel = "Suspicious";

    // Generate AI Summary
    let summary = `Analysis complete. `;
    if (finalRisk > 60) {
        summary += `CRITICAL THREAT DETECTED. The communication utilizes extreme psychological pressure (${emotionMap.score}/100 emotion score) combined with obfuscated technical routing to initiate a ${intentMap.intent} attack.`;
    } else if (finalRisk > 30) {
        summary += `SUSPICIOUS CONTENT. Moderate manipulation tactics detected. Ensure domain authenticity before proceeding with any ${intentMap.intent} requests.`;
    } else {
        summary += `Routine communication structure. No significant psychological manipulation or malicious routing detected at this time.`;
    }

    // Build Threat Genome (Tags)
    let genome = [];
    if (emotionMap.urgency > 80) genome.push("[Hyper-Urgency Trigger]");
    else if (emotionMap.urgency > 40) genome.push("[Elevated Urgency]");

    if (emotionMap.fear > 70) genome.push("[Fear/Anxiety Catalyst]");
    if (emotionMap.authority > 60) genome.push("[Authority Impersonation]");
    if (emotionMap.reward > 70) genome.push("[Financial Greed Hook]");

    // Add domain & intent flags to genome
    genome = [...genome, ...intentMap.flags, ...domainMap.flags];

    // Ensure we don't return an empty genome for Safe
    if (genome.length === 0) {
        genome.push("[Baseline Communication]");
    }

    return {
        riskScore: finalRisk,
        threatLevel,
        confidence: finalRisk > 50 ? 92 : 85, // Static confidence for demo
        aiSummary: summary,
        genome: genome
    };
}

module.exports = { aggregateRisk };
