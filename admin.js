document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const adminPass = document.getElementById('admin-pass');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const messagesTbody = document.getElementById('messages-tbody');
    const noMsgs = document.getElementById('no-msgs');
    const connStatus = document.getElementById('conn-status');

    // Check if already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
        showDashboard(token);
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = adminPass.value;
        const btn = loginForm.querySelector('button');
        const origText = btn.innerText;
        btn.innerText = "AUTHENTICATING...";
        btn.disabled = true;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem('admin_token', data.token);
                loginError.classList.add('hide');
                showDashboard(data.token);
            } else {
                loginError.innerText = "ACCESS DENIED: " + (data.error || "INVALID RECORD");
                loginError.classList.remove('hide');
            }
        } catch (err) {
            loginError.innerText = "CONNECTION FAILED.";
            loginError.classList.remove('hide');
        } finally {
            btn.innerText = origText;
            btn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_token');
        loginSection.classList.add('active-section');
        loginSection.classList.remove('hide');
        dashboardSection.classList.remove('active-section');
        dashboardSection.classList.add('hide');
        adminPass.value = '';
        connStatus.innerText = "SYSTEM_ONLINE";
        connStatus.classList.add('online');
    });

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                const svgIcon = refreshBtn.querySelector('svg');
                if (svgIcon) svgIcon.classList.add('spin-anim');
                refreshBtn.disabled = true;
                
                await Promise.all([
                    fetchMessages(token),
                    new Promise(r => setTimeout(r, 600))
                ]);
                
                if (svgIcon) svgIcon.classList.remove('spin-anim');
                refreshBtn.disabled = false;
            }
        });
    }

    async function showDashboard(token) {
        loginSection.classList.remove('active-section');
        loginSection.classList.add('hide');
        dashboardSection.classList.add('active-section');
        dashboardSection.classList.remove('hide');

        connStatus.innerText = "SECURE_SESSION";
        connStatus.classList.add('online');

        await fetchMessages(token);
    }

    async function fetchMessages(token) {
        try {
            const res = await fetch('/api/messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 401 || res.status === 403) {
                logoutBtn.click(); // invalid token
                return;
            }
            
            const messages = await res.json();
            
            if (messages.length === 0) {
                noMsgs.classList.remove('hide');
                messagesTbody.innerHTML = '';
            } else {
                noMsgs.classList.add('hide');
                messagesTbody.innerHTML = messages.map(msg => `
                    <tr>
                        <td>#${String(msg.id).padStart(4, '0')}</td>
                        <td>${msg.name}</td>
                        <td><a href="mailto:${msg.email}" style="color:var(--primary-color)">${msg.email}</a></td>
                        <td>${msg.message}</td>
                        <td style="position: relative; padding-right: 40px;">
                          ${new Date(msg.timestamp).toLocaleString()}
                          <div class="action-container">
                            <button class="delete-msg-btn hover-delete" data-id="${msg.id}" title="Delete" style="display: flex; align-items: center; justify-content: center;">
                              <svg width="18" height="18" fill="#ffffff" viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                            </button>
                          </div>
                        </td>
                    </tr>
                `).join('');

                attachActionListeners(token);
            }
        } catch (err) {
            console.error("Failed to fetch transmissions", err);
            messagesTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red">ERROR RETRIEVING DATA</td></tr>';
        }
    }

    function attachActionListeners(token) {
        // Delete action
        const deleteBtns = document.querySelectorAll('.delete-msg-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this transmission?')) {
                    try {
                        const res = await fetch(`/api/messages/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.ok) {
                            fetchMessages(token);
                        } else {
                            console.error('Failed to delete transmission');
                        }
                    } catch (err) {
                        console.error('Error deleting transmission', err);
                    }
                }
            });
        });
    }
});
