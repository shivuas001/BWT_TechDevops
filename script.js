document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ Saenix AI: System Initialized');

    // Elements
    const landingPage = document.getElementById('landing-page');
    const appDashboard = document.getElementById('app-dashboard');
    const enterAppBtn = document.getElementById('enter-app-btn');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Navigation: Landing to Dashboard
    if (enterAppBtn) {
        enterAppBtn.addEventListener('click', () => {
            localStorage.setItem('saenix_entered', 'true');
            landingPage.style.opacity = '0';
            setTimeout(() => {
                landingPage.classList.add('hidden');
                appDashboard.classList.remove('hidden');
                appDashboard.style.opacity = '0';

                // Slight fade in for dashboard
                requestAnimationFrame(() => {
                    appDashboard.style.transition = 'opacity 0.4s ease-out';
                    appDashboard.style.opacity = '1';
                });
            }, 300);
        });
    }

    if (localStorage.getItem('saenix_entered') === 'true') {
        if (landingPage) landingPage.classList.add('hidden');
        if (appDashboard) {
            appDashboard.classList.remove('hidden');
            appDashboard.style.opacity = '1';
        }
    }

    // Sidebar Navigation Logic
    const viewDashboard = document.querySelector('.scan-panel');
    const riskPanel = document.querySelector('.risk-panel');
    const viewHistory = document.getElementById('view-history');
    const viewAnalytics = document.getElementById('view-analytics');
    const viewGenome = document.getElementById('view-genome');
    const viewSettings = document.getElementById('view-settings');

    function hideAllPanels() {
        if (viewDashboard) viewDashboard.classList.add('hidden');
        if (riskPanel) riskPanel.classList.add('hidden');
        if (viewHistory) viewHistory.classList.add('hidden');
        if (viewAnalytics) viewAnalytics.classList.add('hidden');
        if (viewGenome) viewGenome.classList.add('hidden');
        if (viewSettings) viewSettings.classList.add('hidden');
        const viewGraph = document.getElementById('view-graph');
        if (viewGraph) viewGraph.classList.add('hidden');
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            if (typeof navLinks !== 'undefined') {
                navLinks.forEach(l => l.classList.remove('active')); // clear top nav
            }
            item.classList.add('active');

            const selectedText = item.innerText.trim().toLowerCase();
            hideAllPanels();
            localStorage.setItem('saenix_active_view', selectedText);

            if (selectedText.includes('new scan')) {
                if (viewDashboard) viewDashboard.classList.remove('hidden');
                if (riskPanel) riskPanel.classList.remove('hidden');
            } else if (selectedText.includes('history')) {
                if (viewHistory) viewHistory.classList.remove('hidden');
            } else if (selectedText.includes('graph intel')) {
                const viewGraph = document.getElementById('view-graph');
                if (viewGraph) viewGraph.classList.remove('hidden');
            } else if (selectedText.includes('analytics')) {
                if (viewAnalytics) viewAnalytics.classList.remove('hidden');
            } else if (selectedText.includes('settings')) {
                if (viewSettings) viewSettings.classList.remove('hidden');
            }
        });
    });

    const lastView = localStorage.getItem('saenix_active_view');
    if (lastView) {
        sidebarItems.forEach(item => {
            if (item.innerText.trim().toLowerCase() === lastView) {
                if (landingPage) landingPage.classList.add('hidden');
                if (appDashboard) {
                    appDashboard.classList.remove('hidden');
                    appDashboard.style.opacity = '1';
                }
                item.click();
            }
        });
    }

    // Top Nav Logic (Mobile Menu Toggle)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active-mobile');
            // Basic inline toggle for demo purposes
            if (sidebar.style.display === 'none' || sidebar.style.display === '') {
                sidebar.style.display = 'flex';
                sidebar.style.position = 'absolute';
                sidebar.style.zIndex = '100';
                sidebar.style.height = '100%';
                sidebar.style.background = 'var(--bg-panel)';
            } else {
                sidebar.style.display = '';
                sidebar.style.position = '';
            }
        });
    }

    // Phase 1C: Input Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const inputAreas = document.querySelectorAll('.input-area');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            inputAreas.forEach(a => {
                a.classList.remove('active');
                a.style.display = 'none';
            });

            btn.classList.add('active');
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            if (target) {
                target.classList.add('active');
                target.style.display = 'block';
            }
        });
    });

    // Phase 1D-3: Animation and Real Data Binding
    const analyzeBtn = document.getElementById('analyze-btn');
    const analyzeText = analyzeBtn?.querySelector('.btn-text');
    const analyzeIcon = analyzeBtn?.querySelector('.btn-icon');

    // UI Elements
    const aiCore = document.getElementById('ai-core');
    const coreCenter = aiCore?.querySelector('.core-center');
    const modules = {
        emotion: document.getElementById('mod-emotion'),
        intent: document.getElementById('mod-intent'),
        domain: document.getElementById('mod-domain'),
        deepfake: document.getElementById('mod-deepfake')
    };

    // Risk Elements
    const gaugeFill = document.getElementById('gauge-fill');
    const gaugeScore = document.getElementById('gauge-score');
    const threatBadge = document.getElementById('threat-badge');
    const genomeList = document.getElementById('genome-list');
    const aiSummaryText = document.getElementById('ai-summary-text');

    function animateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            // Get data
            const textContent = document.getElementById('scan-text')?.value || "";
            const urlContent = document.getElementById('scan-url')?.value || "";
            let activeTab = 'text';
            tabBtns.forEach(b => { if (b.classList.contains('active')) activeTab = b.dataset.tab; });

            // 1. Loading State
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('btn-loading');
            if (analyzeText) analyzeText.innerText = 'Analyzing Intent...';
            if (analyzeIcon) analyzeIcon.innerText = '↻';

            // 2. AI Core Pulse
            if (aiCore) aiCore.classList.add('analyzing');
            if (coreCenter) {
                coreCenter.innerText = 'SCANNING';
                coreCenter.style.color = 'var(--text-secondary)';
            }

            // Reset old data
            if (gaugeFill) gaugeFill.style.background = 'conic-gradient(var(--bg-hover) 0%, transparent 0%)';
            if (gaugeScore) gaugeScore.innerText = '0';
            if (threatBadge) {
                threatBadge.className = 'threat-badge safe';
                threatBadge.innerText = 'ANALYZING...';
            }
            if (genomeList) genomeList.innerHTML = '';

            // Reset Modules
            Object.values(modules).forEach(mod => {
                if (mod) {
                    mod.classList.remove('active');
                    const statusEl = mod.querySelector('.mod-status');
                    if (statusEl) {
                        statusEl.innerText = 'Analyzing...';
                        statusEl.style.color = 'var(--text-secondary)';
                    }
                }
            });

            // 3. Sequential Module Activation (UI simulation while fetching)
            const sequence = [
                { mod: modules.emotion, text: 'Extracting Sentiments...', time: 400 },
                { mod: modules.intent, text: 'Mapping Intent...', time: 1000 },
                { mod: modules.domain, text: 'Checking Reputation...', time: 1600 },
                { mod: modules.deepfake, text: 'Bypassed', time: 2200 }
            ];

            sequence.forEach(step => {
                setTimeout(() => {
                    if (step.mod) {
                        step.mod.classList.add('active');
                        const statusEl = step.mod.querySelector('.mod-status');
                        if (statusEl) statusEl.innerText = step.text;
                    }
                }, step.time);
            });

            try {
                // Fetch to real backend
                const response = await fetch('http://localhost:5000/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: activeTab, text: textContent, url: urlContent })
                });

                const result = await response.json();

                if (result.success) {
                    const data = result.data;

                    // 4. Reveal Results
                    setTimeout(() => {
                        // Restore Button
                        analyzeBtn.disabled = false;
                        analyzeBtn.classList.remove('btn-loading');
                        if (analyzeText) analyzeText.innerText = 'Analyze Threat Intent';
                        if (analyzeIcon) analyzeIcon.innerText = '⚡';

                        // Core Stop
                        if (aiCore) aiCore.classList.remove('analyzing');
                        if (coreCenter) {
                            coreCenter.innerText = 'LOCKED';
                            coreCenter.style.color = data.threatLevel === 'Safe' ? 'var(--risk-low)' : 'var(--risk-high)';
                        }

                        // Update Modules Stat
                        if (modules.emotion) {
                            const statusEl = modules.emotion.querySelector('.mod-status');
                            if (statusEl) {
                                statusEl.innerText = `Score: ${data.emotionalIndex.score}`;
                                statusEl.style.color = data.emotionalIndex.score > 50 ? 'var(--risk-high)' : 'var(--risk-low)';
                            }
                        }
                        if (modules.intent) {
                            const statusEl = modules.intent.querySelector('.mod-status');
                            if (statusEl) {
                                statusEl.innerText = data.intent;
                                statusEl.style.color = data.intent !== 'None Detected' ? 'var(--risk-high)' : 'var(--risk-low)';
                            }
                        }
                        if (modules.domain) {
                            const statusEl = modules.domain.querySelector('.mod-status');
                            if (statusEl) {
                                statusEl.innerText = data.flags.some(f => f.includes('Suspicious')) ? 'Flagged URL' : 'Analyzed';
                                statusEl.style.color = data.flags.length > 0 ? 'var(--risk-med)' : 'var(--text-secondary)';
                            }
                        }
                        if (modules.deepfake) {
                            modules.deepfake.classList.remove('active');
                            const statusEl = modules.deepfake.querySelector('.mod-status');
                            if (statusEl) statusEl.innerText = 'N/A';
                        }

                        // Risk Gauge
                        if (gaugeScore) animateValue(gaugeScore, 0, data.riskScore, 1000);
                        const gaugeColor = data.riskScore >= 61 ? 'var(--risk-high)' : (data.riskScore > 30 ? 'var(--risk-med)' : 'var(--risk-low)');
                        if (gaugeFill) gaugeFill.style.background = `conic-gradient(${gaugeColor} ${data.riskScore}%, transparent 0%)`;

                        // Threat Badge
                        if (threatBadge) {
                            const badgeClass = data.riskScore >= 61 ? 'danger' : (data.riskScore > 30 ? 'warning' : 'safe');
                            threatBadge.className = `threat-badge ${badgeClass}`;
                            threatBadge.innerText = data.threatLevel.toUpperCase();
                        }

                        // Emotional Bars
                        const barFear = document.getElementById('bar-fear');
                        if (barFear) barFear.style.width = data.emotionalIndex.fear + '%';
                        const barUrgency = document.getElementById('bar-urgency');
                        if (barUrgency) barUrgency.style.width = data.emotionalIndex.urgency + '%';
                        const barAuth = document.getElementById('bar-authority');
                        if (barAuth) barAuth.style.width = data.emotionalIndex.authority + '%';
                        const barReward = document.getElementById('bar-reward');
                        if (barReward) barReward.style.width = data.emotionalIndex.reward + '%';

                        // Genome
                        if (genomeList) {
                            if (data.genome && data.genome.length > 0) {
                                data.genome.forEach(item => {
                                    const badge = document.createElement('div');
                                    badge.className = 'genome-item danger';
                                    badge.innerText = item;
                                    genomeList.appendChild(badge);
                                });
                            } else {
                                genomeList.innerHTML = '<div class="genome-item neutral">No anomalies detected.</div>';
                            }
                        }

                        // Summary
                        if (aiSummaryText) aiSummaryText.innerText = data.aiSummary;

                        // Refresh history and analytics in background
                        loadHistory();
                        loadAnalytics();

                    }, 3000);
                }
            } catch (err) {
                console.error("Scan failed", err);
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('btn-loading');
                if (aiCore) aiCore.classList.remove('analyzing');
            }
        });
    }

    // Load History
    async function loadHistory() {
        try {
            const res = await fetch('http://localhost:5000/history');
            const result = await res.json();
            const tbody = document.getElementById('history-tbody');
            if (tbody && result.success) {
                tbody.innerHTML = '';
                result.data.forEach(scan => {
                    const date = new Date(scan.createdAt).toLocaleString();
                    const targetText = scan.inputType === 'url' ? scan.inputURL : scan.inputText;
                    const target = targetText ? targetText.substring(0, 40) + (targetText.length > 40 ? '...' : '') : 'Scan Context';
                    const badgeClass = scan.riskScore >= 61 ? 'danger' : (scan.riskScore > 30 ? 'warning' : 'safe');
                    const color = scan.riskScore >= 61 ? 'var(--risk-high)' : (scan.riskScore > 30 ? 'var(--risk-med)' : 'var(--risk-low)');

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${date}</td>
                        <td>${target}</td>
                        <td>${scan.intent}</td>
                        <td><span style="color: ${color}; font-weight: bold;">${scan.riskScore}</span></td>
                        <td><span class="threat-badge ${badgeClass}" style="padding: 4px 8px; font-size: 0.75rem;">${scan.threatLevel.toUpperCase()}</span></td>
                        <td><button class="tab-btn view-details-btn" style="padding: 4px 8px; font-size: 0.75rem;">Details</button></td>
                    `;

                    // Bind click event for Details button
                    const detailsBtn = tr.querySelector('.view-details-btn');
                    detailsBtn.addEventListener('click', () => {
                        loadScanDetailsIntoDashboard(scan);
                    });

                    tbody.appendChild(tr);
                });
            }
        } catch (e) {
            console.error('History API error:', e);
        }
    }

    // Populate and Show Details Modal
    function loadScanDetailsIntoDashboard(scan) {
        const modal = document.getElementById('details-modal');
        if (!modal) return;

        // Populate Payload
        const payloadBox = document.getElementById('modal-payload');
        const targetText = scan.inputType === 'url' ? scan.inputURL : scan.inputText;
        payloadBox.innerText = targetText || "No payload provided.";

        // Populate Risk Score & Badge
        const scoreElement = document.getElementById('modal-score');
        const badgeElement = document.getElementById('modal-badge');

        scoreElement.innerText = scan.riskScore;

        let color = 'var(--risk-low)';
        if (scan.riskScore > 30) color = 'var(--risk-med)';
        if (scan.riskScore > 60) color = 'var(--risk-high)';
        scoreElement.style.color = color;

        badgeElement.innerText = scan.threatLevel.toUpperCase();
        badgeElement.className = 'threat-badge';
        if (scan.threatLevel === 'High Risk') badgeElement.classList.add('danger');
        else if (scan.threatLevel === 'Suspicious') badgeElement.classList.add('warning');
        else badgeElement.classList.add('safe');

        // Populate Intent
        document.getElementById('modal-intent').innerText = scan.intent;

        // Populate Summary
        const summaryElement = document.getElementById('modal-summary');
        summaryElement.innerText = scan.aiSummary || "No detailed summary available.";

        // Populate Genome
        const genomeList = document.getElementById('modal-genome');
        genomeList.innerHTML = '';
        if (scan.genome && scan.genome.length > 0) {
            scan.genome.forEach(item => {
                const badge = document.createElement('div');
                badge.className = 'genome-item danger';
                badge.innerText = item;
                genomeList.appendChild(badge);
            });
        } else {
            genomeList.innerHTML = '<div class="genome-item neutral">No anomalies detected.</div>';
        }

        // Show Modal
        modal.classList.remove('hidden');
    }

    // Modal Close Logic
    const modal = document.getElementById('details-modal');
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    async function loadAnalytics() {
        try {
            const res = await fetch('http://localhost:5000/analytics');
            const result = await res.json();
            if (result.success) {
                const stats = document.querySelectorAll('.stat-value');
                if (stats.length >= 3) {
                    stats[0].innerText = result.data.totalScans || 0;
                    stats[1].innerText = result.data.criticalThreats || 0;
                    stats[2].innerText = result.data.topVector || 'None Detected';
                }
            }
        } catch (e) {
            console.error('Analytics API error:', e);
        }
    }

    // Initial Load - Fetch db entries if MongoDB is available
    setTimeout(() => {
        try {
            loadHistory();
            loadAnalytics();
        } catch (e) { }
    }, 1000);

    // PHASE 2: Graph Intelligence Implementation
    const graphAnalyzeBtn = document.getElementById('graph-analyze-btn');
    const cyContainer = document.getElementById('cy');

    if (graphAnalyzeBtn) {
        graphAnalyzeBtn.addEventListener('click', async () => {
            console.log("Graph Analyze Button Clicked!");
            let textInput = document.getElementById('graph-scan-text')?.value || "Hello";

            // Reset Pipeline Visuals
            for (let i = 1; i <= 6; i++) {
                const step = document.getElementById(`pipe-${i}`);
                if (step) {
                    step.classList.remove('active', 'done');
                }
            }

            // Clear prior graph
            if (window.cyInstance && typeof window.cyInstance.destroy === 'function') {
                window.cyInstance.destroy();
                window.cyInstance = null;
            }

            document.getElementById('graph-risk-score').innerText = '0';
            document.getElementById('graph-fraud-type').innerText = 'Analyzing...';
            document.getElementById('graph-entities').innerHTML = 'Extracting...';

            const btnText = graphAnalyzeBtn.querySelector('.btn-text');
            if (btnText) btnText.innerText = "Analyzing Topology...";
            graphAnalyzeBtn.disabled = true;

            try {
                // Simulate Pipeline Animation sequentially
                const animatePipeline = async (stepId, ms) => {
                    const step = document.getElementById(`pipe-${stepId}`);
                    if (step) step.classList.add('active');
                    await new Promise(r => setTimeout(r, ms));
                    if (step) {
                        step.classList.remove('active');
                        step.classList.add('done');
                    }
                };

                await animatePipeline(1, 400); // Processing
                await animatePipeline(2, 500); // Entities
                await animatePipeline(3, 400); // Pattern

                // Fetch real backend graph data concurrently
                const res = await fetch('http://localhost:5000/api/analyze-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: textInput })
                });

                if (!res.ok) throw new Error("Graph API Failed");
                const data = await res.json();

                await animatePipeline(4, 600); // Graph Build

                // Initialize Cytoscape
                if (cyContainer && typeof cytoscape !== 'undefined') {
                    const cyElements = [
                        ...data.graph.nodes.map(n => ({ data: n.data })),
                        ...data.graph.edges.map(e => ({ data: e.data }))
                    ];

                    window.cyInstance = cytoscape({
                        container: cyContainer,
                        elements: cyElements,
                        style: [
                            {
                                selector: 'node',
                                style: {
                                    'background-color': '#475569',
                                    'label': 'data(label)',
                                    'color': '#fff',
                                    'text-valign': 'center',
                                    'text-halign': 'center',
                                    'font-size': '10px',
                                    'width': '60px',
                                    'height': '60px',
                                    'border-width': 2,
                                    'border-color': '#1e293b'
                                }
                            },
                            {
                                selector: 'node[type="message"]',
                                style: { 'background-color': '#10b981', 'width': '80px', 'height': '80px', 'font-size': '12px', 'font-weight': 'bold' }
                            },
                            {
                                selector: 'node[type="bank"]',
                                style: { 'background-color': '#3b82f6', 'width': '70px', 'height': '70px' }
                            },
                            {
                                selector: 'node[type="domain"]',
                                style: { 'background-color': '#ef4444', 'shape': 'hexagon', 'width': '80px', 'height': '80px' }
                            },
                            {
                                selector: 'node[type="keyword"]',
                                style: { 'background-color': '#eab308', 'width': '65px', 'height': '65px' }
                            },
                            {
                                selector: 'node[type="sender"]',
                                style: { 'background-color': '#8b5cf6', 'shape': 'diamond', 'width': '80px', 'height': '80px' }
                            },
                            {
                                selector: 'node[type="phone"]',
                                style: { 'background-color': '#0ea5e9', 'width': '70px', 'height': '70px' }
                            },
                            {
                                selector: 'node[type="threat"]',
                                style: { 'background-color': '#b91c1c', 'shape': 'star', 'width': '90px', 'height': '90px', 'font-size': '11px', 'font-weight': 'bold', 'color': '#fca5a5' }
                            },
                            {
                                selector: 'edge',
                                style: {
                                    'width': 2,
                                    'line-color': '#64748b',
                                    'target-arrow-color': '#64748b',
                                    'target-arrow-shape': 'triangle',
                                    'curve-style': 'bezier',
                                    'label': 'data(label)',
                                    'font-size': '10px',
                                    'color': '#94a3b8',
                                    'text-rotation': 'autorotate',
                                    'text-margin-y': -10
                                }
                            },
                            {
                                selector: 'edge[type="impersonates"]',
                                style: { 'line-color': '#ef4444', 'target-arrow-color': '#ef4444', 'width': 3, 'line-style': 'dashed' }
                            },
                            {
                                selector: 'edge[type="contains"]',
                                style: { 'line-color': '#3b82f6', 'target-arrow-color': '#3b82f6' }
                            }
                        ],
                        layout: {
                            name: 'circle',
                            padding: 30
                        }
                    });
                } else {
                    console.error("Cytoscape container or library missing!");
                }

                await animatePipeline(5, 500); // Graph Intel

                // Populate UI from response
                document.getElementById('graph-risk-score').innerText = data.risk_score;

                let color = 'var(--risk-low)';
                if (data.risk_score >= 30) color = 'var(--risk-med)';
                if (data.risk_score >= 60) color = 'var(--risk-high)';
                document.getElementById('graph-risk-score').style.color = color;

                document.getElementById('graph-fraud-type').innerText = data.fraud_type;

                const entitiesText =
                    `<strong>🏦 Banks:</strong> ${data.entities.banks}<br>` +
                    `<strong>🔗 Domains:</strong> ${data.entities.domains}<br>` +
                    `<strong>📧 Emails:</strong> ${data.entities.emails}<br>` +
                    `<strong>📞 Phones:</strong> ${data.entities.phones || 'None Detected'}<br>` +
                    `<strong>⚠️ Keywords:</strong> ${data.entities.keywords && data.entities.keywords.length > 0 ? data.entities.keywords.join(", ") : "None Detected"}`;
                document.getElementById('graph-entities').innerHTML = entitiesText;

                // Show AI Reasoning Card
                const aiCard = document.getElementById('ai-reasoning-card');
                const aiText = document.getElementById('ai-reasoning-text');
                const aiBadge = document.getElementById('ai-confidence-badge');
                if (aiCard && data.ai_reasoning) {
                    aiText.innerText = data.ai_reasoning;
                    aiBadge.innerText = data.ai_confidence || 'Medium';
                    const badgeColors = { 'High': '#10b981', 'Medium': '#eab308', 'Low': '#94a3b8' };
                    aiBadge.style.background = `${badgeColors[data.ai_confidence] || '#8b5cf6'}33`;
                    aiBadge.style.color = badgeColors[data.ai_confidence] || '#c4b5fd';
                    aiCard.style.display = 'block';
                }

                // Show Suspicious Indicators
                const indicatorsCard = document.getElementById('ai-indicators-card');
                const indicatorsList = document.getElementById('ai-indicators-list');
                if (indicatorsCard && data.suspicious_indicators && data.suspicious_indicators.length > 0) {
                    indicatorsList.innerHTML = data.suspicious_indicators.map(indicator =>
                        `<li style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem;">🚩 ${indicator}</li>`
                    ).join('');
                    indicatorsCard.style.display = 'block';
                }

                await animatePipeline(6, 300); // Scoring

            } catch (err) {
                console.error("Graph Intel Error:", err);
                alert("Failed to analyze topology. Make sure node server is running.");
            } finally {
                if (btnText) btnText.innerText = "Construct Intelligence Graph";
                graphAnalyzeBtn.disabled = false;
            }
        });
    }
});
