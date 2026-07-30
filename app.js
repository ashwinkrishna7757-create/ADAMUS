// ----------------------------------------------------
// Project ADAMUS - Redesigned SaaS Interactive Script
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------
    // 1. Pipeline Simulator Logic
    // ------------------------------------------------
    const pipelineButtons = document.querySelectorAll('.pipeline-btn');
    const consoleBody = document.getElementById('showcase-console');
    const consoleTitleLabel = document.getElementById('console-title-label');

    // Define simulation steps
    const simulationData = {
        'data-proc': {
            title: 'Conversion Funnels Terminal Logs',
            steps: [
                { text: '[system] Initializing funnel split-test router...', type: 'info' },
                { text: '[system] Connection handshake complete: CRM database active', type: 'info' },
                { text: '[ADAMUS] Request matching user target segment: \'High-Value Leads\'', type: 'hl' },
                { text: '[ADAMUS] Funnel path matched: Route /outreach/funnel-a', type: 'success' },
                { text: '[system] Conversion optimization: Funnel A selected (response time 420μs)', type: 'success' },
                { text: '[system] Dynamic tracking active. Funnel stats monitoring...', type: 'info' }
            ]
        },
        'ai-middleware': {
            title: 'AI Outreach Gateway Terminal Logs',
            steps: [
                { text: '[outbox] Intercepting outreach campaign target queue...', type: 'info' },
                { text: '[outbox] Rate limit validation: 148 posts/min within compliance limit', type: 'info' },
                { text: '[AI Engine] Generating personalized campaign copy drafts...', type: 'hl' },
                { text: '[AI Engine] Status 200: Outreach copy drafts compiled successfully', type: 'success' },
                { text: '[outbox] Posts dispatched to delivery agent (response time 1.2s)', type: 'success' },
                { text: '[gateway] Telemetry recorded. Campaign queue idle.', type: 'info' }
            ]
        },
        'api-sync': {
            title: 'Target Audience Sync Terminal Logs',
            steps: [
                { text: '[sync] Initiating secure audience list sync with Postgres...', type: 'info' },
                { text: '[sync] Identifying matching subscriber records for segment tags...', type: 'info' },
                { text: '[sync] Syncing 14 records from active_subscribers table...', type: 'hl' },
                { text: '[sync] Syncing 3 records from opt_out_list table...', type: 'hl' },
                { text: '[system] Synchronization complete: Contact list is up to date.', type: 'success' },
                { text: '[system] Next incremental sync scheduled in 60 seconds.', type: 'info' }
            ]
        }
    };

    let activeTimeoutIds = [];

    function runPipelineSimulation(pipelineKey) {
        // Clear all running timeouts
        activeTimeoutIds.forEach(id => clearTimeout(id));
        activeTimeoutIds = [];

        // Clear console log
        if (!consoleBody) return;
        consoleBody.innerHTML = '';

        const data = simulationData[pipelineKey];
        if (!data) return;

        // Update Title Label
        if (consoleTitleLabel) {
            consoleTitleLabel.textContent = data.title;
        }

        // Sequence steps execution
        let delayAccumulator = 0;

        data.steps.forEach((step, index) => {
            const timeoutId = setTimeout(() => {
                const line = document.createElement('div');
                line.className = `console-line ${step.type}`;
                line.innerHTML = step.text.replace(/\[system\]|\[ADAMUS\]|\[outbox\]|\[AI Engine\]|\[sync\]|\[gateway\]/g, (match) => {
                    return `<span class="hl">${match}</span>`;
                });
                consoleBody.appendChild(line);

                // Add loading bar for dynamic micro-animations
                if (index === 0 || index === 2) {
                    const progressWrapper = document.createElement('div');
                    progressWrapper.className = 'loading-bar-wrapper';
                    const progressFill = document.createElement('div');
                    progressFill.className = 'loading-bar-fill';
                    progressWrapper.appendChild(progressFill);
                    consoleBody.appendChild(progressWrapper);
                }

                // Autoscroll
                consoleBody.scrollTop = consoleBody.scrollHeight;
            }, delayAccumulator);

            activeTimeoutIds.push(timeoutId);
            delayAccumulator += (index === 0 || index === 2) ? 1400 : 700;
        });
    }

    // Add button click listeners
    pipelineButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pipelineButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const pipelineKey = btn.getAttribute('data-pipeline');
            runPipelineSimulation(pipelineKey);
        });
    });

    // Run first simulation on load
    runPipelineSimulation('data-proc');

    // ------------------------------------------------
    // 2. Interactive Pricing Calculator Logic
    // ------------------------------------------------
    const priceRange = document.getElementById('price-range');
    const calcRequestsLbl = document.getElementById('calc-requests-lbl');
    const planTierBadge = document.getElementById('plan-tier-badge');
    const calcPriceLbl = document.getElementById('calc-price-lbl');
    
    // Config configurator option cards
    const configCards = document.querySelectorAll('.config-card');
    
    // Feature list items
    const featBandwidth = document.getElementById('feat-bandwidth');
    const featNodes = document.getElementById('feat-nodes');
    const featSupport = document.getElementById('feat-support');

    function updatePricing() {
        if (!priceRange) return;

        const val = parseInt(priceRange.value);
        
        // Format number with commas
        const formattedRequests = val.toLocaleString();
        if (calcRequestsLbl) {
            calcRequestsLbl.textContent = `${formattedRequests} Posts`;
        }

        let tierName = 'Starter Plan';
        let bandwidth = 'Up to 500 Posts';
        let nodes = '1 active outreach campaign';
        let support = 'Standard customer support';

        // Update active selection of configurator cards based on slider values
        configCards.forEach(c => c.classList.remove('active'));

        if (val <= 150) {
            tierName = 'Starter Plan';
            bandwidth = 'Up to 500 Posts';
            nodes = '1 active outreach campaign';
            support = 'Standard customer support';
            const card = document.getElementById('tier-card-starter');
            if (card) card.classList.add('active');
        } else if (val > 150 && val <= 375) {
            tierName = 'Growth Plan';
            bandwidth = 'Up to 1,200 Posts';
            nodes = '5 active outreach campaigns';
            support = 'Standard email support';
            const card = document.getElementById('tier-card-growth');
            if (card) card.classList.add('active');
        } else {
            tierName = 'Scale Plan';
            bandwidth = 'Up to 5,000 Posts';
            nodes = 'Unlimited active campaigns';
            support = '24/7 dedicated account manager';
            const card = document.getElementById('tier-card-scale');
            if (card) card.classList.add('active');
        }

        const cost = Math.round((val / 150) * 9999);
        const formattedCost = cost.toLocaleString('en-IN');

        // Update pricing view content
        if (planTierBadge) planTierBadge.textContent = tierName;
        if (calcPriceLbl) calcPriceLbl.textContent = formattedCost;
        if (featBandwidth) featBandwidth.textContent = bandwidth;
        if (featNodes) featNodes.textContent = nodes;
        if (featSupport) featSupport.textContent = support;

        // Dynamically style based on plan
        if (planTierBadge) {
            if (tierName === 'Starter Tier') {
                planTierBadge.style.borderColor = 'var(--primary)';
                planTierBadge.style.background = 'var(--primary-glow)';
            } else if (tierName === 'Growth Tier') {
                planTierBadge.style.borderColor = 'var(--secondary)';
                planTierBadge.style.background = 'var(--secondary-glow)';
            } else {
                planTierBadge.style.borderColor = 'var(--primary)';
                planTierBadge.style.background = 'var(--primary-glow)';
            }
        }
    }

    if (priceRange) {
        priceRange.addEventListener('input', updatePricing);
    }

    // Set click handlers for Spec selector cards
    configCards.forEach(card => {
        card.addEventListener('click', () => {
            const volume = parseInt(card.getAttribute('data-volume'));
            if (priceRange) {
                priceRange.value = volume;
                updatePricing();
            }
        });
    });

    // Run once initially
    updatePricing();

    // ------------------------------------------------
    // 3. Sliding Cover Picture Slideshow
    // ------------------------------------------------
    const coverImages = document.querySelectorAll('.cover-image');
    let currentSlide = 0;

    function nextSlide() {
        if (coverImages.length === 0) return;
        
        coverImages[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % coverImages.length;
        coverImages[currentSlide].classList.add('active');
    }

    // Transition slides every 5 seconds (5000ms)
    setInterval(nextSlide, 5000);

    // ------------------------------------------------
    // 4. Mobile Navigation Drawer Toggle
    // ------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.toggle('active');
            mobileDrawer.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileDrawer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
