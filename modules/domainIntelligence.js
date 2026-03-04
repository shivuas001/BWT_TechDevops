const suspiciousTLDs = ['.xyz', '.top', '.online', '.click', '.info', '.biz', '.cc', '.su'];

function analyzeDomain(urlStr) {
    if (!urlStr) return { score: 0, flags: [] };

    let score = 0;
    let flags = [];
    let parsedUrl;

    try {
        // Add protocol if missing for parsing
        if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
            urlStr = 'http://' + urlStr;
        }
        parsedUrl = new URL(urlStr);
    } catch (e) {
        return { score: 10, flags: ['Invalid URL format'] };
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // 1. IP Address Check
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(hostname)) {
        score += 50;
        flags.push('[Obfuscated Origin] IP Routing');
    }

    // 2. Suspicious TLD Check
    if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
        score += 40;
        flags.push(`[Suspicious TLD: ${hostname.split('.').pop()}]`);
    }

    // 3. Excessive Subdomains
    const parts = hostname.split('.');
    if (parts.length > 3 && !ipRegex.test(hostname)) { // more than sub.domain.com
        score += 30;
        flags.push('[High Subdomain Entropy]');
    }

    // 4. Lookalike / Typosquatting (simplified heuristic: contains brand names)
    const brands = ['paypal', 'google', 'microsoft', 'apple', 'amazon', 'netflix', 'bank'];
    if (brands.some(b => hostname.includes(b)) && !brands.some(b => hostname === `${b}.com`)) {
        score += 60;
        flags.push('[Brand Impersonation Typosquatting]');
    }

    return {
        score: Math.min(score, 100),
        flags
    };
}

module.exports = { analyzeDomain };
