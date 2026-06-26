document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const container = document.getElementById('data-container');
    const pageTitle = document.getElementById('page-title');
    let dbData = null;

    // Fetch data from FastAPI backend
    async function fetchData() {
        try {
            const response = await fetch('/api/outputs');
            dbData = await response.json();
            renderTab('inbound'); // Default tab
        } catch (error) {
            container.innerHTML = `<div style="color: #ef4444;">Error loading data: ${error.message}</div>`;
        }
    }

    // Format timestamp
    function formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    }

    // Render logic
    function renderTab(tabId) {
        if (!dbData) return;
        container.innerHTML = ''; // Clear current

        if (tabId === 'inbound') {
            pageTitle.textContent = "Inbound Proposals";
            const items = dbData.inbound_proposals || [];
            if(items.length === 0) container.innerHTML = "<p>No proposals generated yet.</p>";
            
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.company_name}</h3>
                    <div class="meta">${item.email}</div>
                    <pre>${item.proposal_text}</pre>
                    <div class="timestamp">${formatTime(item.timestamp)}</div>
                `;
                container.appendChild(card);
            });
        } 
        else if (tabId === 'outbound') {
            pageTitle.textContent = "Outbound Sequences";
            const items = dbData.outbound_campaigns || [];
            if(items.length === 0) container.innerHTML = "<p>No outbound sequences generated yet.</p>";

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                
                // Format the email sequence dictionary object nicely
                let emailDisplay = '';
                if(typeof item.email_sequence === 'object') {
                    for(const [key, val] of Object.entries(item.email_sequence)) {
                        emailDisplay += `<strong>${key}</strong>\n${val}\n\n`;
                    }
                } else {
                    emailDisplay = item.email_sequence;
                }

                card.innerHTML = `
                    <h3>${item.company_name}</h3>
                    <div class="meta"><a href="${item.url}" target="_blank" style="color: var(--accent)">${item.url}</a></div>
                    
                    <div style="font-size: 0.85rem; font-weight: bold; margin-bottom: 0.3rem;">Landing Page Snippet:</div>
                    <pre style="margin-bottom: 1rem;">${item.demo_html}</pre>
                    
                    <div style="font-size: 0.85rem; font-weight: bold; margin-bottom: 0.3rem;">Email Sequence:</div>
                    <pre>${emailDisplay}</pre>
                    
                    <div class="timestamp">${formatTime(item.timestamp)}</div>
                `;
                container.appendChild(card);
            });
        }
        else if (tabId === 'content') {
            pageTitle.textContent = "Content Marketing";
            const items = dbData.content_blogs || [];
            if(items.length === 0) container.innerHTML = "<p>No blogs generated yet.</p>";

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>Topic: ${item.topic}</h3>
                    <div class="meta">Audience: ${item.audience}</div>
                    <div class="meta">Saved to: <code>${item.file_path}</code></div>
                    <div class="timestamp">${formatTime(item.timestamp)}</div>
                `;
                container.appendChild(card);
            });
        }
    }

    // Navigation setup
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Render content
            renderTab(e.target.dataset.tab);
        });
    });

    // Initialize
    fetchData();
});
